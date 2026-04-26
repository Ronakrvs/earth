import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 })

    const supabase = await createAdminClient()

    // Only cancel orders that are still pending (payment not yet confirmed)
    // and belong to this user (verified by email since session.user.id might be OAuth sub)
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, status, payment_status, user_id, user_email")
      .eq("id", orderId)
      .maybeSingle()

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Authorization: must be the order owner (by user_id or email)
    const isOwner =
      (order.user_id && order.user_id === session.user.id) ||
      (order.user_email && order.user_email === session.user.email)

    if (!isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Only cancel if still pending — paid orders need manual review
    if (order.payment_status !== "pending") {
      return NextResponse.json({ error: "Cannot cancel a paid order" }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "cancelled", payment_status: "failed", updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (updateError) throw updateError

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("[orders/cancel] error:", error?.message || error)
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}
