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
  } catch (err) {
    console.warn("⚠️  Warning: Could not read .env.local file.")
  }
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function promoteToAdmin(email) {
  console.log(`\n🚀 Promoting user with email: ${email} to admin...`)

  // 1. Find the user profile
  const { data: profile, error: findError } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("email", email)
    .maybeSingle()

  if (findError || !profile) {
    console.error("❌ Error finding user profile:", findError?.message || "User not found")
    console.log("💡 Tip: Make sure the user has signed up on the site first.")
    return
  }

  if (profile.role === "admin") {
    console.log(`✅ User ${profile.full_name} (${email}) is already an admin.`)
    return
  }

  // 2. Update the role
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", profile.id)

  if (updateError) {
    console.error("❌ Error updating user role:", updateError.message)
    return
  }

  console.log(`\n🎉 Success! ${profile.full_name} (${email}) has been promoted to admin.`)
  console.log("🔐 They can now access the /admin dashboard.")
}

// Get email from command line arguments
const emailArg = process.argv[2]

if (!emailArg) {
  console.error("❌ Please provide an email address.")
  console.log("Usage: node scripts/promote-admin.mjs user@example.com")
  process.exit(1)
}

promoteToAdmin(emailArg)
