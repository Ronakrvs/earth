"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type TrackingStatus = "processing" | "packed" | "dispatched" | "in_transit" | "delivered"

type ShipmentInfo = {
  order_number: string
  status: TrackingStatus
  carrier: string
  tracking_number: string
  estimated_date: string
  steps: { label: string; date: string; done: boolean; active: boolean }[]
}

const STATUS_STEPS: Record<TrackingStatus, number> = {
  processing: 0,
  packed: 1,
  dispatched: 2,
  in_transit: 3,
  delivered: 4,
}

export default function TrackOrderPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [shipment, setShipment] = useState<ShipmentInfo | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setNotFound(false)
    setShipment(null)

    try {
      const res = await fetch(`/api/track-order?query=${encodeURIComponent(query.trim())}`)
      if (res.status === 404) {
        setNotFound(true)
      } else if (res.ok) {
        const data = await res.json()
        setShipment(data)
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <div className="container mx-auto max-w-2xl">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-5 py-1.5 text-xs font-black uppercase tracking-widest">
            Order Tracking
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Track Your <span className="text-primary italic">Order</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium mb-10">
            Enter your order number (e.g. SV20240322-0042) or the email address you used at checkout.
          </p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order number or email address"
                className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-14 px-8 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:opacity-70"
            >
              {loading ? "Searching…" : "Track Order"}
            </Button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">

          {notFound && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Package className="h-16 w-16 text-slate-300 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-slate-900 mb-3">Order Not Found</h2>
              <p className="text-slate-500 font-medium mb-6 max-w-sm mx-auto">
                We couldn't find an order matching <strong>"{query}"</strong>. Please check your order number or email and try again.
              </p>
              <a href="https://wa.me/919166599895" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary text-white rounded-2xl font-bold">
                  💬 Contact Support on WhatsApp
                </Button>
              </a>
            </div>
          )}

          {shipment && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Order Number</p>
                  <h2 className="text-xl font-black text-slate-900">{shipment.order_number}</h2>
                </div>
                <Badge className={`px-4 py-2 text-sm font-black rounded-xl capitalize ${
                  shipment.status === "delivered"
                    ? "bg-emerald-100 text-emerald-700"
                    : shipment.status === "in_transit"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {shipment.status.replace("_", " ")}
                </Badge>
              </div>

              {/* Carrier info */}
              <div className="p-6 md:p-8 border-b border-slate-100 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Carrier</p>
                  <p className="font-bold text-slate-900">{shipment.carrier}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Tracking Number</p>
                  <p className="font-bold text-slate-900">{shipment.tracking_number}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Estimated Delivery</p>
                  <p className="font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {shipment.estimated_date}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 md:p-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Shipment Timeline</h3>
                <div className="space-y-6">
                  {shipment.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`mt-0.5 h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                        step.done ? "bg-primary" : step.active ? "bg-primary/20 ring-2 ring-primary" : "bg-slate-100"
                      }`}>
                        {step.done
                          ? <CheckCircle className="h-4 w-4 text-white" />
                          : step.active
                          ? <Truck className="h-3 w-3 text-primary" />
                          : <div className="h-2 w-2 rounded-full bg-slate-300" />
                        }
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold text-[15px] ${step.done || step.active ? "text-slate-900" : "text-slate-400"}`}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-xs text-slate-400 mt-0.5 font-medium">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-slate-500 font-medium text-sm mb-4">
                  Questions about your delivery? We're here to help.
                </p>
                <a href="https://wa.me/919166599895" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary text-white rounded-2xl font-bold">
                    💬 WhatsApp Support
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Info cards when no search yet */}
          {!shipment && !notFound && !loading && (
            <div className="grid sm:grid-cols-3 gap-6 mt-4">
              {[
                { icon: Package, title: "Order Placed", desc: "You'll receive a confirmation email & WhatsApp within minutes." },
                { icon: Truck, title: "Dispatched in 1–2 Days", desc: "We pack and ship within 1–2 business days from our Udaipur farm." },
                { icon: CheckCircle, title: "Delivered in 2–5 Days", desc: "Metro cities: 2–3 days. Other areas: 3–5 days." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                  <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-black text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm font-medium">{desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
