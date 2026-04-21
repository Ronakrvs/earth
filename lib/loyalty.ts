import { createAdminClientStatic } from "./supabase/server"

export type LoyaltyReason = 'order_placed' | 'referral' | 'review_left' | 'newsletter' | 'redeemed'

/**
 * Core utility to credit loyalty points to a user.
 */
export async function addLoyaltyPoints(
  userId: string, 
  points: number, 
  reason: LoyaltyReason,
  orderId?: string
) {
  if (points === 0) return { success: true }
  
  const supabase = createAdminClientStatic()
  
  // 1. For newsletter, check if they already received points (one-time reward)
  if (reason === 'newsletter') {
    const { data: existing } = await supabase
      .from("loyalty_points")
      .select("id")
      .eq("user_id", userId)
      .eq("reason", "newsletter")
      .single()
    
    if (existing) return { success: false, error: "Already credited for newsletter" }
  }

  // 2. Perform the insertion
  const { error } = await supabase.from("loyalty_points").insert({
    user_id: userId,
    points,
    reason,
    order_id: orderId || null
  })

  if (error) {
    console.error(`Error adding loyalty points (${reason}):`, error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

/**
 * Calculates points based on a rupee amount (1 pt per ₹10).
 */
export function calculateRewards(amount: number): number {
  return Math.floor(amount / 10)
}
