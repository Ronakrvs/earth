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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-green-600 flex items-center gap-1">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/shop" className="hover:text-green-600">Shop</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800 font-medium truncate">{product.name}</span>
        </nav>

        {/* Product detail */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-100 mb-10">
          <ProductDetailClient product={product} />
        </div>

        {/* Related products */}
        {related && related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p: any) => <ProductCard key={p.id} product={p as any} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
