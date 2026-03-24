import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Leaf, Sun, Droplets, Heart, Users, Award, MapPin, 
  Calendar, Sprout, Camera, Shield, ArrowRight, Star, 
  Map as MapIcon, Globe
} from "lucide-react"
import WhatsAppButton from "@/components/whatsapp-button"
import moringa from '@/public/moringa.webp'
import moringa1 from '@/public/moringa7.webp'
import moringa2 from '@/public/moringa2.webp'
import moringa3 from '@/public/morinag3.webp'
import moringa4 from '@/public/moringa4.webp'
import moringa5 from '@/public/moringa6.webp'
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Botanical Integrity: Our Organic Farm Story | Shigruvedas",
  description: "Explore our 7+ acre certified organic moringa farm in Udaipur, Rajasthan. A journey of sustainable alchemy, from Earth to Wellness.",
}

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Farm"],
    "name": "Shigruvedas Organic Moringa Farm",
    "description": "Certified organic moringa farm in Rajasthan with 10,000+ trees and chemical-free farming.",
    "url": "https://shigruvedas.com/about",
    "telephone": "+91-9166599895",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Udaipur",
      "addressRegion": "Rajasthan",
      "addressCountry": "IN"
    }
  }

  const farmGalleryImages = [
    { src: moringa2, alt: "Aerial view of farm", title: "Botanical Sanctuary" },
    { src: moringa1, alt: "Healthy trees", title: "10,000+ Sentinels" },
    { src: moringa, alt: "Farmers picking", title: "Hand-Picked Alchemy" },
    { src: moringa3, alt: "Organic methods", title: "Ancient Wisdom" },
    { src: moringa4, alt: "Sun-drying", title: "Solar Infusion" },
    { src: moringa5, alt: "Quality control", title: "Purity Protocol" }
  ]

  return (
    <div className="min-h-screen bg-background pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ─── ABOUT HERO ─────────────────────────────────────────── */}
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
            Certified Organic Sanctuary • Udaipur
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9] italic"
          >
            Rooted in <br/> <span className="text-primary not-italic tracking-[-0.05em]">Alchemies.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto mb-16 italic"
          >
            "Connecting Rajasthan's ancient farming heritage with contemporary botanical science to bring you the purest moringa on Earth."
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]"
          >
            <span className="flex items-center gap-3"><MapIcon className="h-5 w-5 text-primary/20" /> Mewar Region</span>
            <span className="flex items-center gap-3"><Calendar className="h-5 w-5 text-primary/20" /> Since 2019</span>
            <span className="flex items-center gap-3"><Shield className="h-5 w-5 text-primary/20" /> NPOP Certified</span>
          </motion.div>
        </div>
      </section>

      {/* ─── STORY GALLERY ────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmGalleryImages.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <MoringaCard className="p-0 border-primary/5 group overflow-hidden h-full shadow-2xl shadow-primary/2 hover:shadow-primary/5 transition-all" glass={true}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-[4000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 p-8 flex flex-col justify-end">
                      <Camera className="h-6 w-6 text-primary mb-4" />
                      <h3 className="text-xl font-black text-white italic tracking-tight">{image.title}</h3>
                      <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">{image.alt}</p>
                    </div>
                  </div>
                </MoringaCard>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 text-center"
          >
            <WhatsAppButton
              message="I'd love to learn more about your farm tours and sustainable practices."
              className="h-16 px-12 bg-primary text-white hover:bg-emerald-900 rounded-2xl font-black text-lg shadow-2xl transition-all"
            >
              Schedule Farm Visit
            </WhatsAppButton>
          </motion.div>
        </div>
      </section>

      {/* ─── MISSION & VISION ───────────────────────────────────────── */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-6xl text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-6">The Botanical Intent</h2>
            <div className="w-24 h-1.5 bg-primary/20 mx-auto rounded-full" />
        </div>

        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <MoringaCard className="p-12 h-full border-primary/5 hover:bg-primary/5 transition-colors" glass={true}>
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-10 shadow-xl shadow-primary/5">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-6 italic tracking-tight">Our Mission</h3>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic mb-8">
                  "To bridge the gap between ancient Ayurvedic wisdom and modern nutrition through certified organic cultivation."
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We are committed to zero-chemical agriculture, supporting artisanal farming communities in Mewar, and preserving botanical purity for generations to come.
                </p>
              </MoringaCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <MoringaCard className="p-12 h-full bg-slate-900 text-white border-none shadow-2xl shadow-primary/20" glass={false}>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-xl border border-white/10">
                  <Heart className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-3xl font-black mb-6 italic tracking-tight">Our Vision</h3>
                <p className="text-slate-300 text-lg leading-relaxed font-medium italic mb-8">
                  "To define the global standard for premium botanical integrity while empowering the land that nurtures us."
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We are Philippine where high-density nutrition is harvested with respect for the Earth, making Rajasthan's green gold accessible to homes across the globe.
                </p>
              </MoringaCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── FARM STATS ────────────────────────────────────────────── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/2 -z-10" />
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { val: "7+", sub: "Certified Acres", icon: MapIcon },
              { val: "10k+", sub: "Moringa Trees", icon: Sprout },
              { val: "5+", sub: "Years of Wisdom", icon: Calendar },
              { val: "100%", sub: "Organic Integrity", icon: Shield }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-center mb-6">
                  <stat.icon className="h-8 w-8 text-primary/30" />
                </div>
                <div className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-2 italic">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY MORINGA ALCHEMY ────────────────────────────────────────── */}
      <section className="py-40 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl ring-1 ring-primary/5"
            >
              <Image 
                src={moringa1} 
                alt="Nutrient dense moringa" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-x-8 bottom-8 p-10 bg-white/20 backdrop-blur-3xl border border-white/20 rounded-[3rem] text-white">
                <Star className="h-8 w-8 text-accent fill-accent mb-6" />
                <p className="text-2xl font-black italic leading-tight">"Nature's most dense manifestation of life-force."</p>
              </div>
            </motion.div>

            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-accent mb-10">
                The Miracle Profile
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] italic mb-12">Ancient Alchemy for the <span className="text-primary not-italic tracking-tighter">Modern Body.</span></h2>
              
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { t: "7x Vit-C", d: "Than Oranges", icon: Sun },
                  { t: "4x Calcium", d: "Than Milk", icon: Heart },
                  { t: "3x Potassium", d: "Than Bananas", icon: Droplets },
                  { t: "2x Protein", d: "Than Yogurt", icon: Sprout }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ x: 10 }}
                    className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-primary/2 group"
                  >
                    <item.icon className="h-6 w-6 text-primary/40 group-hover:text-primary transition-colors mb-6" />
                    <h4 className="text-2xl font-black text-slate-900 italic tracing-tight">{item.t}</h4>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.d}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL BOTANICAL CTA ────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <MoringaCard className="bg-gradient-to-br from-primary to-emerald-950 p-12 md:p-32 text-center text-white relative overflow-hidden border-none shadow-2xl shadow-primary/20" glass={false}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <circle cx="90" cy="10" r="30" fill="currentColor" />
                    <circle cx="10" cy="90" r="20" fill="currentColor" />
                </svg>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex h-20 w-20 rounded-[2.5rem] bg-white/10 items-center justify-center mb-10 backdrop-blur-md">
                <Globe className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter italic">Join the Botanical Journey 🌿</h2>
              <p className="text-emerald-100/70 text-xl font-medium leading-relaxed mb-16 italic">"From our Rajasthan farm to your wellness rituals. Experience the purest expression of the Miracle Tree."</p>
              
              <div className="flex flex-wrap gap-6 justify-center">
                <Link href="/shop">
                  <Button size="lg" className="h-18 px-14 bg-white text-primary hover:bg-emerald-50 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 group flex items-center gap-4">
                    Explore the Collection <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                <WhatsAppButton
                  message="I'd like to visit your farm!"
                  variant="outline"
                  className="h-18 px-12 border-white/20 text-white hover:bg-white/10 rounded-2xl font-black text-xl backdrop-blur-xl"
                >
                  Schedule Visit
                </WhatsAppButton>
              </div>
            </div>
          </MoringaCard>
        </div>
      </section>
    </div>
  )
}