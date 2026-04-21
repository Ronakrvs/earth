"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MapPin, Phone, Clock, Users, Leaf, Star, ChevronDown,
  CalendarDays, Camera, TreePine, Sprout, ArrowRight, CheckCircle2
} from "lucide-react"
import { toast } from "sonner"

/* ── types ───────────────────────────────────────────────────────────── */
type FormState = {
  name: string; email: string; phone: string
  visit_date: string; group_size: string; visit_type: string; message: string
}

const INITIAL: FormState = {
  name: "", email: "", phone: "",
  visit_date: "", group_size: "1", visit_type: "general", message: ""
}

/* ── static data ─────────────────────────────────────────────────────── */
const VISIT_TYPES = [
  { value: "general",     label: "General Farm Tour (Free)"    },
  { value: "learning",    label: "Moringa Learning Experience" },
  { value: "harvesting",  label: "Hands-on Harvesting Session" },
  { value: "b2b",         label: "B2B / Bulk Supplier Visit"   },
  { value: "photography", label: "Farm Photography Session"    },
]

const HIGHLIGHTS = [
  { icon: TreePine,    title: "7-Acre Organic Farm",    desc: "Walk through our lush moringa plantation in the Aravali Foothills — over 2,000 trees in full bloom." },
  { icon: Sprout,      title: "Farm to Table Journey",  desc: "Watch our complete process: harvesting → drying → stone-grinding → lab testing → packaging." },
  { icon: Camera,      title: "Stunning Photography",   desc: "The farm is a photographer's paradise — golden-hour moringa fields against Rajasthan's blue skies." },
  { icon: Leaf,        title: "Taste the Difference",   desc: "Free moringa tea tasting and freshly-harvested samples you can't get anywhere else." },
  { icon: Users,       title: "Group & School Visits",  desc: "Educational sessions available for school groups, wellness retreats, and corporate offsites." },
  { icon: CalendarDays, title: "Flexible Scheduling",   desc: "Open Mon–Sat, 8 AM – 5 PM. Book in advance for a personalised guided experience." },
]

const TIMELINES = [
  { time: "08:00 – 08:30", act: "Welcome & Moringa Tea", desc: "Arrive at the farm. Enjoy freshly brewed moringa tea while we brief you on the session." },
  { time: "08:30 – 09:30", act: "Guided Farm Walk",       desc: "Walk through the plantation with our farm manager. Learn about organic cultivation, soil care, and pest-free farming." },
  { time: "09:30 – 10:15", act: "Harvesting Session",     desc: "Put on gloves and experience hand-picking moringa leaves alongside our farmers." },
  { time: "10:15 – 11:00", act: "Processing Demo",        desc: "Watch live: solar drying, stone-grinding, and our quality testing process." },
  { time: "11:00 – 11:30", act: "Q&A + Shopping",         desc: "Ask anything. Buy fresh products directly from the farm at farm-gate prices." },
]

const FAQS = [
  { q: "Is there an entry fee?",                   a: "General farm tours are free of charge. Specialised sessions (harvesting, B2B visits) may have a small fee — mentioned during booking confirmation." },
  { q: "How far is the farm from Udaipur city?",   a: "Our farm is approximately 18 km from Udaipur City Palace. It takes about 35–40 minutes by car/bike. We'll share the exact Google Maps pin after booking." },
  { q: "Can I bring children?",                    a: "Absolutely! Children love walking through the moringa trees. We recommend ages 5+ for the harvesting session. Please note the terrain is uneven in some sections." },
  { q: "What should I wear / bring?",              a: "Comfortable clothes and closed shoes (the farm soil can be muddy after irrigation days). Bring a hat and sunscreen — Rajasthan sun is strong! Water bottle recommended." },
  { q: "Can I purchase products directly at the farm?", a: "Yes. You can buy moringa powder, dried leaves, drumsticks, and seeds directly at farm-gate prices (10–15% lower than our website)." },
  { q: "Do you arrange transport from Udaipur?",   a: "We don't arrange transport, but we can recommend local cab services. WhatsApp us and we'll coordinate if needed." },
]

/* ── page ────────────────────────────────────────────────────────────── */
export default function FarmVisitPage() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [booked, setBooked] = useState(false)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.visit_date) { toast.error("Please select a visit date."); return }
    setLoading(true)
    try {
      const res = await fetch("/api/farm-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setBooked(true)
        toast.success("Visit booked! 🌿 We'll confirm via WhatsApp within 24 hours.")
      } else {
        const d = await res.json().catch(() => ({}))
        toast.error(d.error || "Booking failed. Please try WhatsApp directly.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // minimum date = tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative py-28 px-4 bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/farm-bg.jpg')] bg-center bg-cover opacity-10" />
        <div className="container mx-auto max-w-5xl relative z-10 text-center">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-5 py-2 text-xs font-black uppercase tracking-widest">
            🌿 Visit Our Farm
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Experience Moringa
            <span className="block text-primary italic mt-2">at Its Source</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Step inside our 7-acre certified organic farm in Udaipur, Rajasthan.
            Walk the rows, pick the leaves, taste the difference. No farm visits are
            the same — yours will be unforgettable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#book">
              <Button className="bg-primary text-white h-14 px-10 rounded-2xl font-black text-base shadow-xl shadow-primary/30">
                Book a Free Visit <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="https://wa.me/919166599895" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold text-base">
                💬 WhatsApp Us First
              </Button>
            </a>
          </div>

          {/* Quick info pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {[
              { icon: MapPin,  text: "18 km from Udaipur city" },
              { icon: Clock,   text: "Mon–Sat · 8 AM – 5 PM"  },
              { icon: Users,   text: "Groups welcome"          },
              { icon: Star,    text: "Free for general visits" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-5 py-2.5 border border-slate-100 shadow-sm">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-slate-700">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              What to Expect at the Farm
            </h2>
            <p className="text-slate-500 font-medium max-w-xl mx-auto">
              A visit to Shigruvedas is more than a tour — it's an immersion into sustainable organic farming.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group rounded-3xl border border-slate-100 bg-slate-50/50 p-8 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-500">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-3">{title}</h3>
                <p className="text-slate-500 font-medium text-[15px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
              A Typical Visit Schedule
            </h2>
            <p className="text-slate-500 font-medium">Morning visits (8 AM start) are most recommended — cooler weather and best light.</p>
          </div>
          <div className="relative space-y-0">
            {/* vertical line */}
            <div className="absolute left-[28px] top-0 bottom-0 w-0.5 bg-primary/20" />
            {TIMELINES.map((step, i) => (
              <div key={i} className="relative flex gap-6 pb-10 last:pb-0">
                <div className="relative z-10 h-14 w-14 shrink-0 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-white font-black text-sm">
                  {i + 1}
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 flex-1 shadow-sm">
                  <span className="text-xs font-black text-primary uppercase tracking-widest">{step.time}</span>
                  <h3 className="font-black text-slate-900 text-lg mt-1 mb-2">{step.act}</h3>
                  <p className="text-slate-500 font-medium text-[15px] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY PLACEHOLDER ───────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-black text-center text-slate-900 mb-12 tracking-tight">The Farm in Photos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "/images/leaves2.png", label: "Moringa Canopy" },
              { src: "/images/powder2.png", label: "Stone-Ground Powder" },
              { src: "/images/drumstick2.png", label: "Fresh Drumsticks" },
              { src: "/images/image.png", label: "Organic Harvest" },
            ].map(({ src, label }) => (
              <div key={label} className="relative aspect-square rounded-3xl overflow-hidden bg-primary/5 border border-slate-100 group">
                <Image
                  src={src}
                  alt={label}
                  fill
                  className="object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white font-bold text-sm">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING FORM ──────────────────────────────────────────────── */}
      <section id="book" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-background">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <Badge className="bg-primary/10 text-primary border-none mb-4 px-5 py-1.5 text-xs font-black uppercase tracking-widest">
              Book Your Visit
            </Badge>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Reserve Your Spot
            </h2>
            <p className="text-slate-500 font-medium">
              Fill in your details and we'll confirm your visit via WhatsApp within 24 hours.
            </p>
          </div>

          {booked ? (
            <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-12 text-center">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Visit Request Received! 🌿</h3>
              <p className="text-slate-500 font-medium mb-6 max-w-sm mx-auto">
                Thank you, <strong>{form.name}</strong>! Our team will confirm your visit on
                WhatsApp / Email within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/919166599895" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary text-white rounded-2xl font-bold h-12 px-8">
                    💬 WhatsApp Us Directly
                  </Button>
                </a>
                <Link href="/shop">
                  <Button variant="outline" className="rounded-2xl font-bold h-12 px-8">
                    Browse Our Products
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10 space-y-6">

              {/* Name + Phone */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">Full Name *</label>
                  <input
                    value={form.name} onChange={set("name")} required
                    placeholder="Priya Sharma"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">WhatsApp / Phone *</label>
                  <input
                    value={form.phone} onChange={set("phone")} required
                    placeholder="+91 98765 43210"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Email Address *</label>
                <input
                  type="email" value={form.email} onChange={set("email")} required
                  placeholder="priya@email.com"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              {/* Date + Group size */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">Preferred Visit Date *</label>
                  <input
                    type="date" value={form.visit_date} onChange={set("visit_date")} required
                    min={minDateStr}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">Group Size</label>
                  <select
                    value={form.group_size} onChange={set("group_size")}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
                  >
                    {["1","2","3 – 5","6 – 10","10 – 20","20+"].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              {/* Visit type */}
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Type of Visit</label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {VISIT_TYPES.map(vt => (
                    <label
                      key={vt.value}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        form.visit_type === vt.value
                          ? "border-primary bg-primary/5"
                          : "border-slate-100 hover:border-primary/30"
                      }`}
                    >
                      <input
                        type="radio" name="visit_type" value={vt.value}
                        checked={form.visit_type === vt.value}
                        onChange={set("visit_type")}
                        className="accent-primary"
                      />
                      <span className={`text-sm font-bold ${form.visit_type === vt.value ? "text-primary" : "text-slate-700"}`}>
                        {vt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-black text-slate-700 mb-2">Special Requests / Message</label>
                <textarea
                  value={form.message} onChange={set("message")} rows={3}
                  placeholder="Tell us about your group, any special dietary needs, or questions you'd like answered during the visit."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              <Button
                type="submit" disabled={loading}
                className="w-full h-14 bg-primary text-white rounded-2xl font-black text-base shadow-xl shadow-primary/20 disabled:opacity-70"
              >
                {loading ? "Submitting…" : "🌿 Book My Farm Visit"}
              </Button>
              <p className="text-center text-slate-400 text-xs font-medium">
                Or reach us directly · WhatsApp: +91 91665 99895 · shigruvedas@gmail.com
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── LOCATION ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-emerald-50 border border-primary/10 p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">How to Reach Us</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Farm Address</p>
                    <p className="text-slate-500 font-medium">Near Aravali Foothills, ~18 km from Udaipur.<br/>We'll send the exact Google Maps pin after booking.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Contact Before Arriving</p>
                    <a href="tel:+919166599895" className="text-primary font-bold hover:underline">+91 91665 99895</a>
                    <p className="text-slate-500 font-medium text-sm mt-1">Call or WhatsApp us before you set out — we'll guide you in.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-black text-slate-900">Farm Hours</p>
                    <p className="text-slate-500 font-medium">Monday – Saturday · 8:00 AM – 5:00 PM<br/>Sunday visits available for pre-booked groups only.</p>
                  </div>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/UdaipurFarm"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 bg-primary text-white font-bold rounded-2xl px-7 py-3 hover:bg-primary/90 transition-colors"
              >
                <MapPin className="h-4 w-4" /> Open in Google Maps
              </a>
            </div>
            <div className="bg-primary/10 rounded-2xl aspect-square flex items-center justify-center text-center p-8">
              <div>
                <TreePine className="h-16 w-16 text-primary mx-auto mb-4 opacity-60" />
                <p className="text-slate-600 font-bold text-lg mb-2">Exact pin shared on WhatsApp</p>
                <p className="text-slate-400 font-medium text-sm">After your booking is confirmed, we'll send you the precise Google Maps location and landmark details.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-black text-center text-slate-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details key={i} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-900 hover:text-primary transition-colors gap-4">
                  <span>{faq.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                </summary>
                <div className="px-6 pb-6 text-slate-500 font-medium text-[15px] leading-relaxed border-t border-slate-50 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Ready to Visit?</h2>
          <p className="text-slate-500 font-medium mb-8">Book above or reach us directly. We love welcoming guests to our farm — every visitor leaves with a new perspective on food.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#book">
              <Button className="bg-primary text-white h-14 px-10 rounded-2xl font-black text-base shadow-xl shadow-primary/20">
                Book a Visit →
              </Button>
            </a>
            <a href="https://wa.me/919166599895" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold text-base">
                💬 Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
