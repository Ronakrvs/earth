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

    // Fetch all variants with their associated product names
    const { data: inventory, error } = await supabase
      .from("product_variants")
      .select(`
        *,
        products:product_id (name, slug)
      `)
      .order("stock", { ascending: true })

    if (error) throw error

    return NextResponse.json(inventory)
  } catch (error: any) {
    console.error("Fetch inventory error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
