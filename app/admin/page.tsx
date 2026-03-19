import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Package, Users, ShoppingBag, TrendingUp,
  AlertTriangle, BarChart3, Settings, ChevronRight,
  Leaf, ArrowUpRight
} from "lucide-react"

export default async function AdminDashboard() {
  const session = await auth()
  console.log("session",session)
  if (!session?.user?.id) redirect("/")

  const supabase = await createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()
console.log("prod",profile)
  if (profile?.role !== "admin") redirect("/")

  const stats = [
    { label: "Total Orders", value: "—", change: "+0%", icon: Package, color: "bg-blue-500", link: "/admin/orders" },
    { label: "Revenue (Oct)", value: "₹—", change: "+0%", icon: TrendingUp, color: "bg-green-500", link: "/admin/orders" },
    { label: "Total Customers", value: "—", change: "+0%", icon: Users, color: "bg-purple-500", link: "/admin/users" },
    { label: "Products", value: "3", change: "", icon: ShoppingBag, color: "bg-amber-500", link: "/admin/products" },
  ]

  const quickLinks = [
    { label: "Manage Products", description: "Add, edit, delete products & variants", href: "/admin/products", icon: ShoppingBag },
    { label: "All Orders", description: "View and update order statuses", href: "/admin/orders", icon: Package },
    { label: "User Management", description: "View users, manage roles", href: "/admin/users", icon: Users },
    { label: "Inventory", description: "Monitor and update stock levels", href: "/admin/inventory", icon: AlertTriangle },
    { label: "B2B Inquiries", description: "Review bulk order requests", href: "/admin/b2b", icon: ArrowUpRight },
    { label: "Analytics", description: "Sales reports and insights", href: "/admin/analytics", icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Leaf className="h-4 w-4 text-green-700" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Shigruvedas Management Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">← View Store</Link>
            <Link href="/admin/settings">
              <Settings className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, {session.user.name?.split(" ")[0]} 👋</h2>
          <p className="text-gray-500 text-sm mt-1">Here&apos;s what&apos;s happening with Shigruvedas today.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, change, icon: Icon, color, link }) => (
            <Link key={label} href={link}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all group">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${color} bg-opacity-10 rounded-xl p-2`}>
                    <Icon className={`h-5 w-5 ${color.replace("bg-", "text-")}`} />
                  </div>
                  {change && (
                    <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">{change}</Badge>
                  )}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Action Cards */}
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {quickLinks.map(({ label, description, href, icon: Icon }) => (
            <Link key={label} href={href}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-green-300 hover:shadow-md transition-all group flex items-center gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition-colors">
                  <Icon className="h-5 w-5 text-green-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{label}</p>
                  <p className="text-xs text-gray-500 truncate">{description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-500 flex-shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Getting started note */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="font-bold text-green-900 mb-2">🚀 Getting Started</h3>
          <p className="text-sm text-green-800 mb-3">
            Connect your Supabase database to enable live order tracking, inventory management, and real-time analytics.
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>1. Add your Supabase credentials to <code className="bg-green-100 px-1 rounded">.env.local</code></li>
            <li>2. Run the SQL schema from <code className="bg-green-100 px-1 rounded">supabase/schema.sql</code></li>
            <li>3. Add Google OAuth credentials</li>
            <li>4. Configure Razorpay test keys</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
