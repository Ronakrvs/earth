"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Menu, ShoppingCart, User, LogOut, Settings,
    Package, Shield, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import WhatsAppButton from "./whatsapp-button"
import { useCart } from "@/lib/store/cart"
import CartDrawer from "./cart/CartDrawer"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const ThemeToggle = dynamic(() => import("./ThemeToggle").then(mod => mod.ThemeToggle), { 
  ssr: false,
  loading: () => <div className="w-10 h-10 rounded-2xl bg-primary/5 animate-pulse" />
})

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Recipes", href: "/recipes" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
]

const secondaryLinks = [
  { name: "Track Order", href: "/track-order" },
  { name: "Wholesale / B2B", href: "/b2b" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const totalItems = useCart((s) => s.totalItems)
  const openCart = useCart((s) => s.openCart)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const user = session?.user
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group flex-shrink-0">
              <div className="relative overflow-hidden rounded-2xl p-1 bg-primary/5 group-hover:bg-primary/10 transition-colors">
                <Image
                  src="/images/logo.png"
                  alt="Shigruvedas"
                  width={42}
                  height={42}
                  className="drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-slate-900 tracking-tighter leading-none group-hover:text-primary transition-colors">SHIGRUVEDAS</span>
                <span className="text-[10px] text-primary font-bold hidden sm:block tracking-[0.2em] uppercase mt-1 opacity-70">Earth to Wellness</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-5 py-2 text-[15px] font-bold rounded-xl transition-all duration-300 relative group",
                    pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/")
                      ? "text-primary bg-primary/5"
                      : "text-slate-600 hover:text-primary"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute bottom-2 left-5 right-5 h-0.5 bg-primary rounded-full transition-all duration-300",
                    pathname === item.href || (pathname.startsWith(item.href + "/") && item.href !== "/")
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-3 text-slate-600 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all duration-300 group"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
                {mounted && totalItems() > 0 && (
                  <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-black rounded-lg min-w-[20px] h-[20px] flex items-center justify-center px-1 shadow-lg shadow-primary/30 animate-in fade-in zoom-in duration-300">
                    {totalItems()}
                  </span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                      <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left mr-2">
                        <div className="text-sm font-bold text-slate-900 leading-tight">{user.name?.split(' ')[0]}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Account</div>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    <DropdownMenuLabel className="font-normal px-4 py-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none text-slate-900">{user.name}</p>
                        <p className="text-xs leading-none text-slate-400 truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary px-4 py-3 cursor-pointer">
                      <Link href="/profile">
                        <User className="mr-3 h-4 w-4" /> <span className="font-semibold">My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary px-4 py-3 cursor-pointer">
                      <Link href="/profile/orders">
                        <Package className="mr-3 h-4 w-4" /> <span className="font-semibold">My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary px-4 py-3 cursor-pointer">
                      <Link href="/profile/settings">
                        <Settings className="mr-3 h-4 w-4" /> <span className="font-semibold">Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/5 focus:text-primary px-4 py-3 cursor-pointer text-primary">
                          <Link href="/admin">
                            <Shield className="mr-3 h-4 w-4" /> <span className="font-bold">Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-slate-50" />
                    <DropdownMenuItem
                      className="rounded-xl focus:bg-red-50 text-red-600 focus:text-red-600 px-4 py-3 cursor-pointer"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-3 h-4 w-4" /> <span className="font-bold">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-foreground/70 hover:text-primary font-bold h-11 px-6 rounded-xl hover:bg-primary/10 transition-all">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-primary hover:bg-primary-dark text-white font-bold h-11 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95">
                      Join Free
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile burger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-12 w-12 rounded-2xl hover:bg-primary/5 text-slate-900">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-sm p-0 rounded-l-[40px] border-none shadow-2xl">
                  <div className="flex flex-col h-full bg-white/80 backdrop-blur-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-8 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <Image src="/images/logo.png" alt="Shigruvedas" width={36} height={36} />
                        <span className="font-black text-xl text-slate-900 tracking-tighter">SHIGRUVEDAS</span>
                      </div>
                      <button onClick={() => setMobileOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-all">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* User info if logged in */}
                    {user && (
                      <div className="flex items-center gap-4 p-8 bg-primary/5">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback className="bg-primary/20 text-primary font-black">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-black text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                        </div>
                      </div>
                    )}

                    {/* Nav links */}
                    <nav className="flex-1 p-8 space-y-2 overflow-y-auto">
                      <div className="space-y-1">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center py-4 px-6 rounded-2xl text-[17px] font-bold transition-all duration-300",
                              pathname === item.href
                                ? "bg-primary text-white shadow-xl shadow-primary/20 translate-x-1"
                                : "text-slate-600 hover:bg-primary/5 hover:text-primary"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>

                      {user && (
                        <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                          <p className="text-[10px] text-slate-400 font-black px-6 uppercase tracking-[0.2em]">Profile & Settings</p>
                          <div className="space-y-1">
                            <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center py-4 px-6 rounded-2xl text-[16px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all">
                              <User className="h-5 w-5 mr-4 opacity-50" /> My Profile
                            </Link>
                            <Link href="/profile/orders" onClick={() => setMobileOpen(false)} className="flex items-center py-4 px-6 rounded-2xl text-[16px] font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all">
                              <Package className="h-5 w-5 mr-4 opacity-50" /> My Orders
                            </Link>
                            {user.role === "admin" && (
                              <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center py-4 px-6 rounded-2xl text-[16px] font-bold text-primary bg-primary/5 transition-all">
                                <Shield className="h-5 w-5 mr-4" /> Admin Panel
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-1">
                        <p className="text-[10px] text-slate-400 font-black px-6 uppercase tracking-[0.2em] mb-2">More</p>
                        {secondaryLinks.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center py-3 px-6 rounded-2xl text-[15px] font-bold text-slate-500 hover:bg-primary/5 hover:text-primary transition-all"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </nav>

                    {/* Bottom actions */}
                    <div className="p-8 space-y-4 border-t border-slate-100">
                      {user ? (
                        <Button
                          variant="ghost"
                          className="w-full h-16 rounded-2xl text-red-600 bg-red-50/50 hover:bg-red-50 font-black text-lg transition-all"
                          onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false) }}
                        >
                          <LogOut className="h-5 w-5 mr-3" /> Sign Out
                        </Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                            <Button variant="outline" className="w-full h-16 rounded-2xl border-border bg-background font-bold text-foreground/80 hover:bg-muted">Sign In</Button>
                          </Link>
                          <Link href="/auth/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                            <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary-dark font-bold text-white shadow-lg shadow-primary/20">Sign Up</Button>
                          </Link>
                        </div>
                      )}
                      <WhatsAppButton className="w-full h-16 rounded-2xl shadow-xl shadow-emerald-500/20" size="lg" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  )
}
