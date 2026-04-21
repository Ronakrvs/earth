import { createAdminClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { RefreshCw, Calendar, Package, TrendingUp, AlertCircle, CheckCircle2, PauseCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function SubscriptionsAdminPage() {
  const supabase = await createAdminClient()
  
  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select(`
      *,
      profiles ( full_name, email ),
      products ( name )
    `)
    .order("created_at", { ascending: false })

  const list = subscriptions || []
  const activeCount = list.filter(s => s.status === 'active').length
  const pausedCount = list.filter(s => s.status === 'paused').length
  
  const totalMRR = list.filter(s => s.status === 'active').reduce((acc, s) => {
    const monthlyPrice = (Number(s.price_locked) * Number(s.quantity)) * (30 / Number(s.frequency_days))
    return acc + monthlyPrice
  }, 0)

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-gradient">Recurring Subscriptions</h1>
          <p className="text-slate-500 font-medium">Manage active customer subscriptions and recurring revenue.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white col-span-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                 <TrendingUp className="h-5 w-5 text-primary" />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Estimated MRR</p>
                 <h3 className="text-3xl font-black text-slate-900 leading-none">₹{totalMRR.toFixed(2)}</h3>
               </div>
            </div>
            <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-4 py-2">+12% growth</Badge>
          </div>
        </Card>
        
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active Plans</p>
              <h3 className="text-3xl font-black text-emerald-600 leading-none">{activeCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <PauseCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Paused</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{pausedCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border text-sm border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Subscription Ledger</h2>
        </div>
        
        {list.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No subscriptions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-500">Customer</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Product</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Frequency</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Next Order</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">{s.profiles?.full_name || "Unknown"}</span>
                        <span className="text-xs text-slate-400 font-medium">{s.profiles?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-primary/40" />
                        <span className="font-bold text-slate-900 truncate max-w-[150px]">{s.products?.name}</span>
                        <span className="text-xs text-slate-400 font-medium">x{s.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant="outline" className="font-bold border-slate-200 text-slate-500 bg-white">
                        Every {s.frequency_days} Days
                       </Badge>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {new Date(s.next_billing_date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                       {s.status === "active" ? (
                         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black hover:bg-emerald-100">Active</Badge>
                       ) : s.status === "paused" ? (
                        <Badge className="bg-amber-100 text-amber-700 border-none font-black">Paused</Badge>
                       ) : (
                        <Badge className="bg-red-50 text-red-600 border-none font-black">Cancelled</Badge>
                       )}
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
