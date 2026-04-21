import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClientStatic } from "@/lib/supabase/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClientStatic()

    // 1. Fetch Global Settings
    const { data: settingsData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "config")
      .single()
    
    const config = (settingsData?.value as any) || {}
    const loyaltyEnabled = config.loyalty_enabled !== false
    const couponEnabled = config.coupon_enabled !== false

    // 2. Fetch Loyalty Balance (if enabled)
    let balance = 0
    if (loyaltyEnabled) {
      const { data: balanceData } = await supabase
        .from("loyalty_balances")
        .select("balance")
        .eq("user_id", session.user.id)
        .single()
      balance = balanceData?.balance || 0
    }

    // 3. Fetch Available Coupons (if enabled)
    let coupons = []
    if (couponEnabled) {
      // Fetch active coupons
      const { data: activeCoupons } = await supabase
        .from("coupons")
        .select("*")
        .eq("is_active", true)

      // Filter by date and usage
      if (activeCoupons) {
        const now = new Date()
        
        // Fetch usage for this user
        const { data: usageData } = await supabase
          .from("coupon_usage")
          .select("coupon_id")
          .eq("user_id", session.user.id)
        
        const usedCouponIds = (usageData || []).map(u => u.coupon_id)

        coupons = activeCoupons.filter(c => {
          // Check dates
          if (c.start_date && new Date(c.start_date) > now) return false
          if (c.end_date && new Date(c.end_date) < now) return false
          
          // Check if already used (if usage limit exists)
          // By default unique(coupon_id, user_id) in schema means 1 use per user
          if (usedCouponIds.includes(c.id)) return false
          
          return true
        })
      }
    }

    return NextResponse.json({
      loyaltyEnabled,
      couponEnabled,
      balance,
      coupons
    })
  } catch (error: any) {
    console.error("Eligibility check error:", error)
    return NextResponse.json({ error: "Failed to fetch checkout eligibility" }, { status: 500 })
  }
}
