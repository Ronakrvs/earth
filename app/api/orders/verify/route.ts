import { NextResponse } from "next/server"
import crypto from "crypto"
import { createAdminClientStatic } from "@/lib/supabase/server"
import { addLoyaltyPoints, calculateRewards } from "@/lib/loyalty"

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
      .select("id, user_id, total, coupon_id")
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

    return NextResponse.json({ success: true, orderId: dbOrderId })
  } catch (error) {
    console.error("Verify order error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
