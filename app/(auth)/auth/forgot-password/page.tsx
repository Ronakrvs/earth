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
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react"

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
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
      <div className="text-center py-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
        <p className="text-sm text-gray-500 mb-6">
          We sent a password reset link to your email address. Check it and follow the instructions.
        </p>
        <Link href="/auth/login">
          <Button variant="outline" className="w-full">Back to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <Mail className="h-6 w-6 text-orange-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 text-center mb-1">Forgot your password?</h1>
      <p className="text-sm text-gray-500 text-center mb-6">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {serverError && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="you@example.com" className="mt-1" {...register("email")} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-green-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
