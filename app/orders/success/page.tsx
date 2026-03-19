import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ShoppingBag, Package } from "lucide-react"

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-1">Thank you for your order 🌿</p>
        {searchParams.orderId && (
          <p className="text-xs text-gray-400 font-mono mb-6">
            Order ID: {searchParams.orderId.slice(0, 12)}...
          </p>
        )}
        <p className="text-sm text-gray-600 mb-8 bg-green-50 rounded-xl p-4">
          Your organic moringa products will be shipped within <strong>1–2 business days</strong>.
          You will receive an SMS/email with tracking details.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/profile/orders">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2">
              <Package className="h-4 w-4" /> Track My Order
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline" className="w-full gap-2">
              <ShoppingBag className="h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
