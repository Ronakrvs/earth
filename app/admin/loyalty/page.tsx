import { createAdminClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Coins, TrendingUp, History, User, Plus, Filter, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function LoyaltyAdminPage() {
  const supabase = await createAdminClient()
  
  const { data: points, error } = await supabase
    .from("loyalty_points")
    .select(`
      *,
      profiles ( full_name, email )
    `)
    .order("created_at", { ascending: false })

  const { data: balances } = await supabase
    .from("loyalty_balances")
    .select(`
      *,
      profiles ( full_name, email )
    `)
    .order("balance", { ascending: false })

  const transactions = points || []
  const topHolders = balances || []
  const totalEarned = transactions.filter(t => t.points > 0).reduce((s, t) => s + t.points, 0)
  const totalRedeemed = Math.abs(transactions.filter(t => t.points < 0).reduce((s, t) => s + t.points, 0))

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-gradient">Loyalty Rewards</h1>
          <p className="text-slate-500 font-medium">Monitor customer points, reward distribution, and redemption history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Coins className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Points Earned</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{totalEarned}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-emerald-50/50 border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Points Redeemed</p>
              <h3 className="text-3xl font-black text-emerald-600 leading-none">{totalRedeemed}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white col-span-1 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                 <User className="h-5 w-5 text-primary" />
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Top Holder</p>
                 <h3 className="text-xl font-black text-slate-900 truncate">
                   {topHolders[0]?.profiles?.full_name || "N/A"}
                 </h3>
               </div>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-primary">{topHolders[0]?.balance || 0}</span>
              <span className="block text-xs font-bold text-primary/50 uppercase">Balance</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
        {/* Ledger */}
        <div className="bg-white border text-sm border-slate-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Transaction Ledger
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-500">Customer</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Reason</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Points</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {t.profiles?.full_name || "Hidden Profile"}
                    </td>
                    <td className="px-6 py-4 capitalize font-medium text-slate-500">
                      {t.reason.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4">
                      {t.points > 0 ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-black">
                          <ArrowUpRight className="h-3 w-3" /> +{t.points}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 font-black">
                          <ArrowDownRight className="h-3 w-3" /> {t.points}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium whitespace-nowrap">
                      {new Date(t.created_at).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOP BALANCES */}
        <div className="bg-white border text-sm border-slate-100 rounded-3xl shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900">Highest Balances</h2>
           </div>
           <div className="p-6 space-y-4">
              {topHolders.slice(0, 5).map((u, i) => (
                <div key={u.user_id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center font-black text-slate-400 text-xs border border-slate-100">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm leading-none">{u.profiles?.full_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Customer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary text-lg leading-none">{u.balance}</p>
                    <p className="text-[10px] text-primary/40 font-bold uppercase mt-1">Points</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
