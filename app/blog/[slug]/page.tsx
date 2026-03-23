import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft, Leaf, ArrowRight } from "lucide-react"

import { createAdminClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const supabase = await createAdminClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true)
  
  return (posts || []).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createAdminClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, cover_image')
    .eq('slug', slug)
    .single()

  if (!post) return { title: "Post Not Found" }
  
  return { 
    title: post.title, 
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image || "/og-image.jpg"],
    }
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

  const readTime = `${Math.max(1, Math.ceil(post.content.split(" ").length / 200))} min`
  const date = new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  // BlogPosting Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.cover_image || "https://shigruvedas.com/og-image.jpg",
    "datePublished": post.created_at,
    "dateModified": post.updated_at || post.created_at,
    "author": {
      "@type": "Organization",
      "name": "Shigruvedas"
    },
    "description": post.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://shigruvedas.com/blog/${slug}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 mb-6 group transition-colors">
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Hero image */}
          <div className="aspect-[21/9] relative bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
            <Image
              src={post.cover_image || "/images/powder2.png"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags?.map((tag: string) => (
                <Badge key={tag} className="bg-green-100 text-green-700 hover:bg-green-200 border-none transition-colors">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-10 pb-10 border-b border-gray-100">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-green-600" /> {date}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-green-600" /> {readTime} read</span>
              <span className="flex items-center gap-2 font-medium text-gray-600 uppercase tracking-wider text-[10px]"><Leaf className="h-4 w-4 text-green-500" /> Shigruvedas Farm</span>
            </div>

            {/* Post body */}
            <div className="prose prose-green lg:prose-lg max-w-none text-gray-700 leading-relaxed text-sm">
              {post.content.split("\n\n").map((para: string, i: number) => {
                const trimmed = para.trim()
                if (!trimmed) return null

                if (trimmed.startsWith("## ")) {
                  return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-5">{trimmed.replace("## ", "")}</h2>
                }
                if (trimmed.startsWith("### ")) {
                  return <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-4">{trimmed.replace("### ", "")}</h3>
                }
                if (trimmed.startsWith("---")) {
                  return <hr key={i} className="border-gray-100 my-8" />
                }
                if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
                  return (
                    <ul key={i} className="list-disc list-outside ml-6 space-y-3 mb-6">
                      {trimmed.split("\n").filter(l => l.trim()).map((item, j) => (
                        <li key={j} className="pl-2">{item.replace(/^- /, "").trim()}</li>
                      ))}
                    </ul>
                  )
                }
                if (trimmed.startsWith("> ")) {
                  return (
                    <blockquote key={i} className="border-l-4 border-green-500 bg-green-50/50 p-6 rounded-r-2xl italic text-gray-800 my-8">
                      {trimmed.replace("> ", "")}
                    </blockquote>
                  )
                }
                return <p key={i} className="mb-6 whitespace-pre-wrap">{trimmed}</p>
              })}
            </div>

            {/* CTA */}
            <div className="mt-16 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <p className="inline-flex items-center gap-2 bg-green-600 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full mb-4">
                   Farm Direct Premium Moringa
                </p>
                <h3 className="text-2xl font-bold text-green-900 mb-2">Experience the Purity of Udaipur</h3>
                <p className="text-green-700/80 mb-8 max-w-md mx-auto">
                  Our organic moringa is stone-ground fresh within 24 hours of harvest. Pure nutrition, zero additives.
                </p>
                <Link href="/shop">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-green-200 transition-all hover:scale-105">
                    Shop Our Collection <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
