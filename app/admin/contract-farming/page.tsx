import { createAdminClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Trees, Mail, Phone, MapPin, LandPlot, Calendar, Search, Filter, Trash2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export const dynamic = "force-dynamic"

export default async function AdminContractFarmingPage() {
  const supabase = await createAdminClient()
  
  const { data: submissions, error } = await supabase
    .from("contract_farming_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  const list = submissions || []
  const pendingCount = list.filter(s => s.status === 'pending').length

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-gradient">Contract Farming</h1>
          <p className="text-slate-500 font-medium">Manage and review potential agricultural partnerships.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Trees className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{list.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-amber-50/50 border-amber-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">Pending Review</p>
              <h3 className="text-3xl font-black text-amber-600 leading-none">{pendingCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-emerald-50/50 border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Growth Rate</p>
              <h3 className="text-3xl font-black text-emerald-600 leading-none">+12%</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-slate-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Grower Details</th>
                <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Location & Land</th>
                <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Submission Date</th>
                <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                <th className="text-right p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {list.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="font-bold text-slate-900">{sub.full_name}</div>
                    <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail className="h-3 w-3" /> {sub.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Phone className="h-3 w-3" /> {sub.phone}
                        </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                        <MapPin className="h-3 w-3 text-slate-400" /> {sub.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <LandPlot className="h-3 w-3" /> {sub.land_size}
                    </div>
                  </td>
                  <td className="p-6 text-slate-500 font-medium">
                    {format(new Date(sub.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="p-6">
                    <Badge className={`rounded-xl px-3 py-1 font-bold text-[10px] tracking-wide uppercase border-none ${
                        sub.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                        sub.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                        'bg-emerald-100 text-emerald-700'
                    }`}>
                        {sub.status}
                    </Badge>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5">
                            <Search className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                  <tr>
                      <td colSpan={5} className="p-20 text-center">
                          <Trees className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                          <p className="text-slate-400 font-medium italic">No partnership leads in the manifest.</p>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
