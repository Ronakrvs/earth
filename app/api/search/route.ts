import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()
  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, short_description, thumbnail, category, is_featured,
      product_variants (id, weight, price, compare_price, stock)
    `)
    .eq("is_active", true)
    .or(`name.ilike.%${q}%,short_description.ilike.%${q}%,category.ilike.%${q}%,tags.cs.{${q}}`)
    .order("is_featured", { ascending: false })
    .limit(20)

  if (error) {
    console.error("[search] query error:", error.message)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }

  const products = (data || []).map((p) => ({
    ...p,
    product_variants: (p.product_variants || []).filter((v: any) => v.stock > 0),
  })).filter((p) => p.product_variants.length > 0 || true)

  return NextResponse.json({ products })
}
