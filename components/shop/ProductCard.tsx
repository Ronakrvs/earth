"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Leaf } from "lucide-react"
import { useCart } from "@/lib/store/cart"
import { toast } from "sonner"

export interface ProductVariant {
  id: string
  weight: string
  price: number
  compare_price?: number
  stock: number
}

export interface Product {
  id: string
  name: string
  slug: string
  short_description: string
  category: string
  thumbnail: string
  is_featured: boolean
  product_variants: ProductVariant[]
  avg_rating?: number
  review_count?: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem)
  const openCart = useCart((s) => s.openCart)

  const cheapestVariant = product.product_variants
    .filter((v) => v.stock > 0)
    .sort((a, b) => a.price - b.price)[0]

  const discount = cheapestVariant?.compare_price
    ? Math.round(((cheapestVariant.compare_price - cheapestVariant.price) / cheapestVariant.compare_price) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!cheapestVariant) return
    addItem({
      id: cheapestVariant.id,
      productId: product.id,
      productName: product.name,
      variantWeight: cheapestVariant.weight,
      price: cheapestVariant.price,
      comparePrice: cheapestVariant.compare_price,
      image: product.thumbnail,
      quantity: 1,
      slug: product.slug,
    })
    toast.success(`${product.name} (${cheapestVariant.weight}) added to cart!`, {
      action: { label: "View Cart", onClick: openCart },
    })
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
          {product.is_featured && (
            <Badge className="absolute top-3 left-3 bg-green-600 text-white text-xs">
              <Leaf className="h-3 w-3 mr-1" /> Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 group-hover:text-green-700 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.short_description}</p>

          {/* Rating */}
          {product.avg_rating && (
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.floor(product.avg_rating!) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.review_count})</span>
            </div>
          )}

          {/* Price */}
          {cheapestVariant ? (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900">₹{cheapestVariant.price}</span>
              {cheapestVariant.compare_price && (
                <span className="text-sm text-gray-400 line-through">₹{cheapestVariant.compare_price}</span>
              )}
              <span className="text-xs text-gray-500">{cheapestVariant.weight}</span>
            </div>
          ) : (
            <p className="text-sm text-red-500 mb-3">Out of stock</p>
          )}

          {/* Variant pills */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.product_variants.slice(0, 4).map((v) => (
              <span
                key={v.id}
                className={`text-xs px-2 py-0.5 rounded-full border ${
                  v.stock > 0
                    ? "border-gray-200 text-gray-600 bg-gray-50"
                    : "border-gray-100 text-gray-300 bg-gray-50 line-through"
                }`}
              >
                {v.weight}
              </span>
            ))}
          </div>

          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            onClick={handleAddToCart}
            disabled={!cheapestVariant}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
}
