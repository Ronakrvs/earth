import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    Package, MapPin, Settings, ChevronRight,
    ShoppingBag, Heart, Shield, ArrowUpRight, Zap, Sparkles
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoringaCard } from "@/components/ui/moringa-card"
import { createAdminClient } from "@/lib/supabase/server"
import * as motion from "framer-motion/client"
import SignOutButton from "@/components/profile/SignOutButton"

function getRank(orderCount: number): string {
  if (orderCount >= 10) return "Guardian"
  if (orderCount >= 5) return "Alchemist"
  if (orderCount >= 2) return "Cultivator"
  return "Novice"
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/auth/login?callbackUrl=/profile")

  const supabase = await createAdminClient()
  const userId = session.user.id

  const [settingsResult, orderCountResult, loyaltyResult, wishlistCountResult] = await Promise.all([
    supabase.from("settings").select("value").eq("key", "config").maybeSingle(),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("loyalty_balances").select("balance").eq("user_id", userId).maybeSingle(),
    supabase.from("wishlists").select("id", { count: "exact", head: true }).eq("user_id", userId),
  ])

  const config = settingsResult.data?.value || { loyalty_enabled: true }
  const orderCount = orderCountResult.count ?? 0
  const loyaltyBalance = (loyaltyResult.data?.balance as number) ?? 0
  const wishlistCount = wishlistCountResult.count ?? 0

  const quickStats = [
    { label: "Manifested", value: String(orderCount), icon: ShoppingBag, color: "text-primary bg-primary/5" },
    { label: "Favorites", value: String(wishlistCount), icon: Heart, color: "text-rose-600 bg-rose-50" },
    { label: "Rank", value: getRank(orderCount), icon: Zap, color: "text-amber-600 bg-amber-50" },
  ]

  const navItems = [
    { href: "/profile/orders", icon: Package, label: "Acquisition History", desc: "Review your botanical heritage", color: "text-primary bg-primary/5", badge: null },
    ...(config.loyalty_enabled !== false ? [{ href: "/profile/loyalty", icon: Sparkles, label: "Vitality Points", desc: "View your earned organic essence", color: "text-amber-600 bg-amber-50", badge: null }] : []),
    { href: "/profile/addresses", icon: MapPin, label: "Delivery Nexus", desc: "Manage your shipping coordinates", color: "text-emerald-600 bg-emerald-50", badge: null },
    { href: "/profile/settings", icon: Settings, label: "Core Protocol", desc: "Refine your alchemical identity", color: "text-muted-foreground bg-muted", badge: null },
  ]

  const initials = session.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Botanical Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      {/* Hero Section: The Guardian's Nexus */}
      <div className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto max-w-4xl px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center md:items-end gap-8"
          >
             <div className="relative group">
                <div className="absolute -inset-4 bg-primary/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-32 h-32 rounded-[2.5rem] object-cover border border-border/60 shadow-2xl relative z-10" />
                ) : (
                  <div className="w-32 h-32 bg-card rounded-[2.5rem] flex items-center justify-center text-3xl font-black text-primary border border-border shadow-2xl relative z-10 uppercase">
                    {initials}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center border-4 border-border/60 z-20 shadow-lg">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
             </div>

             <div className="text-center md:text-left space-y-2 flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tighter italic">Greetings, {session.user?.name?.split(" ")[0] || "Keeper"}.</h1>
                    <Badge className="w-fit mx-auto md:mx-0 bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                        {(session.user as any)?.role === "admin" ? "Grand Alchemist" : "Botanical Member"}
                    </Badge>
                </div>
                <p className="text-sm font-medium text-muted-foreground max-w-md">
                    Welcome to your personal sanctuary. Manage your botanical assets and refine your organic journey.
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Identifier: {session.user?.email}</p>
             </div>

             <div className="hidden md:block">
                <Link href="/shop">
                    <Button className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-black text-xs uppercase tracking-widest transition-all group flex items-center gap-3 border-none">
                        Explore Flora <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </Link>
             </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-6 space-y-8">
        {/* Quick Insights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
            >
                <MoringaCard className="p-8 text-center space-y-4 hover:shadow-2xl transition-all duration-500 border-border/60" glass={true}>
                    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-black text-foreground tracking-tighter italic">{value}</div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
                    </div>
                </MoringaCard>
            </motion.div>
          ))}
        </div>

        {/* Primary Navigation Protocol */}
        <MoringaCard className="overflow-hidden border-border/60 shadow-xl" glass={true}>
            <div className="p-6 border-b border-primary/5 bg-primary/5">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Operational Core</h2>
            </div>
            <div className="divide-y divide-primary/5">
              {navItems.map(({ href, icon: Icon, label, desc, color }: any, i: number) => (
                <Link key={href} href={href} className="group flex items-center gap-4 sm:gap-6 p-5 sm:p-8 hover:bg-card/50 transition-all">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 ${color} rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-500`}>
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex-1 space-y-0.5 sm:space-y-1 text-left min-w-0">
                      <div className="text-base sm:text-lg font-black text-foreground tracking-tight italic group-hover:text-primary transition-colors truncate">{label}</div>
                      <div className="text-xs font-medium text-muted-foreground hidden sm:block">{desc}</div>
                    </div>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-muted flex items-center justify-center opacity-30 sm:opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 flex-shrink-0">
                        <ChevronRight className="h-4 w-4 text-foreground" />
                    </div>
                </Link>
              ))}
            </div>
        </MoringaCard>

        {/* Alchemist Control (Admin) */}
        {(session.user as any)?.role === "admin" && (
           <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
           >
              <Link href="/admin">
                <div className="relative group overflow-hidden rounded-[2.5rem] p-6 sm:p-10 bg-card text-foreground shadow-2xl shadow-primary/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none transition-all group-hover:scale-150" />
                    <div className="relative z-10 flex items-center gap-5 sm:gap-8">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-card/50 backdrop-blur-3xl rounded-[2rem] flex items-center justify-center shrink-0 border border-border/40 group-hover:rotate-12 transition-transform duration-500">
                            <Shield className="h-7 w-7 sm:h-10 sm:w-10 text-primary" />
                        </div>
                        <div className="flex-1 text-left space-y-1 sm:space-y-2 min-w-0">
                            <div className="text-xl sm:text-3xl font-black tracking-tighter italic">Alchemical Chamber</div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">Supreme Administrative Nexus</div>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-md hidden sm:block">
                                Orchestrate the botanical cycle. Manage flora, acquisition streams, and the alchemical database.
                            </p>
                        </div>
                        <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center shadow-xl group-hover:translate-x-4 transition-all duration-500 flex-shrink-0">
                            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-primary-foreground" />
                        </div>
                    </div>
                </div>
              </Link>
           </motion.div>
        )}

        {/* Neutralize Session (Sign Out) */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center pt-8"
        >
            <SignOutButton />
        </motion.div>
      </div>
    </div>
  )
}
