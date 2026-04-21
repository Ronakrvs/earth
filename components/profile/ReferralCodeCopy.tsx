"use client"

import { useState } from "react"
import { Copy, Check, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoringaCard } from "@/components/ui/moringa-card"
import * as motion from "framer-motion/client"

interface ReferralCodeCopyProps {
  code: string
}

export default function ReferralCodeCopy({ code }: ReferralCodeCopyProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy!", err)
    }
  }

  return (
    <MoringaCard className="p-8 border-primary/20 bg-primary/5 relative overflow-hidden group" glass={true}>
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">Referral Nexus</span>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: copied ? 1 : 0 }}
            className="text-[10px] font-black uppercase tracking-widest text-emerald-600 italic bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"
          >
            Copied to Clipboard
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-4 flex items-center justify-between shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-2xl font-black italic tracking-tighter text-slate-900 select-all">
                {code}
              </span>
              <div className="h-6 w-px bg-slate-100 mx-2 hidden md:block" />
              <button 
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-primary transition-colors p-2"
                title="Copy to clipboard"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <Button 
            onClick={copyToClipboard}
            className="h-14 px-8 bg-slate-900 text-white hover:bg-primary rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-3 w-full md:w-auto border-none"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Code"}
          </Button>
        </div>

        <p className="text-[10px] font-medium text-slate-400 italic leading-relaxed">
          "Share this unique botanical signature. When a new botanist initiates their journey using your code, you both manifest 500 Vitality points."
        </p>
      </div>
    </MoringaCard>
  )
}
