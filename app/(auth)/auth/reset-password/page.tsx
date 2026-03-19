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
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock } from "lucide-react"

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords don't match",
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
      setTimeout(() => router.push("/auth/login"), 2000)
    }
  }

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Password updated!</h2>
        <p className="text-sm text-gray-500">Redirecting you to login...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Lock className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Set new password</h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Choose a strong password for your account
      </p>

      {serverError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <div className="relative mt-1">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 8 characters" {...register("password")} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirm_password">Confirm New Password</Label>
          <div className="relative mt-1">
            <Input id="confirm_password" type={showConfirm ? "text" : "password"} placeholder="Re-enter password" {...register("confirm_password")} />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Update Password
        </Button>
      </form>
    </div>
  )
}
