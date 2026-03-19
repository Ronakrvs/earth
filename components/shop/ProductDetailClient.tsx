"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Star, Shield, Truck, Leaf, RotateCcw } from "lucide-react"
import { useCart } from "@/lib/store/cart"
import { toast } from "sonner"

interface Variant {
  id: string
  weight: string
  price: number
  compare_price?: number
  stock: number
}

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    category: string
    thumbnail: string
    images: string[]
    product_variants: Variant[]
    avg_rating?: number
    review_count?: number
  }
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.product_variants.find((v) => v.stock > 0) || product.product_variants[0]
  )
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.thumbnail)
  const addItem = useCart((s) => s.addItem)
  const openCart = useCart((s) => s.openCart)

  const discount = selectedVariant.compare_price
    ? Math.round(((selectedVariant.compare_price - selectedVariant.price) / selectedVariant.compare_price) * 100)
    : 0

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantWeight: selectedVariant.weight,
      price: selectedVariant.price,
      comparePrice: selectedVariant.compare_price,
      image: product.thumbnail,
      quantity,
      slug: product.slug,
    })
    toast.success("Added to cart!", {
      action: { label: "View Cart", onClick: openCart },
    })
  }

  const allImages = [product.thumbnail, ...product.images.filter((i) => i !== product.thumbnail)]

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
      {/* Image gallery */}
      <div className="space-y-4">
        <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden border border-gray-100">
          <Image
            src={activeImage}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-contain p-8"
            priority
          />
        </div>
        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                  activeImage === img ? "border-green-500" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div>
        {/* Category badge */}
        <Badge variant="secondary" className="bg-green-100 text-green-700 mb-3 capitalize">
          <Leaf className="h-3 w-3 mr-1" />
          {product.category.replace("-", " ")}
        </Badge>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

        {/* Rating */}
        {product.avg_rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.avg_rating!) ? "fill-amber-400 text-amber-400" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{product.avg_rating}</span>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm text-gray-500">{product.review_count} reviews</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold text-gray-900">₹{selectedVariant.price}</span>
          {selectedVariant.compare_price && (
            <span className="text-xl text-gray-400 line-through">₹{selectedVariant.compare_price}</span>
          )}
          {discount > 0 && (
            <Badge className="bg-orange-100 text-orange-700 text-sm">{discount}% off</Badge>
          )}
        </div>

        {/* Variant selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Select Weight: <span className="text-green-600">{selectedVariant.weight}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.product_variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => { setSelectedVariant(variant); setQuantity(1) }}
                disabled={variant.stock === 0}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                  selectedVariant.id === variant.id
                    ? "border-green-500 bg-green-50 text-green-700"
                    : variant.stock === 0
                    ? "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:border-green-300"
                }`}
              >
                {variant.weight}
                {variant.stock === 0 && <span className="ml-1 text-xs">(OOS)</span>}
                {variant.stock > 0 && variant.stock <= 20 && (
                  <span className="ml-1 text-xs text-orange-500">({variant.stock} left)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity + Add to cart */}
        <div className="flex gap-3 mb-6">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-3 hover:bg-gray-100 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-3 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
              className="px-3 py-3 hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2 h-12"
            onClick={handleAddToCart}
            disabled={selectedVariant.stock === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            {selectedVariant.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { icon: Truck, text: "Free delivery on ₹499+" },
            { icon: Shield, text: "100% Certified Organic" },
            { icon: Leaf, text: "Chemical-Free Farming" },
            { icon: RotateCcw, text: "Easy Returns" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2">
              <Icon className="h-4 w-4 text-green-600 flex-shrink-0" />
              {text}
            </div>
          ))}
        </div>

        {/* Description */}
        <Separator className="mb-4" />
        <div>
          <h3 className="font-medium text-gray-900 mb-2">Product Details</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>
      </div>
    </div>
  )
}
