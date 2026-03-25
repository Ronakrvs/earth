import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { 
  Package, Users, ShoppingBag, TrendingUp, 
  ArrowUpRight, Clock, ChevronRight, 
  Activity, Zap, Target, MousePointer2 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const supabase = await createAdminClient()

  // Fetch some real stats
  const { count: totalOrders } = await supabase.from('orders').select('*', { count: 'exact', head: true })
  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { data: recentInquiries } = await supabase
    .from('b2b_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { 
      label: "Total Orders", 
      value: totalOrders?.toString() || "0", 
      change: "+12%", 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-blue-50/50",
      trend: "up"
    },
    { 
      label: "Total Customers", 
      value: totalUsers?.toString() || "0", 
      change: "+5%", 
      icon: Users, 
      color: "text-purple-600", 
      bg: "bg-purple-50/50",
      trend: "up"
    },
    { 
      label: "Revenue (Oct)", 
      value: "₹74,250", 
      change: "+18%", 
      icon: TrendingUp, 
      color: "text-green-600", 
      bg: "bg-green-50/50",
      trend: "up"
    },
    { 
      label: "Active Products", 
      value: totalProducts?.toString() || "0", 
      change: "Stable", 
      icon: ShoppingBag, 
      color: "text-amber-600", 
      bg: "bg-amber-50/50",
      trend: "neutral"
    },
  ]

  return (
    <div className="space-y-10 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, <span className="text-green-600 font-bold">{session.user.name?.split(" ")[0]}</span>. Here&apos;s your daily summary.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">3 Admins Online</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge variant="secondary" className="bg-slate-50 text-slate-500 border-none font-bold text-[10px] tracking-wider uppercase">
                  {stat.change}
                </Badge>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] overflow-hidden">
          <CardHeader className="p-8 pb-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-indigo-600" />
                </div>
                Recent B2B Inquiries
              </CardTitle>
              <Link href="/admin/b2b">
                <Button variant="ghost" className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-4">
              {recentInquiries?.map((inquiry) => (
                <Link key={inquiry.id} href={`/admin/b2b`}>
                  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                          {inquiry.company_name[0].toUpperCase()}
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-900">{inquiry.company_name}</p>
                          <p className="text-xs text-slate-400 font-medium">{inquiry.contact_name} • {new Date(inquiry.created_at).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </Link>
              ))}
              {!recentInquiries?.length && (
                <div className="text-center py-12 text-slate-400 font-medium">No recent inquiries</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Insights */}
        <div className="space-y-6">
           <Card className="border-none shadow-sm rounded-[32px] bg-indigo-600 text-white overflow-hidden relative group">
              <div className="absolute -top-12 -right-12 h-40 w-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <CardContent className="p-8 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-black mb-2">Inventory Alert</h3>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
                  4 products are running low on stock. Check the inventory management to restock soon.
                </p>
                <Link href="/admin/inventory">
                   <Button variant="secondary" className="w-full bg-white text-indigo-600 font-black rounded-2xl shadow-xl hover:bg-indigo-50 transition-all">
                      Check Inventory
                   </Button>
                </Link>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm rounded-[32px] bg-green-900 text-white overflow-hidden relative group">
              <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-green-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <CardContent className="p-8 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-black mb-2">Monthly Goal</h3>
                <p className="text-green-100/70 text-sm font-medium mb-6">You reached 75% of your sales target this month.</p>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                   <div className="h-full bg-green-400 rounded-full" style={{ width: '75%' }} />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-green-400">
                   <span>Current: ₹74k</span>
                   <span>Goal: ₹100k</span>
                </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
