import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const body = await req.json()
    const { status } = body

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update order error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
