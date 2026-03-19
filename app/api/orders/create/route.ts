import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import Razorpay from "razorpay"

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
    // (Supabase integration requires env vars — placeholder structure here)
    const dbOrderId = razorpayOrder.id // Replace with actual Supabase insert ID

    return NextResponse.json({
      orderId: dbOrderId,
      razorpayOrderId: razorpayOrder.id,
      dbOrderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    })
  } catch (error: any) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
