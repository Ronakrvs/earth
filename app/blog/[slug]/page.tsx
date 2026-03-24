import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft, Leaf, ArrowRight } from "lucide-react"
import { createAdminClient, createAdminClientStatic } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"
import { cn } from "@/lib/utils"

export async function generateStaticParams() {
  const supabase = createAdminClientStatic()
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
    <div className="min-h-screen bg-background pb-32 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ─── ARTICLE HEADER ──────────────────────────────────────── */}
      <div className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 hover:text-primary mb-12 transition-all group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Knowledge Hub
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center mb-16"
          >
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {post.tags?.map((tag: string) => (
                <span key={tag} className="bg-primary/5 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary/5">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter max-w-4xl">
              {post.title}
            </h1>

            <div className="flex items-center justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary/20" /> {date}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary/20" /> {readTime} read</span>
              <span className="flex items-center gap-2"><Leaf className="h-4 w-4 text-primary/60" /> Organic Insight</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MoringaCard className="p-0 bg-white border-primary/5 shadow-2xl shadow-primary/5 overflow-hidden ring-1 ring-primary/5" glass={true}>
            {/* Hero Image */}
            <div className="aspect-[21/10] relative bg-slate-50 overflow-hidden">
              <Image
                src={post.cover_image || "/images/powder2.png"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="p-8 md:p-20">
              {/* Post Content */}
              <div className="prose prose-slate lg:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:mb-8 prose-blockquote:border-primary/20 prose-blockquote:bg-primary/5 prose-blockquote:p-10 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:font-medium prose-blockquote:text-xl prose-blockquote:text-slate-800 prose-li:text-slate-600 prose-li:font-medium prose-img:rounded-3xl prose-strong:text-slate-900 prose-strong:font-black">
                {post.content.split("\n\n").map((para: string, i: number) => {
                  const trimmed = para.trim()
                  if (!trimmed) return null

                  if (trimmed.startsWith("## ")) {
                    return <h2 key={i} className="text-3xl font-black text-slate-900 mt-16 mb-8">{trimmed.replace("## ", "")}</h2>
                  }
                  if (trimmed.startsWith("### ")) {
                    return <h3 key={i} className="text-2xl font-black text-slate-900 mt-12 mb-6">{trimmed.replace("### ", "")}</h3>
                  }
                  if (trimmed.startsWith("---")) {
                    return <hr key={i} className="border-slate-100 my-16 opacity-50" />
                  }
                  if (trimmed.includes("\n- ") || trimmed.startsWith("- ")) {
                    return (
                      <ul key={i} className="list-disc list-outside ml-6 space-y-4 mb-8">
                        {trimmed.split("\n").filter(l => l.trim()).map((item, j) => (
                          <li key={j} className="pl-2">{item.replace(/^- /, "").trim()}</li>
                        ))}
                      </ul>
                    )
                  }
                  if (trimmed.startsWith("> ")) {
                    return (
                      <blockquote key={i}>
                        <p className="mb-0">{trimmed.replace("> ", "")}</p>
                      </blockquote>
                    )
                  }
                  return <p key={i} className="whitespace-pre-wrap">{trimmed}</p>
                })}
              </div>

              {/* Enhanced CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-24"
              >
                <MoringaCard className="bg-gradient-to-br from-primary to-emerald-900 p-10 md:p-16 text-center text-white overflow-hidden border-none shadow-2xl shadow-primary/20" glass={false}>
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M0,0 Q50,20 100,0 V100 Q50,80 0,100 Z" fill="currentColor" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10 max-w-xl mx-auto">
                    <span className="inline-flex px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-secondary mb-6 backdrop-blur-md">
                      Botanical Excellence
                    </span>
                    <h3 className="text-3xl md:text-4xl font-black mb-6 tracking-tighter">Harvest the Miracle for Yourself</h3>
                    <p className="text-emerald-100/70 mb-10 text-lg font-medium leading-relaxed italic">
                      "Our Rajasthani farm brings you the purest moringa, stone-ground within 24 hours of harvest."
                    </p>
                    <Link href="/shop">
                      <Button size="lg" className="h-16 px-10 bg-white text-primary hover:bg-emerald-50 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl group">
                        Shop the Collection <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </MoringaCard>
              </motion.div>
            </div>
          </MoringaCard>
        </motion.div>
      </div>
    </div>
  )
}
