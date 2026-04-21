import { createAdminClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { UserPlus, Gift, Share2, TrendingUp, CheckCircle2, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function ReferralsAdminPage() {
  const supabase = await createAdminClient()
  
  const { data: referrals, error } = await supabase
    .from("referrals")
    .select(`
      *,
      referrer:profiles!referrer_id(full_name, email),
      referee:profiles!referee_id(full_name, email)
    `)
    .order("created_at", { ascending: false })

  const list = referrals || []
  const rewardedCount = list.filter(r => r.status === 'rewarded').length
  const pendingCount = list.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-gradient">Referral Program</h1>
          <p className="text-slate-500 font-medium">Monitor and manage the customer referral program performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Share2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Invitations</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{list.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-emerald-50/50 border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Gift className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Rewards Given</p>
              <h3 className="text-3xl font-black text-emerald-600 leading-none">{rewardedCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending Rewards</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{pendingCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border text-sm border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Referral Activity</h2>
        </div>
        
        {list.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No referral activity found yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-500">Referrer (Advocate)</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Referee (Friend)</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Used Code</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">{r.referrer?.full_name || "Unknown"}</span>
                        <span className="text-xs text-slate-400 font-medium">{r.referrer?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {r.referee ? (
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900">{r.referee.full_name || "Friend"}</span>
                          <span className="text-xs text-slate-400 font-medium">{r.referee.email}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 font-medium">Invitation Sent</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <code className="bg-slate-100 px-2 py-0.5 rounded text-xs font-black text-slate-700 uppercase">
                          {r.referral_code}
                       </code>
                    </td>
                    <td className="px-6 py-4">
                      {r.status === "rewarded" ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black hover:bg-emerald-100 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Rewarded
                        </Badge>
                      ) : (
                         <Badge className="bg-amber-50 text-amber-600 border-none font-black animate-pulse gap-1">
                           <Clock className="h-3 w-3" /> Pending
                         </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {new Date(r.created_at).toLocaleDateString("en-IN")}
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
