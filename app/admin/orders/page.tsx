import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import OrdersList from "./OrdersList"
import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminOrdersPage() {
  const session = await auth()
  const supabase = await createAdminClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (session?.user?.role !== "admin" && profile?.role !== "admin") redirect("/")

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles:user_id (full_name, email),
      user_email,
      order_items (*)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
          <ShoppingBag className="h-6 w-6 text-green-700" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 font-medium text-sm">View and track all customer orders.</p>
        </div>
      </div>

      <OrdersList initialOrders={orders || []} />
    </div>
  )
}
