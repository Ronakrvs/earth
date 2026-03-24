import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    // Determine if the request is multipart/form-data or JSON
    const contentType = req.headers.get("content-type") || ""
    let data: any = {}

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData()
      data = {
        company_name: formData.get("company_name"),
        contact_name: formData.get("contact_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        business_type: formData.get("business_type"),
        products: formData.get("products"),
        monthly_quantity: formData.get("monthly_quantity"),
        message: formData.get("message"),
      }
    } else {
      data = await req.json()
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
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("✅ B2B inquiry stored successfully:", insertedData?.[0]?.id)

    return NextResponse.json({ 
        success: true, 
        message: "Institutional inquiry received.",
        id: insertedData?.[0]?.id 
    })
  } catch (error: any) {
    console.error("🚨 B2B inquiry submission failed:", error.message || error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
