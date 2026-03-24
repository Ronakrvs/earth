"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Loader2, Mail, Sparkles, ArrowRight, RefreshCcw } from "lucide-react"
import * as motion from "framer-motion/client"

const schema = z.object({
  email: z.string().email("Please enter a valid alchemical identifier"),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    if (error) {
      setServerError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/10">
            <Mail className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">Nexus Transversal.</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Recovery link dispatched to your portal.</p>
        </div>
        <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
           "Engage the secure cryptographic link transmitted to your correspondence to restore your botanical logic."
        </p>
        <Link href="/auth/login" className="block w-full">
          <Button className="w-full h-16 bg-primary text-white hover:bg-emerald-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10 transition-all border-none">
            Return to Entry
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Logic Restoration.</h1>
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mt-2">Recover your botanical access</p>
      </div>

      {serverError && (
        <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-red-600 bg-red-50 border border-red-100 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {serverError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 text-left">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Identification Marker</Label>
          <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <Input
                id="email"
                type="email"
                placeholder="you@nexus.com"
                className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none"
                {...register("email")}
              />
          </div>
          {errors.email && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-16 bg-primary text-white hover:bg-emerald-900 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/10 transition-all active:scale-95 group border-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-3">
                Initiate Restoration <RefreshCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-700" />
            </span>
          )}
        </Button>
      </form>

      <div className="text-center pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Remembered your logic?{" "}
            <Link href="/auth/login" className="text-primary hover:text-emerald-900 transition-colors underline underline-offset-4">Sign in</Link>
          </p>
      </div>
    </motion.div>
  )
}
