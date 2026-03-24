"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react"
import * as motion from "framer-motion/client"

const schema = z.object({
  password: z.string().min(8, "Security key must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Security keys do not match",
  path: ["confirm_password"],
})
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: data.password })
    if (error) {
      setServerError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push("/auth/login"), 2500)
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
                <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
        </div>
        <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">Logic Restored.</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Security protocol updated successfully.</p>
        </div>
        <div className="flex flex-col items-center gap-4">
             <p className="text-sm text-slate-500 font-medium italic">"Redirecting to secure entry..."</p>
             <Loader2 className="h-5 w-5 animate-spin text-primary/40" />
        </div>
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Restoring Access.</h1>
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mt-2">Redefine your botanical security</p>
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">New Security Logic</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
                placeholder="Minimum 8 characters" 
                className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" 
                {...register("password")} 
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Confirm New Logic</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input 
                id="confirm_password" 
                type={showConfirm ? "text" : "password"} 
                placeholder="Re-enter logic protocol" 
                className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" 
                {...register("confirm_password")} 
            />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm_password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{errors.confirm_password.message}</p>}
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
                Update Protocol <ShieldCheck className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </span>
          )}
        </Button>
      </form>
    </motion.div>
  )
}
