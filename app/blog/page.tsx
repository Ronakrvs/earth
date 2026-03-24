import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight, Leaf, Search, TrendingUp, Utensils, Sparkles, Sprout } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Moringa Health Blog — Recipes, Tips & Research | Shigruvedas",
  description: "Science-backed health benefits, delicious recipes and farm stories about organic moringa. Expert wellness tips from our Rajasthan farm.",
}

import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  { label: "All Articles", value: "all", icon: Sparkles },
  { label: "Health & Wellness", value: "health", icon: TrendingUp },
  { label: "Recipes", value: "recipes", icon: Utensils },
  { label: "Farm Life", value: "farm", icon: Sprout },
]

type BlogSearchParams = {
  category?: string | string[]
}

type FormattedPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  tag: string
  readTime: string
  date: string
  image: string
}

function includesAny(source: string, keys: string[]) {
  const s = source.toLowerCase()
  return keys.some((k) => s.includes(k))
}

function inferCategory(post: { category: string; tag: string; title: string; excerpt: string }) {
  const haystack = `${post.category} ${post.tag} ${post.title} ${post.excerpt}`
  if (includesAny(haystack, ["recipe", "cook", "kitchen", "meal"])) return "recipes"
  if (includesAny(haystack, ["farm", "soil", "harvest", "field", "cultivation"])) return "farm"
  if (includesAny(haystack, ["health", "wellness", "nutrition", "benefit"])) return "health"
  return "all"
}

function matchesCategory(post: FormattedPost, category: string) {
  if (category === "all") return true
  return inferCategory(post) === category
}

function safeImage(url?: string | null) {
  if (!url) return "/images/powder2.png"
  return url
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<BlogSearchParams>
}) {
  const params = await searchParams
  const rawCategory = Array.isArray(params?.category) ? params.category[0] : params?.category
  const selectedCategory = CATEGORIES.some((c) => c.value === rawCategory) ? (rawCategory as string) : "all"

  const supabase = await createAdminClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  const formattedPosts: FormattedPost[] = (posts || []).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt || "",
    category: post.tags?.[0] || "General",
    tag: post.tags?.[1] || "Article",
    readTime: `${Math.max(1, Math.ceil((post.content || "").split(" ").length / 200))} min`,
    date: new Date(post.created_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    image: safeImage(post.cover_image),
  }))

  const filteredPosts = formattedPosts.filter((post) => matchesCategory(post, selectedCategory))
  const featured = filteredPosts[0]
  const rest = filteredPosts.slice(1)

  const counts = {
    all: formattedPosts.length,
    health: formattedPosts.filter((p) => inferCategory(p) === "health").length,
    recipes: formattedPosts.filter((p) => inferCategory(p) === "recipes").length,
    farm: formattedPosts.filter((p) => inferCategory(p) === "farm").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-primary mb-8"
          >
            <Leaf className="h-4 w-4" /> Moringa Knowledge Hub
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6 leading-none"
          >
            Insights for a <br />
            <span className="text-gradient">Vital Life</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg font-medium leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Deep dives into the science of moringa, delicious botanical recipes, and stories from our Rajasthan homestead.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-lg mx-auto"
          >
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
            <input
              placeholder="Explore the miracle..."
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] bg-card border border-border shadow-2xl shadow-primary/5 text-foreground text-sm placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
          </motion.div>
        </div>
      </section>

      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto px-4 py-2 max-w-6xl">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar justify-center items-center h-14">
            {CATEGORIES.map(({ label, value, icon: Icon }) => (
              <Link
                key={value}
                href={value === "all" ? "/blog" : `/blog?category=${value}`}
                className={cn(
                  "flex-shrink-0 flex items-center gap-2 px-5 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
                  selectedCategory === value
                    ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                    : "text-muted-foreground hover:text-primary hover:bg-card"
                )}
              >
                <Icon className="h-4 w-4 opacity-70" /> {label}
                <span className="opacity-70">({counts[value as keyof typeof counts]})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-16">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-32 opacity-70">
            <Leaf className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
            <p className="text-xl font-black uppercase tracking-[0.2em] text-foreground">No Articles In This Category Yet</p>
          </div>
        ) : (
          <>
            {featured && (
              <div className="mb-20">
                <Link href={`/blog/${featured.slug}`} className="group block">
                  <MoringaCard className="grid lg:grid-cols-12 p-0 bg-card border-border/60 overflow-hidden group-hover:shadow-2xl transition-all" glass={true}>
                    <div className="lg:col-span-5 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-foreground">{featured.tag}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/50">{featured.category}</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-foreground mb-5 leading-[1.08] group-hover:text-primary transition-colors tracking-tighter">
                        {featured.title}
                      </h2>
                      <p className="text-muted-foreground text-base md:text-lg mb-7 line-clamp-3 font-medium leading-relaxed">{featured.excerpt}</p>
                      <div className="flex items-center gap-5 text-[10px] text-muted-foreground/80 font-black uppercase tracking-widest mb-8">
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary/30" /> {featured.date}</span>
                        <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary/30" /> {featured.readTime} read</span>
                      </div>
                      <Button className="h-13 md:h-14 px-8 md:px-10 rounded-2xl bg-primary text-primary-foreground font-bold group-hover:scale-105 transition-all shadow-xl shadow-primary/20 w-full sm:w-fit justify-center">
                        Explore Full Article <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>

                    <div className="lg:col-span-7 min-h-[280px] md:min-h-[420px] lg:min-h-[520px] relative bg-muted">
                      <img
                        src={featured.image}
                        alt={featured.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
                    </div>
                  </MoringaCard>
                </Link>
              </div>
            )}

            {rest.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-black text-foreground tracking-tighter italic">The Latest Harvest</h2>
                  <div className="h-px flex-1 mx-10 bg-border hidden sm:block" />
                  <span className="text-[10px] font-black text-primary/50 uppercase tracking-widest">{rest.length} Fresh Narratives</span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((post, idx) => (
                    <motion.div
                      key={post.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                    >
                      <Link href={`/blog/${post.slug}`} className="group block h-full">
                        <MoringaCard className="p-0 border-border/60 hover:bg-card transition-all overflow-hidden h-full flex flex-col" glass={true}>
                          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                            <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                            <div className="absolute top-4 left-4">
                              <span className="bg-card/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary shadow-sm border border-border">{post.tag}</span>
                            </div>
                          </div>
                          <div className="p-7 flex flex-col flex-1">
                            <p className="text-[10px] text-primary/50 font-black uppercase tracking-[0.2em] mb-3">{post.category}</p>
                            <h3 className="font-extrabold text-foreground text-xl group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-tight flex-1 tracking-tight">
                              {post.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-6 font-medium italic">"{post.excerpt}"</p>
                            <div className="flex items-center justify-between pt-5 border-t border-border text-[10px] font-black text-muted-foreground/80 uppercase tracking-widest">
                              <span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 opacity-50" /> {post.date}</span>
                              <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 opacity-50" /> {post.readTime}</span>
                            </div>
                          </div>
                        </MoringaCard>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <MoringaCard className="bg-gradient-to-br from-primary to-emerald-900 p-12 md:p-24 text-white relative overflow-hidden border-none" glass={false}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="90" cy="10" r="30" fill="currentColor" />
                <circle cx="10" cy="90" r="20" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex h-16 w-16 rounded-3xl bg-white/10 items-center justify-center mb-8 backdrop-blur-md">
                <Leaf className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Stay Rooted in <br/> Wellness</h2>
              <p className="text-emerald-100/70 text-lg mb-12 font-medium">Join 5,000+ botanical enthusiasts. Receive moringa recipes, research, and life-harvesting tips every Sunday.</p>

              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-8 py-5 rounded-2xl bg-white/10 text-white placeholder:text-emerald-200/50 text-sm border border-white/20 focus:outline-none focus:ring-4 focus:ring-white/10 backdrop-blur-xl transition-all outline-none font-bold"
                />
                <Button size="lg" className="h-16 px-10 bg-white text-primary hover:bg-emerald-50 rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95">
                  Subscribe Free
                </Button>
              </form>
              <p className="text-emerald-300/40 text-[10px] mt-6 font-bold uppercase tracking-[0.2em] italic">No spam. Just pure botanical inspiration.</p>
            </div>
          </MoringaCard>
        </motion.div>
      </div>
    </div>
  )
}
