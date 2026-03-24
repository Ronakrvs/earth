import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import * as motion from "framer-motion/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRight, Leaf, Star, CheckCircle2, Heart, Phone, ChevronRight, Zap, Sparkles
} from "lucide-react"
import { createSimpleClient } from "@/lib/supabase/client"
import { createAdminClientStatic } from "@/lib/supabase/server"
import Hero from "@/components/home/Hero"
import StatsBar from "@/components/home/StatsBar"
import Features from "@/components/home/Features"
import { MoringaCard, BentoGrid, BentoItem } from "@/components/ui/moringa-card"

export const metadata: Metadata = {
  title: "Organic Moringa Products — Fresh from Rajasthan Farm | Shigruvedas",
  description: "Buy premium organic moringa leaves, powder & drumsticks from our certified 7+ acre farm in Udaipur, Rajasthan. Free delivery. 100% chemical-free.",
  keywords: ["organic moringa Rajasthan", "moringa powder India", "fresh moringa leaves", "shigruvedas"],
  alternates: { canonical: "https://shigruvedas.com" },
}

async function getFeaturedProducts() {
  const supabase = createSimpleClient()
  const { data } = await supabase
    .from("products")
    .select(`
      *,
      product_variants (*)
    `)
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(3)
  
  return (data || []).map((p: any) => ({
    name: p.name,
    slug: p.slug,
    desc: p.short_description,
    price: `₹${Math.min(...p.product_variants.map((v: any) => v.price))}`,
    weight: p.product_variants[0]?.weight || "",
    image: p.thumbnail,
    badge: p.category.replace("-", " "),
  }))
}

async function getBlogPosts() {
  const supabase = createAdminClientStatic()
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3)
    
  return (data || []).map((post: any) => ({
    slug: post.slug,
    title: post.title,
    cat: post.tags?.[0] || "General",
    image: post.cover_image || "/images/powder2.png"
  }))
}

const TESTIMONIALS = [
  { name: "Priya Sharma", location: "Mumbai", rating: 5, text: "The moringa powder is absolutely incredible — you can taste the freshness. My energy levels have genuinely improved within 2 weeks.", avatar: "PS" },
  { name: "Rajesh Patel", location: "Ahmedabad", rating: 5, text: "Finally found a reliable organic moringa supplier. The drumsticks are so tender and the quality is restaurant-grade.", avatar: "RP" },
  { name: "Ananya Singh", location: "Delhi", rating: 5, text: "As a nutritionist I'm very particular about quality. Shigruvedas is the only brand I recommend for pure moringa.", avatar: "AS" },
]

export default async function HomePage() {
  const products = await getFeaturedProducts()
  const blogPosts = await getBlogPosts()
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Shigruvedas",
    "url": "https://shigruvedas.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://shigruvedas.com/shop?query={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <Hero />

      {/* ─── STATS ────────────────────────────────────────────────── */}
      <StatsBar />

      {/* ─── HIGHLIGHT PRODUCTS ────────────────────────────────────── */}
      <section className="py-32 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <Badge className="bg-primary/5 text-primary border-primary/10 mb-4 px-4 py-1">Premium Collection</Badge>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
                Farm-Fresh <span className="text-gradient">Essentials</span>
              </h2>
              <p className="text-slate-500 text-lg">
                Crafted with patience, harvested with care. Explore our selection of nature's most nutrient-dense offerings.
              </p>
            </div>
            <Link href="/shop" className="group">
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl gap-2 h-14 px-8">
                Explore Full Store <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {products.map((product: any, idx: number) => (
              <MoringaCard key={product.slug} delay={idx * 0.15} className="group flex flex-col h-full bg-slate-50/50 hover:bg-white">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100/50">
                  <Image
                    src={product.image || "/images/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-white/80 backdrop-blur-md text-primary border-none shadow-sm px-4 py-1.5 capitalize font-bold">
                      {product.badge}
                    </Badge>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">{product.desc}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900">{product.price}</span>
                      <span className="text-slate-400 text-xs font-medium">/ {product.weight}</span>
                    </div>
                    <Link href={`/products/${product.slug}`}>
                      <Button size="icon" variant="outline" className="h-12 w-12 rounded-2xl border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all group/btn">
                        <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </MoringaCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE MORINGA MIRACLE (BENTO) ────────────────────────────── */}
      <section className="py-32 px-6 bg-[#FDFEFC] text-foreground overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-900/5 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
            <Badge className="bg-primary/10 text-primary border-none mb-4 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">The Alchemical Truth</Badge>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter italic text-slate-900">
              A Nutrition <span className="text-primary underline decoration-primary/20 underline-offset-8">Miracle.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed italic">
              "Known as the 'Tree of Life,' Moringa oleifera contains over 90 bio-available nutrients, vitamins, and minerals that transcend modern supplementation."
            </p>
          </div>

          <BentoGrid className="max-w-6xl mx-auto">
            <BentoItem colSpan={12} className="lg:col-span-7">
              <MoringaCard glass={true} className="h-full bg-white/40 border-white p-12 flex flex-col justify-end group min-h-[450px] shadow-2xl">
                <div className="relative z-10">
                  <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform duration-700">
                    <Leaf className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-4xl font-black mb-6 italic text-slate-900 tracking-tighter leading-none">7× More Vitamin C.</h3>
                  <p className="text-slate-500 leading-relaxed font-medium text-lg max-w-md">
                    Inoculate your immunity with a Vitamin C concentration seven times higher than fresh oranges in every organic serving.
                  </p>
                </div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              </MoringaCard>
            </BentoItem>
            
            <BentoItem colSpan={12} className="lg:col-span-5 space-y-6">
              <MoringaCard glass={true} className="bg-white/40 border-white p-10 group shadow-xl">
                <div className="flex items-center gap-8">
                  <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Zap className="h-8 w-8 text-amber-600 fill-amber-600/20" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900 italic tracking-tight">Energy Protocol</h4>
                    <p className="text-slate-400 text-sm font-medium">Bio-available Iron for perpetual vitality.</p>
                  </div>
                </div>
              </MoringaCard>

              <MoringaCard glass={true} className="bg-white/40 border-white p-10 group shadow-xl">
                <div className="flex items-center gap-8">
                  <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Heart className="h-8 w-8 text-rose-600 fill-rose-600/20" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-slate-900 italic tracking-tight">Heart Catalyst</h4>
                    <p className="text-slate-400 text-sm font-medium">Potassium levels that double organic bananas.</p>
                  </div>
                </div>
              </MoringaCard>

              <MoringaCard glass={true} className="bg-slate-900 p-10 group shadow-2xl border-none">
                <div className="flex items-center gap-8">
                  <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="h-8 w-8 text-primary shadow-2xl" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-white italic tracking-tight">Antioxidant Shield</h4>
                    <p className="text-slate-400 text-sm font-medium">46 types of pure antioxidant compounds.</p>
                  </div>
                </div>
              </MoringaCard>
            </BentoItem>

            <BentoItem colSpan={12}>
              <div className="mt-12 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 px-6 py-10 border-t border-primary/5">
                {["7× Vitamin C", "4× Calcium", "2× Protein", "3× Potassium", "25× Iron"].map((benefit, i) => (
                  <motion.div 
                    key={benefit} 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 group cursor-default"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary opacity-30 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-400 group-hover:text-primary transition-colors">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </BentoItem>
          </BentoGrid>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <Features />

      {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-32 px-4 bg-slate-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <Badge className="bg-primary/5 text-primary border-primary/10 mb-4 px-4 py-1">Community Love</Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Voices of <span className="text-gradient">Wellness</span></h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-accent text-accent" />)}
              </div>
              <span className="font-bold text-slate-900 ml-2">4.9/5 Average</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <MoringaCard key={t.name} delay={idx * 0.15} className="p-10 bg-white border-slate-100 italic flex flex-col">
                <div className="flex mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8 flex-1">"{t.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{t.location}</div>
                  </div>
                </div>
              </MoringaCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG PREVIEW ─────────────────────────────────────────── */}
      <section className="py-32 px-4 relative overflow-hidden bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-20">
            <div className="max-w-2xl">
              <Badge className="bg-primary/5 text-primary border-primary/10 mb-4 px-4 py-1">Journal</Badge>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">The <span className="text-gradient">Green Book</span></h2>
            </div>
            <Link href="/blog" className="group">
              <Button variant="ghost" className="text-primary font-bold hover:bg-primary/5 rounded-xl gap-2 h-14 px-8">
                Read All Stories <ChevronRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
                <MoringaCard delay={idx * 0.1} className="h-full flex flex-col group-hover:scale-[1.01] transition-all">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 backdrop-blur-md text-primary border-none shadow-sm capitalize font-bold">
                        {post.cat}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                  </div>
                </MoringaCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <MoringaCard className="bg-gradient-to-br from-primary to-emerald-800 p-12 md:p-24 text-center text-white overflow-hidden shadow-2xl shadow-primary/20" glass={false}>
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0,0 Q50,20 100,0 V100 Q50,80 0,100 Z" fill="currentColor" />
              </svg>
            </div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative z-10"
            >
              <div className="inline-flex h-20 w-20 rounded-full bg-white/10 items-center justify-center mb-8">
                <Heart className="h-10 w-10 text-accent animate-pulse" />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                Embrace the <span className="text-primary-foreground italic">Miracle</span>
              </h2>
              <p className="text-emerald-50/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
                Join 500+ souls who have transformed their wellness with our farm-fresh organic moringa. Your journey to pure health starts here.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/shop">
                  <Button size="lg" className="h-16 px-10 bg-white text-primary hover:bg-emerald-50 rounded-2xl font-bold text-lg shadow-xl group">
                    Shop Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="https://wa.me/9166599895" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="h-16 px-10 border-white/20 text-white hover:bg-white/10 rounded-2xl font-bold backdrop-blur-md">
                    Chat with Us
                  </Button>
                </a>
              </div>
            </motion.div>
          </MoringaCard>
        </div>
      </section>
    </>
  )
}