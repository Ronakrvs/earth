import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isAdminSession } from "@/lib/admin-auth"
import { sendEmail } from "@/lib/email"
import { buildOrderStatusUpdateEmail } from "@/lib/email-templates/order-status-update"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (typeof body?.status === "string") {
      const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }
      updatePayload.status = body.status
    }

    if (typeof body?.tracking_number === "string") {
      updatePayload.tracking_number = body.tracking_number.trim() || null
    }

    if (!updatePayload.status && !("tracking_number" in updatePayload)) {
      return NextResponse.json({ error: "No changes provided" }, { status: 400 })
    }

    // Fetch current order before update (need current status for email logic)
    const { data: currentOrder } = await supabase
      .from("orders")
      .select(`
        id, order_number, user_email, user_id, status, tracking_number, total,
        shipping_name,
        order_items (product_name, variant_weight, quantity, unit_price, total_price)
      `)
      .eq("id", id)
      .single()

    // Apply the DB update
    const { error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("id", id)

    if (error) throw error

    // ── Send notification email ────────────────────────────────────────
    if (currentOrder) {
      // Resolve customer email — try user_email first, then profiles table
      let customerEmail = currentOrder.user_email
      if (!customerEmail && currentOrder.user_id) {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", currentOrder.user_id)
          .maybeSingle()
        customerEmail = profileRow?.email ?? null
      }

      const newStatus = updatePayload.status ?? currentOrder.status
      const newTracking = "tracking_number" in updatePayload
        ? updatePayload.tracking_number
        : currentOrder.tracking_number

      const statusChanged = !!updatePayload.status && updatePayload.status !== currentOrder.status
      const trackingAdded =
        "tracking_number" in updatePayload &&
        updatePayload.tracking_number &&
        updatePayload.tracking_number !== currentOrder.tracking_number

      // Decide which emails to send
      const shouldEmail =
        statusChanged ||
        trackingAdded

      if (customerEmail && shouldEmail) {
        const customerName = currentOrder.shipping_name || "Valued Customer"

        // If status changed to shipped, or tracking added while shipped — send shipping email
        // Otherwise send a generic status update
        const emailStatus = statusChanged ? newStatus : currentOrder.status

        const subjectMap: Record<string, string> = {
          processing: `Your order ${currentOrder.order_number} is being processed`,
          shipped: `Your order ${currentOrder.order_number} has been shipped! 🚚`,
          delivered: `Your order ${currentOrder.order_number} has been delivered ✅`,
          cancelled: `Your order ${currentOrder.order_number} has been cancelled`,
        }

        const subject =
          trackingAdded && !statusChanged
            ? `Tracking update for order ${currentOrder.order_number} 📦`
            : subjectMap[emailStatus] || `Update on your order ${currentOrder.order_number}`

        const html = buildOrderStatusUpdateEmail({
          orderNumber: currentOrder.order_number,
          customerName,
          status: emailStatus,
          trackingNumber: newTracking,
          items: (currentOrder.order_items as any[]) || [],
          total: Number(currentOrder.total),
        })

        // Fire-and-forget — never block the response
        sendEmail({ to: customerEmail, subject, html }).catch((err) =>
          console.error("[admin/orders] email send failed:", err?.message)
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
