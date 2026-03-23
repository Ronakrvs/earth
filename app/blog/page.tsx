import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, Leaf, Search, TrendingUp, Utensils, Sparkles, Sprout } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Moringa Health Blog — Recipes, Tips & Research | Shigruvedas",
  description: "Science-backed health benefits, delicious recipes and farm stories about organic moringa. Expert wellness tips from our Rajasthan farm.",
}

const CATEGORIES = [
  { label: "All Articles", value: "all", icon: Sparkles },
  { label: "Health & Wellness", value: "health", icon: TrendingUp },
  { label: "Recipes", value: "recipes", icon: Utensils },
  { label: "Farm Life", value: "farm", icon: Sprout },
]

export default async function BlogPage() {
  const supabase = await createAdminClient()
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
  }

  const formattedPosts = (posts || []).map(post => ({
    ...post,
    category: post.tags?.[0] || "General",
    tag: post.tags?.[1] || "Article",
    tagColor: "bg-green-600",
    readTime: `${Math.max(1, Math.ceil(post.content.split(" ").length / 200))} min`,
    date: new Date(post.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    image: post.cover_image || "/images/powder2.png"
  }))

  const featured = formattedPosts[0]
  const rest = formattedPosts.slice(1)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white pt-16 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-4xl relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-5 border border-white/10">
            <Leaf className="h-4 w-4 text-green-400" /> Moringa Knowledge Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Health Tips, Recipes &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">Farm Stories</span>
          </h1>
          <p className="text-green-100 max-w-xl mx-auto mb-8">
            Science-backed wellness insights and delicious recipes from our organic moringa farm in Rajasthan.
          </p>
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search articles..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-gray-900 text-sm placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>
      </section>

      {/* Category pills */}
      <div className="sticky top-16 z-30 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 max-w-5xl">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  value === "all"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-12">
        {formattedPosts.length === 0 ? (
          <div className="text-center py-20">
            <Leaf className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No articles found. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group block mb-14">
                <div className="grid md:grid-cols-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                  <div className="md:col-span-2 aspect-video md:aspect-auto bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden relative">
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="md:col-span-3 p-6 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`${featured.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full capitalize`}>
                        {featured.tag}
                      </span>
                      <Badge className="bg-green-100 text-green-700 capitalize">{featured.category}</Badge>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 group-hover:text-green-700 transition-colors leading-tight">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {featured.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featured.readTime} read</span>
                    </div>
                    <span className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl group-hover:bg-green-700 transition-colors w-fit">
                      Read Article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">Latest Articles</h2>
              <span className="text-sm text-gray-400">{rest.length} articles</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white rounded-3xl border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-lg transition-all overflow-hidden h-full flex flex-col">
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className={`absolute top-3 left-3 ${post.tagColor} text-white text-xs font-bold px-2.5 py-1 rounded-full capitalize`}>
                        {post.tag}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-xs text-green-600 font-medium mb-1 capitalize">{post.category}</p>
                      <h3 className="font-bold text-gray-900 text-sm group-hover:text-green-700 transition-colors mb-2 line-clamp-2 leading-snug flex-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-br from-green-700 to-emerald-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="relative text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Stay in the Loop 🌿</h2>
            <p className="text-green-100 mb-6 text-sm">
              Get moringa recipes, health research, and exclusive farm updates delivered weekly.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 rounded-2xl bg-white/10 text-white placeholder:text-green-200 text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
              />
              <Button className="bg-white text-green-700 hover:bg-green-50 font-bold px-6 rounded-2xl flex-shrink-0">
                Subscribe Free
              </Button>
            </form>
            <p className="text-green-200 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
