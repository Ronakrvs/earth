import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* ── POST: Increment helpful count ── */
export async function POST(req: NextRequest) {
  try {
    const { reviewId } = await req.json()
    if (!reviewId) return NextResponse.json({ error: "Review ID required" }, { status: 400 })

    // Fetch current count to avoid using raw SQL syntax for increment
    const { data: review } = await supabaseAdmin
      .from("reviews")
      .select("helpful_count")
      .eq("id", reviewId)
      .single()

    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 })

    const { error } = await supabaseAdmin
      .from("reviews")
      .update({ helpful_count: (review.helpful_count || 0) + 1 })
      .eq("id", reviewId)

    if (error) {
      console.error("Helpful increment error:", error)
      return NextResponse.json({ error: "Failed to update count." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Helpful API error:", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
