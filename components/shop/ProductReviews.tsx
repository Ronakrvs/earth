"use client"

import { useState, useEffect, useCallback } from "react"
import { Star, ThumbsUp, BadgeCheck, MessageSquarePlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import Link from "next/link"

/* ── types ─────────────────────────────────────────────────────────── */
interface Review {
  id: string
  rating: number
  title: string | null
  content: string | null
  is_verified: boolean
  helpful_count: number
  created_at: string
  profiles: { full_name: string | null; avatar_url: string | null } | null
}

interface Props {
  productId: string
  productName: string
}

/* ── star renderer ─────────────────────────────────────────────────── */
function Stars({ value, onChange, size = "md" }: { value: number; onChange?: (n: number) => void; size?: "sm" | "md" | "lg" }) {
  const [hover, setHover] = useState(0)
  const s = size === "lg" ? "h-8 w-8" : size === "md" ? "h-5 w-5" : "h-4 w-4"
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(s, "transition-colors", {
            "fill-amber-400 text-amber-400": n <= (hover || value),
            "text-slate-200 fill-slate-200": n > (hover || value),
            "cursor-pointer hover:scale-110": !!onChange,
          })}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHover(n)}
          onMouseLeave={() => onChange && setHover(0)}
        />
      ))}
    </div>
  )
}

/* ── rating bar ────────────────────────────────────────────────────── */
function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-500 w-4">{label}</span>
      <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-slate-400 w-6 text-right">{count}</span>
    </div>
  )
}

/* ── main component ─────────────────────────────────────────────────── */
export default function ProductReviews({ productId, productName }: Props) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ rating: 0, title: "", content: "" })
  const [helpedReviews, setHelpedReviews] = useState<Set<string>>(new Set())

  /* handle helpful click */
  async function handleHelpful(id: string) {
    if (helpedReviews.has(id)) return
    
    // optimistic update
    setHelpedReviews(prev => new Set(prev).add(id))
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful_count: (r.helpful_count || 0) + 1 } : r))
    
    try {
      await fetch("/api/reviews/helpful", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: id })
      })
    } catch {
      // ignore silently
    }
  }

  /* fetch reviews */
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?product_id=${productId}`)
      if (res.ok) {
        const d = await res.json()
        setReviews(d.reviews || [])
      }
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => { fetchReviews() }, [fetchReviews])

  /* computed stats */
  const count = reviews.length
  const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  /* submit review */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.rating) { toast.error("Please select a star rating."); return }
    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId, ...form }),
      })
      const d = await res.json()
      if (res.ok) {
        toast.success(d.message || "Review submitted! It'll appear after moderation.")
        setForm({ rating: 0, title: "", content: "" })
        setShowForm(false)
      } else {
        toast.error(d.error || "Failed to submit review.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-20 pt-16 border-t border-slate-100">
      {/* ── header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
            Customer <span className="text-primary italic">Reviews</span>
          </h2>
          <p className="text-slate-400 font-medium">
            What our customers say about {productName}
          </p>
        </div>
        {session ? (
          <Button
            onClick={() => setShowForm((v) => !v)}
            className={cn(
              "rounded-2xl font-bold h-12 px-7 gap-2 transition-all",
              showForm
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-primary text-white shadow-lg shadow-primary/20"
            )}
          >
            <MessageSquarePlus className="h-4 w-4" />
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        ) : (
          <Link href="/auth/signin">
            <Button variant="outline" className="rounded-2xl font-bold h-12 px-7 gap-2">
              <MessageSquarePlus className="h-4 w-4" /> Sign in to Review
            </Button>
          </Link>
        )}
      </div>

      {/* ── summary + distribution ── */}
      {count > 0 && (
        <div className="grid md:grid-cols-[auto_1fr] gap-10 mb-12 p-8 bg-slate-50/60 rounded-3xl border border-slate-100">
          {/* overall score */}
          <div className="flex flex-col items-center justify-center min-w-[140px] text-center">
            <span className="text-7xl font-black text-slate-900 leading-none">{avg.toFixed(1)}</span>
            <Stars value={Math.round(avg)} size="md" />
            <p className="text-slate-400 font-bold text-sm mt-2">{count} {count === 1 ? "review" : "reviews"}</p>
          </div>
          {/* bar chart */}
          <div className="space-y-2.5 justify-center flex flex-col">
            {dist.map(({ star, count: c }) => (
              <RatingBar key={star} label={String(star)} count={c} total={count} />
            ))}
          </div>
        </div>
      )}

      {/* ── write review form ── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-12 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-5"
        >
          <h3 className="font-black text-slate-900 text-lg">Share Your Experience</h3>

          {/* star picker */}
          <div>
            <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-3">Your Rating *</p>
            <Stars value={form.rating} onChange={(n) => setForm((p) => ({ ...p, rating: n }))} size="lg" />
            {form.rating > 0 && (
              <p className="text-sm text-primary font-bold mt-2">
                {["","Terrible","Poor","Average","Good","Excellent!"][form.rating]}
              </p>
            )}
          </div>

          {/* title */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">Review Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Best quality moringa I've tried!"
              maxLength={120}
              className="w-full h-12 px-4 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* content */}
          <div>
            <label className="block text-sm font-black text-slate-700 mb-2">Your Review</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={4}
              placeholder="Tell others about the taste, quality, packaging, and how you use it..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary text-white rounded-2xl font-black px-8 h-12 shadow-lg shadow-primary/20 disabled:opacity-70 gap-2"
            >
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
              className="rounded-2xl font-bold h-12 px-6 text-slate-500"
            >
              Cancel
            </Button>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Reviews are moderated and appear within 24 hours after approval.
          </p>
        </form>
      )}

      {/* ── review cards ── */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
        </div>
      ) : count === 0 ? (
        <div className="text-center py-16 bg-slate-50/60 rounded-3xl border border-slate-100">
          <Star className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900 mb-2">No Reviews Yet</h3>
          <p className="text-slate-400 font-medium mb-6">
            Be the first to share your experience with {productName}!
          </p>
          {session && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white rounded-2xl font-bold px-8 h-12 shadow-lg shadow-primary/20"
            >
              Write First Review
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => {
            const initials = review.profiles?.full_name
              ? review.profiles.full_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
              : "?"
            const daysAgo = Math.floor(
              (Date.now() - new Date(review.created_at).getTime()) / 86400000
            )
            const timeLabel = daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`

            return (
              <div
                key={review.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* avatar */}
                  <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-sm shrink-0">
                    {initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-black text-slate-900 text-[15px]">
                        {review.profiles?.full_name || "Anonymous"}
                      </span>
                      {review.is_verified && (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 gap-1 text-[10px] font-black px-2 py-0.5">
                          <BadgeCheck className="h-3 w-3" /> Verified Purchase
                        </Badge>
                      )}
                      <span className="text-slate-300 text-xs font-medium ml-auto">{timeLabel}</span>
                    </div>

                    <Stars value={review.rating} size="sm" />

                    {review.title && (
                      <p className="font-black text-slate-900 mt-3 text-[15px]">{review.title}</p>
                    )}
                    {review.content && (
                      <p className="text-slate-500 font-medium text-[15px] leading-relaxed mt-2">
                        {review.content}
                      </p>
                    )}

                    <button 
                      onClick={() => handleHelpful(review.id)}
                      disabled={helpedReviews.has(review.id)}
                      className={cn(
                        "flex items-center gap-1.5 mt-4 transition-colors text-xs font-bold",
                        helpedReviews.has(review.id) ? "text-primary" : "text-slate-400 hover:text-primary"
                      )}
                    >
                      <ThumbsUp className={cn("h-3.5 w-3.5", helpedReviews.has(review.id) && "fill-primary")} /> 
                      Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
