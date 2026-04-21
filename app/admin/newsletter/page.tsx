import { createAdminClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Mail, Calendar, Search, Download } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewsletterAdminPage() {
  const supabase = await createAdminClient()
  
  const { data: subscribers, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false })

  const subs = subscribers || []
  const activeCount = subs.filter(s => s.status === 'active').length
  const recentCount = subs.filter(s => new Date(s.subscribed_at).getTime() > Date.now() - 7 * 86400000).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Newsletter Subscribers</h1>
        <p className="text-slate-500 font-medium">Manage your email list and export contacts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Subscribers</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{subs.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <Mail className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Active</p>
              <h3 className="text-3xl font-black text-emerald-600 leading-none">{activeCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Last 7 Days</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">+{recentCount}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white border text-sm border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">Subscriber List</h2>
        </div>
        
        {subs.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No subscribers found. Wait until someone signs up!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-500">Email Address</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Source</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-500">Subscribed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {sub.email}
                      {sub.first_name && <span className="block text-xs font-medium text-slate-400">{sub.first_name}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="font-bold border-slate-200 text-slate-500 bg-white">
                        {sub.source || "footer"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === "active" ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-none font-black hover:bg-emerald-100">Active</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-500 border-none font-bold hover:bg-slate-200">Unsubscribed</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {new Date(sub.subscribed_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
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
