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
    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user?.id || '')
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { variants, ...productData } = body

    // 1. Update product
    const { error: productError } = await supabase
      .from("products")
      .update(productData)
      .eq("id", id)

    if (productError) throw productError

    // 2. Update variants (Complex way: Delete old ones and insert new ones, OR match IDs)
    // For simplicity, we'll delete variants that aren't in the new list and update/insert others.
    
    // Delete variants not in the new list
    const incomingVariantIds = variants.map((v: any) => v.id).filter(Boolean)
    await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", id)
      .not("id", "in", `(${incomingVariantIds.join(",") || "00000000-0000-0000-0000-000000000000"})`)

    // Upsert remaining variants
    const variantData = variants.map((v: any) => ({
      ...v,
      product_id: id
    }))

    const { error: variantError } = await supabase
      .from("product_variants")
      .upsert(variantData)

    if (variantError) throw variantError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update product error:", error)
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
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user?.id || '')
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
