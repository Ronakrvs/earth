import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import Razorpay from "razorpay"
import { createClient } from "@/lib/supabase/server"

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const session = await auth()
    const body = await req.json()
    const { items, shipping, subtotal, shippingAmount, total } = body

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100), // in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    })

    // Store pending order in Supabase
    const supabase = await createClient()
    
    // Generate order number (optional as DB has a trigger, but let's be explicit if needed)
    // Actually, schema.sql has a function but no trigger on public.orders for it. 
    // Let's use the DB function if possible or just let it fail if not provided.
    // The schema says: order_number TEXT UNIQUE NOT NULL
    
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        user_id: session?.user?.id,
        order_number: razorpayOrder.receipt, // Using receipt as temp order number or use DB function
        status: "pending",
        payment_status: "pending",
        razorpay_order_id: razorpayOrder.id,
        subtotal,
        shipping_amount: shippingAmount,
        total,
        shipping_name: shipping.name,
        shipping_phone: shipping.phone,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_pincode: shipping.pincode,
      }])
      .select()
      .single()

    if (orderError) throw orderError

    // Store order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.name,
      variant_weight: item.weight,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      dbOrderId: order.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
