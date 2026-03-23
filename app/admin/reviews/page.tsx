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
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-700 fill-yellow-700" />
              </div>
              <h1 className="text-2xl font-bold">Ratings & Reviews</h1>
            </div>
          </div>
        </div>

        <ReviewsList initialReviews={reviews || []} />
      </div>
    </div>
  )
}
