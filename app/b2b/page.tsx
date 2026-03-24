import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Building2, CheckCircle2, Users, Phone,
    TrendingDown, Package, Star, ArrowRight,
    Globe, Zap, ShieldCheck
} from "lucide-react"
import { B2BForm } from "./B2BClient"
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "B2B Wholesale & Institutional Supply | Shigruvedas",
  description: "Scale your wellness brand with Shigruvedas. Direct farm supply of premium organic moringa for retailers, exporters, and wellness innovators.",
}

const TIERS = [
  { 
    label: "Botanical Starter", 
    min: "5 kg", 
    discount: "10% Yield", 
    perks: ["Volume-based Pricing", "Standard Quality Assurance", "Direct Farm Dispatch"],
    accent: "bg-slate-50"
  },
  { 
    label: "Institutional Partner", 
    min: "25 kg", 
    discount: "20% Yield", 
    perks: ["Priority Botanical Selection", "Custom Alchemical Packaging", "NET-15 Terms"], 
    popular: true,
    accent: "bg-primary/5"
  },
  { 
    label: "Enterprise Alchemist", 
    min: "100 kg", 
    discount: "30% Yield", 
    perks: ["White-Label Integration", "Dedicated Portfolio Manager", "NPOP Export Certification", "NET-30 Strategic Terms"],
    accent: "bg-secondary/10"
  },
]

const CLIENTS = [
  { name: "Global Exporters", icon: Globe },
  { name: "Wellness Brands", icon: Zap },
  { name: "Aesthetic Clinics", icon: Star },
  { name: "Organic Retailers", icon: Building2 },
  { name: "Health Nexus", icon: Users },
  { name: "Botanical Artisans", icon: Leaf }
]

import { Leaf } from "lucide-react"

export default function B2BPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── B2B HERO ─────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-48 px-4 overflow-hidden text-center">
        {/* Organic Accents */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-primary/5 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase text-primary mb-12 border border-primary/5"
          >
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Institutional Botanical Supply
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9] italic"
          >
            Scale with <br/> <span className="text-primary not-italic tracking-[-0.05em]">Botanical Integrity.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto italic mb-16"
          >
            "Direct farm-to-institution logistics. We provide the purity your brand deserves, at the scale your vision requires."
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8"
          >
            <a href="#inquiry">
              <Button size="lg" className="h-18 px-14 bg-primary text-white hover:bg-emerald-900 rounded-2xl font-black text-xl shadow-2xl transition-all active:scale-95 group flex items-center gap-4">
                Initiate Inquiry <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </a>
            <a href="tel:+919166599895">
              <Button size="lg" variant="outline" className="h-18 px-12 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl font-black text-xl">
                Consultation Protocol
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── ENTITIES WE SERVE ─────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 relative z-10 border-y border-slate-100">
        <div className="container mx-auto max-w-7xl text-center">
            <h2 className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 mb-12">Institutional Ecosystem</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {CLIENTS.map(({ name, icon: Icon }) => (
                    <motion.div 
                        key={name}
                        whileHover={{ y: -5 }}
                        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col items-center gap-4 group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                            <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-black text-[10px] uppercase tracking-widest text-slate-800">{name}</span>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* ─── PRICING TIERS ─────────────────────────────────────────── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 italic tracking-tight">Tiered Optimization.</h2>
            <p className="text-slate-400 font-medium italic text-lg text-center mx-auto">Scaling discounts designed for botanical longevity.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {TIERS.map(({ label, min, discount, perks, popular, accent }) => (
              <MoringaCard
                key={label}
                className={cn(
                  "p-12 border-primary/5 shadow-2xl relative flex flex-col justify-between overflow-hidden",
                  popular ? "border-primary/20 bg-primary/5 shadow-primary/10" : "bg-white"
                )}
                glass={true}
              >
                {popular && (
                  <div className="absolute top-0 right-0 p-4">
                    <Badge className="bg-primary text-white font-black uppercase text-[8px] tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                      Optimal Velocity
                    </Badge>
                  </div>
                )}
                
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tight">{label}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Base: {min}</p>
                  
                  <div className="mb-10 p-6 rounded-3xl bg-white border border-slate-50 shadow-inner">
                    <div className="text-5xl font-black text-primary tracking-tighter italic">{discount}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Yield Optimization</div>
                  </div>
                  
                  <ul className="space-y-4 mb-12">
                    {perks.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-sm text-slate-500 font-medium italic">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <a href="#inquiry">
                  <Button
                    className={cn(
                      "w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest transition-all",
                      popular ? "bg-primary text-white hover:bg-emerald-900 shadow-xl" : "bg-white text-slate-900 border border-slate-100 hover:bg-slate-50"
                    )}
                  >
                    Initiate protocol
                  </Button>
                </a>
              </MoringaCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STRATEGIC BENEFITS ─────────────────────────────────────── */}
      <section className="py-32 px-4 bg-slate-900 text-white relative overflow-hidden ring-1 ring-white/5">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 100 M100 0 L0 100" stroke="currentColor" strokeWidth="0.1" />
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-24">
            <Badge className="bg-primary/20 text-primary border-none font-black uppercase tracking-[0.3em] px-6 py-2 mb-8">Architectural Advantages</Badge>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-[0.9]">Why Partner with <br/> <span className="text-primary not-italic">Integrity.</span></h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Package, title: "Consistent Yield", desc: "Year-round botanical predictability from our 7+ acre Rajastani sanctuary." },
              { icon: ShieldCheck, title: "Alchemical Purity", desc: "Certified NPOP standards, lab-verified for supreme nutrient density." },
              { icon: TrendingDown, title: "Market Optimization", desc: "Enterprise pricing structures designed for sustainable growth." },
              { icon: Users, title: "Technical Support", desc: "Dedicated alchemical advisor for seamless workflow integration." },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div 
                key={title}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] bg-white/5 border border-white/5 backdrop-blur-3xl hover:bg-white/10 transition-all group"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 border border-primary/20 transition-all group-hover:scale-110">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-black mb-4 italic tracking-tight">{title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed italic">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INQUIRY NEXUS ─────────────────────────────────────────── */}
      <section id="inquiry" className="py-40 px-4">
        <div className="container mx-auto max-w-4xl">
          <MoringaCard className="p-12 md:p-24 border-primary/5 shadow-2xl relative overflow-hidden" glass={true}>
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 className="w-40 h-40 text-primary" />
            </div>
            
            <div className="text-center mb-20 relative z-10">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 italic tracking-tighter">Initiate Nexus.</h2>
              <p className="text-slate-400 text-lg font-medium italic max-w-xl mx-auto">Submit your institutional requirements. Our artisans will manifest a customized partnership proposal.</p>
            </div>
            
            <B2BForm />
          </MoringaCard>
        </div>
      </section>
    </div>
  )
}
