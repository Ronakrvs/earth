"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Leaf } from "lucide-react"
import { useCart } from "@/lib/store/cart"
import { toast } from "sonner"
import WishlistButton from "@/components/WishlistButton"

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

import { MoringaCard } from "@/components/ui/moringa-card"

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
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <MoringaCard className="flex flex-col h-full bg-white/50 border-primary/5 hover:bg-white transition-all overflow-hidden" glass={true}>
        {/* Image Display */}
        <div className="relative aspect-[4/5] bg-gradient-to-br from-secondary/30 to-background overflow-hidden">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && (
              <Badge className="bg-white/90 backdrop-blur-md text-primary border-none shadow-sm font-black px-3 py-1 text-[10px] uppercase tracking-widest">
                <Leaf className="h-3 w-3 mr-1" /> Featured
              </Badge>
            )}
            {discount > 0 && (
              <Badge className="bg-accent text-white border-none shadow-sm font-black px-3 py-1 text-[10px] uppercase tracking-widest">
                -{discount}% OFF
              </Badge>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <WishlistButton productId={product.id} size="sm" />
          </div>
        </div>

        {/* Product Information */}
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-2">
            <h3 className="font-extrabold text-slate-900 group-hover:text-primary transition-colors line-clamp-1 text-lg tracking-tight">
              {product.name}
            </h3>
            <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest">{product.category.replace("-", " ")}</p>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed flex-1">
            {product.short_description}
          </p>

          {/* Rating & Price Row */}
          <div className="flex items-center justify-between mb-6 pt-4 border-t border-slate-100">
            <div>
              {cheapestVariant ? (
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900 leading-none">₹{cheapestVariant.price}</span>
                    {cheapestVariant.compare_price && (
                      <span className="text-sm text-slate-400 line-through font-medium">₹{cheapestVariant.compare_price}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{cheapestVariant.weight}</span>
                </div>
              ) : (
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Out of stock</p>
              )}
            </div>
            
            {product.avg_rating && (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs font-black text-slate-900 ml-1">{product.avg_rating}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold">({product.review_count})</span>
              </div>
            )}
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-12 shadow-lg shadow-primary/10 transition-all active:scale-95 group/btn"
            onClick={handleAddToCart}
            disabled={!cheapestVariant}
          >
            <ShoppingCart className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            Add to Cart
          </Button>
        </div>
      </MoringaCard>
    </Link>
  )
}
