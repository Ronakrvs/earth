import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isAdminSession } from "@/lib/admin-auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        *,
        products (name),
        profiles (full_name, email)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(reviews)
  } catch (error: any) {
    console.error("Fetch reviews error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
