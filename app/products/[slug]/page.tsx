import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import ProductDetailClient from "@/components/shop/ProductDetailClient"
import ProductCard from "@/components/shop/ProductCard"

const PRODUCTS: Record<string, any> = {
  "organic-moringa-powder": {
    id: "1",
    name: "Organic Moringa Powder",
    slug: "organic-moringa-powder",
    description: "Premium quality sun-dried and stone-ground moringa powder made from certified organic moringa leaves grown on our 7+ acre farm in Udaipur, Rajasthan. Rich in 90+ nutrients including 7x more Vitamin C than oranges, 4x more Calcium than milk, and 2x more Protein than yogurt. Perfect for smoothies, cooking, and daily health supplements. Our traditional cold-processing method preserves the maximum nutritional value.",
    category: "moringa-powder",
    thumbnail: "/images/powder2.png",
    images: [],
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
  "fresh-organic-moringa-leaves": {
    id: "2",
    name: "Fresh Organic Moringa Leaves",
    slug: "fresh-organic-moringa-leaves",
    description: "Hand-picked daily from our organic moringa farm in Rajasthan, these fresh moringa leaves are the most nutritionally dense food on the planet. Read in vitamins, minerals and amino acids. Perfect for cooking traditional Indian dishes, making moringa tea, or fresh consumption. Cold-chain delivery ensures maximum freshness and nutrition.",
    category: "moringa-leaves",
    thumbnail: "/images/leaves2.png",
    images: [],
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
  "fresh-moringa-drumsticks": {
    id: "3",
    name: "Fresh Moringa Drumsticks",
    slug: "fresh-moringa-drumsticks",
    description: "Young, tender moringa drumstick pods harvested at peak maturity from our organic farm. Essential ingredient for South Indian sambar and North Indian sabzi. Rich in dietary fiber, folate, and magnesium. Our drumsticks are packed fresh within hours of harvest for maximum nutrition and flavor.",
    category: "drumsticks",
    thumbnail: "/images/drumstick2.png",
    images: [],
    is_featured: false,
    avg_rating: 4.7,
    review_count: 38,
    product_variants: [
      { id: "v3-250", weight: "250g", price: 89, compare_price: 119, stock: 200 },
      { id: "v3-500", weight: "500g", price: 169, compare_price: 219, stock: 150 },
      { id: "v3-1kg", weight: "1kg", price: 299, compare_price: 399, stock: 100 },
    ],
  },
}

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = PRODUCTS[params.slug]
  if (!product) return {}
  return {
    title: `${product.name} | Shigruvedas`,
    description: product.description.slice(0, 155),
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = PRODUCTS[params.slug]
  if (!product) notFound()

  const related = Object.values(PRODUCTS).filter(
    (p: any) => p.slug !== params.slug && p.category === product.category ||
    (p.category !== product.category && p.is_featured)
  ).slice(0, 3) as any[]

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
        {related.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
