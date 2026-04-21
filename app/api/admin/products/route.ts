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
    const { variants, ...productData } = body

    // 1. Insert product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert([productData])
      .select()
      .single()

    if (productError) throw productError

    // 2. Insert variants
    const variantData = variants.map((v: any) => ({
      ...v,
      product_id: product.id
    }))

    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variantData)

    if (variantError) throw variantError

    return NextResponse.json(product)
  } catch (error: any) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
