import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, visit_date, group_size, visit_type, message } = await req.json()

    if (!name || !email || !phone || !visit_date) {
      return NextResponse.json({ error: "Name, email, phone and visit date are required." }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from("farm_visits").insert({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      visit_date,
      group_size: group_size || "1",
      visit_type: visit_type || "general",
      message: message?.trim() || null,
      status: "pending",
    })

    if (error) {
      console.error("Farm visit insert error:", error)
      return NextResponse.json({ error: "Failed to save booking. Please try again." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Farm visit API error:", err)
    return NextResponse.json({ error: "Server error." }, { status: 500 })
  }
}
