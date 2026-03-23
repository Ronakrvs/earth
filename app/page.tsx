import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ArrowRight, Leaf, Shield, Truck, Star, CheckCircle2, Zap, Heart, Phone, ChevronRight
} from "lucide-react"
import { createSimpleClient } from "@/lib/supabase/client"
import { createAdminClient } from "@/lib/supabase/server"

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
    badgeColor: "bg-green-600",
  }))
}

async function getBlogPosts() {
  const supabase = await createAdminClient()
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

const STATS = [
  { value: "7+", label: "Acres of Organic Farm" },
  { value: "90+", label: "Nutrients in Moringa" },
  { value: "500+", label: "Happy Customers" },
  { value: "100%", label: "Chemical-Free" },
]

const FEATURES = [
  { icon: Leaf, title: "Certified Organic", desc: "No pesticides, no chemicals — ever. Our farm follows strict organic practices." },
  { icon: Truck, title: "Free Delivery ₹499+", desc: "Fast PAN-India shipping. Orders above ₹499 delivered free to your door." },
  { icon: Shield, title: "Quality Guaranteed", desc: "Lab-tested for purity. 100% satisfaction or your money back." },
  { icon: Zap, title: "Farm to Table", desc: "Harvested fresh and dispatched within 24 hours. Maximum nutrition." },
]

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    text: "The moringa powder is absolutely incredible — you can taste the freshness. My energy levels have genuinely improved within 2 weeks of using it daily.",
    avatar: "PS",
  },
  {
    name: "Rajesh Patel",
    location: "Ahmedabad",
    rating: 5,
    text: "Finally found a reliable organic moringa supplier. The drumsticks are so tender and the sambar I made was restaurant quality. Will keep ordering!",
    avatar: "RP",
  },
  {
    name: "Ananya Singh",
    location: "Delhi",
    rating: 5,
    text: "As a nutritionist I'm very particular about quality. Shigruvedas moringa is the only brand I recommend to my clients. Exceptional quality.",
    avatar: "AS",
  },
]

const BENEFITS = [
  "7× more Vitamin C than oranges",
  "4× more Calcium than milk",
  "2× more Protein than yogurt",
  "3× more Potassium than bananas",
  "25× more Iron than spinach",
  "Rich in all essential amino acids",
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
      <div className="min-h-screen bg-white">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative container mx-auto px-4 py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Certified Organic Farm, Udaipur, Rajasthan
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Pure Moringa,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                Direct from Farm
              </span>
            </h1>
            <p className="text-green-100 text-lg leading-relaxed mb-8 max-w-lg">
              Freshly harvested from our 7+ acre certified organic moringa farm. 
              No middlemen, no additives — just nature's most nutrient-dense superfood delivered to your door.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/shop">
                <Button size="lg" className="bg-white text-green-900 hover:bg-green-50 font-bold gap-2 shadow-lg">
                  Shop Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/b2b">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                  B2B Wholesale
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-green-200">
              {["✓ Free delivery ₹499+", "✓ Lab-tested quality", "✓ 100% organic"].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          {/* Hero product showcase */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Main image */}
              <div className="relative z-10 bg-gradient-to-br from-green-700/50 to-emerald-800/50 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <Image
                  src="/images/powder2.png"
                  alt="Organic Moringa Powder"
                  width={400}
                  height={400}
                  className="w-full drop-shadow-2xl"
                  priority
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 z-20 bg-white rounded-2xl shadow-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Leaf className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">100% Organic</div>
                    <div className="text-xs text-gray-500">Certified Farm</div>
                  </div>
                </div>
              </div>
              {/* Rating badge */}
              <div className="absolute -bottom-4 -left-4 z-20 bg-white rounded-2xl shadow-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <div className="text-xs font-bold text-gray-900">4.9 • 500+ reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl md:text-3xl font-extrabold text-white">{value}</div>
                  <div className="text-xs text-green-200 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-700 mb-3">Our Products</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Farm-Fresh Moringa, <span className="text-green-600">Your Way</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Choose from whole leaves, fine powder, or fresh drumsticks — all grown on our certified organic farm.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {products.map((product: any) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group">
                <div className="bg-white rounded-3xl border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 aspect-square overflow-hidden">
                    <Image
                      src={product.image || "/images/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-contain p-10 group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className={`absolute top-4 left-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full capitalize`}>
                      {product.badge}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-green-700 transition-colors uppercase">{product.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{product.desc}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-extrabold text-gray-900">{product.price}</span>
                        <span className="text-sm text-gray-400 ml-1">/ {product.weight}</span>
                      </div>
                      <span className="flex items-center gap-1 text-green-600 text-sm font-semibold group-hover:gap-2 transition-all">
                        View <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2">
                View All Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY MORINGA ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <Badge className="bg-green-100 text-green-700 mb-3">Why Moringa?</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Nature's Most <span className="text-green-600">Nutrient-Dense</span> Superfood
              </h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                Moringa oleifera is called the "Miracle Tree" for a reason. Gram for gram, it packs more vitamins, minerals, and antioxidants than almost any other plant on earth.
              </p>
              <ul className="space-y-3 mb-8">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/blog/health-benefits-moringa-powder">
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 gap-2">
                  Read the Science <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-6 text-white">
                  <div className="text-4xl font-extrabold mb-1">7×</div>
                  <div className="text-sm text-green-100">More Vitamin C than oranges</div>
                </div>
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="text-4xl font-extrabold text-gray-900 mb-1">25×</div>
                  <div className="text-sm text-gray-500">More Iron than spinach</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="text-4xl font-extrabold text-gray-900 mb-1">4×</div>
                  <div className="text-sm text-gray-500">More Calcium than milk</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 text-white">
                  <div className="text-4xl font-extrabold mb-1">90+</div>
                  <div className="text-sm text-amber-100">Total nutrients packed in</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-700 mb-3">Why Choose Us</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              The Shigruvedas Difference
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                  <Icon className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-700 mb-3">Customer Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="flex">
                {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <span>4.9 average from 500+ reviews</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:border-green-200 transition-all">
                <div className="flex mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── B2B CTA ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-900 to-emerald-800 text-white">
        <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <Badge className="bg-white/20 text-white border-white/30 mb-3">B2B Wholesale</Badge>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Need Bulk Moringa?</h2>
            <p className="text-green-100 text-sm">
              Special pricing for retailers, restaurants, ayurvedic clinics & exporters. Minimum 5kg.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <Link href="/b2b">
              <Button size="lg" className="bg-white text-green-900 hover:bg-green-50 font-bold">
                Explore B2B Plans
              </Button>
            </Link>
            <a href="tel:+919166599895">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2">
                <Phone className="h-4 w-4" /> Call Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── BLOG PREVIEW ─────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Badge className="bg-green-100 text-green-700 mb-2">From The Blog</Badge>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Health Tips & Recipes</h2>
            </div>
            <Link href="/blog" className="hidden sm:flex items-center gap-1 text-green-600 font-semibold hover:gap-2 transition-all text-sm">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <div className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden relative">
                    <Image src={post.image} alt={post.title} fill className="w-full h-full object-cover p-0 group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <Badge className="bg-green-100 text-green-700 text-xs mb-2 capitalize">{post.cat}</Badge>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-green-700 transition-colors line-clamp-2">{post.title}</h3>
                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium mt-3 group-hover:gap-2 transition-all">
                      Read more <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Start Your Moringa Journey Today
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
            Join 500+ customers who have transformed their wellness routine with our farm-fresh organic moringa. 
            Free delivery on your first order above ₹499.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 font-bold shadow-lg">
                Shop Now — Free Delivery <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://wa.me/9166599895" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 gap-2">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}