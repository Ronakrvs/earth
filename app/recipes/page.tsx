import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Flame, Star, ChefHat, ArrowRight, Droplet, UtensilsCrossed, Leaf } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Healthy Moringa Recipes | Shigruvedas",
  description: "Discover delicious, vegetarian, and healthy recipes. Cooking made easy with our step-by-step guides using Shigruvedas Organic Moringa Powder.",
}

export const revalidate = 3600; // Cache for 1 hour

export default async function RecipesPage() {
  const supabase = await createAdminClient()
  
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching recipes:", error)
  }

  const liquidKeywords = ["smoothie", "drink", "beverage", "tea", "soup", "lassi", "mojito", "juice", "coffee", "latte", "water"]
  
  const liquid = (recipes || []).filter(r => 
    r.tags?.some((tag: string) => liquidKeywords.some(kw => tag.toLowerCase().includes(kw))) || 
    liquidKeywords.some(kw => r.name.toLowerCase().includes(kw))
  )
  
  const solid = (recipes || []).filter(r => !liquid.includes(r))

  // Reusable recipe card component
  const RecipeCard = ({ recipe }: { recipe: any }) => (
    <Link href={`/recipes/${recipe.id}`} className="group h-full block">
      <div className="bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
        
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={recipe.image_url || "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000"}
            alt={recipe.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-white text-green-800 border-none shadow-sm font-bold opacity-90 backdrop-blur-md capitalize">
              {recipe.difficulty}
            </Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.tags?.slice(0, 2).map((type: string) => (
              <span key={type} className="text-[10px] uppercase tracking-wider font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                {type}
              </span>
            ))}
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
            {recipe.name}
          </h3>
          
          <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed flex-1 italic border-l-2 border-green-200 pl-2">
            {recipe.description}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
              <div className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-lg py-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-medium">{(recipe.prep_time || 0) + (recipe.cook_time || 0)}m</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-lg py-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="font-medium">{recipe.servings} p</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-lg py-2">
                <Flame className="w-4 h-4 text-green-600" />
                <span className="font-medium">{recipe.calories} cal</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm font-semibold text-green-600">
              <span>View Recipe</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white py-20 lg:py-28">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <Badge className="bg-white/20 text-white border-white/30 mb-6 px-4 py-1.5 backdrop-blur-sm">
            <ChefHat className="w-4 h-4 mr-2 inline-block" /> Vegeterian Collection
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Moringa Superfood <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Recipe Collection
            </span>
          </h1>
          <p className="text-green-100 text-lg leading-relaxed mb-8">
            Explore our curated collection of entirely vegetarian, highly nutritious ways to integrate our premium organic Moringa powder. Discover solids and liquids!
          </p>
        </div>
      </section>

      {recipes?.length === 0 ? (
        <div className="text-center py-20 bg-white">
          <Leaf className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No recipes found. Check back soon!</p>
        </div>
      ) : (
        <>
          {/* ─── RECIPES GRID - LIQUID ─────────────────────────────────────────── */}
          <section className="flex-1 py-16 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center gap-3 mb-10">
                <Droplet className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-extrabold text-gray-900">Moringa Liquids & Beverages</h2>
              </div>
              
              {liquid.length === 0 ? (
                <p className="text-gray-500 italic">Explore our solid meals below!</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {liquid.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>
          </section>
          
          {/* ─── RECIPES GRID - SOLID ─────────────────────────────────────────── */}
          <section className="flex-1 py-16 px-4 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto max-w-7xl">
              <div className="flex items-center gap-3 mb-10">
                <UtensilsCrossed className="w-8 h-8 text-amber-600" />
                <h2 className="text-3xl font-extrabold text-gray-900">Moringa Solid Meals & Snacks</h2>
              </div>
              
              {solid.length === 0 ? (
                <p className="text-gray-500 italic">No solid recipes yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {solid.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
