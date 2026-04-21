import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import InquiriesList from "./InquiriesList"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminB2BPage() {
  const session = await auth()
  const supabase = await createAdminClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (session?.user?.role !== "admin" && profile?.role !== "admin") redirect("/")

  const { data: inquiries } = await supabase
    .from("b2b_inquiries")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
          <ArrowUpRight className="h-6 w-6 text-indigo-700" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">B2B Inquiries</h1>
          <p className="text-slate-500 font-medium text-sm">Manage bulk business requests and leads.</p>
        </div>
      </div>

      <InquiriesList initialInquiries={inquiries || []} />
    </div>
  )
}
