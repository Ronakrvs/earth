import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Star, ArrowRight } from "lucide-react"
import ProductCard from "@/components/shop/ProductCard"
import BundleCard from "@/components/shop/BundleCard"
import SortSelect from "@/components/shop/SortSelect"
import { createAdminClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "moringa-powder", label: "Moringa Powder" },
  { value: "moringa-leaves", label: "Moringa Leaves" },
  // { value: "drumsticks", label: "Drumsticks" },
]

export const metadata: Metadata = {
  title: "Shop Organic Moringa Products | Shigruvedas",
  description: "Browse our range of organic moringa powder, fresh leaves, and drumsticks. Multiple weight options, competitive pricing, free delivery across India.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const activeCategory = resolvedSearchParams.category || "all"
  const activeSort = resolvedSearchParams.sort || "featured"
  const supabase = await createAdminClient()
  
  // Fetch settings for feature toggles
  const { data: settingsData, error: settingsError } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "config")
    .maybeSingle()
  
  // Default to enabled features if settings table is missing or doesn't have the config key
  const config = settingsData?.value || {
    announcement_text: "🌿 Premium Organic Moringa - Farm Fresh & Nutrient Dense",
    announcement_link: "/shop",
    subscription_enabled: true,
    referral_enabled: true,
    loyalty_enabled: true,
    coupon_enabled: true,
    bundles_enabled: true
  }
  
  // Conditional Bundles Fetch
  let bundles: any[] = []
  if (config.bundles_enabled !== false) {
    const { data: bData } = await supabase
      .from("bundles")
      .select(`
        *,
        bundle_items (
          product_variants ( price )
        )
      `)
      .eq("is_active", true)
    bundles = bData || []
  }

  let query = supabase
    .from("products")
    .select(`
      *,
      product_variants (*)
    `)
    .eq("is_active", true)

  if (activeCategory !== "all") {
    query = query.eq("category", activeCategory)
  }

  const { data: products, error } = await query

  if (error) {
    console.error("Shop page products error:", error.message)
  }

  const sortedProducts = [...(products || [])].sort((a, b) => {
    if (activeSort === "price-asc") {
      const priceA = Math.min(...a.product_variants.map((v: any) => v.price))
      const priceB = Math.min(...b.product_variants.map((v: any) => v.price))
      return priceA - priceB
    }
    if (activeSort === "price-desc") {
      const priceA = Math.min(...a.product_variants.map((v: any) => v.price))
      const priceB = Math.min(...b.product_variants.map((v: any) => v.price))
      return priceB - priceA
    }
    return Number(b.is_featured) - Number(a.is_featured)
  })

  return (
    <div className="min-h-screen bg-background">
      {/* ─── SHOP HERO ────────────────────────────────────────────── */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase text-primary mb-8"
            >
              <Leaf className="h-3 w-3" /> Botanical Marketplace
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-none"
            >
              Shop the <span className="text-gradient">Miracle</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed"
            >
              Experience the world's most nutrient-dense superfood, harvested with care and delivered fresh from our certified organic farm.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ─── CONTROLS & GRID ──────────────────────────────────────── */}
      <section className="pb-32 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Controls Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 mb-10 lg:mb-16 py-4 lg:py-6 border-y border-slate-100/50">
            {/* Category Navigation */}
            <div className="flex flex-wrap items-center justify-center gap-2 w-full lg:w-auto">
              {CATEGORIES.map((cat, idx) => (
                <Link
                  key={cat.value}
                  href={`/shop?category=${cat.value}`}
                  className={cn(
                    "px-5 py-2.5 sm:px-6 rounded-2xl text-[12px] sm:text-[13px] font-black uppercase tracking-wider transition-all duration-300 min-h-[44px] flex items-center",
                    activeCategory === cat.value
                      ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105"
                      : "bg-white/50 text-slate-400 hover:text-primary hover:bg-white border border-transparent hover:border-primary/10"
                  )}
                >
                  {cat.label}
                </Link>
              ))}
              
              {config.bundles_enabled !== false && (
                <Link
                  href="/shop?category=bundles"
                  className={cn(
                    "px-5 py-2.5 sm:px-6 rounded-2xl text-[12px] sm:text-[13px] font-black uppercase tracking-wider transition-all duration-300 bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100 min-h-[44px] flex items-center",
                    activeCategory === "bundles" && "bg-amber-500 text-white border-amber-500 shadow-xl shadow-amber-200 scale-105"
                  )}
                >
                  Value Bundles
                </Link>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:block">Sort By</span>
              <SortSelect defaultValue={activeSort} />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
            <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">
              Showing {sortedProducts.length} Earth-Derived Results
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
          </div>

          {/* Product/Bundle Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-12">
            {activeCategory === "bundles" ? (
              bundles.map((bundle, idx) => (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <BundleCard bundle={bundle} />
                </motion.div>
              ))
            ) : (
              sortedProducts.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 4) * 0.1 }}
                >
                  <ProductCard product={product as any} />
                </motion.div>
              ))
            )}
          </div>

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-32">
              <div className="inline-flex h-24 w-24 rounded-full bg-slate-50 items-center justify-center mb-8">
                <Leaf className="h-10 w-10 text-slate-200" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Nature's taking a break.</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">No products found in this category. We're constantly harvesting new batches, so please check back soon.</p>
              <Link href="/shop">
                <Button variant="outline" className="h-14 px-10 rounded-2xl border-primary/20 text-primary font-bold hover:bg-primary/5">
                  Clear All Filters
                </Button>
              </Link>
            </div>
          )}

          {/* ─── B2B CALLOUT ────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-32"
          >
            <MoringaCard className="bg-gradient-to-br from-primary to-emerald-800 p-8 sm:p-12 md:p-20 text-center text-white overflow-hidden relative border-none" glass={false}>
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,0 Q50,20 100,0 V100 Q50,80 0,100 Z" fill="currentColor" />
                </svg>
              </div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <div className="inline-flex h-14 w-14 rounded-2xl bg-white/10 items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-accent fill-accent" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter italic">Bulk Wholesale Inquiries</h2>
                <p className="text-emerald-100/70 text-lg mb-10 font-medium">Looking for bulk quantities for your business or retail store? Access exclusive B2B pricing and wholesale rates directly from the source.</p>
                <Link href="/b2b">
                  <Button size="lg" className="h-16 px-10 bg-white text-primary hover:bg-emerald-50 rounded-2xl font-bold text-lg shadow-2xl group">
                    Explore B2B Pricing <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </MoringaCard>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
