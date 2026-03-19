import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Star } from "lucide-react"
import ProductCard from "@/components/shop/ProductCard"
import SortSelect from "@/components/shop/SortSelect"

export const metadata: Metadata = {
  title: "Shop Organic Moringa Products | Shigruvedas",
  description: "Browse our range of organic moringa powder, fresh leaves, and drumsticks. Multiple weight options, competitive pricing, free delivery across India.",
}

// Static product data (replace with DB fetch once Supabase is configured)
const PRODUCTS = [
  {
    id: "1",
    name: "Organic Moringa Powder",
    slug: "organic-moringa-powder",
    short_description: "Pure organic moringa leaf powder, stone-ground for maximum nutrition. Perfect for smoothies, cooking & supplements.",
    category: "moringa-powder",
    thumbnail: "/images/powder2.png",
    is_featured: true,
    avg_rating: 4.9,
    review_count: 67,
    product_variants: [
      { id: "v1-100", weight: "100g", price: 149, compare_price: 199, stock: 120 },
      { id: "v1-250", weight: "250g", price: 329, compare_price: 449, stock: 80 },
      { id: "v1-500", weight: "500g", price: 599, compare_price: 799, stock: 60 },
      { id: "v1-1kg", weight: "1kg", price: 1099, compare_price: 1499, stock: 40 },
    ],
  },
  {
    id: "2",
    name: "Fresh Organic Moringa Leaves",
    slug: "fresh-organic-moringa-leaves",
    short_description: "Daily fresh-harvested moringa leaves from our certified organic farm in Rajasthan, rich in 90+ nutrients.",
    category: "moringa-leaves",
    thumbnail: "/images/leaves2.png",
    is_featured: true,
    avg_rating: 4.8,
    review_count: 45,
    product_variants: [
      { id: "v2-100", weight: "100g", price: 99, compare_price: 149, stock: 150 },
      { id: "v2-250", weight: "250g", price: 219, compare_price: 299, stock: 100 },
      { id: "v2-500", weight: "500g", price: 399, compare_price: 549, stock: 75 },
      { id: "v2-1kg", weight: "1kg", price: 749, compare_price: 999, stock: 50 },
    ],
  },
  {
    id: "3",
    name: "Fresh Moringa Drumsticks",
    slug: "fresh-moringa-drumsticks",
    short_description: "Tender moringa pods perfect for traditional Indian sambar, sabzi and curries. High fiber, rich in vitamins.",
    category: "drumsticks",
    thumbnail: "/images/drumstick2.png",
    is_featured: false,
    avg_rating: 4.7,
    review_count: 38,
    product_variants: [
      { id: "v3-250", weight: "250g", price: 89, compare_price: 119, stock: 200 },
      { id: "v3-500", weight: "500g", price: 169, compare_price: 219, stock: 150 },
      { id: "v3-1kg", weight: "1kg", price: 299, compare_price: 399, stock: 100 },
    ],
  },
]

const CATEGORIES = [
  { value: "all", label: "All Products" },
  { value: "moringa-powder", label: "Moringa Powder" },
  { value: "moringa-leaves", label: "Moringa Leaves" },
  { value: "drumsticks", label: "Drumsticks" },
]

export default function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string }
}) {
  const activeCategory = searchParams.category || "all"
  const activeSort = searchParams.sort || "featured"

  const filtered = PRODUCTS
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .sort((a, b) => {
      if (activeSort === "price-asc")
        return (a.product_variants[0]?.price || 0) - (b.product_variants[0]?.price || 0)
      if (activeSort === "price-desc")
        return (b.product_variants[0]?.price || 0) - (a.product_variants[0]?.price || 0)
      if (activeSort === "rating") return (b.avg_rating || 0) - (a.avg_rating || 0)
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
        <p className="text-sm text-gray-500 mb-6">{filtered.length} products found</p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product as any} />
          ))}
        </div>

        {filtered.length === 0 && (
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
