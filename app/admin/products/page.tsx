import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, Plus, Search, Edit, Eye, ChevronLeft } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/server"
import DeleteProductButton from "@/components/admin/DeleteProductButton"

export default async function AdminProductsPage() {
  const session = await auth()
  
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (profile?.role !== "admin") redirect("/")

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_variants (*)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching admin products:", error)
  }

  const processedProducts = (products || []).map(p => {
    const prices = p.product_variants.map((v: any) => v.price)
    const stock = p.product_variants.reduce((acc: number, v: any) => acc + v.stock, 0)
    return {
      ...p,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      totalStock: stock,
      variantCount: p.product_variants.length
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-gray-600">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <Package className="h-5 w-5 text-green-700" />
            <h1 className="font-bold text-gray-900">Products</h1>
          </div>
          <Link href="/admin/products/new">
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2" size="sm">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-semibold text-gray-600">Product</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Category</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Price Range</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Variants</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Total Stock</th>
                  <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                  <th className="text-right p-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {processedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{product.name}</div>
                      {product.is_featured && (
                        <span className="text-xs text-green-600">⭐ Featured</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="capitalize bg-green-50 text-green-700 text-xs">
                        {product.category.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-700">
                      ₹{product.minPrice} – ₹{product.maxPrice}
                    </td>
                    <td className="p-4 text-gray-600">{product.variantCount} sizes</td>
                    <td className="p-4">
                      <span className={product.totalStock < 50 ? "text-orange-600 font-medium" : "text-gray-700"}>
                        {product.totalStock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge className={product.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                        {product.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products/${product.slug}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4 text-gray-400" />
                          </Button>
                        </Link>
                        <DeleteProductButton id={product.id} name={product.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
