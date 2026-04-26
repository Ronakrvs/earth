"use client"

import { useEffect } from "react"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useWishlist } from "@/lib/store/wishlist"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: "sm" | "md"
}

export default function WishlistButton({ productId, className, size = "md" }: WishlistButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { load, toggle, isWishlisted, loaded } = useWishlist()

  useEffect(() => {
    if (session) load()
  }, [session, load])

  const wishlisted = isWishlisted(productId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session) {
      router.push("/auth/login?callbackUrl=/shop")
      return
    }

    await toggle(productId)
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist")
  }

  const sizeClasses = size === "sm"
    ? "w-8 h-8"
    : "w-10 h-10"

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white/50 transition-all duration-200 hover:scale-110 active:scale-95",
        sizeClasses,
        className
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={cn(iconSize, "transition-colors duration-200", wishlisted
          ? "fill-rose-500 text-rose-500"
          : "text-slate-400 hover:text-rose-400"
        )}
      />
    </button>
  )
}
