export type ShiprocketOrderPayload = {
  order_id: string
  order_number: string
  awb?: string | null
  shipment_id?: string | null
  status?: string | null
}

export async function createShiprocketOrder(_input: {
  orderId: string
  orderNumber: string
  awb?: string | null
}) {
  // Future integration point:
  // 1. Authenticate with Shiprocket
  // 2. Create shipment/order in Shiprocket
  // 3. Persist shiprocket_order_id, shiprocket_shipment_id, shiprocket_awb, shiprocket_status
  // 4. Return the created payload so callers can sync it back to Supabase
  return null as ShiprocketOrderPayload | null
}

export async function fetchShiprocketTracking(_awb: string) {
  // Future integration point:
  // Query Shiprocket tracking API and map the response to our order detail UI.
  return null
}
