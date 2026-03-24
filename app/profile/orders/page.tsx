import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Package, Clock, ChevronRight, ChevronLeft, ShoppingBag, Leaf, History } from "lucide-react"
import Link from "next/link"
import { MoringaCard } from "@/components/ui/moringa-card"
import * as motion from "framer-motion/client"
import { Button } from "@/components/ui/button"

export default async function ProfileOrdersPage() {
  const session = await auth()
  if (!session) redirect("/auth/login?callbackUrl=/profile/orders")

  return (
    <div className="min-h-screen bg-[#FDFEFC] pb-24 relative overflow-hidden">
      {/* Botanical Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-900/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 py-12 max-w-4xl relative z-10">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6 mb-12"
        >
          <Link href="/profile" className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic flex items-center gap-3">
                Acquisition History.
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Your botanical heritage archive</p>
          </div>
        </motion.div>

        {/* Empty State / Legacy Archive */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <MoringaCard className="p-16 md:p-24 text-center space-y-8 border-white shadow-2xl" glass={true}>
              <div className="relative inline-block">
                  <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                  <div className="w-24 h-24 bg-white rounded-[2rem] border border-slate-100 shadow-xl flex items-center justify-center mx-auto relative z-10">
                    <History className="h-10 w-10 text-primary/30" />
                  </div>
              </div>
              
              <div className="space-y-3">
                  <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter">Archive Vacant.</h2>
                  <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto">
                    "Your journey of botanical acquisition is yet to be inscribed. Manifest your first selection to begin your legacy."
                  </p>
              </div>

              <div className="pt-4">
                  <Link href="/shop" className="inline-block">
                    <Button className="h-14 px-10 bg-primary text-white hover:bg-emerald-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all group flex items-center gap-4 border-none">
                        Initiate First Selection <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </Button>
                  </Link>
              </div>
            </MoringaCard>
        </motion.div>
      </div>
    </div>
  )
}
