import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, Search, Edit, Eye, 
  ChevronLeft, Package, ShoppingBag,
  Trash2, Filter
} from "lucide-react"
import { createAdminClient } from "@/lib/supabase/server"
import DeleteProductButton from "@/components/admin/DeleteProductButton"

export default async function AdminProductsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")
  
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  if (session?.user?.role !== "admin" && profile?.role !== "admin") redirect("/")

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-amber-700" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Management</h1>
            <p className="text-slate-500 font-medium text-sm">Add and manage your moringa products.</p>
          </div>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold px-6 h-12 flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Search bar */}
        <div className="flex gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 bg-white shadow-sm"
            />
          </div>
          <Button variant="outline" className="rounded-2xl border-slate-100 h-11 px-4 text-slate-500">
            <Filter className="h-4 w-4 mr-2" /> Filter
          </Button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto text-slate-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/50">
                  <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Product</th>
                  <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Category</th>
                  <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Price Range</th>
                  <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Stock</th>
                  <th className="text-left p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Status</th>
                  <th className="text-right p-6 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {processedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{product.variantCount} Variants</div>
                    </td>
                    <td className="p-6">
                      <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-600 border-none font-bold text-[10px] tracking-wide">
                        {product.category.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="p-6 font-bold text-slate-700">
                      ₹{product.minPrice} – ₹{product.maxPrice}
                    </td>
                    <td className="p-6">
                      <span className={cn(
                        "font-bold text-xs px-2.5 py-1 rounded-lg",
                        product.totalStock < 10 ? "bg-red-50 text-red-600" : "bg-slate-50 text-slate-500"
                      )}>
                        {product.totalStock} in stock
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-1.5 w-1.5 rounded-full", product.is_active ? "bg-green-500" : "bg-slate-300")} />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{product.is_active ? "Active" : "Archived"}</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/products/${product.slug}`}>
                          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
