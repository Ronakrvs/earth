"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell, PieChart, Pie 
} from "recharts"
import { 
  Users, Package, IndianRupee, ShoppingBag, 
  AlertTriangle, MessageSquare, Star, ArrowUpRight, TrendingUp 
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/api/admin/analytics")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    )
  }

  const { summary, salesOverTime } = data

  const stats = [
    { title: "Total Revenue", value: `₹${summary.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Users", value: summary.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Delivered Orders", value: summary.deliveredOrders, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Pending Orders", value: summary.pendingOrders, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
  ]

  const alerts = [
    { title: "Low Stock Items", value: summary.lowStockCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
    { title: "New B2B Inquiries", value: summary.newB2BInquiries, icon: MessageSquare, color: "text-indigo-600", bg: "bg-indigo-100" },
    { title: "Pending Reviews", value: summary.pendingReviews, icon: Star, color: "text-yellow-600", bg: "bg-yellow-100" },
    { title: "Total Products", value: summary.totalProducts, icon: Package, color: "text-teal-600", bg: "bg-teal-100" },
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden relative group transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="border-none shadow-sm rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100/50 pb-6 px-8">
          <div>
            <CardTitle className="text-lg font-bold">Revenue Trends</CardTitle>
            <p className="text-sm text-gray-500">Sales performance over the last 7 days</p>
          </div>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
             <ArrowUpRight className="h-4 w-4" />
             LIVE DATA
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                  tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dx={-10}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Stats/Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {alerts.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden group transition-all hover:bg-white/50 border border-transparent hover:border-gray-100">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 leading-none mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
