import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import ProductForm from "@/components/admin/ProductForm"

export default async function EditProductPage({ 
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

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_variants (*)
    `)
    .eq("id", id)
    .single()

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <ProductForm initialData={product} />
      </div>
    </div>
  )
}
