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
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-700" />
              </div>
              <h1 className="text-2xl font-bold">Blog Management</h1>
            </div>
          </div>
          <Link href="/admin/blog/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" /> New Post
            </Button>
          </Link>
        </div>

        <BlogList initialPosts={posts || []} />
      </div>
    </div>
  )
}
