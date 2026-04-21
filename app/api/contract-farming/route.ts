import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    const { error } = await supabaseAdmin
      .from("contract_farming_submissions")
      .insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          location: data.location,
          land_size: data.land_size,
          message: data.message,
        }
      ])

    if (error) {
      console.error("Contract farming error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error("Contract farming API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Simple check for admin role via cookies/session could be added here
  // For now, we'll assume the admin page fetches this via a separate privileged route or useAdminClient
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
