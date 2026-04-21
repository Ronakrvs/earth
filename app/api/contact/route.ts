import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      name,
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      message, 
      subject,
      orderType,
      freshLeavesQty,
      powderQty 
    } = body

    // Support both single "name" and split first/last names
    let finalFirstName = firstName || ""
    let finalLastName = lastName || ""

    if (name && !finalFirstName) {
      const parts = name.trim().split(/\s+/)
      finalFirstName = parts[0]
      finalLastName = parts.slice(1).join(" ") || "Botanist" // Default last name if only one name provided
    }

    const productsInterested = []
    if (freshLeavesQty) productsInterested.push({ name: "Fresh Moringa Leaves", qty: freshLeavesQty })
    if (powderQty) productsInterested.push({ name: "Moringa Powder", qty: powderQty })

    const supabase = await createAdminClient()
    const { error } = await supabase.from("contact_messages").insert([{
      first_name: finalFirstName || "Visitor",
      last_name: finalLastName || "Botanist",
      email: email,
      phone: phone,
      address: address,
      message: message,
      order_type: subject || orderType || "general",
      products_interested: productsInterested
    }])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Failed to submit contact form" }, { status: 500 })
  }
}
