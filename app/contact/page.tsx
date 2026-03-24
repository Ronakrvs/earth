import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { 
  Mail, Phone, MapPin, Clock, Truck, Leaf, 
  MessageCircle, ArrowRight, Globe, ShieldCheck,
  Zap
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ContactForm from "./ContactForm"
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Contact Botanical Integrity | Shigruvedas",
  description: "Initiate your botanical journey. Contact Shigruvedas for premium organic moringa wholesale, retail, and farm inquiries in Udaipur, Rajasthan.",
}

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Shigruvedas",
      "telephone": "+91-9166599895",
      "email": "shigruvedas@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "248, A-Block, hiran magri",
        "addressLocality": "Udaipur",
        "addressRegion": "Rajasthan",
        "postalCode": "313002",
        "addressCountry": "IN"
      }
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ─── CONTACT HERO ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-40 px-4 overflow-hidden text-center">
        {/* Organic Accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-primary/5 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase text-primary mb-12 border border-primary/5"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Connect with Botanical Integrity
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9] italic"
          >
            Initiate the <br/> <span className="text-primary not-italic tracking-[-0.05em]">Dialogue.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mx-auto italic"
          >
            "Whether you seek wholesale partnership or a single jar of purity, our artisans are ready to assist your journey."
          </motion.p>
        </div>
      </section>

      {/* ─── CONTACT GRID ───────────────────────────────────────────── */}
      <section className="px-4 relative z-10 -mt-10">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12">
            
            {/* Left: Info Grid */}
            <div className="lg:col-span-5 space-y-10">
              <MoringaCard className="p-10 border-primary/5 shadow-2xl shadow-primary/2 h-full flex flex-col justify-between" glass={true}>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-12 italic tracking-tight">Direct Channels</h2>
                  
                  <div className="space-y-12">
                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="flex gap-6 group cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl shadow-primary/5">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Voice Protocol</p>
                        <p className="text-2xl font-black text-slate-900 italic tracking-tight">+91 91665 99895</p>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">Aesthetic Hours: 9am — 6pm</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="flex gap-6 group cursor-pointer"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-xl shadow-accent/5">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Digital Protocol</p>
                        <p className="text-2xl font-black text-slate-900 italic tracking-tight">shigruvedas@gmail.com</p>
                        <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">Response within 1 solar cycle</p>
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ x: 10 }}
                      className="flex gap-6 group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-amber-500/5">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Physical Sanctuary</p>
                        <p className="text-xl font-black text-slate-900 italic tracking-tight leading-tight">
                          248, A-Block, hiran magri,<br />
                          Udaipur, Rajasthan 313002
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-slate-50">
                  <div className="flex items-center gap-4 text-primary mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/5">
                    <ShieldCheck className="w-6 h-6" />
                    <p className="text-sm font-black italic tracking-tight">Data Integrity Guaranteed.</p>
                  </div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">
                    Your information remains encrypted and purely within our botanical ecosystem.
                  </p>
                </div>
              </MoringaCard>

              {/* Service Cards */}
              <div className="grid grid-cols-2 gap-6">
                <MoringaCard className="p-8 border-primary/5 flex flex-col items-center text-center group hover:bg-primary transition-colors" glass={true}>
                  <Zap className="w-8 h-8 text-primary group-hover:text-white mb-4 transition-colors" />
                  <p className="font-black text-slate-900 group-hover:text-white italic tracking-tight">Rapid Response</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/60 mt-2">Quotes in 12h</p>
                </MoringaCard>
                <MoringaCard className="p-8 border-primary/5 flex flex-col items-center text-center group hover:bg-accent transition-colors" glass={true}>
                  <Globe className="w-8 h-8 text-accent group-hover:text-white mb-4 transition-colors" />
                  <p className="font-black text-slate-900 group-hover:text-white italic tracking-tight">Global Logistics</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white/60 mt-2">Trusted Delivery</p>
                </MoringaCard>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-7">
              <MoringaCard className="p-12 md:p-16 border-primary/5 shadow-2xl shadow-primary/2" glass={true}>
                <div className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 italic tracking-tighter">Manifest Intent.</h2>
                  <p className="text-slate-400 font-medium italic">Initiate communication through the botanical nexus below.</p>
                </div>
                <ContactForm />
              </MoringaCard>
            </div>

          </div>
        </div>
      </section>

      {/* ─── MAP SECTION ────────────────────────────────────────────── */}
      <section className="py-40 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 group relative ring-1 ring-slate-100"
          >
             <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14511.233544710189!2d73.691544!3d24.571267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e5655030d9cb%3A0x2db4e7a63d917f30!2sHiran%20Magri%2C%20Udaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
              width="100%"
              height="600"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 hover:scale-[1.02]"
            ></iframe>
            
            <div className="absolute top-12 left-12 max-w-sm hidden md:block">
              <MoringaCard className="p-10 border-none shadow-2xl shadow-black/10" glass={true}>
                <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                  <Leaf className="w-5 h-5" />
                  Headquarters
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-4 italic tracking-tight">Shigruvedas HQ</h4>
                <p className="text-slate-500 font-medium leading-relaxed mb-8 italic">
                  248, A-Block, hiran magri,<br/> Udaipur, Rajasthan 313002
                </p>
                <Link 
                  href="https://maps.google.com" 
                  target="_blank"
                  className="inline-flex h-14 items-center gap-3 px-8 bg-slate-900 text-white rounded-2xl font-black text-sm group/btn hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
                >
                  Get Directions <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
              </MoringaCard>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── B2B CTA SECTION ────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <MoringaCard className="bg-slate-900 p-12 md:p-24 text-center text-white relative overflow-hidden border-none shadow-2xl shadow-primary/20" glass={false}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L50 0 L100 100 Z" fill="currentColor" />
              </svg>
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <Badge className="bg-secondary text-primary font-black uppercase tracking-[0.3em] px-6 py-2 mb-10 rounded-full border-none">
                Botanical Scalability
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter italic leading-[0.9]">Partner in <br/> <span className="text-secondary not-italic">Wholesale Purity.</span></h2>
              <p className="text-slate-400 text-xl font-medium leading-relaxed mb-16 italic">
                "Join our network of premium wellness providers. We offer direct farm shipping and NPOP certified consistency for your global brand."
              </p>
              
              <div className="flex flex-wrap justify-center gap-8">
                <Link href="/b2b">
                  <Button size="lg" className="h-18 px-14 bg-secondary text-primary hover:bg-white rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 group flex items-center gap-4 border-none">
                    B2B Inquiries <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <Link href="tel:+919166599895">
                  <Button variant="outline" className="h-18 px-12 border-white/20 text-white hover:bg-white/10 rounded-2xl font-black text-xl backdrop-blur-xl">
                    Call Direct Sales
                  </Button>
                </Link>
              </div>
            </div>
          </MoringaCard>
        </div>
      </section>
    </div>
  )
}
