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
import { useState, useEffect } from "react"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Recipes", href: "/recipes" },
  { name: "B2B", href: "/b2b" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const totalItems = useCart((s) => s.totalItems)
  const openCart = useCart((s) => s.openCart)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const user = session?.user
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="Shigruvedas"
                width={40}
                height={40}
                className="drop-shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-bold text-lg text-green-800 leading-none">SHIGRUVEDAS</span>
                <span className="text-[10px] text-green-600 hidden sm:block tracking-wider">EARTH TO WELLNESS</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href || pathname.startsWith(item.href + "/") && item.href !== "/"
                      ? "text-green-700 bg-green-50"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {isMounted && totalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {totalItems()}
                  </span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-green-200 transition-all">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                        <AvatarFallback className="bg-green-100 text-green-700 text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" /> My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer text-green-700">
                            <Shield className="mr-2 h-4 w-4" /> Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer focus:text-red-600"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm" className="text-gray-700 hover:text-green-700">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile burger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-2">
                        <Image src="/images/logo.png" alt="Shigruvedas" width={32} height={32} />
                        <span className="font-bold text-green-800">SHIGRUVEDAS</span>
                      </div>
                      <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {/* User info if logged in */}
                    {user && (
                      <div className="flex items-center gap-3 p-4 bg-green-50 border-b">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image || undefined} />
                          <AvatarFallback className="bg-green-200 text-green-800 font-bold">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                    )}

                    {/* Nav links */}
                    <nav className="flex-1 p-4 space-y-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center py-2.5 px-3 rounded-lg text-sm font-medium transition-colors",
                            pathname === item.href
                              ? "bg-green-100 text-green-700"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}

                      {user && (
                        <>
                          <div className="pt-2 pb-1">
                            <p className="text-xs text-gray-400 font-medium px-3 uppercase tracking-wider">Account</p>
                          </div>
                          <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                            <User className="h-4 w-4 mr-3 text-gray-400" /> My Profile
                          </Link>
                          <Link href="/profile/orders" onClick={() => setMobileOpen(false)} className="flex items-center py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
                            <Package className="h-4 w-4 mr-3 text-gray-400" /> My Orders
                          </Link>
                          {user.role === "admin" && (
                            <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center py-2.5 px-3 rounded-lg text-sm font-medium text-green-700 hover:bg-green-50">
                              <Shield className="h-4 w-4 mr-3" /> Admin Panel
                            </Link>
                          )}
                        </>
                      )}
                    </nav>

                    {/* Bottom actions */}
                    <div className="p-4 space-y-2 border-t">
                      {user ? (
                        <Button
                          variant="outline"
                          className="w-full text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false) }}
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Sign Out
                        </Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                            <Button variant="outline" className="w-full">Sign In</Button>
                          </Link>
                          <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                            <Button className="w-full bg-green-600 hover:bg-green-700">Sign Up</Button>
                          </Link>
                        </div>
                      )}
                      <WhatsAppButton className="w-full" size="sm" />
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
