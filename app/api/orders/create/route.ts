import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import Razorpay from "razorpay"
import { createAdminClientStatic } from "@/lib/supabase/server"
import { createShiprocketOrder } from "@/lib/shiprocket"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function normalizeUuid(value: unknown) {
  return typeof value === "string" && UUID_RE.test(value) ? value : null
}

function isMissingColumnError(error: any, columnName: string) {
  const message = String(error?.message || error?.details || "").toLowerCase()
  const target = columnName.toLowerCase()
  return (
    error?.code === "42703" ||
    message.includes(`column "${target}" of relation "orders" does not exist`) ||
    message.includes(`could not find the '${target}' column`) ||
    message.includes(target)
  )
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    const { items, shipping, subtotal, shippingAmount, total, discountAmount, pointsUsed, couponId, checkoutSessionId } = body

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Payment gateway is not configured" }, { status: 500 })
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    })

    const supabase = createAdminClientStatic()

    // Create Razorpay order with the FINAL discounted total
    if (!checkoutSessionId || typeof checkoutSessionId !== "string") {
      return NextResponse.json({ error: "Missing checkout session" }, { status: 400 })
    }

    let canUseCheckoutSessionId = true

    const existingOrderResult = await supabase
      .from("orders")
      .select("id, razorpay_order_id, order_number")
      .eq("checkout_session_id", checkoutSessionId)
      .maybeSingle()

    if (existingOrderResult.error) {
      if (isMissingColumnError(existingOrderResult.error, "checkout_session_id")) {
        canUseCheckoutSessionId = false
      } else {
        throw existingOrderResult.error
      }
    } else if (existingOrderResult.data?.id && existingOrderResult.data?.razorpay_order_id) {
      return NextResponse.json({
        orderId: existingOrderResult.data.id,
        razorpayOrderId: existingOrderResult.data.razorpay_order_id,
        dbOrderId: existingOrderResult.data.id,
        amount: Math.round(total * 100),
        currency: "INR",
      })
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    })

    // Store pending order in Supabase
    const normalizedShipping = {
      full_name: shipping?.full_name ?? shipping?.name ?? "",
      phone: shipping?.phone ?? "",
      address_line1: shipping?.address_line1 ?? shipping?.address ?? "",
      address_line2: shipping?.address_line2 ?? "",
      city: shipping?.city ?? "",
      state: shipping?.state ?? "",
      pincode: shipping?.pincode ?? "",
    }
    const normalizedItems = (items || []).map((item: any) => ({
      product_id: normalizeUuid(item.product_id ?? item.productId),
      variant_id: normalizeUuid(item.variant_id ?? item.id),
      product_name: item.product_name ?? item.productName,
      variant_weight: item.variant_weight ?? item.variantWeight,
      quantity: item.quantity,
      unit_price: item.unit_price ?? item.price,
      total_price: (item.unit_price ?? item.price) * item.quantity,
    }))
    
    // Resolve the real Supabase profile UUID by email.
    // NextAuth Google OAuth gives us an OAuth sub (numeric), not a Supabase UUID —
    // passing it directly causes the orders_user_id_fkey FK violation.
    let resolvedUserId: string | null = null
    const sessionUserId = session?.user?.id
    if (sessionUserId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionUserId)) {
      resolvedUserId = sessionUserId
    }

    const orderInsert = {
      user_id: resolvedUserId,          // real UUID or null for guest
      user_email: session?.user?.email ?? null,  // keep email for reference
      order_number: razorpayOrder.receipt,
      status: "pending",
      payment_status: "pending",
      razorpay_order_id: razorpayOrder.id,
      subtotal,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount || 0,
      coupon_id: couponId || null,
      total,
      shipping_name: normalizedShipping.full_name,
      shipping_phone: normalizedShipping.phone,
      shipping_address: normalizedShipping.address_line1,
      shipping_city: normalizedShipping.city,
      shipping_state: normalizedShipping.state,
      shipping_pincode: normalizedShipping.pincode,
      ...(canUseCheckoutSessionId ? { checkout_session_id: checkoutSessionId } : {}),
    }

    let orderResult = await supabase
      .from("orders")
      .insert([orderInsert])
      .select()
      .single()

    if (orderResult.error && canUseCheckoutSessionId && isMissingColumnError(orderResult.error, "checkout_session_id")) {
      canUseCheckoutSessionId = false
      const { checkout_session_id: _ignored, ...orderInsertWithoutSession } = orderInsert as any
      orderResult = await supabase
        .from("orders")
        .insert([orderInsertWithoutSession])
        .select()
        .single()
    }

    if (orderResult.error) throw orderResult.error
    const order = orderResult.data

    // Store order items
    const orderItems = normalizedItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      variant_weight: item.variant_weight,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Future Shiprocket sync hook:
    // When Shiprocket automation is enabled, create the shipment here and persist
    // shiprocket_order_id / shiprocket_shipment_id / shiprocket_awb / shiprocket_status
    // on the same order row. The webhook endpoint can then keep the database updated.
    void createShiprocketOrder({
      orderId: order.id,
      orderNumber: razorpayOrder.receipt ?? `rcpt_${order.id}`,
      awb: null,
    }).catch((error) => {
      console.error("Shiprocket sync placeholder error:", error)
    })

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      dbOrderId: order.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to create order" },
      { status: 500 }
    )
  }
}
