import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const data = {
      company_name: formData.get("company_name"),
      contact_name: formData.get("contact_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      business_type: formData.get("business_type"),
      products: formData.get("products"),
      monthly_quantity: formData.get("monthly_quantity"),
      message: formData.get("message"),
    }

    // Store in Supabase
    const supabase = await createAdminClient()
    const { error } = await supabase.from("b2b_inquiries").insert([{
      company_name: data.company_name,
      contact_name: data.contact_name,
      email: data.email,
      phone: data.phone,
      business_type: data.business_type,
      products_interested: [data.products],
      monthly_quantity: data.monthly_quantity,
      message: data.message,
    }])

    if (error) throw error

    // Redirect to thank you message
    return NextResponse.redirect(new URL("/b2b?submitted=true", req.url))
  } catch (error) {
    console.error("B2B inquiry error:", error)
    return NextResponse.redirect(new URL("/b2b?error=true", req.url))
  }
}
