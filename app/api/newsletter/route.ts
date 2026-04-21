import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { auth } from "@/lib/auth"
import { addLoyaltyPoints } from "@/lib/loyalty"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, source = "website", first_name } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .upsert(
        { email: email.toLowerCase().trim(), source, first_name, status: "active" },
        { onConflict: "email" }
      )

    if (error) {
      console.error("Newsletter subscribe error:", error)
      return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
    }

    // Attempt to credit loyalty points if user is logged in
    try {
      const session = await auth()
      if (session?.user?.id) {
        await addLoyaltyPoints(session.user.id, 50, 'newsletter')
      }
    } catch (loyaltyErr) {
      // Don't fail the whole request if loyalty points fail
      console.error("Loyalty point credit error (newsletter):", loyaltyErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Newsletter API error:", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
