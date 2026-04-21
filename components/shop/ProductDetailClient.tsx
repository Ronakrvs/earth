"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Star, Shield, Truck, Leaf, RotateCcw, CheckCircle2, RefreshCw, ChevronDown } from "lucide-react"
import { useCart } from "@/lib/store/cart"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
  subscriptionEnabled?: boolean
}

export default function ProductDetailClient({ product, subscriptionEnabled = true }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(
    product.product_variants.find((v) => v.stock > 0) || product.product_variants[0]
  )
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.thumbnail)
  const [subscribeMode, setSubscribeMode] = useState(false)
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
    toast.success("Added to your collection!", {
        description: `${product.name} (${selectedVariant.weight}) has been added.`,
        action: { label: "View Cart", onClick: openCart },
    })
  }

  const allImages = [product.thumbnail, ...product.images.filter((i) => i !== product.thumbnail)]

  return (
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
      {/* ─── IMAGE GALLERY ───────────────────────────────────────── */}
      <div className="space-y-6">
        <motion.div 
          layoutId={`image-${product.slug}`}
          className="relative aspect-square bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50 group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-contain p-12 group-hover:scale-110 transition-transform duration-1000 ease-out"
                priority
              />
            </motion.div>
          </AnimatePresence>
          
          {discount > 0 && (
            <div className="absolute top-8 left-8">
              <Badge className="bg-primary text-white font-black px-4 py-1.5 rounded-xl shadow-lg shadow-primary/30">
                {discount}% OFF
              </Badge>
            </div>
          )}
        </motion.div>

        {allImages.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-2">
            {allImages.map((img, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveImage(img)}
                className={cn(
                  "flex-shrink-0 w-24 h-24 rounded-[24px] border-2 overflow-hidden transition-all duration-300 bg-white",
                  activeImage === img 
                    ? "border-primary shadow-xl shadow-primary/10" 
                    : "border-slate-100 hover:border-primary/30 shadow-sm"
                )}
              >
                <Image src={img} alt="" width={96} height={96} className="w-full h-full object-contain p-3" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* ─── PRODUCT INFO ───────────────────────────────────────── */}
      <div className="flex flex-col pt-4">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-4 py-1.5 font-black uppercase tracking-widest text-[10px]">
                    <Leaf className="h-3.5 w-3.5 mr-2" />
                    {product.category.replace("-", " ")}
                </Badge>
                {selectedVariant.stock > 0 ? (
                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-4 py-1.5 font-bold text-[10px]">
                        IN STOCK & READY
                    </Badge>
                ) : (
                    <Badge className="bg-red-50 text-red-600 border-red-100 px-4 py-1.5 font-bold text-[10px]">
                        OUT OF STOCK
                    </Badge>
                )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                {product.name}
            </h1>

            {/* Rating Summary */}
            <div className="flex items-center gap-4 mb-10">
                <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-xl">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-2" />
                    <span className="text-sm font-black text-amber-700">{product.avg_rating || "4.9"}</span>
                </div>
                <span className="text-sm font-bold text-slate-400 tracking-wide uppercase">
                    From {product.review_count || "124"} Souls
                </span>
            </div>

            <div className="bg-slate-50/50 rounded-[32px] p-8 md:p-10 border border-slate-100 mb-10">
                {/* Price Display */}
                <div className="flex items-baseline gap-4 mb-8">
                    <span className="text-5xl font-black text-slate-900">₹{selectedVariant.price}</span>
                    {selectedVariant.compare_price && (
                        <span className="text-2xl text-slate-300 line-through font-bold">₹{selectedVariant.compare_price}</span>
                    )}
                </div>

                {/* Subscribe / One-time toggle */}
                {subscriptionEnabled && (
                    <div className="mb-8">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Purchase Option</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setSubscribeMode(false)}
                                className={cn(
                                    "rounded-2xl border-2 p-4 text-left transition-all duration-200",
                                    !subscribeMode
                                        ? "border-primary bg-primary/5"
                                        : "border-slate-100 bg-white hover:border-primary/30"
                                )}
                            >
                                <p className={`text-sm font-black ${!subscribeMode ? "text-primary" : "text-slate-700"}`}>One-time</p>
                                <p className="text-xl font-black text-slate-900 mt-1">₹{selectedVariant.price}</p>
                            </button>
                            <button
                                onClick={() => setSubscribeMode(true)}
                                className={cn(
                                    "rounded-2xl border-2 p-4 text-left transition-all duration-200 relative overflow-hidden",
                                    subscribeMode
                                        ? "border-primary bg-primary/5"
                                        : "border-slate-100 bg-white hover:border-primary/30"
                                )}
                            >
                                <span className="absolute top-2 right-2 bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded-lg">SAVE 15%</span>
                                <p className={`text-sm font-black ${subscribeMode ? "text-primary" : "text-slate-700"}`}>
                                    <RefreshCw className="h-3 w-3 inline mr-1" />Subscribe
                                </p>
                                <p className="text-xl font-black text-slate-900 mt-1">
                                    ₹{Math.round(selectedVariant.price * 0.85)}
                                    <span className="text-sm font-medium text-slate-400">/mo</span>
                                </p>
                            </button>
                        </div>
                        {subscribeMode && (
                            <p className="text-xs text-slate-500 font-medium mt-2 px-1">📦 Delivered every 30 days · Cancel or pause any time</p>
                        )}
                    </div>
                )}

                {/* Variant Selector */}
                <div className="mb-10">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Select Pack Size</p>
                    <div className="flex flex-wrap gap-3">
                        {product.product_variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={() => { setSelectedVariant(variant); setQuantity(1) }}
                                disabled={variant.stock === 0}
                                className={cn(
                                    "px-6 py-4 rounded-2xl border-2 text-sm font-bold transition-all duration-300 min-w-[100px]",
                                    selectedVariant.id === variant.id
                                        ? "border-primary bg-primary text-white shadow-xl shadow-primary/20"
                                        : variant.stock === 0
                                        ? "border-slate-100 text-slate-300 bg-slate-50/50 cursor-not-allowed"
                                        : "border-slate-100 text-slate-600 bg-white hover:border-primary/30 hover:shadow-md"
                                )}
                            >
                                {variant.weight}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Row */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center h-16 bg-white border-2 border-slate-100 rounded-2xl px-2">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
                        >
                            <Minus className="h-5 w-5" />
                        </button>
                        <span className="flex-1 text-center font-black text-slate-900 min-w-[50px]">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-primary"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>
                    <Button
                        size="lg"
                        className="flex-1 h-16 bg-primary hover:bg-primary-dark text-white font-black text-lg rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95 gap-3"
                        onClick={handleAddToCart}
                        disabled={selectedVariant.stock === 0}
                    >
                        <ShoppingCart className="h-6 w-6" />
                        {selectedVariant.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                    </Button>
                </div>
            </div>

            {/* Trust Manifest */}
            <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                    { icon: Truck, text: "Zen Delivery", sub: "Free over ₹499" },
                    { icon: Shield, text: "Purely Organic", sub: "USDA Certified" },
                    { icon: Leaf, text: "Direct Farm", sub: "Udaipur, RJ" },
                    { icon: RotateCcw, text: "Soul Promise", sub: "Easy Returns" },
                ].map(({ icon: Icon, text, sub }) => (
                    <div key={text} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200 transition-all duration-500">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-primary/10 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{text}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Product Story */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <Separator className="flex-1 bg-slate-100" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">The Story</span>
                    <Separator className="flex-1 bg-slate-100" />
                </div>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-500 text-lg leading-relaxed font-medium mb-6">
                        {product.description}
                    </p>
                    <div className="grid gap-4">
                        {[
                            "Grown in mineral-rich Aravali soil",
                            "Sun-dried to preserve core nutrients",
                            "Zero synthetic additives or pesticides",
                            "Freshly packed for maximal potency"
                        ].map((point) => (
                            <div key={point} className="flex items-center gap-3 text-slate-900 font-bold">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span>{point}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Accordion */}
            <div className="mt-10">
                <div className="flex items-center gap-4 mb-6">
                    <Separator className="flex-1 bg-slate-100" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">FAQs</span>
                    <Separator className="flex-1 bg-slate-100" />
                </div>
                <div className="space-y-3">
                    {[
                        { q: "How do I use this product daily?", a: "Take 1 teaspoon (4–5g) daily. Mix into warm water, smoothies, dal, or any recipe. Start with ½ tsp for the first week." },
                        { q: "Is it safe during pregnancy?", a: "Moringa leaves and powder are generally considered safe. However, please consult your doctor before use during pregnancy or while breastfeeding." },
                        { q: "What is the shelf life?", a: "18 months sealed. Once opened, store in a cool dry place and use within 6 months for best results. Do not refrigerate." },
                        { q: "Do you have lab test reports?", a: "Yes. Every batch is third-party lab tested. Request the current batch COA via WhatsApp (+91 91665 99895) or email." },
                        { q: "What if I'm not satisfied?", a: "We offer hassle-free returns within 7 days for unopened products. For quality issues, we replace immediately — no questions asked." },
                    ].map((faq, i) => (
                        <details key={i} className="group rounded-2xl border border-slate-100 bg-slate-50/50 overflow-hidden">
                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none font-bold text-slate-900 hover:text-primary transition-colors gap-4">
                                <span className="text-sm">{faq.q}</span>
                                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                            </summary>
                            <div className="px-5 pb-5 text-slate-500 text-sm leading-relaxed font-medium border-t border-slate-100 pt-3">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  )
}
