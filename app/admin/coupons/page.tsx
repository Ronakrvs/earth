import { createAdminClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Ticket, Calendar, Plus, Search, Tag, Users, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import DeleteCouponButton from "@/components/admin/DeleteCouponButton"

export const dynamic = "force-dynamic"

export default async function CouponsAdminPage() {
  const supabase = await createAdminClient()
  
  const { data: coupons, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: usageStats } = await supabase
    .from("coupon_usage")
    .select("coupon_id, id")

  const usageMap = (usageStats || []).reduce((acc: any, curr: any) => {
    acc[curr.coupon_id] = (acc[curr.coupon_id] || 0) + 1
    return acc
  }, {})

  const list = coupons || []
  const activeCount = list.filter(c => c.is_active).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-gradient">Promo & Coupons</h1>
          <p className="text-slate-500 font-medium">Create and manage discount codes for your store.</p>
        </div>
        <Link href="/admin/coupons/new">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold h-12 px-6 gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Create Coupon
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Coupons</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{list.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Tag className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Codes</p>
              <h3 className="text-3xl font-black text-emerald-600 leading-none">{activeCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Redeemed</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{usageStats?.length || 0}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border text-sm border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Active Promotions</h2>
        </div>
        
        {list.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No coupons found. Create your first promotion!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-500">Code</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Discount</th>
                  <th className="px-6 py-4 font-bold text-slate-500">usage</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Expiry</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="bg-slate-100 px-3 py-1 rounded-lg font-mono font-black text-slate-900 border border-slate-200 uppercase tracking-wider">
                           {c.code}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-slate-900">
                        {c.type === 'percent' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                      </span>
                      {c.min_order_value > 0 && (
                        <span className="block text-xs font-medium text-slate-400">Min. order ₹{c.min_order_value}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {usageMap[c.id] || 0} {c.max_uses ? `/ ${c.max_uses}` : "times"}
                    </td>
                    <td className="px-6 py-4">
                      {c.is_active ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black hover:bg-emerald-100">Active</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 border-none font-bold hover:bg-slate-200">Disabled</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500 whitespace-nowrap">
                      {c.end_date ? new Date(c.end_date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      }) : "No Expiry"}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/coupons/${c.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary">
                               <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteCouponButton id={c.id} />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
