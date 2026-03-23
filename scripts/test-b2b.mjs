import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve } from "path"

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local")
    const envContent = readFileSync(envPath, "utf-8")
    envContent.split("\n").forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        let value = match[2] || ""
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
        process.env[match[1]] = value
      }
    })
  } catch (err) {}
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing Supabase environment variables.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function test() {
  console.log("🚀 Testing B2B inquiry insertion...")
  const { data, error } = await supabase.from("b2b_inquiries").insert([{
    company_name: "Test Company",
    contact_name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    business_type: "retailer",
    products_interested: ["Test Product"],
    monthly_quantity: "100 kg",
    message: "This is a test inquiry"
  }]).select()

  if (error) {
    console.error("❌ Insertion failed:", error.message)
    process.exit(1)
  } else {
    console.log("✅ Insertion successful:", data?.[0]?.id)
    process.exit(0)
  }
}

test()
