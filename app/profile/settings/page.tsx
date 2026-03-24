"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, User, Lock, ChevronLeft, Shield, Sparkles, Save, Key, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { MoringaCard } from "@/components/ui/moringa-card"
import * as motion from "framer-motion/client"

const profileSchema = z.object({
  full_name: z.string().min(2, "Identifier must be at least 2 characters"),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  current_password: z.string().min(6, "Current security key is required"),
  new_password: z.string().min(8, "New logic must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Logic protocols do not match",
  path: ["confirm_password"],
})

type ProfileData = z.infer<typeof profileSchema>
type PasswordData = z.infer<typeof passwordSchema>

export default function ProfileSettingsPage() {
  const { data: session, update } = useSession()
  const [pwLoading, setPwLoading] = useState(false)

  const {
    register: regProfile,
    handleSubmit: handleProfile,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { full_name: session?.user?.name || "" },
  })

  const {
    register: regPw,
    handleSubmit: handlePw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) })

  const onProfileSubmit = async (data: ProfileData) => {
    const supabase = createClient()
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: data.full_name, phone: data.phone, updated_at: new Date().toISOString() })
      .eq("id", session?.user?.id)

    if (error) {
      toast.error("Alchemical update failed")
    } else {
      await update({ user: { ...session?.user, name: data.full_name } })
      toast.success("Identity protocol updated")
    }
  }

  const onPasswordSubmit = async (data: PasswordData) => {
    setPwLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: data.new_password })
    setPwLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Security logic refreshed")
      resetPw()
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Botanical Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 py-12 max-w-2xl relative z-10">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 mb-12"
        >
          <Link href="/profile" className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="space-y-1">
              <h1 className="text-3xl font-black text-foreground tracking-tighter italic">Core Protocol.</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Manage your alchemical identity</p>
          </div>
        </motion.div>

        <div className="space-y-8">
            {/* Identity Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <MoringaCard className="p-8 md:p-12 border-white shadow-xl" glass={true}>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-lg font-black text-foreground italic tracking-tight">Identity Naming</h2>
                    </div>
                    
                    <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-8">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Full Nomenclature</Label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                                <Input className="h-14 pl-12 rounded-2xl border-border/40 bg-muted/60 focus:bg-card focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" {...regProfile("full_name")} />
                            </div>
                            {profileErrors.full_name && <p className="text-destructive text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{profileErrors.full_name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Nexus Identifier (Immutable)</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                                <Input className="h-14 pl-12 rounded-2xl border-border/40 bg-muted/70 text-muted-foreground font-medium cursor-not-allowed border-none shadow-none ring-0 focus-visible:ring-0" defaultValue={session?.user?.email || ""} disabled />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Communication Line</Label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                                <Input className="h-14 pl-12 rounded-2xl border-border/40 bg-muted/60 focus:bg-card focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none border-none" placeholder="+91 91665 9895" {...regProfile("phone")} />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-16 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/10 transition-all active:scale-95 group border-none" disabled={profileSubmitting}>
                            {profileSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <span className="flex items-center gap-3">
                                    Finalize Updates <Save className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>
                </MoringaCard>
            </motion.div>

            {/* Security Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <MoringaCard className="p-8 md:p-12 border-white shadow-xl" glass={true}>
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-lg font-black text-foreground italic tracking-tight">Logic Refresh</h2>
                    </div>

                    <form onSubmit={handlePw(onPasswordSubmit)} className="space-y-8">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Current Logic</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                                <Input type="password" className="h-14 pl-12 rounded-2xl border-border/40 bg-muted/60 focus:bg-card focus:ring-primary/20 transition-all font-medium border-none shadow-none ring-0 focus-visible:ring-0" {...regPw("current_password")} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">New Security Logic</Label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                                <Input type="password" className="h-14 pl-12 rounded-2xl border-border/40 bg-muted/60 focus:bg-card focus:ring-primary/20 transition-all font-medium border-none shadow-none ring-0 focus-visible:ring-0" placeholder="Minimum 8 characters" {...regPw("new_password")} />
                            </div>
                            {pwErrors.new_password && <p className="text-destructive text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{pwErrors.new_password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-4">Confirm New Protocol</Label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                                <Input type="password" className="h-14 pl-12 rounded-2xl border-border/40 bg-muted/60 focus:bg-card focus:ring-primary/20 transition-all font-medium border-none shadow-none ring-0 focus-visible:ring-0" {...regPw("confirm_password")} />
                            </div>
                            {pwErrors.confirm_password && <p className="text-destructive text-[10px] font-black uppercase tracking-widest mt-2 pl-4">{pwErrors.confirm_password.message}</p>}
                        </div>

                        <Button type="submit" variant="outline" className="w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 group border-border hover:bg-muted" disabled={pwLoading}>
                            {pwLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <span className="flex items-center gap-3">
                                    Rotate Logic <RefreshCcw className="h-5 w-5" />
                                </span>
                            )}
                        </Button>
                    </form>
                </MoringaCard>
            </motion.div>
        </div>
      </div>
    </div>
  )
}

function RefreshCcw(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
        </svg>
    )
}
