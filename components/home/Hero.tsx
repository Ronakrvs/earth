"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Leaf, Star, Phone } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-background text-foreground pt-20 pb-32"
    >
      {/* Dynamic Background Elements - Organic Blobs */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" 
      />

      <div className="container relative z-10 mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-xs font-bold mb-8 border border-primary/10 text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Direct from Our Certified 7+ Acre Farm
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 tracking-tighter text-slate-900">
            Elevate Your Health with 
            <span className="block text-gradient">
              Pure Moringa Zen
            </span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10 max-w-xl font-medium">
            Experience the miracle tree in its most potent form. Hand-picked, chemical-free, and nutrient-dense moringa delivered from our Udaipur farm to your wellness routine.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/shop">
              <Button size="lg" className="h-14 px-8 bg-primary text-white hover:bg-primary/90 rounded-2xl font-bold text-lg shadow-xl shadow-primary/10 group">
                Shop Fresh Now 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/b2b">
              <Button size="lg" variant="outline" className="h-14 px-8 border-primary/20 text-primary hover:bg-primary/5 rounded-2xl font-bold transition-all">
                B2B Wholesale
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 opacity-40 hover:opacity-100 transition-all duration-500">
            {["Lab-Tested", "Organic Certified", "Zero Chemicals"].map((tag) => (
              <div key={tag} className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-slate-500">
                <Leaf className="h-4 w-4 text-primary" />
                {tag}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          style={{ scale, opacity }}
          className="relative flex items-center justify-center p-4"
        >
          {/* Main Product Image with Parallax Floating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[480px] aspect-square rounded-[3rem] bg-stone-100/50 p-12 border border-white/50 shadow-2xl animate-zen-float"
          >
            <Image
              src="/images/powder2.png"
              alt="Premium Moringa Powder"
              width={600}
              height={600}
              className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)]"
              priority
            />
          </motion.div>

          {/* Floating Action Badge */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="absolute -top-4 right-8 z-20 bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-primary/5 shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-accent/20 flex items-center justify-center">
                <Star className="h-6 w-6 text-accent fill-accent" />
              </div>
              <div>
                <div className="text-sm font-black text-slate-900">4.9/5 Rating</div>
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">500+ Verified Reviews</div>
              </div>
            </div>
          </motion.div>

          {/* Harvest Info Badge */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute -bottom-10 left-8 z-20 bg-white/80 backdrop-blur-xl p-5 rounded-3xl border border-primary/5 shadow-xl max-w-[200px]"
          >
            <div className="text-[10px] font-black text-primary mb-2 uppercase tracking-widest">Harvest Status:</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Fresh Dispatch Active
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Hero Curve Decorator */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-[calc(100%+1.3px)] h-[80px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C58.42,88.54,124.57,100.25,185,100.25,245.43,100.25,274.5,73.57,321.39,56.44Z" fill="var(--background)"></path>
        </svg>
      </div>
    </section>
  )
}
