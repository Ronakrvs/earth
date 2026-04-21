import { createAdminClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Calendar, Clock, Users, CheckCircle2, XCircle, Info, Phone, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import FarmVisitActions from "@/components/admin/FarmVisitActions"

export const dynamic = "force-dynamic"

export default async function FarmVisitsAdminPage() {
  const supabase = await createAdminClient()
  
  const { data: visits, error } = await supabase
    .from("farm_visits")
    .select("*")
    .order("visit_date", { ascending: false })

  const list = visits || []
  const pendingCount = list.filter(v => v.status === 'pending').length
  const confirmedCount = list.filter(v => v.status === 'confirmed').length
  const upcomingCount = list.filter(v => v.status === 'confirmed' && new Date(v.visit_date) >= new Date()).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-gradient">Farm Visit Bookings</h1>
          <p className="text-slate-500 font-medium">Manage visitor requests and coordination for the Moringa Farm.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending Tasks</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{pendingCount}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Confirmed</p>
              <h3 className="text-3xl font-black text-emerald-600 leading-none">{confirmedCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Upcoming Visits</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{upcomingCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border text-sm border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Manage Visitation</h2>
        </div>
        
        {list.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No booking requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-500">Visitor</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Scheduled Date</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Type / Size</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900">{v.name}</span>
                        <span className="text-xs text-slate-400 font-medium">{v.email}</span>
                        {v.message && (
                          <div className="mt-2 text-[11px] text-slate-500 flex items-start gap-1 p-2 bg-slate-50 rounded-lg">
                            <Info className="h-3 w-3 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 italic">"{v.message}"</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {new Date(v.visit_date).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric", weekday: "short"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="capitalize text-[10px] bg-white border-slate-200">
                          {v.visit_type}
                        </Badge>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <Users className="h-3 w-3" /> Group: {v.group_size}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {v.status === "confirmed" ? (
                        <div className="flex flex-col gap-1">
                           <Badge className="bg-emerald-50 text-emerald-600 border-none font-black hover:bg-emerald-100">Confirmed</Badge>
                           <a href={`tel:${v.phone}`} className="text-[10px] font-bold text-slate-400 hover:text-primary flex items-center gap-1">
                              <Phone className="h-2.5 w-2.5" /> {v.phone}
                           </a>
                        </div>
                      ) : v.status === "cancelled" ? (
                        <Badge className="bg-red-50 text-red-600 border-none font-black hover:bg-red-100">Cancelled</Badge>
                      ) : (
                        <div className="flex flex-col gap-1">
                           <Badge className="bg-amber-50 text-amber-600 border-none font-black animate-pulse">Pending Review</Badge>
                           <a href={`tel:${v.phone}`} className="text-[10px] font-bold text-slate-400 hover:text-primary flex items-center gap-1">
                              <Phone className="h-2.5 w-2.5" /> {v.phone}
                           </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <FarmVisitActions id={v.id} currentStatus={v.status} />
                       {v.status !== 'pending' && (
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                            <MoreHorizontal className="h-4 w-4" />
                         </Button>
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
