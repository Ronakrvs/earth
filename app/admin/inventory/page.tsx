import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import InventoryList from "./InventoryList"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminInventoryPage() {
  const session = await auth()
  const supabase = await createAdminClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (profile?.role !== "admin") redirect("/")

  const { data: inventory } = await supabase
    .from("product_variants")
    .select(`
      *,
      products:product_id (name, slug)
    `)
    .order("stock", { ascending: true })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-amber-700" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
          <p className="text-slate-500 font-medium text-sm">Monitor and update stock levels for all products.</p>
        </div>
      </div>

      <InventoryList initialInventory={inventory || []} />
    </div>
  )
}
