"use client"

import { useCart } from "@/lib/store/cart"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart()

  const shipping = totalPrice() >= 499 ? 0 : 49
  const grandTotal = totalPrice() + shipping

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-green-600" />
            Shopping Cart
            {totalItems() > 0 && (
              <span className="text-sm font-normal text-gray-500">({totalItems()} items)</span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="font-medium text-gray-700 mb-1">Your cart is empty</h3>
              <p className="text-sm text-gray-400 mb-6">Discover our organic moringa products</p>
              <Button
                asChild
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={closeCart}
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border">
                  <Image
                    src={item.image}
                    alt={item.productName}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.productName}</p>
                  <p className="text-xs text-gray-500 mb-2">{item.variantWeight}</p>
                  <div className="flex items-center justify-between">
                    {/* Qty controls */}
                    <div className="flex items-center gap-1 bg-white rounded-md border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-l-md transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-sm font-medium min-w-[24px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-r-md transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-white space-y-3">
            {/* Free shipping banner */}
            {shipping > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
                🚚 Add ₹{(499 - totalPrice()).toFixed(0)} more for <strong>FREE delivery</strong>
              </div>
            )}
            {shipping === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
                🎉 You qualify for <strong>FREE delivery!</strong>
              </div>
            )}

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{totalPrice().toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base pt-1">
                <span>Total</span>
                <span>₹{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            <Button
              asChild
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={closeCart}
            >
              <Link href="/checkout">
                Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={closeCart} asChild>
              <Link href="/cart">View Cart</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
