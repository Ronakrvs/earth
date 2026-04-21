import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const session = await auth()
    
    // Consistent and efficient authorization check
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (session.user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 })

    const supabase = await createAdminClient()
    
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        *,
        profiles:user_id (full_name, email),
        order_items (*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(orders)
  } catch (error: any) {
    console.error("Fetch orders error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
