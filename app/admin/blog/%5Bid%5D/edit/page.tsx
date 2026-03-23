import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import BlogForm from "../../BlogForm"

export default async function EditBlogPostPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const supabase = await createAdminClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (profile?.role !== "admin") redirect("/")

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single()

  if (!post) redirect("/admin/blog")

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
        <BlogForm initialData={post} />
      </div>
    </div>
  )
}
