import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClientStatic } from "@/lib/supabase/server"

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.toLowerCase().trim() : null
}

function isMissingColumnError(error: any, columnName: string) {
  const message = String(error?.message || error?.details || "").toLowerCase()
  const target = columnName.toLowerCase()
  return (
    error?.code === "42703" ||
    message.includes(`column "${target}" of relation "addresses" does not exist`) ||
    message.includes(`could not find the '${target}' column`) ||
    message.includes(target)
  )
}

function isForeignKeyError(error: any) {
  const message = String(error?.message || error?.details || "").toLowerCase()
  return error?.code === "23503" || message.includes("violates foreign key constraint")
}

function isUuid(value: string | null | undefined) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

async function insertAddressWithFallbacks(supabase: ReturnType<typeof createAdminClientStatic>, payload: Record<string, any>) {
  let result = await supabase.from("addresses").insert(payload).select("*").single()
  if (!result.error) return result

  if (isMissingColumnError(result.error, "user_email")) {
    const { user_email: _ignored, ...withoutEmail } = payload
    result = await supabase.from("addresses").insert(withoutEmail).select("*").single()
    if (!result.error) return result
  }

  if (isForeignKeyError(result.error)) {
    const { user_id: _ignored, ...withoutUserId } = payload
    result = await supabase.from("addresses").insert(withoutUserId).select("*").single()
    if (!result.error) return result
  }

  return result
}

export async function GET() {
  try {
    const session = await auth()
    const email = normalizeEmail(session?.user?.email)
    const userId = isUuid(session?.user?.id || null) ? session?.user?.id || null : null

    if (!email && !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createAdminClientStatic()
    let query = supabase.from("addresses").select("*").order("is_default", { ascending: false }).order("created_at", { ascending: false })

    if (email) {
      query = query.or(`user_email.eq.${email},user_id.eq.${userId || ""}`)
    } else {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query
    if (error) {
      if (email && isMissingColumnError(error, "user_email")) {
        return NextResponse.json(
          {
            error:
              "Your Supabase database is missing public.addresses.user_email. Run the latest supabase/migrations.sql, then reload.",
          },
          { status: 500 }
        )
      }
      throw error
    }
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Fetch addresses error:", error)
    return NextResponse.json({ error: error?.message || "Failed to load addresses" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    const email = normalizeEmail(session?.user?.email)
    const userId = isUuid(session?.user?.id || null) ? session?.user?.id || null : null

    if (!email && !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const supabase = createAdminClientStatic()

    const insertPayload: Record<string, any> = {
      ...(userId ? { user_id: userId } : {}),
      ...(email ? { user_email: email } : {}),
      full_name: body.fullName || body.full_name,
      phone: body.phone,
      address_line1: body.line1 || body.address_line1,
      address_line2: body.line2 || body.address_line2 || "",
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      is_default: body.isDefault ?? body.is_default ?? false,
    }

    const insertResult = await insertAddressWithFallbacks(supabase, insertPayload)

    if (insertResult.error) {
      throw insertResult.error
    }
    return NextResponse.json(insertResult.data)
  } catch (error: any) {
    console.error("Create address error:", error)
    return NextResponse.json({ error: error?.message || "Failed to save address" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    const email = normalizeEmail(session?.user?.email)
    const userId = isUuid(session?.user?.id || null) ? session?.user?.id || null : null
    const supabase = createAdminClientStatic()
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: "Missing address id" }, { status: 400 })
    }

    if (body.isDefault) {
      let reset = supabase.from("addresses").update({ is_default: false })
      if (email) reset = reset.or(`user_email.eq.${email},user_id.eq.${userId || ""}`)
      else reset = reset.eq("user_id", userId)
      await reset
    }

    const { data, error } = await supabase
      .from("addresses")
      .update({
        full_name: body.fullName || body.full_name,
        phone: body.phone,
        address_line1: body.line1 || body.address_line1,
        address_line2: body.line2 || body.address_line2 || "",
        city: body.city,
        state: body.state,
        pincode: body.pincode,
        is_default: body.isDefault ?? body.is_default ?? false,
      })
      .eq("id", body.id)
      .select("*")
      .single()

    if (error) {
      throw error
    }
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Update address error:", error)
    return NextResponse.json({ error: error?.message || "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    const email = normalizeEmail(session?.user?.email)
    const userId = isUuid(session?.user?.id || null) ? session?.user?.id || null : null
    const supabase = createAdminClientStatic()
    const body = await req.json()

    if (!body.id) {
      return NextResponse.json({ error: "Missing address id" }, { status: 400 })
    }

    let query = supabase.from("addresses").delete().eq("id", body.id)
    if (email) {
      query = query.or(`user_email.eq.${email},user_id.eq.${userId || ""}`)
    } else {
      query = query.eq("user_id", userId)
    }

    const { error } = await query
    if (error) {
      throw error
    }
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete address error:", error)
    return NextResponse.json({ error: error?.message || "Failed to delete address" }, { status: 500 })
  }
}
