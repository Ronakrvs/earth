import { auth } from "@/lib/auth"
import { createAdminClientStatic } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  
  // Efficient and consistent authorization check
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })
  if (session.user.role !== "admin") return new NextResponse("Forbidden", { status: 403 })

  // Use the static client to bypass RLS for administrative GET
  const supabase = createAdminClientStatic()
  
  const { data: settings, error } = await supabase
    .from('settings')
    .select('*')

  if (error) {
    console.error("Admin Settings GET error:", error.message)
    return NextResponse.json({})
  }

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, any>)

  return NextResponse.json(settingsMap)
}

export async function POST(req: Request) {
  const session = await auth()
  
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })
  if (session.user.role !== "admin") return new NextResponse("Forbidden", { status: 403 })

  // Use the static client to bypass RLS for administrative UPSERT
  const supabase = createAdminClientStatic()
  
  const { key, value } = await req.json()

  if (!key) return new NextResponse("Key is required", { status: 400 })

  const { error } = await supabase
    .from('settings')
    .upsert({ 
      key, 
      value,
      updated_at: new Date().toISOString()
    })

  if (error) return new NextResponse(error.message, { status: 500 })

  return NextResponse.json({ success: true })
}
