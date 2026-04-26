import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ArrowLeft, Download, ExternalLink, Package, Truck, CheckCircle2, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoringaCard } from "@/components/ui/moringa-card"

function getTrackStatus(status: string) {
  const map: Record<string, string> = {
    pending: "processing",
    confirmed: "processing",
    processing: "packed",
    shipped: "dispatched",
    delivered: "delivered",
    cancelled: "processing",
    refunded: "processing",
  }
  return map[status] ?? "processing"
}

// India Post tracking numbers: 2 letters + 9 digits + "IN" (e.g. EW123456789IN)
function isIndiaPostTracking(trackingNumber: string): boolean {
  return /^[A-Z]{2}[0-9]{9}IN$/i.test(trackingNumber.trim())
}

function getTrackingUrl(trackingNumber: string): { url: string; carrier: string } {
  if (!trackingNumber) return { url: "", carrier: "Shiprocket" }
  if (isIndiaPostTracking(trackingNumber)) {
    return {
      url: `https://www.indiapost.gov.in/VAS/Pages/trackconsignment.aspx?consignmentNo=${encodeURIComponent(trackingNumber.trim())}`,
      carrier: "India Post",
    }
  }
  return {
    url: `https://www.shiprocket.in/shipment-tracking/?awb=${encodeURIComponent(trackingNumber)}`,
    carrier: "Shiprocket",
  }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/profile/orders")

  const { id } = await params
  const supabase = await createAdminClient()
  const email = session.user.email?.toLowerCase().trim()

  let orderQuery = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total,
      subtotal,
      shipping_amount,
      discount_amount,
      points_used,
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
      tracking_number,
      created_at,
      order_items (
        id,
        product_name,
        variant_weight,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq("id", id)

  if (email) {
    orderQuery = orderQuery.or(`user_id.eq.${session.user.id},user_email.eq.${email}`)
  } else {
    orderQuery = orderQuery.eq("user_id", session.user.id)
  }

  const { data: order } = await orderQuery.single()

  if (!order) notFound()

  const trackStatus = getTrackStatus(order.status)
  const trackingInfo = order.tracking_number ? getTrackingUrl(order.tracking_number) : null

  const steps = [
    { label: "Order Placed", done: true, active: false, icon: Clock3 },
    { label: "Packed", done: ["packed", "dispatched", "in_transit", "delivered"].includes(trackStatus), active: trackStatus === "packed", icon: Package },
    { label: "Dispatched", done: ["dispatched", "in_transit", "delivered"].includes(trackStatus), active: trackStatus === "dispatched", icon: Truck },
    { label: "Delivered", done: trackStatus === "delivered", active: false, icon: CheckCircle2 },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
        <div className="flex items-center justify-between gap-3 mb-8 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link href="/profile/orders" className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 transition-all flex-shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-black text-foreground tracking-tight truncate">Order {order.order_number}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Placed on {new Date(order.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
            </div>
          </div>
          <Link href={`/profile/orders/${order.id}/invoice`} target="_blank" className="flex-shrink-0">
            <Button className="rounded-2xl bg-primary text-primary-foreground font-bold px-3 sm:px-4">
              <Download className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Download Invoice</span>
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <MoringaCard className="p-6 md:p-8 border-border/60" glass={true}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-foreground">
                    {trackingInfo ? trackingInfo.carrier : "Shipment"} Tracking
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {order.tracking_number ? `AWB / Tracking: ${order.tracking_number}` : "Tracking number will appear after dispatch"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {steps.map((step) => {
                  const Icon = step.icon
                  return (
                    <div
                      key={step.label}
                      className={`flex items-center gap-4 rounded-2xl border px-4 py-4 ${
                        step.done ? "border-primary/20 bg-primary/5" : "border-border/60 bg-card/60"
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${step.done ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-foreground">{step.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {step.active ? "Current stage" : step.done ? "Completed" : "Pending"}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {trackingInfo ? (
                  <Link href={trackingInfo.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="rounded-2xl border-border font-bold">
                      Track on {trackingInfo.carrier} <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                    Tracking link will appear here after dispatch.
                  </div>
                )}
              </div>
            </MoringaCard>

            <MoringaCard className="p-6 md:p-8 border-border/60" glass={true}>
              <h2 className="text-xl font-black text-foreground mb-5">Items</h2>
              <div className="space-y-3">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-4">
                    <div>
                      <p className="font-semibold text-foreground">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.variant_weight} × {item.quantity}
                      </p>
                    </div>
                    <div className="font-bold text-foreground">₹{Number(item.total_price).toFixed(0)}</div>
                  </div>
                ))}
              </div>
            </MoringaCard>
          </div>

          <div className="space-y-6">
            <MoringaCard className="p-6 border-border/60" glass={true}>
              <h2 className="text-lg font-black text-foreground mb-4">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">₹{Number(order.subtotal).toFixed(0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-medium">₹{Number(order.shipping_amount).toFixed(0)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-medium">-₹{Number(order.discount_amount).toFixed(0)}</span></div>
                {typeof order.points_used === "number" && (
                  <div className="flex justify-between"><span className="text-muted-foreground">Points Used</span><span className="font-medium">-{order.points_used}</span></div>
                )}
                <div className="flex justify-between border-t border-border pt-3">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-black text-foreground">₹{Number(order.total).toFixed(0)}</span>
                </div>
              </div>
            </MoringaCard>

            <MoringaCard className="p-6 border-border/60" glass={true}>
              <h2 className="text-lg font-black text-foreground mb-4">Shipping Address</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">{order.shipping_name}</p>
                <p>{order.shipping_phone}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
              </div>
            </MoringaCard>
          </div>
        </div>
      </div>
    </div>
  )
}
