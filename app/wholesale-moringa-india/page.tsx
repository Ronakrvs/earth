"use client"

import { useState } from "react"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Globe, Award, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const pricingTiers = [
  { qty: "5 – 20 kg", pricePerKg: "₹1,400", savings: "~30% off MRP", highlight: false },
  { qty: "20 – 100 kg", pricePerKg: "₹1,200", savings: "~40% off MRP", highlight: true },
  { qty: "100+ kg", pricePerKg: "Custom Quote", savings: "Best Rates", highlight: false },
]

const buyers = [
  "Ayurvedic Brands", "Supplement Companies", "Health Food Stores",
  "Restaurants & Hotels", "Export Companies", "Wellness Centres",
  "Supermarkets", "Naturopathy Clinics",
]

const certifications = [
  { name: "FSSAI Certified", desc: "Food safety certified for India" },
  { name: "Organic Certified", desc: "Certified chemical-free farming" },
  { name: "Lab Tested", desc: "Third-party COA for every batch" },
  { name: "APEDA Registered", desc: "Export-ready for international shipments" },
]

export default function WholesalePage() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", country: "India", product: "", quantity: "", message: "" })
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/b2b-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.company,
          contact_name: form.name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          product: form.product,
          monthly_quantity: form.quantity,
          message: form.message,
          business_type: "wholesale",
        }),
      })
      if (res.ok) {
        toast.success("Inquiry received! Our team will contact you within 24 hours. 🌿")
        setForm({ company: "", name: "", email: "", phone: "", country: "India", product: "", quantity: "", message: "" })
      } else {
        toast.error("Failed to submit. Please try again or WhatsApp us directly.")
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
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-5 py-1.5 text-xs font-black uppercase tracking-widest">
            Wholesale & B2B
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Premium Organic Moringa
            <span className="block text-primary italic">Bulk Supply for Businesses</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto mb-8">
            Direct from our 7-acre certified organic farm in Udaipur. Lab-tested, FSSAI certified, and export-ready.
            No middlemen. Consistent quality. Competitive pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#wholesale-form">
              <Button className="bg-primary text-white h-14 px-10 rounded-2xl font-bold text-base shadow-lg shadow-primary/20">
                Get a Bulk Quote <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="https://wa.me/919166599895" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold text-base">
                💬 WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Who We Supply */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-black text-center mb-10 text-slate-900">Who We Supply</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {buyers.map((b) => (
              <span key={b} className="bg-primary/5 text-primary border border-primary/10 rounded-xl px-5 py-2.5 text-sm font-bold">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products Available */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-black text-center mb-10 text-slate-900">Products Available in Bulk</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Moringa Powder", desc: "Stone-ground, fine mesh. MOQ: 5kg. Available as raw or encapsulation-grade." },
              { name: "Moringa Leaves (Dried)", desc: "Sun-dried whole or crushed leaves. MOQ: 5kg." },
              { name: "Moringa Seeds", desc: "Organic seeds for oil extraction or planting. MOQ: 2kg." },
              { name: "Moringa Oil (Cold-Pressed)", desc: "Pure Ben oil / Moringa oil. MOQ: 1 litre." },
              { name: "Fresh Drumsticks", desc: "Seasonal supply. MOQ: 10kg. Best for central India delivery." },
              { name: "Custom / White Label", desc: "Your brand, our farm. MOQ: 50kg. 7–10 day lead time." },
            ].map((p) => (
              <div key={p.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-black text-slate-900 mb-2">{p.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-black text-center mb-3 text-slate-900">Bulk Pricing — Moringa Powder</h2>
          <p className="text-slate-500 text-center font-medium mb-10">Contact us for leaves, seeds, oil, and custom product pricing.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.qty}
                className={`rounded-3xl border p-8 text-center transition-all ${
                  tier.highlight
                    ? "bg-primary text-white border-primary shadow-2xl shadow-primary/30 scale-105"
                    : "bg-white border-slate-100 shadow-sm"
                }`}
              >
                {tier.highlight && (
                  <Badge className="bg-white text-primary mb-4 font-black px-3">Most Popular</Badge>
                )}
                <p className={`text-sm font-black uppercase tracking-wider mb-3 ${tier.highlight ? "text-emerald-100" : "text-slate-400"}`}>
                  {tier.qty}
                </p>
                <p className={`text-3xl font-black mb-2 ${tier.highlight ? "text-white" : "text-slate-900"}`}>
                  {tier.pricePerKg}
                </p>
                <p className="text-sm font-medium">
                  <span className={tier.highlight ? "text-emerald-200" : "text-primary"}>{tier.savings}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm font-medium mt-6">
            * Prices subject to market rates & seasonal availability. GST applicable. Minimum 5kg for all orders.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-black text-center mb-10 text-slate-900">Our Certifications</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.name} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-black text-slate-900 mb-1">{cert.name}</h3>
                <p className="text-slate-500 text-sm font-medium">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/10 p-10 md:p-16 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <Globe className="h-12 w-12 text-primary mb-6" />
              <h2 className="text-3xl font-black text-slate-900 mb-4">Export Capability</h2>
              <p className="text-slate-600 font-medium mb-6 leading-relaxed">
                We export organic moringa to UAE, UK, USA, Canada, and Singapore. All shipments
                come with COA, phytosanitary certificate, and customs documentation.
              </p>
              <ul className="space-y-3">
                {["APEDA registered exporter", "Phytosanitary certified", "USD / AED invoicing available", "Sea & air freight options"].map((p) => (
                  <li key={p} className="flex items-center gap-3 font-bold text-slate-900">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="shrink-0 text-center">
              <p className="text-slate-500 font-medium mb-4">Interested in exporting?</p>
              <a href="mailto:shigruvedas@gmail.com">
                <Button className="bg-primary text-white h-14 px-8 rounded-2xl font-bold">
                  Email Export Team
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section id="wholesale-form" className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl font-black text-center mb-3 text-slate-900">Get a Bulk Quote</h2>
          <p className="text-slate-500 text-center font-medium mb-10">
            Fill in your requirements and our B2B team will get back to you within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Company Name *</label>
                <input name="company" required value={form.company} onChange={handleChange}
                  placeholder="Wellness Pvt Ltd"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Contact Name *</label>
                <input name="name" required value={form.name} onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Email *</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange}
                  placeholder="rahul@company.com"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Phone / WhatsApp *</label>
                <input name="phone" required value={form.phone} onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Country</label>
                <select name="country" value={form.country} onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white">
                  {["India","UAE","USA","UK","Canada","Singapore","Australia","Other"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Product Required</label>
                <select name="product" value={form.product} onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white">
                  <option value="">Select product…</option>
                  {["Moringa Powder","Moringa Leaves (Dried)","Moringa Seeds","Moringa Oil","Drumsticks","Multiple / Custom"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">Estimated Monthly Quantity</label>
              <input name="quantity" value={form.quantity} onChange={handleChange}
                placeholder="e.g. 50kg/month"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2">Additional Requirements</label>
              <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                placeholder="Custom packaging, certifications needed, delivery location, etc."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-white rounded-2xl font-black text-base shadow-lg shadow-primary/20 disabled:opacity-70"
            >
              {loading ? "Submitting…" : "Submit Wholesale Inquiry →"}
            </Button>
            <p className="text-center text-slate-400 text-xs font-medium">
              Our B2B team replies within 24 hours · WhatsApp: +91 91665 99895
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
