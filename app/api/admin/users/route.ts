import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

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

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: users, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(users)
  } catch (error: any) {
    console.error("Fetch users error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
