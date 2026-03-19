import { NextResponse } from "next/server"
import crypto from "crypto"

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
    // const supabase = await createAdminClient()
    // await supabase.from("orders").update({ 
    //   payment_status: "paid", 
    //   status: "confirmed",
    //   razorpay_payment_id: razorpayPaymentId,
    //   razorpay_signature: razorpaySignature
    // }).eq("razorpay_order_id", razorpayOrderId)

    return NextResponse.json({ success: true, orderId: dbOrderId })
  } catch (error) {
    console.error("Verify order error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
