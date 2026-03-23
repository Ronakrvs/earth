import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
    Clock, Users, Flame, Star, ChefHat, Target,
    ArrowLeft, CheckCircle2, ListChecks, HeartPulse
} from "lucide-react"

import { createAdminClient } from "@/lib/supabase/server"

// Correct Recipe interface based on Supabase schema
interface Recipe {
  id: string;
  name: string;
  slug: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  calories: number;
  tags: string[];
  image_url: string;
  rating: number;
  created_at: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createAdminClient()
  const { data: recipe } = await supabase
    .from('recipes')
    .select('name, description, image_url, tags')
    .eq('id', resolvedParams.id)
    .single()

  if (!recipe) return { title: "Recipe Not Found" }

  return {
    title: `${recipe.name} Recipe | Shigruvedas`,
    description: recipe.description || `Learn how to make ${recipe.name}. A delicious healthy recipe featuring organic Moringa.`,
    openGraph: {
      title: recipe.name,
      description: recipe.description,
      images: [recipe.image_url || "/og-image.jpg"],
    }
  }
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const supabase = await createAdminClient()
  const { data: recipe } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (!recipe) {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": recipe.name,
    "image": recipe.image_url || "https://shigruvedas.com/og-image.jpg",
    "description": recipe.description,
    "prepTime": `PT${recipe.prep_time}M`,
    "cookTime": `PT${recipe.cook_time}M`,
    "totalTime": `PT${recipe.prep_time + recipe.cook_time}M`,
    "recipeYield": `${recipe.servings} servings`,
    "recipeCategory": recipe.cuisine,
    "recipeCuisine": recipe.cuisine,
    "nutrition": {
      "@type": "NutritionInformation",
      "calories": `${recipe.calories} calories`
    },
    "recipeIngredient": recipe.ingredients,
    "recipeInstructions": recipe.instructions.map((step: string) => ({
      "@type": "HowToStep",
      "text": step
    })),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": recipe.rating || "4.8",
      "ratingCount": "85"
    }
  }

  return (
    <div className="min-h-screen bg-white">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ─── BREADCRUMB & BACK ────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4 text-sm text-gray-500">
          <Link href="/recipes" className="hover:text-green-700 font-medium flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Recipes
          </Link>
          <span className="text-gray-300">|</span>
          <span>{recipe.cuisine}</span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-md">{recipe.name}</span>
        </div>
      </div>

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="container mx-auto px-4 py-10 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left: Image */}
          <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square w-full rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={recipe.image_url || "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000"}
              alt={recipe.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className="bg-white/90 backdrop-blur-md text-green-800 border-none px-3 py-1 text-sm shadow-sm font-bold capitalize">
                {recipe.difficulty}
              </Badge>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 capitalize">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              {recipe.name}
            </h1>

            <div className="flex items-center gap-4 mb-6 text-sm">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                {(recipe.rating || 4.8).toFixed(1)}
              </div>
              <span className="text-gray-500 font-medium">(Verified Recipe)</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-500 font-medium">{recipe.cuisine} Cuisine</span>
            </div>

            {/* Superfood Tip Box */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-2 text-green-800">
                <HeartPulse className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-lg">Moringa Superfood Tip</h3>
              </div>
              <p className="text-green-700 leading-relaxed text-sm">
                Make this recipe even healthier by adding 1 teaspoon of Shigruvedas Organic Moringa Powder. It blends perfectly, adding iron, vitamins, and antioxidants without changing the core flavor!
              </p>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100">
                <ChefHat className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Prep Time</span>
                <span className="text-lg font-extrabold text-gray-900">{recipe.prep_time}m</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100">
                <Clock className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Cook Time</span>
                <span className="text-lg font-extrabold text-gray-900">{recipe.cook_time}m</span>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100">
                <Users className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Servings</span>
                <span className="text-lg font-extrabold text-gray-900">{recipe.servings}</span>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-green-100">
                <Flame className="w-6 h-6 text-green-600 mb-2" />
                <span className="text-xs text-green-700 uppercase tracking-wider font-bold mb-1">Calories</span>
                <span className="text-lg font-extrabold text-green-900">{recipe.calories}</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CONTENT SECTION ──────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">

            {/* Left/Sidebar: Ingredients */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Ingredients</h3>
                </div>

                <ul className="space-y-4">
                  {recipe.ingredients.map((ingredient: string, i: number) => (
                    <li key={i} className="flex gap-3 text-gray-700 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="leading-relaxed">
                        {ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right/Main: Instructions */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Instructions</h3>
                </div>

                <div className="space-y-8">
                  {recipe.instructions.map((step: string, i: number) => (
                    <div key={i} className="flex gap-5 group">
                      <div className="flex-shrink-0 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 font-bold flex flex-col items-center justify-center text-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                          {i + 1}
                        </div>
                        {i !== recipe.instructions.length - 1 && (
                          <div className="w-px h-full bg-gray-100 mt-2 group-hover:bg-green-200 transition-colors" />
                        )}
                      </div>
                      <div className="pt-1 pb-2">
                        <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-900 transition-colors">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

interface PageProps {
  params: Promise<{ id: string }>
}

