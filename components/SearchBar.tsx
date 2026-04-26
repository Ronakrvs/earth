"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  className?: string
  onClose?: () => void
  autoFocus?: boolean
}

export default function SearchBar({ className, onClose, autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
    onClose?.()
  }

  return (
    <form onSubmit={handleSubmit} className={cn("relative flex items-center", className)}>
      <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
