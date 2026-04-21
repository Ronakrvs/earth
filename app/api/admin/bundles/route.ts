import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isAdminSession } from "@/lib/admin-auth"

export async function POST(req: Request) {
  try {
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

    // 1. Insert bundle
    const { data: bundle, error: bundleError } = await supabase
      .from("bundles")
      .insert([bundleData])
      .select()
      .single()

    if (bundleError) throw bundleError

    // 2. Insert items
    if (items && items.length > 0) {
      const itemData = items.map((item: any) => ({
        ...item,
        bundle_id: bundle.id
      }))

      const { error: itemError } = await supabase
        .from("bundle_items")
        .insert(itemData)

      if (itemError) throw itemError
    }

    return NextResponse.json(bundle)
  } catch (error: any) {
    console.error("Create bundle error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
