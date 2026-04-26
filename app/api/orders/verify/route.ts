import { NextResponse } from "next/server"
import crypto from "crypto"
import { createAdminClientStatic } from "@/lib/supabase/server"
import { addLoyaltyPoints, calculateRewards } from "@/lib/loyalty"
import { sendEmail } from "@/lib/email"
import { buildOrderInvoiceEmail } from "@/lib/email-templates/order-invoice"

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, dbOrderId } = await req.json()

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex")

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 })
    }

    // Update order status in Supabase
    const supabase = createAdminClientStatic()

    // 1. Update the order
    const { data: order, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature
      })
      .eq("razorpay_order_id", razorpayOrderId)
      .select(`
        id, user_id, user_email, total, subtotal, shipping_amount, discount_amount,
        coupon_id, order_number, created_at,
        shipping_name, shipping_phone, shipping_address, shipping_city, shipping_state, shipping_pincode,
        order_items (product_name, variant_weight, quantity, unit_price, total_price)
      `)
      .single()

    if (updateError) {
      console.error("Order update error:", updateError)
      return NextResponse.json({ success: false, error: "Order update failed" }, { status: 500 })
    }

    // 2. Handle Redemption & Rewards
    if (order && order.user_id) {
      // 2a. Record coupon usage if applicable
      if (order.coupon_id) {
        try {
          await supabase.from("coupon_usage").insert({
            coupon_id: order.coupon_id,
            user_id: order.user_id,
            order_id: order.id
          })
        } catch (couponUsageErr) {
          console.error("Coupon usage recording error:", couponUsageErr)
        }
      }

      // 2b. Credit loyalty points for the NEW purchase
      const rewards = calculateRewards(Number(order.total))
      try {
        await addLoyaltyPoints(order.user_id, rewards, 'order_placed', order.id)
      } catch (loyaltyErr) {
        console.error("Loyalty point credit error (purchase):", loyaltyErr)
      }
    }

    // 3. Send order confirmation email with invoice
    // Resolve email: user_email on order first, then profiles table as fallback
    let customerEmail = order?.user_email
    if (!customerEmail && order?.user_id) {
      const { data: profileEmail } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", order.user_id)
        .maybeSingle()
      customerEmail = profileEmail?.email ?? null
    }

    if (order && customerEmail) {
      const profileResult = order.user_id
        ? await supabase.from("profiles").select("full_name").eq("id", order.user_id).maybeSingle()
        : null
      const customerName = profileResult?.data?.full_name || (order as any).shipping_name || "Valued Customer"

      const html = buildOrderInvoiceEmail({
        orderNumber: order.order_number,
        customerName,
        customerEmail,
        items: ((order as any).order_items || []) as any[],
        subtotal: Number(order.subtotal),
        shippingAmount: Number(order.shipping_amount),
        discountAmount: Number(order.discount_amount),
        total: Number(order.total),
        shippingAddress: {
          name: order.shipping_name,
          phone: order.shipping_phone,
          address: order.shipping_address,
          city: order.shipping_city,
          state: order.shipping_state,
          pincode: order.shipping_pincode,
        },
        createdAt: order.created_at,
        paymentId: razorpayPaymentId,
      })

      sendEmail({
        to: customerEmail,
        subject: `Order Confirmed — ${order.order_number} | Shigruvedas`,
        html,
      }).catch((err) => console.error("[verify] invoice email failed:", err?.message))
    }

    return NextResponse.json({ success: true, orderId: dbOrderId })
  } catch (error) {
    console.error("Verify order error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
