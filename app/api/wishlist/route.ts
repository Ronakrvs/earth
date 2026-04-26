import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ productIds: [] })

  const supabase = await createAdminClient()
  const { data } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", session.user.id)

  return NextResponse.json({ productIds: (data || []).map((r) => r.product_id) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 })

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: session.user.id, product_id: productId })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, added: false })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, added: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { productId } = await req.json()
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 })

  const supabase = await createAdminClient()
  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("user_id", session.user.id)
    .eq("product_id", productId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
