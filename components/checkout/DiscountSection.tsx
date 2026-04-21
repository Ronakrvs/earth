"use client"

import { useEffect, useState } from "react"
import { Sparkles, Ticket, Check, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoringaCard } from "@/components/ui/moringa-card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import * as motion from "framer-motion/client"
import { cn } from "@/lib/utils"

interface Coupon {
  id: string
  code: string
  type: 'percent' | 'fixed' | 'free_shipping'
  value: number
  min_order_value: number
}

interface DiscountData {
  loyaltyEnabled: boolean
  couponEnabled: boolean
  balance: number
  coupons: Coupon[]
}

interface DiscountSectionProps {
  subtotal: number
  onDiscountChange: (discount: { pointsUsed: number, pointsValue: number, coupon: Coupon | null }) => void
}

export default function DiscountSection({ subtotal, onDiscountChange }: DiscountSectionProps) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<DiscountData | null>(null)
  
  const [usePoints, setUsePoints] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  useEffect(() => {
    fetch("/api/checkout/eligibility")
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  // Calculate Points Value (100 pts = ₹10)
  const maxPointsValue = data ? Math.floor(data.balance / 100) * 10 : 0
  const pointsToRedeem = data ? Math.floor(data.balance / 100) * 100 : 0

  useEffect(() => {
    onDiscountChange({
      pointsUsed: usePoints ? pointsToRedeem : 0,
      pointsValue: usePoints ? maxPointsValue : 0,
      coupon: selectedCoupon
    })
  }, [usePoints, selectedCoupon, pointsToRedeem, maxPointsValue, onDiscountChange])

  if (loading) return (
    <div className="p-8 border border-border/40 rounded-2xl flex items-center justify-center gap-2 text-muted-foreground italic text-xs">
      <Loader2 className="h-4 w-4 animate-spin" /> Fetching eligibility...
    </div>
  )

  if (!data?.loyaltyEnabled && !data?.couponEnabled) return null

  return (
    <div className="space-y-6">
      <h3 className="font-bold text-lg text-foreground flex items-center gap-2 italic tracking-tight">
        <Sparkles className="h-5 w-5 text-amber-500" /> Botanical Nexus Discounts
      </h3>

      <div className="grid gap-4">
        {/* Loyalty Points Section */}
        {data.loyaltyEnabled && data.balance >= 100 && (
          <MoringaCard className="p-6 border-amber-200/40 bg-amber-500/5" glass={true}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 italic tracking-tight">Redeem Vitality</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                    Manifest ₹{maxPointsValue} off using {pointsToRedeem} pts
                  </p>
                </div>
              </div>
              <Switch 
                checked={usePoints}
                onCheckedChange={setUsePoints}
              />
            </div>
          </MoringaCard>
        )}

        {/* Coupons Section */}
        {data.couponEnabled && data.coupons.length > 0 && (
          <div className="space-y-3">
             <div className="flex items-center gap-2 px-1">
                <Ticket className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Signatures</span>
             </div>
             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {data.coupons.map((coupon) => {
                   const isEligible = subtotal >= (coupon.min_order_value || 0)
                   const isSelected = selectedCoupon?.id === coupon.id

                   return (
                      <motion.div
                         key={coupon.id}
                         whileHover={isEligible ? { y: -2 } : {}}
                         whileTap={isEligible ? { scale: 0.98 } : {}}
                         onClick={() => isEligible && setSelectedCoupon(isSelected ? null : coupon)}
                         className={cn(
                            "flex-shrink-0 w-[200px] p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                            isSelected ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-border/60 bg-white/40",
                            !isEligible && "opacity-40 cursor-not-allowed grayscale"
                         )}
                      >
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black tracking-tight bg-slate-900 text-white px-3 py-1 rounded-lg italic">
                               {coupon.code}
                            </span>
                            {isSelected && <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>}
                         </div>
                         <p className="text-sm font-bold text-slate-900 italic">
                            {coupon.type === 'percent' ? `${coupon.value}% Off` : `₹${coupon.value} Off`}
                         </p>
                         <p className="text-[9px] font-medium text-slate-400 mt-1">
                            {isEligible ? `Min order ₹${coupon.min_order_value || 0}` : `Needs ₹${(coupon.min_order_value || 0) - subtotal} more`}
                         </p>
                      </motion.div>
                   )
                })}
             </div>
          </div>
        )}
      </div>
    </div>
  )
}
