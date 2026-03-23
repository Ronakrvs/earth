import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Building2, CheckCircle2, Users, Phone,
    TrendingDown, Package, Star, ArrowRight
} from "lucide-react"
import { B2BForm, B2BInquiryStatus } from "./B2BClient"

export const metadata: Metadata = {
  title: "B2B Wholesale Moringa | Shigruvedas",
  description: "Premium bulk moringa products for businesses. Wholesale pricing, dedicated account manager, and flexible payment terms for retailers, restaurants and exporters.",
}

const TIERS = [
  { label: "Starter", min: "5 kg", discount: "10%", perks: ["Volume pricing", "Dedicated support", "Standard delivery"] },
  { label: "Business", min: "25 kg", discount: "20%", perks: ["Priority dispatch", "Custom packaging", "NET-15 terms"], popular: true },
  { label: "Enterprise", min: "100 kg", discount: "30%", perks: ["White-label packaging", "NET-30 terms", "Dedicated manager", "Custom contracts"] },
]

const CLIENTS = ["Retailers", "Restaurants", "Health Food Stores", "Ayurvedic Clinics", "Exporters", "Wellness Brands"]

export default function B2BPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white pt-16 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge className="bg-white/20 text-white border-white/30 mb-4">B2B Wholesale Program</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Premium Moringa at<br />Wholesale Prices
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto mb-8">
            Direct from our 7+ acre certified organic farm in Rajasthan. 
            Partner with Shigruvedas for consistent supply, competitive pricing, and enterprise-grade support.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-green-200 mb-10">
            {["100% Certified Organic", "Minimum 5kg Order", "Custom Packaging", "NET-30 Terms"].map((f) => (
              <div key={f} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> {f}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#inquiry">
              <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-semibold gap-2">
                Submit B2B Inquiry <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="tel:+9166599895">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <Phone className="h-4 w-4" /> Call +91 9166599895
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Who We Supply</h2>
          <p className="text-gray-500 text-sm mb-6">Trusted by businesses across India</p>
          <div className="flex flex-wrap justify-center gap-3">
            {CLIENTS.map((c) => (
              <Badge key={c} variant="outline" className="px-4 py-1.5 text-sm border-green-300 text-green-700 bg-white">
                <Building2 className="h-3.5 w-3.5 mr-1.5" /> {c}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Wholesale Pricing Tiers</h2>
            <p className="text-gray-500">The more you order, the more you save</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map(({ label, min, discount, perks, popular }) => (
              <div
                key={label}
                className={`rounded-2xl border-2 p-6 relative ${
                  popular
                    ? "border-green-500 shadow-lg shadow-green-100"
                    : "border-gray-200"
                }`}
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-600 text-white px-3">Most Popular</Badge>
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{label}</h3>
                  <p className="text-sm text-gray-500">From {min} per order</p>
                  <div className="text-4xl font-bold text-green-600 mt-3">{discount}</div>
                  <div className="text-sm text-gray-400">discount on retail price</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
                <a href="#inquiry">
                  <Button
                    className={`w-full ${popular ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
                    variant={popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Partner with Shigruvedas?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package, title: "Consistent Supply", desc: "Year-round supply from our 7+ acre farm with zero stock-outs" },
              { icon: Star, title: "Premium Quality", desc: "Certified organic, lab-tested for purity and nutritional value" },
              { icon: TrendingDown, title: "Best Pricing", desc: "Competitive wholesale pricing with flexible payment terms" },
              { icon: Users, title: "Dedicated Support", desc: "Personal account manager and priority customer care" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Submit B2B Inquiry</h2>
            <p className="text-gray-500">Fill out the form and our team will respond within 24 hours</p>
          </div>
          <B2BForm />
        </div>
      </section>
      
      <B2BInquiryStatus />
    </div>
  )
}
