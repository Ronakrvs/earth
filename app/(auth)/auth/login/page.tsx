"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Mail, Lock, LogIn, Sparkles } from "lucide-react"
import * as motion from "framer-motion/client"

const schema = z.object({
  email: z.string().email("Please enter a valid alchemical identifier"),
  password: z.string().min(6, "Passphrase must be at least 6 characters"),
})
type FormData = z.infer<typeof schema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = (() => {
    const raw = searchParams.get("callbackUrl") || "/"
    if (raw.startsWith("/api")) return "/"
    return raw
  })()
  const isConfirmed = searchParams.get("confirmed") === "true"
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (result?.error) {
      setServerError("Authentication failed. Invalid credentials.")
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    await signIn("google", { callbackUrl })
  }

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Authentication.</h1>
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-slate-400 mt-2">Resume your botanical journey</p>
      </div>

      {isConfirmed && (
        <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest"
        >
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          Email Verified. Proceed to Login.
        </motion.div>
      )}

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
        className="w-full h-14 rounded-2xl border-slate-100 hover:bg-slate-50 gap-4 font-black text-xs uppercase tracking-widest transition-all shadow-sm"
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
          Neural Bypass
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Identifier</Label>
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

        <div className="space-y-2">
          <div className="flex justify-between items-center px-4">
            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Key</Label>
            <Link
              href="/auth/forgot-password"
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-emerald-900 transition-colors"
            >
              Lost Logic?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-14 pl-12 rounded-2xl border-slate-50 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none"
              {...register("password")}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{errors.password.message}</p>
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
                Secure Entry <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>

      <div className="text-center pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Uninitiated?{" "}
            <Link href="/auth/signup" className="text-primary hover:text-emerald-900 transition-colors underline underline-offset-4">
                Manifest Profile
            </Link>
          </p>
      </div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-12 gap-6">
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Initializing Protocol...</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
