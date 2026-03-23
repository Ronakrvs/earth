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

    console.log("📝 Processing B2B inquiry for:", data.company_name)

    // Store in Supabase
    const supabase = await createAdminClient()
    const { error, data: insertedData } = await supabase.from("b2b_inquiries").insert([{
      company_name: data.company_name,
      contact_name: data.contact_name,
      email: data.email,
      phone: data.phone,
      business_type: data.business_type || null,
      products_interested: data.products ? [data.products] : [],
      monthly_quantity: data.monthly_quantity || null,
      message: data.message || null,
      status: 'new'
    }]).select()

    if (error) {
      console.error("❌ Supabase insertion error:", error)
      throw error
    }

    console.log("✅ B2B inquiry stored successfully:", insertedData?.[0]?.id)

    // Redirect to thank you message
    return NextResponse.redirect(new URL("/b2b?submitted=true", req.url))
  } catch (error: any) {
    console.error("🚨 B2B inquiry submission failed:", error.message || error)
    return NextResponse.redirect(new URL("/b2b?error=true", req.url))
  }
}
