import { NextResponse } from "next/server"
import { createAdminClientStatic } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const supabase = createAdminClientStatic()

    const shiprocketOrderId = payload?.order_id || payload?.shiprocket_order_id || null
    const shiprocketShipmentId = payload?.shipment_id || payload?.shiprocket_shipment_id || null
    const awb = payload?.awb || payload?.awb_code || payload?.tracking_number || null
    const status = payload?.current_status || payload?.status || null
    const orderNumber = payload?.order_number || payload?.merchant_order_id || payload?.merchant_reference || null

    if (!orderNumber && !shiprocketOrderId && !shiprocketShipmentId && !awb) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 })
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
      shiprocket_last_synced_at: new Date().toISOString(),
    }

    if (shiprocketOrderId) updatePayload.shiprocket_order_id = shiprocketOrderId
    if (shiprocketShipmentId) updatePayload.shiprocket_shipment_id = shiprocketShipmentId
    if (awb) {
      updatePayload.shiprocket_awb = awb
      updatePayload.tracking_number = awb
    }
    if (status) updatePayload.shiprocket_status = status

    let query = supabase.from("orders").update(updatePayload)

    if (orderNumber) {
      query = query.eq("order_number", orderNumber)
    } else if (shiprocketOrderId) {
      query = query.eq("shiprocket_order_id", shiprocketOrderId)
    } else if (shiprocketShipmentId) {
      query = query.eq("shiprocket_shipment_id", shiprocketShipmentId)
    } else if (awb) {
      query = query.eq("tracking_number", awb)
    }

    const { error } = await query
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Shiprocket webhook error:", error)
    return NextResponse.json({ error: error?.message || "Webhook failed" }, { status: 500 })
  }
}
