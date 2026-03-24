"use client"

import { motion } from "framer-motion"
import { Shield, Truck, Zap, Leaf } from "lucide-react"
import { MoringaCard } from "@/components/ui/moringa-card"

const FEATURES = [
  { 
    icon: Leaf, 
    title: "100% Certified Organic", 
    desc: "No pesticides, no chemicals — ever. Our farm follows strict organic practices for maximum purity.",
    color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-600" 
  },
  { 
    icon: Truck, 
    title: "Eco-Friendly Delivery", 
    desc: "Fast PAN-India shipping with sustainable packaging. Free delivery on orders above ₹499.",
    color: "bg-amber-100 text-amber-700 hover:bg-amber-600" 
  },
  { 
    icon: Shield, 
    title: "Purity Guaranteed", 
    desc: "Lab-tested for nutritional potency. 100% satisfaction or your money back with every purchase.",
    color: "bg-blue-100 text-blue-700 hover:bg-blue-600" 
  },
  { 
    icon: Zap, 
    title: "Harvest to Table", 
    desc: "Harvested fresh and dispatched within 24 hours. Preserving maximum vitality and nutrition.",
    color: "bg-purple-100 text-purple-700 hover:bg-purple-600" 
  },
]

export default function Features() {
  return (
    <section className="py-32 px-4 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-4"
          >
            The Shigruvedas Standard
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Nature's Quality, <span className="text-gradient">Elevated</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg"
          >
            We've redefined the journey of Moringa. From our sun-drenched Udaipur farm to your daily routine, every step is optimized for vitality.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <MoringaCard 
              key={feature.title} 
              delay={idx * 0.15}
              className="group p-8 border-none bg-white hover:bg-primary transition-all duration-500"
              hoverEffect="scale"
              glass={false}
            >
              <div className={`w-16 h-16 ${feature.color} rounded-[1.25rem] flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-white group-hover:text-primary group-hover:rotate-6`}>
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="font-extrabold text-xl mb-4 group-hover:text-white transition-colors duration-500">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed group-hover:text-white/80 transition-colors duration-500">
                {feature.desc}
              </p>
            </MoringaCard>
          ))}
        </div>
      </div>
    </section>
  )
}
