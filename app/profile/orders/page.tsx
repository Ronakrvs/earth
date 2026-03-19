import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Package, Clock, ChevronRight, ChevronLeft } from "lucide-react"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-cyan-100 text-cyan-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export default async function ProfileOrdersPage() {
  const session = await auth()
  if (!session) redirect("/auth/login?callbackUrl=/profile/orders")

  // Empty state shown until Supabase is connected
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/profile" className="text-gray-400 hover:text-gray-600">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-green-600" /> My Orders
          </h1>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-gray-300" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-sm text-gray-400 mb-6">
            Your order history will appear here after your first purchase.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-2 text-green-600 font-medium hover:underline text-sm">
            Start Shopping <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
