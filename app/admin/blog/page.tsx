import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import BlogList from "./BlogList"
import Link from "next/link"
import { ArrowLeft, BookOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminBlogPage() {
  const session = await auth()
  const supabase = await createAdminClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (profile?.role !== "admin") redirect("/")

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Blog Posts</h1>
            <p className="text-slate-500 font-medium text-sm">Manage your wellness journal and updates.</p>
          </div>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold px-6">
            New Post
          </Button>
        </Link>
      </div>

      <BlogList initialPosts={posts || []} />
    </div>
  )
}
