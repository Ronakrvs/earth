import { Suspense } from "react"
import { createAdminClient } from "@/lib/supabase/server"
import ProductCard from "@/components/shop/ProductCard"
import SearchBar from "@/components/SearchBar"
import { Search } from "lucide-react"

export const dynamic = "force-dynamic"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

async function SearchResults({ q }: { q: string }) {
  const supabase = await createAdminClient()

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, short_description, thumbnail, category, is_featured,
      product_variants (id, weight, price, compare_price, stock)
    `)
    .eq("is_active", true)
    .or(`name.ilike.%${q}%,short_description.ilike.%${q}%,category.ilike.%${q}%`)
    .order("is_featured", { ascending: false })
    .limit(24)

  if (error) {
    return <p className="text-muted-foreground text-center py-12">Something went wrong. Please try again.</p>
  }

  const products = (data || []).map((p) => ({
    ...p,
    product_variants: p.product_variants || [],
  }))

  if (products.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
          <Search className="h-8 w-8 text-primary/40" />
        </div>
        <h2 className="text-xl font-black text-foreground">No results for &ldquo;{q}&rdquo;</h2>
        <p className="text-muted-foreground text-sm">Try a different keyword or browse our shop.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product as any} />
      ))}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams
  const query = q.trim()

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-10 space-y-6">
          <h1 className="text-3xl font-black tracking-tighter text-foreground">
            {query ? <>Results for &ldquo;<span className="text-primary">{query}</span>&rdquo;</> : "Search Products"}
          </h1>
          <SearchBar className="max-w-xl" autoFocus={!query} />
        </div>

        {query.length >= 2 ? (
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-muted rounded-[2rem] animate-pulse" />
              ))}
            </div>
          }>
            <SearchResults q={query} />
          </Suspense>
        ) : query ? (
          <p className="text-muted-foreground text-sm">Please enter at least 2 characters.</p>
        ) : null}
      </div>
    </div>
  )
}
