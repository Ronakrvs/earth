import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Boxes, Package, Plus, Search, Tag, TrendingDown, LayoutGrid, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function BundlesAdminPage() {
  const supabase = await createAdminClient()
  
  const { data: bundles, error } = await supabase
    .from("bundles")
    .select(`
      *,
      bundle_items (
        id,
        quantity,
        products ( name ),
        product_variants ( weight )
      )
    `)
    .order("created_at", { ascending: false })

  const list = bundles || []
  const activeCount = list.filter(b => b.is_active).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight text-gradient">Product Bundles</h1>
          <p className="text-slate-500 font-medium">Create and manage curated product kits and value bundles.</p>
        </div>
        <Link href="/admin/bundles/new">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold h-12 px-6 gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> Create Bundle
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Boxes className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Bundles</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{list.length}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-emerald-50/50 border-emerald-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-800 uppercase tracking-wider">Active Kits</p>
              <h3 className="text-3xl font-black text-emerald-600 leading-none">{activeCount}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm rounded-3xl bg-white">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Avg. Discount</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">20%</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((bundle) => (
          <Card key={bundle.id} className="group overflow-hidden border-slate-100 shadow-sm rounded-3xl bg-white hover:shadow-xl hover:shadow-primary/5 transition-all">
            <div className="aspect-video relative bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
               {bundle.image_url ? (
                 <Image 
                   src={bundle.image_url} 
                   alt={bundle.name} 
                   fill 
                   className="object-cover group-hover:scale-105 transition-transform duration-500" 
                 />
               ) : (
                 <LayoutGrid className="h-12 w-12 text-slate-200" />
               )}
               <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 backdrop-blur-md text-primary border-none shadow-sm px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">
                    {bundle.discount_pct}% OFF
                  </Badge>
               </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">{bundle.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">{bundle.slug}</p>
                </div>
                {bundle.is_active ? (
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-slate-300" />
                )}
              </div>

              <div className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Bundle Items</p>
                 {bundle.bundle_items.map((item: any) => (
                   <div key={item.id} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                         <div className="h-6 w-6 rounded-lg bg-white flex items-center justify-center border border-slate-100">
                            <span className="text-[10px] font-black text-primary">{item.quantity}x</span>
                         </div>
                         <span className="text-sm font-bold text-slate-700 truncate max-w-[120px]">{item.products.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{item.product_variants?.weight || "Std"}</span>
                   </div>
                 ))}
              </div>

              <div className="mt-6 flex gap-3">
                 <Link href={`/admin/bundles/${bundle.id}`} className="flex-1">
                   <Button variant="outline" className="w-full rounded-xl h-11 font-bold text-slate-600 hover:bg-slate-50 border-slate-200">
                      Edit
                   </Button>
                 </Link>
                 <Link href={`/products/bundle/${bundle.slug}`} target="_blank" className="flex-1">
                   <Button className="w-full rounded-xl h-11 font-black bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/10">
                      Preview
                   </Button>
                 </Link>
              </div>
            </div>
          </Card>
        ))}

        {/* Add New Card Placeholder */}
        <Link href="/admin/bundles/new" className="contents">
          <button className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-12 hover:border-primary/40 hover:bg-primary/[0.02] transition-all group min-h-[400px] w-full">
             <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
             </div>
             <span className="font-black text-slate-400 group-hover:text-primary transition-colors">Create New Bundle</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
