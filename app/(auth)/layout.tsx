import type React from "react"
import Link from "next/link"
import { Leaf } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Leaf className="h-7 w-7 text-green-300" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Shigruvedas</span>
            <span className="text-green-300 text-xs -mt-1">Organic Moringa Farm, Rajasthan</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-7">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-green-300/70 mt-5">
          © 2025 Shigruvedas · 
          <Link href="/privacy" className="hover:text-green-200 ml-1">Privacy</Link> · 
          <Link href="/terms" className="hover:text-green-200 ml-1">Terms</Link>
        </p>
      </div>
    </div>
  )
}
