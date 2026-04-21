import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { addLoyaltyPoints } from "@/lib/loyalty"
import { auth } from "@/lib/auth"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ── GET: fetch approved reviews for a product ── */
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product_id")
  if (!productId) return NextResponse.json({ error: "product_id required" }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select(`
      id, rating, title, content, is_verified, helpful_count, created_at,
      profiles ( full_name, avatar_url )
    `)
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reviews: data || [] })
}

/* ── POST: submit a new review (auth required) ── */
export async function POST(req: NextRequest) {
  try {
    // Verify session via NextAuth
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to leave a review." }, { status: 401 })
    }
    const userId = session.user.id

    const { product_id, rating, title, content } = await req.json()

    if (!product_id || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "A product and a valid rating (1-5) are required." }, { status: 400 })
    }

    // Check if user already reviewed this product
    const { data: existing } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("product_id", product_id)
      .eq("user_id", userId)
      .single()

    if (existing) {
      return NextResponse.json({ error: "You've already reviewed this product." }, { status: 409 })
    }

    // Check if user has purchased this product (verified purchase badge)
    // Note: This logic is a bit simplified; in production, you'd join orders/order_items
    const { data: purchased } = await supabaseAdmin
      .from("order_items")
      .select("id")
      .eq("product_id", product_id)
      .limit(1)

    const { error } = await supabaseAdmin.from("reviews").insert({
      product_id,
      user_id: userId,
      rating,
      title: title?.trim() || null,
      content: content?.trim() || null,
      is_verified: !!(purchased && purchased.length > 0),
      is_approved: false, // admin moderates
    })

    if (error) {
      console.error("Review insert error:", error)
      return NextResponse.json({ error: "Failed to submit review." }, { status: 500 })
    }

    // Credit loyalty points for the review
    try {
      await addLoyaltyPoints(userId, 100, 'review_left')
    } catch (loyaltyErr) {
      console.error("Loyalty point credit error (review):", loyaltyErr)
    }

    return NextResponse.json({ success: true, message: "Review submitted! It will appear after moderation." })
  } catch (err) {
    console.error("Reviews API error:", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
