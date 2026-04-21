import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import BundleForm from "@/components/admin/BundleForm"

export default async function EditBundlePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const session = await auth()
  
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (session?.user?.role !== "admin" && profile?.role !== "admin") redirect("/")

  const { data: bundle } = await supabase
    .from("bundles")
    .select(`
      *,
      bundle_items (
        id,
        product_id,
        quantity
      )
    `)
    .eq("id", id)
    .single()

  if (!bundle) notFound()

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <BundleForm initialData={bundle} />
      </div>
    </div>
  )
}
