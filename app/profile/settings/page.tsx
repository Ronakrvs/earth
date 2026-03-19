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
import { Loader2, User, Lock, ChevronLeft } from "lucide-react"
import Link from "next/link"

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
})

const passwordSchema = z.object({
  current_password: z.string().min(6),
  new_password: z.string().min(8, "Must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords don't match",
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
      toast.error("Failed to update profile")
    } else {
      await update({ user: { ...session?.user, name: data.full_name } })
      toast.success("Profile updated!")
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
      toast.success("Password changed!")
      resetPw()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile" className="text-gray-400 hover:text-gray-600">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        </div>

        {/* Profile form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <User className="h-4 w-4 text-green-600" /> Personal Information
          </h2>
          <form onSubmit={handleProfile(onProfileSubmit)} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input className="mt-1" {...regProfile("full_name")} />
              {profileErrors.full_name && <p className="text-red-500 text-xs mt-1">{profileErrors.full_name.message}</p>}
            </div>
            <div>
              <Label>Email Address</Label>
              <Input className="mt-1" defaultValue={session?.user?.email || ""} disabled />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input className="mt-1" placeholder="+91 98765 43210" {...regProfile("phone")} />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={profileSubmitting}>
              {profileSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </form>
        </div>

        {/* Password form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <Lock className="h-4 w-4 text-green-600" /> Change Password
          </h2>
          <form onSubmit={handlePw(onPasswordSubmit)} className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input type="password" className="mt-1" {...regPw("current_password")} />
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" className="mt-1" placeholder="Min 8 characters" {...regPw("new_password")} />
              {pwErrors.new_password && <p className="text-red-500 text-xs mt-1">{pwErrors.new_password.message}</p>}
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input type="password" className="mt-1" {...regPw("confirm_password")} />
              {pwErrors.confirm_password && <p className="text-red-500 text-xs mt-1">{pwErrors.confirm_password.message}</p>}
            </div>
            <Button type="submit" variant="outline" disabled={pwLoading}>
              {pwLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
