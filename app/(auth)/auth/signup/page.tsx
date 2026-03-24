"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, User, Mail, Phone, Lock, Sparkles, ArrowRight, UserPlus } from "lucide-react"
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"

const schema = z.object({
  full_name: z.string().min(2, "Identifier must be at least 2 characters"),
  email: z.string().email("Please enter a valid alchemical identifier"),
  phone: z.string().optional(),
  password: z.string().min(8, "Security key must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Security keys do not match",
  path: ["confirm_password"],
})
type FormData = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.full_name, phone: data.phone },
        emailRedirectTo: `${window.location.origin}/auth/login?confirmed=true`,
      },
    })
    if (error) {
      setServerError(error.message)
    } else {
      setSuccess(true)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    await signIn("google", { callbackUrl: "/" })
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
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter">Verification Pending.</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Authentication link dispatched to your nexus.</p>
        </div>
        <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
           "We have transmitted a secure activation protocol to your email. Engage the link to manifest your profile."
        </p>
        <Link href="/auth/login" className="block w-full">
          <Button className="w-full h-16 bg-primary text-white hover:bg-emerald-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10 transition-all border-none">
            Back to Entry
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
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Manifest Identity.</h1>
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mt-2">Initialize your botanical presence</p>
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

      {/* Google Protocol */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-14 rounded-2xl border-slate-50 hover:bg-slate-50 gap-4 font-black text-xs uppercase tracking-widest transition-all shadow-sm"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <Separator className="bg-slate-50" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-[8px] font-black uppercase tracking-[0.3em] text-slate-300">
          Biological Entry
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Full Nomenclature</Label>
          <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <Input id="full_name" placeholder="Ronak Sharma" className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" {...register("full_name")} />
          </div>
          {errors.full_name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{errors.full_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Alchemical Identifier</Label>
          <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <Input id="email" type="email" placeholder="you@nexus.com" className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" {...register("email")} />
          </div>
          {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Communication Line (Optional)</Label>
          <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
              <Input id="phone" type="tel" placeholder="+91 91665 9895" className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" {...register("phone")} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">New Security Logic</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Minimum 8 characters" className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" {...register("password")} />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Confirm Logic Protocol</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input id="confirm_password" type={showConfirm ? "text" : "password"} placeholder="Re-enter logic" className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" {...register("confirm_password")} />
            <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500" onClick={() => setShowConfirm(!showConfirm)}>
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
          {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <span className="flex items-center gap-3">
                  Initiate Profile <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </span>
          )}
        </Button>
      </form>

      <div className="text-center pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Already Initialized?{" "}
            <Link href="/auth/login" className="text-primary hover:text-emerald-900 transition-colors underline underline-offset-4">Sign in</Link>
          </p>
      </div>
    </motion.div>
  )
}
