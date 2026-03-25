"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Star,
  BookOpen,
  UtensilsCrossed,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  X,
  Menu,
  Leaf
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: ShoppingBag },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Inventory", href: "/admin/inventory", icon: AlertTriangle },
  { label: "B2B Inquiries", href: "/admin/b2b", icon: ArrowUpRight },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Blog Posts", href: "/admin/blog", icon: BookOpen },
  { label: "Recipe Hub", href: "/admin/recipes", icon: UtensilsCrossed },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const user = session?.user
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AD"

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/80 backdrop-blur-md border-slate-200 shadow-sm rounded-xl overflow-hidden"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-100 transition-transform duration-300 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Header */}
          <div className="p-8 pb-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                <Image src="/images/logo.png" alt="Logo" width={28} height={28} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg text-slate-900 tracking-tighter leading-none">SHIGRUVEDAS</span>
                <span className="text-[10px] text-green-600 font-bold tracking-[0.2em] uppercase mt-1">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-8 space-y-1 overflow-y-auto scrollbar-hide">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Management</p>
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin')
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group",
                    isActive
                      ? "bg-green-50 text-green-700 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      isActive ? "bg-white text-green-700" : "bg-transparent text-slate-400 group-hover:text-slate-600"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {item.label}
                  </div>
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />}
                </Link>
              )
            })}
          </nav>

          {/* User Profile & Footer */}
          <div className="p-6 border-t border-slate-50">
             <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={user?.image || undefined} />
                    <AvatarFallback className="bg-green-100 text-green-700 text-xs font-black">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate tracking-tight">{user?.name || "Admin User"}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">System Admin</p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold h-11 text-xs px-3"
                >
                  <LogOut className="h-4 w-4 mr-3" /> Sign Out
                </Button>
             </div>
             
             <div className="mt-6 flex items-center justify-between px-2">
                <p className="text-[10px] text-slate-300 font-medium tracking-tight">v2.4.0 • Build ID: SV-25</p>
                <Link href="/" className="text-[10px] text-slate-400 hover:text-green-600 font-bold transition-colors">Store front →</Link>
             </div>
          </div>
        </div>
      </aside>
    </>
  )
}
