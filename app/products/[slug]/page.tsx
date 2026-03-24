import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import ProductDetailClient from "@/components/shop/ProductDetailClient"
import ProductCard from "@/components/shop/ProductCard"
import { createClient } from "@/lib/supabase/server"
import { createSimpleClient } from "@/lib/supabase/client"

export async function generateStaticParams() {
  const supabase = createSimpleClient()
  const { data: products } = await supabase.from("products").select("slug")
  return (products || []).map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = createSimpleClient()
  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (!product) return {}
  return {
    title: `${product.name} | Shigruvedas`,
    description: product.description?.slice(0, 155),
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = createSimpleClient()

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      product_variants (*)
    `)
    .eq("slug", slug)
    .single()

  if (!product) notFound()

  const minPrice = Math.min(...(product.product_variants?.map((v: any) => v.price) || [0]))
  const maxPrice = Math.max(...(product.product_variants?.map((v: any) => v.price) || [0]))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image_url || "https://shigruvedas.com/og-image.jpg",
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Shigruvedas"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": minPrice,
      "highPrice": maxPrice,
      "offerCount": product.product_variants?.length || 1,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "124"
    }
  }

  const { data: related } = await supabase
    .from("products")
    .select(`
      *,
      product_variants (*)
    `)
    .eq("is_active", true)
    .neq("slug", slug)
    .or(`category.eq.${product.category},is_featured.eq.true`)
    .limit(3)

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ─── BREADCRUMBS ─────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl h-14 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">
            <Home className="h-3 w-3" /> HOME
          </Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <Link href="/shop" className="hover:text-primary transition-colors">SHOP</Link>
          <ChevronRight className="h-3 w-3 opacity-30" />
          <span className="text-slate-900 truncate">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl py-12 md:py-20">
        {/* Product detail */}
        <div className="mb-32">
          <ProductDetailClient product={product} />
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <div className="relative pt-20 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="max-w-xl">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                        Complete Your <span className="text-primary italic">Healing</span> Ritual
                    </h2>
                    <p className="text-slate-500 font-medium">Elevate your wellness journey with our other sun-drenched Rajasthan treasures.</p>
                </div>
                <Link href="/shop" className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary-dark transition-colors flex items-center gap-2 group">
                    View Sanctuary <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p: any) => <ProductCard key={p.id} product={p as any} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
