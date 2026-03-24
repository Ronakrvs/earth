"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"

export default function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", e.target.value)
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <SlidersHorizontal className="h-4 w-4 text-gray-400" />
      <select
        className="text-[xs] font-bold border border-primary/10 rounded-xl px-4 py-2 bg-white/50 backdrop-blur-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer hover:bg-white"
        defaultValue={defaultValue}
        onChange={handleChange}
      >
        <option value="featured">✨ Featured First</option>
        <option value="rating">⭐️ Top Rated</option>
        <option value="price-asc">📈 Price: Low to High</option>
        <option value="price-desc">📉 Price: High to Low</option>
      </select>
    </div>
  )
}
