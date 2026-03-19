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
        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300"
        defaultValue={defaultValue}
        onChange={handleChange}
      >
        <option value="featured">Featured</option>
        <option value="rating">Top Rated</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  )
}
