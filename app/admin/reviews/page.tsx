import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import ReviewsList from "./ReviewsList"
import Link from "next/link"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminReviewsPage() {
  const session = await auth()
  const supabase = await createAdminClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (profile?.role !== "admin") redirect("/")

  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      products (name),
      profiles (full_name, email)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
          <Star className="h-6 w-6 text-yellow-700" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Ratings & Reviews</h1>
          <p className="text-slate-500 font-medium text-sm">Moderate and manage customer feedback.</p>
        </div>
      </div>

      <ReviewsList initialReviews={reviews || []} />
    </div>
  )
}
