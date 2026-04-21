import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query")?.trim()
  if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 })

  // Find by order number or user email
  let order: any = null

  // Try order number first
  const { data: byNumber, error: numError } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_number", query.toUpperCase())
    .maybeSingle()

  if (byNumber) {
    order = byNumber
  } else {
    // Try by email via profiles
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", query.toLowerCase())
      .maybeSingle()

    if (profile) {
      const { data: latestOrder } = await supabaseAdmin
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      order = latestOrder
    }
  }

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Map DB status to timeline steps
  const statusMap: Record<string, string> = {
    pending: "processing",
    confirmed: "processing",
    processing: "packed",
    shipped: "dispatched",
    delivered: "delivered",
    cancelled: "processing",
  }
  const trackStatus = statusMap[order.status] ?? "processing"

  const steps = [
    { label: "Order Placed", done: true, active: false, date: new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) },
    { label: "Packed & Ready to Ship", done: ["packed","dispatched","in_transit","delivered"].includes(trackStatus), active: trackStatus === "packed", date: "" },
    { label: "Dispatched", done: ["dispatched","in_transit","delivered"].includes(trackStatus), active: trackStatus === "dispatched", date: "" },
    { label: "In Transit", done: ["in_transit","delivered"].includes(trackStatus), active: trackStatus === "in_transit", date: "" },
    { label: "Delivered", done: trackStatus === "delivered", active: false, date: "" },
  ]

  return NextResponse.json({
    order_number: order.order_number,
    status: trackStatus,
    carrier: "Delhivery / Shiprocket",
    tracking_number: order.tracking_number || "Will be updated after dispatch",
    estimated_date: "2–5 Business Days",
    steps,
  })
}
