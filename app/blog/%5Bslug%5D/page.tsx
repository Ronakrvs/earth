import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft, Leaf, ArrowRight } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createAdminClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .single()

  if (!post) return { title: "Article Not Found" }
  return { 
    title: `${post.title} | Shigruvedas Blog`, 
    description: post.excerpt 
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createAdminClient()
  
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) {
    notFound()
  }

  const category = post.tags?.[0] || "General"
  const readTime = `${Math.max(1, Math.ceil(post.content.split(" ").length / 200))} min read`
  const dateStr = new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 mb-6">
          <ChevronLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Hero image */}
          <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 relative">
            <Image
              src={post.cover_image || "/images/powder2.png"}
              alt={post.title}
              fill
              className="w-full h-full object-cover p-0"
              priority
            />
          </div>

          <div className="p-6 md:p-10">
            <Badge className="bg-green-100 text-green-700 mb-4 capitalize">{category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {dateStr}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {readTime}</span>
              <span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-green-500" /> Shigruvedas</span>
            </div>

            {/* Post body */}
            <div className="prose prose-green max-w-none text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap">
               {post.content}
            </div>

            {/* CTA */}
            <div className="mt-10 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="font-semibold text-green-800 mb-1">Try Organic Moringa Today 🌿</p>
              <p className="text-sm text-green-700 mb-4">Direct from our certified organic farm in Udaipur, Rajasthan</p>
              <Link href="/shop">
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
