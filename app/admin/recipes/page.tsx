import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import RecipesList from "./RecipesList"
import Link from "next/link"
import { ArrowLeft, UtensilsCrossed, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function AdminRecipesPage() {
  const session = await auth()
  const supabase = await createAdminClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session?.user?.id || '')
    .single()

  if (session?.user?.role !== "admin" && profile?.role !== "admin") redirect("/")

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
            <UtensilsCrossed className="h-6 w-6 text-orange-700" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Recipe Hub</h1>
            <p className="text-slate-500 font-medium text-sm">Create and curate culinary inspiration.</p>
          </div>
        </div>
        <Link href="/admin/recipes/new">
          <Button className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold px-6">
            Add Recipe
          </Button>
        </Link>
      </div>

      <RecipesList initialRecipes={recipes || []} />
    </div>
  )
}
