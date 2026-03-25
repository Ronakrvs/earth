import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import AnalyticsDashboard from "./AnalyticsDashboard"
import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminAnalyticsPage() {
  const session = await auth()
  const supabase = await createAdminClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (profile?.role !== "admin") redirect("/")

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-purple-700" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics & Insights</h1>
          <p className="text-slate-500 font-medium text-sm">Real-time performance metrics and trends.</p>
        </div>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}
