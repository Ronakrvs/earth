import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import BundleForm from "@/components/admin/BundleForm"

export default async function NewBundlePage() {
  const session = await auth()
  
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (session?.user?.role !== "admin" && profile?.role !== "admin") redirect("/")

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <BundleForm />
      </div>
    </div>
  )
}
