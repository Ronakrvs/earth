import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { 
    ChevronLeft, Sparkles, TrendingUp, 
    Gift, History, ArrowRight, Zap, Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoringaCard } from "@/components/ui/moringa-card"
import { createAdminClient } from "@/lib/supabase/server"
import * as motion from "framer-motion/client"
import { format } from "date-fns"
import ReferralCodeCopy from "@/components/profile/ReferralCodeCopy"

export default async function LoyaltyPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/profile/loyalty")

  const supabase = await createAdminClient()
  
  // Fetch loyalty balance
  const { data: balanceData } = await supabase
    .from("loyalty_balances")
    .select("balance")
    .eq("user_id", session.user.id)
    .single()

  const balance = balanceData?.balance || 0

  // Fetch profile for referral code
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", session.user.id)
    .single()

  const referralCode = profile?.referral_code || "SHIGRU-JOIN"

  // Fetch points history
  const { data: history } = await supabase
    .from("loyalty_points")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl px-6 pt-12">
        <Link href="/profile" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Nexus</span>
        </Link>

        {/* Hero: Balance Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <MoringaCard className="bg-gradient-to-br from-amber-500 to-amber-600 p-12 text-white relative overflow-hidden border-none shadow-2xl shadow-amber-200" glass={false}>
             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                <Sparkles className="h-48 w-48" />
             </div>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <Star className="h-5 w-5 fill-white" />
                   </div>
                   <h1 className="text-sm font-black uppercase tracking-[0.3em]">Vitality Balance</h1>
                </div>
                <div className="flex items-baseline gap-4">
                   <span className="text-7xl font-black italic tracking-tighter">{balance}</span>
                   <span className="text-2xl font-bold opacity-80 uppercase tracking-widest italic">Essence Points</span>
                </div>
                <p className="text-amber-50/70 font-medium max-w-sm">
                   Your organic contribution has manifested into Vitality. Use these points for exclusive botanical rewards.
                </p>
             </div>
          </MoringaCard>
        </motion.div>

        {/* Referral Referral Nexus */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="mb-12"
        >
           <ReferralCodeCopy code={referralCode} />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Section: Points History */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <History className="h-5 w-5 text-primary" />
                 <h2 className="text-lg font-black tracking-tight italic">Manifestation History</h2>
              </div>
              <MoringaCard className="divide-y divide-border/40 border-border/60" glass={true}>
                 {history && history.length > 0 ? (
                    history.map((item) => (
                       <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-card/50 transition-all">
                          <div>
                             <div className="font-bold text-foreground text-sm">{item.reason.replace('_', ' ').toUpperCase()}</div>
                             <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
                                {format(new Date(item.created_at), 'MMMM d, yyyy')}
                             </div>
                          </div>
                          <div className={`text-lg font-black italic ${item.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                             {item.points > 0 ? '+' : ''}{item.points}
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="p-12 text-center space-y-4">
                       <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-40">
                          <TrendingUp className="h-6 w-6" />
                       </div>
                       <p className="text-sm text-muted-foreground font-medium italic">No Vitality manifests yet.</p>
                    </div>
                 )}
              </MoringaCard>
           </div>

           {/* Section: How to Earn */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <Gift className="h-5 w-5 text-amber-500" />
                 <h2 className="text-lg font-black tracking-tight italic">Ways to Manifest</h2>
              </div>
              <div className="space-y-4">
                 {[
                    { label: "Botanical Purchase", points: "1 Point per ₹10", icon: Zap, color: "bg-blue-50 text-blue-600" },
                    { label: "Community Referral", points: "+500 Points", icon: ArrowRight, color: "bg-purple-50 text-purple-600" },
                    { label: "Experience Review", points: "+100 Points", icon: Star, color: "bg-amber-50 text-amber-600" },
                    { label: "Newsletter Initiation", points: "+50 Points", icon: Gift, color: "bg-emerald-50 text-emerald-600" },
                 ].map((way) => (
                    <MoringaCard key={way.label} className="p-6 border-border/40 hover:border-primary/20 transition-all cursor-pointer group" glass={true}>
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${way.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                             <way.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                             <div className="font-bold text-foreground">{way.label}</div>
                             <div className="text-[10px] font-black uppercase tracking-widest text-primary/70">{way.points}</div>
                          </div>
                       </div>
                    </MoringaCard>
                 ))}
              </div>
           </div>
        </div>

        {/* Redemption Call to Action */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="mt-16"
        >
           <MoringaCard className="p-12 text-center border-border/60 shadow-xl overflow-hidden relative" glass={true}>
              <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
              <div className="relative z-10 max-w-lg mx-auto space-y-8">
                 <h2 className="text-3xl font-black italic tracking-tighter">Ready to Redeem?</h2>
                 <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    Vitality points can be converted into alchemical discounts at the checkout stage. Every 100 points = ₹10 off.
                 </p>
                 <Link href="/shop">
                    <Button className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                       Visit Shop Nexus
                    </Button>
                 </Link>
              </div>
           </MoringaCard>
        </motion.div>
      </div>
    </div>
  )
}
