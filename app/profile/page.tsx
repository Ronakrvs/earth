import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Package, MapPin, Settings, LogOut, ChevronRight,
    ShoppingBag, Heart, Star, Shield
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const NAV_ITEMS = [
  { href: "/profile/orders", icon: Package, label: "My Orders", desc: "Track and view order history", color: "bg-blue-50 text-blue-600", badge: null },
  { href: "/profile/addresses", icon: MapPin, label: "Saved Addresses", desc: "Manage delivery addresses", color: "bg-purple-50 text-purple-600", badge: null },
  { href: "/profile/settings", icon: Settings, label: "Account Settings", desc: "Name, email, password", color: "bg-gray-50 text-gray-600", badge: null },
]

const QUICK_STATS = [
  { label: "Orders", value: "0", icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
  { label: "Wishlist", value: "0", icon: Heart, color: "text-pink-600 bg-pink-50" },
  { label: "Reviews", value: "0", icon: Star, color: "text-amber-600 bg-amber-50" },
]

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/auth/login?callbackUrl=/profile")

  const initials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile hero */}
      <div className="bg-gradient-to-br from-green-900 to-emerald-800 text-white pt-10 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            {session.user?.image ? (
              <img src={session.user.image} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20" />
            ) : (
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-bold border border-white/10">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold">{session.user?.name || "Welcome!"}</h1>
              <p className="text-green-200 text-sm">{session.user?.email}</p>
              <Badge className="bg-white/20 text-white border-white/20 text-xs mt-1">
                {(session.user as any)?.role === "admin" ? "Admin" : "Member"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 -mt-10 pb-10">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {QUICK_STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="text-data font-extrabold text-gray-900 text-xl">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Navigation cards */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          {NAV_ITEMS.map(({ href, icon: Icon, label, desc, color }, i) => (
            <Link key={href} href={href}>
              <div className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${i < NAV_ITEMS.length - 1 ? "border-b border-gray-50" : ""}`}>
                <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 text-sm">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Admin shortcut */}
        {(session.user as any)?.role === "admin" && (
          <Link href="/admin">
            <div className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-4 text-white flex items-center gap-4 mb-4 hover:from-green-800 hover:to-emerald-700 transition-all">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Admin Dashboard</div>
                <div className="text-xs text-green-100">Manage products, orders & users</div>
              </div>
              <ChevronRight className="h-4 w-4 text-white/60" />
            </div>
          </Link>
        )}

        {/* Sign out */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <form action="/api/auth/signout" method="POST">
            <button className="flex items-center gap-4 p-4 w-full hover:bg-red-50 transition-colors group">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-red-600 text-sm">Sign Out</div>
                <div className="text-xs text-gray-500">Log out of your account</div>
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
