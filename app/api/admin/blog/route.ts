import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isAdminSession } from "@/lib/admin-auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(posts)
  } catch (error: any) {
    console.error("Fetch blog posts error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, slug, content, excerpt, cover_image, tags, is_published } = body

    const { data: post, error } = await supabase
      .from("blog_posts")
      .insert([{
        title,
        slug,
        content,
        excerpt,
        cover_image,
        tags,
        is_published,
        author_id: session.user.id,
        published_at: is_published ? new Date().toISOString() : null
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(post)
  } catch (error: any) {
    console.error("Create blog post error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
