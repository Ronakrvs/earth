"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Star, LayoutGrid } from "lucide-react"
import { MoringaCard } from "@/components/ui/moringa-card"

export default function BundleCard({ bundle }: { bundle: any }) {
  return (
    <Link href={`/products/bundle/${bundle.slug}`} className="block group">
      <MoringaCard className="overflow-hidden border-slate-100 shadow-sm group-hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white" glass={true}>
        <div className="aspect-[4/5] relative bg-slate-50 flex items-center justify-center overflow-hidden">
          {bundle.image_url ? (
            <Image
              src={bundle.image_url}
              alt={bundle.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <LayoutGrid className="h-20 w-20 text-slate-100" />
          )}
          
          <div className="absolute top-6 left-6 flex flex-col gap-2">
            <Badge className="w-fit bg-amber-500 text-white border-none px-4 py-1.5 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-200">
              Value Bundle
            </Badge>
            <Badge className="w-fit bg-white/90 backdrop-blur-md text-primary border-none px-4 py-1.5 font-black uppercase text-[10px] tracking-widest shadow-sm">
              {bundle.discount_pct}% OFF
            </Badge>
          </div>
        </div>

        <div className="p-8 space-y-4">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
              {bundle.name}
            </h3>
            <p className="text-sm text-slate-400 font-medium truncate">
               Complete {bundle.name.split(' ')[0]} experience
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest line-through decoration-slate-200">
                Premium Value
              </span>
              <span className="text-2xl font-black text-primary italic tracking-tighter">
                Bundle Deal
              </span>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
        </div>
      </MoringaCard>
    </Link>
  )
}
