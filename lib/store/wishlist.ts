import { create } from "zustand"

interface WishlistStore {
  productIds: Set<string>
  loaded: boolean
  load: () => Promise<void>
  toggle: (productId: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  productIds: new Set(),
  loaded: false,

  async load() {
    if (get().loaded) return
    try {
      const res = await fetch("/api/wishlist")
      if (!res.ok) return
      const { productIds } = await res.json()
      set({ productIds: new Set(productIds), loaded: true })
    } catch {
      set({ loaded: true })
    }
  },

  async toggle(productId) {
    const { productIds } = get()
    const wishlisted = productIds.has(productId)

    // Optimistic update
    const next = new Set(productIds)
    if (wishlisted) next.delete(productId)
    else next.add(productId)
    set({ productIds: next })

    try {
      const res = await fetch("/api/wishlist", {
        method: wishlisted ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })
      if (!res.ok) {
        // Revert on failure
        set({ productIds })
      }
    } catch {
      set({ productIds })
    }
  },

  isWishlisted(productId) {
    return get().productIds.has(productId)
  },
}))
