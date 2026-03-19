"use client"

import { useCart } from "@/lib/store/cart"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart()
  const shipping = totalPrice() >= 499 ? 0 : 49
  const grandTotal = totalPrice() + shipping

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="h-7 w-7 text-green-600" />
          Shopping Cart
          {totalItems() > 0 && (
            <span className="text-lg font-normal text-gray-500">({totalItems()} items)</span>
          )}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-12 w-12 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some organic moringa products to get started!</p>
            <Link href="/shop">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Browse Products <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">{item.productName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.variantWeight}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</div>
                        {item.comparePrice && (
                          <div className="text-xs text-gray-400 line-through">
                            ₹{(item.comparePrice * item.quantity).toFixed(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link href="/shop" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium mt-2">
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
              </Link>
            </div>

            {/* Order summary */}
            <div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

                {shipping > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-700">
                    🚚 Add ₹{(499 - totalPrice()).toFixed(0)} more for <strong>FREE delivery</strong>
                  </div>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({totalItems()} items)</span>
                    <span>₹{totalPrice().toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-gray-900 text-lg">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(0)}</span>
                  </div>
                  <p className="text-xs text-gray-400">Including all taxes</p>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base">
                    Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-4 mt-4">
                  {["🔒 Secure", "✅ Razorpay", "🏦 UPI / Cards"].map((b) => (
                    <span key={b} className="text-xs text-gray-400">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
