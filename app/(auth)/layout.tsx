import type React from "react"
import Link from "next/link"
import { Leaf } from "lucide-react"
import { MoringaCard } from "@/components/ui/moringa-card"
import * as motion from "framer-motion/client"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050B05] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Botanical Accents */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[200px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[180px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Nexus */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
        >
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="w-16 h-16 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2rem] flex items-center justify-center group-hover:bg-primary/20 transition-all duration-700 group-hover:rotate-[15deg]">
              <Leaf className="h-8 w-8 text-primary shadow-primary/50" />
            </div>
            <div className="space-y-1">
                <span className="text-white font-black text-2xl tracking-tighter uppercase block">Shigruvedas</span>
                <span className="text-primary/60 text-[10px] font-black tracking-[0.4em] uppercase block">Botanical Excellence</span>
            </div>
          </Link>
        </motion.div>

        {/* Auth Interface */}
        <MoringaCard 
            className="p-8 md:p-12 border-white/5 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden" 
            glass={true}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          {children}
        </MoringaCard>

        {/* Protocol Footer */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-10 space-y-4"
        >
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20">
            © 2025 Shigruvedas · Alchemical Supply Chain
          </p>
          <div className="flex justify-center gap-6 text-[10px] font-black tracking-widest uppercase text-white/40">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Privacy</Link>
            <span className="opacity-20">|</span>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Growth</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
