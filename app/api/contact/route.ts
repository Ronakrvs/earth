import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      message, 
      orderType,
      freshLeavesQty,
      powderQty 
    } = body

    const productsInterested = []
    if (freshLeavesQty) productsInterested.push({ name: "Fresh Moringa Leaves", qty: freshLeavesQty })
    if (powderQty) productsInterested.push({ name: "Moringa Powder", qty: powderQty })

    const supabase = await createAdminClient()
    const { error } = await supabase.from("contact_messages").insert([{
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      message,
      order_type: orderType,
      products_interested: productsInterested
    }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
