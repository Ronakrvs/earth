import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Truck, Leaf, MessageCircle, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ContactForm from "./ContactForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Shigruvedas | Organic Moringa Supplier in Rajasthan",
  description: "Get in touch with Shigruvedas for premium organic moringa. We offer bulk wholesale, retail orders, and farm visits in Udaipur, Rajasthan. Support local sustainable farming.",
  keywords: ["contact shigruvedas", "moringa wholesale India", "organic moringa bulk Udaipur", "moringa farm contact"],
}

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Shigruvedas",
      "image": "https://shigruvedas.com/og-image.jpg",
      "telephone": "+91-9166599895",
      "email": "shigruvedas@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "248, A-Block, hiran magri",
        "addressLocality": "Udaipur",
        "addressRegion": "Rajasthan",
        "postalCode": "313002",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm mx-auto">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            We'd Love to Hear From You
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Get in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Touch
            </span>
          </h1>

          <p className="text-green-100 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
            Ready to experience the power of organic moringa? Place your order or inquire about bulk purchases today!
          </p>
        </div>
      </section>

      {/* ─── CONTACT SECTION ────────────────────────────────────────── */}
      <section className="py-20 px-4 -mt-10 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left Column: Contact Sidebar */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Call Us</p>
                      <p className="text-xl font-extrabold text-gray-900">+91 91665 99895</p>
                      <p className="text-gray-500 text-sm font-medium">Mon-Sat, 9am - 6pm</p>
                    </div>
                  </div>

                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                      <p className="text-xl font-extrabold text-gray-900">shigruvedas@gmail.com</p>
                      <p className="text-gray-500 text-sm font-medium">We reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                      <p className="text-lg font-extrabold text-gray-900 leading-tight">
                        248, A-Block, hiran magri,<br />
                        Udaipur, Rajasthan 313002
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    Connect Organically
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Follow our farm journey on social media or reach out via WhatsApp for instant ordering support.
                  </p>
                </div>
              </div>

              {/* Service Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100">
                  <Clock className="w-8 h-8 text-green-600 mb-3" />
                  <p className="font-bold text-gray-900">Fast Response</p>
                  <p className="text-xs text-gray-500">Quotes in 12 hours</p>
                </div>
                <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100">
                  <Truck className="w-8 h-8 text-emerald-600 mb-3" />
                  <p className="font-bold text-gray-900">Global Shipping</p>
                  <p className="text-xs text-gray-500">Safe, secure delivery</p>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-display">Send a Message</h2>
                  <p className="text-gray-500 font-medium">Fill out the form below and our team will get back to you shortly.</p>
                </div>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── MAP SECTION ────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group relative">
             <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14511.233544710189!2d73.691544!3d24.571267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e5655030d9cb%3A0x2db4e7a63d917f30!2sHiran%20Magri%2C%20Udaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
            ></iframe>
            <div className="absolute top-10 left-10 bg-white p-6 rounded-3xl shadow-xl max-w-sm hidden md:block border border-gray-100">
              <div className="flex items-center gap-2 text-green-600 font-bold mb-2">
                <Leaf className="w-4 h-4" />
                Visit Our Office
              </div>
              <h4 className="text-lg font-extrabold text-gray-900 mb-2">Shigruvedas HQ</h4>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                248, A-Block, hiran magri, Udaipur, Rajasthan 313002
              </p>
              <Link 
                href="https://maps.google.com" 
                target="_blank"
                className="text-green-600 font-bold text-sm inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Get Directions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl bg-green-50 rounded-[40px] p-10 md:p-16 text-center border border-green-100">
          <Badge className="bg-green-100 text-green-700 mb-4 px-4 py-1">Direct Farm Supply</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Looking for Bulk Orders?</h2>
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8 text-lg">
            We supply premium organic moringa to businesses, retailers, and health stores worldwide. 
            Inquire about our wholesale prices and certificate of authenticity.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             <Link href="/b2b">
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-8 rounded-2xl shadow-lg">
                  Go to B2B Inquiries
                </Button>
             </Link>
             <Link href="tel:+919166599895">
                <Button variant="outline" className="border-green-300 text-green-700 font-bold h-14 px-8 rounded-2xl bg-white hover:bg-green-50">
                  Call Direct Sales
                </Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
