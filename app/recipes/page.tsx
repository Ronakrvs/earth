import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Flame, Star, ChefHat, ArrowRight, Droplet, UtensilsCrossed } from "lucide-react"

export const metadata: Metadata = {
  title: "Healthy Moringa Recipes | Shigruvedas",
  description: "Discover delicious, vegetarian, and healthy recipes. Cooking made easy with our step-by-step guides using Shigruvedas Organic Moringa Powder.",
}

interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
  healthyUses?: string;
}

export const revalidate = 86400; // Cache for 24 hours

// Function to dynamically inject Moringa into generic recipes
function injectMoringa(recipe: any): Recipe {
  // Add Moringa to ingredients
  const moringaAmount = Math.random() > 0.5 ? "1 tsp Shigruvedas Organic Moringa Powder" : "1/2 tbsp Shigruvedas Organic Moringa Powder";
  const newIngredients = [moringaAmount, ...recipe.ingredients];

  // Modify instructions to include Moringa
  const newInstructions = [...recipe.instructions];
  if (newInstructions.length > 1) {
    newInstructions.splice(Math.floor(newInstructions.length / 2), 0, "Stir in the Shigruvedas Organic Moringa Powder until well incorporated.");
  }

  // Pre-determined health benefits to cycle through
  const benefits = [
    "High in Iron and Vitamins A & C. Boosts energy naturally without caffeine crashes.",
    "Flushes out toxins, deeply hydrates the skin, and provides a rich source of antioxidants.",
    "Combines excellent plant-based protein with the complete amino acid profile of Moringa.",
    "Provides healthy fats paired with Vitamin E, excellent for heart health and glowing skin.",
    "A high-fiber dish that stabilizes blood sugar. Moringa adds a dense micronutrient profile.",
    "Rich in calcium and potassium. Strengthens bones and promotes healthy muscle function.",
    "Loaded with anti-inflammatory compounds that reduce swelling and promote joint health."
  ];

  return {
    ...recipe,
    name: `Moringa ${recipe.name}`,
    ingredients: newIngredients,
    instructions: newInstructions,
    healthyUses: benefits[(recipe.id || 1) % benefits.length],
    tags: [...recipe.tags, "Superfood", "Moringa", "Vegetarian"],
  };
}

async function getVegRecipes(): Promise<{ solid: Recipe[], liquid: Recipe[] }> {
  try {
    const res = await fetch("https://dummyjson.com/recipes?limit=0");
    if (!res.ok) throw new Error("Failed to fetch recipes");
    const data = await res.json();
    
    // Filter out meat-based items (Vegetarian strictly)
    const nonVegKeywords = ["chicken", "beef", "pork", "fish", "shrimp", "salmon", "meat", "bacon", "prosciutto", "lamb", "turkey", "macaroni", "cheese", "pizza", "burger", "cookie", "cake", "dessert", "fries", "muffin", "brownie", "ice cream", "waffle", "donut", "pastry", "ramen"];
    const vegRecipes = data.recipes.filter((r: Recipe) => {
      const isNonVeg = r.tags.some(tag => nonVegKeywords.some(kw => tag.toLowerCase().includes(kw))) ||
                          nonVegKeywords.some(kw => r.name.toLowerCase().includes(kw)) ||
                          r.ingredients.some(i => nonVegKeywords.some(kw => i.toLowerCase().includes(kw)));
      return !isNonVeg;
    });

    const liquidKeywords = ["smoothie", "drink", "beverage", "tea", "soup", "lassi", "mojito", "caipirinha", "juice", "coffee", "latte", "water"];
    
    const solid: Recipe[] = [];
    const liquid: Recipe[] = [];

    vegRecipes.forEach((r: any) => {
      const isLiquid = r.tags.some((tag: string) => liquidKeywords.some(kw => tag.toLowerCase().includes(kw))) || 
                       liquidKeywords.some(kw => r.name.toLowerCase().includes(kw)) ||
                       r.mealType.some((mt: string) => liquidKeywords.some(kw => mt.toLowerCase().includes(kw)));
      
      const modified = injectMoringa(r);
      if (isLiquid) {
        liquid.push(modified);
      } else {
        solid.push(modified);
      }
    });

    return { solid, liquid };
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { solid: [], liquid: [] };
  }
}

export default async function RecipesPage() {
  const { solid, liquid } = await getVegRecipes();

  // Reusable recipe card component
  const RecipeCard = ({ recipe }: { recipe: Recipe }) => (
    <Link href={`/recipes/${recipe.id}`} className="group h-full block">
      <div className="bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col group-hover:-translate-y-1">
        
        {/* Image Area */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className="bg-white text-green-800 border-none shadow-sm font-bold opacity-90 backdrop-blur-md">
              {recipe.difficulty}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {recipe.rating.toFixed(1)}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {recipe.mealType.slice(0, 2).map(type => (
              <span key={type} className="text-[10px] uppercase tracking-wider font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                {type}
              </span>
            ))}
          </div>

          <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
            {recipe.name}
          </h3>
          
          <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed flex-1 italic border-l-2 border-green-200 pl-2">
            <span className="font-semibold text-green-700 not-italic block mb-1">Added Health Benefit:</span>
            {recipe.healthyUses}
          </p>

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-4">
              <div className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-lg py-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-medium">{recipe.prepTimeMinutes + recipe.cookTimeMinutes}m</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-lg py-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="font-medium">{recipe.servings} p</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 bg-gray-50 rounded-lg py-2">
                <Flame className="w-4 h-4 text-green-600" />
                <span className="font-medium">{recipe.caloriesPerServing} cal</span>
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

      {/* ─── RECIPES GRID - LIQUID ─────────────────────────────────────────── */}
      <section className="flex-1 py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-10">
            <Droplet className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-extrabold text-gray-900">Moringa Liquids & Beverages</h2>
          </div>
          
          {liquid.length === 0 ? (
            <p className="text-gray-500">No liquid recipes found.</p>
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
            <p className="text-gray-500">No solid recipes found.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {solid.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
