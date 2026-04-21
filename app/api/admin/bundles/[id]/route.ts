import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isAdminSession } from "@/lib/admin-auth"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user?.id || '')
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { items, ...bundleData } = body

    // 1. Update bundle
    const { data: bundle, error: bundleError } = await supabase
      .from("bundles")
      .update(bundleData)
      .eq("id", id)
      .select()
      .single()

    if (bundleError) throw bundleError

    // 2. Handle items (Replace all for simplicity)
    if (items) {
      await supabase.from("bundle_items").delete().eq("bundle_id", id)
      
      if (items.length > 0) {
        const itemData = items.map((item: any) => ({
          ...item,
          bundle_id: id
        }))

        const { error: itemError } = await supabase
          .from("bundle_items")
          .insert(itemData)

        if (itemError) throw itemError
      }
    }

    return NextResponse.json(bundle)
  } catch (error: any) {
    console.error("Update bundle error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user?.id || '')
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("bundles")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete bundle error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
