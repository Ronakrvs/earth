import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Star } from "lucide-react"
import ProductCard from "@/components/shop/ProductCard"
import SortSelect from "@/components/shop/SortSelect"
import { createSimpleClient } from "@/lib/supabase/client"

export const metadata: Metadata = {
  title: "Shop Organic Moringa Products | Shigruvedas",
  description: "Browse our range of organic moringa powder, fresh leaves, and drumsticks. Multiple weight options, competitive pricing, free delivery across India.",
}

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "moringa-powder", label: "Moringa Powder" },
  { value: "moringa-leaves", label: "Moringa Leaves" },
  { value: "drumsticks", label: "Drumsticks" },
]

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const activeCategory = resolvedSearchParams.category || "all"
  const activeSort = resolvedSearchParams.sort || "featured"
  const supabase = createSimpleClient()
  
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
    console.error("Error fetching products:", error)
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
    // featured first
    return Number(b.is_featured) - Number(a.is_featured)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white/20 rounded-full p-3">
              <Leaf className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Organic Moringa Products</h1>
          <p className="text-green-100 max-w-xl mx-auto">
            Direct from our 7+ acre certified organic farm in Udaipur, Rajasthan. Free delivery on orders above ₹499.
          </p>
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-green-100">
            {["100% Organic", "Free Delivery ₹499+", "Chemical-Free", "Farm to Table"].map((b) => (
              <div key={b} className="flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/shop?category=${cat.value}`}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat.value
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-600"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Sort */}
          <SortSelect defaultValue={activeSort} />
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-6">{sortedProducts.length} products found</p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">No products found in this category.</p>
            <Link href="/shop">
              <Button variant="outline" className="mt-4">View All Products</Button>
            </Link>
          </div>
        )}

        {/* B2B CTA */}
        <div className="mt-16 bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Need Bulk Quantities?</h2>
          <p className="text-green-100 mb-4">Get exclusive wholesale pricing for B2B orders. Minimum 5kg orders welcome.</p>
          <Link href="/b2b">
            <Button variant="secondary" className="font-semibold">
              Explore B2B Pricing →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
