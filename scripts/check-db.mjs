import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve } from "path"

// Simple .env.local parser
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

async function check() {
  console.log("--- Supabase Database Check ---")
  
  const { count: userCount, error: userError } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  console.log(`Profiles: ${userError ? '❌ Error: ' + userError.message : userCount + ' rows'}`)

  const { count: productCount, error: productError } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`Products: ${productError ? '❌ Error: ' + productError.message : productCount + ' rows'}`)

  const { count: variantCount, error: variantError } = await supabase.from('product_variants').select('*', { count: 'exact', head: true })
  console.log(`Product Variants: ${variantError ? '❌ Error: ' + variantError.message : variantCount + ' rows'}`)
}

check()
