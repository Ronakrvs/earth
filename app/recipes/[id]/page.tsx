import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Clock, Users, Flame, Star, ChefHat, Target,
    ArrowLeft, CheckCircle2, ListChecks, HeartPulse, Leaf, ArrowRight
} from "lucide-react"
import { createAdminClientStatic } from "@/lib/supabase/server"
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = createAdminClientStatic()
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
  const supabase = createAdminClientStatic()
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
    <div className="min-h-screen bg-background pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* ─── NAVIGATION ─────────────────────────────────────────── */}
      <div className="bg-background/80 border-b border-slate-100/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
          <Link href="/recipes" className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 hover:text-primary transition-all flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> BACK TO DIARY
          </Link>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 truncate max-w-[200px] text-center hidden sm:block">
            {recipe.name}
          </div>
          <div className="flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Now Brewing</span>
          </div>
        </div>
      </div>

      {/* ─── HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative pt-12 pb-24 overflow-hidden px-4">
        {/* Organic Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Image Side */}
            <div className="lg:col-span-12 xl:col-span-7">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-[16/10] md:aspect-[21/9] xl:aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/5 group ring-1 ring-primary/5"
              >
                <Image
                  src={recipe.image_url || "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000"}
                  alt={recipe.name}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-[4000ms] ease-out"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                
                {/* Meta Overlay */}
                <div className="absolute inset-x-6 bottom-6 md:inset-x-12 md:bottom-12 p-8 md:p-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] text-white shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                    <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12">
                        <div className="flex gap-10">
                            <div className="text-center group/item hover:scale-110 transition-transform">
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">PREPARATION</div>
                                <div className="text-3xl font-black italic">{recipe.prep_time}<span className="text-sm font-medium not-italic ml-1 opacity-60">MIN</span></div>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden sm:block" />
                            <div className="text-center group/item hover:scale-110 transition-transform">
                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 mb-2">ALCHEMY</div>
                                <div className="text-3xl font-black italic">{recipe.cook_time}<span className="text-sm font-medium not-italic ml-1 opacity-60">MIN</span></div>
                            </div>
                        </div>
                        <Badge className="bg-primary hover:bg-primary text-white font-black px-6 py-2.5 rounded-2xl border-none shadow-xl shadow-primary/20 scale-110">
                            {recipe.difficulty.toUpperCase()}
                        </Badge>
                    </div>
                </div>
              </motion.div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-12 xl:col-span-5">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-wrap gap-3 mb-10">
                  {recipe.tags?.map((tag: string) => (
                    <span key={tag} className="bg-primary/5 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1] mb-10 tracking-tighter">
                  {recipe.name}
                </h1>

                <div className="flex items-center gap-10 mb-14">
                  <div className="flex items-center gap-3 bg-accent/10 px-4 py-2 rounded-2xl border border-accent/5">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="text-lg font-black text-accent">{(recipe.rating || 4.8).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <ChefHat className="w-6 h-6 text-primary/40" />
                      <span className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] italic">{recipe.cuisine} ORIGIN</span>
                  </div>
                </div>

                {/* Botanical Insight Card */}
                <MoringaCard className="relative p-10 bg-primary/5 border-primary/10 overflow-hidden group hover:bg-primary/10 transition-colors" glass={true}>
                    <div className="absolute -top-6 -right-6 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Leaf className="w-24 h-24 text-primary rotate-45" />
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/5 ring-1 ring-primary/5">
                            <HeartPulse className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Botanical Synergy</h3>
                          <p className="text-slate-900 font-black tracking-tight leading-none">The Nutrient Surge</p>
                        </div>
                    </div>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                        "Infuse this dish with 1 tsp of <strong>Moringa Gold</strong> from Udaipur's certified organic groves for a powerhouse of Vitamin A & Antioxidants."
                    </p>
                </MoringaCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTENT SECTION ──────────────────────────────────────── */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">

            {/* Sidebar: Ingredients */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-10">
                {/* Micro Stats */}
                <div className="grid grid-cols-2 gap-6">
                    <MoringaCard className="p-8 bg-white border-slate-100/50 shadow-2xl shadow-primary/2" glass={true}>
                        <Users className="w-7 h-7 text-primary/30 mb-6" />
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">GUESTS</div>
                        <div className="text-3xl font-black text-slate-900 italic">{recipe.servings}<span className="text-xs not-italic ml-2 opacity-30">P</span></div>
                    </MoringaCard>
                    <MoringaCard className="p-8 bg-white border-slate-100/50 shadow-2xl shadow-primary/2" glass={true}>
                        <Flame className="w-7 h-7 text-primary/30 mb-6" />
                        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">ENERGY</div>
                        <div className="text-3xl font-black text-slate-900 italic">{recipe.calories}<span className="text-xs not-italic ml-2 opacity-30">C</span></div>
                    </MoringaCard>
                </div>

                {/* Ingredients */}
                <MoringaCard className="p-10 md:p-14 bg-white border-slate-100/50 shadow-2xl shadow-primary/2" glass={true}>
                    <div className="flex items-center justify-between mb-12">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">Gathering</h3>
                        <ListChecks className="w-6 h-6 text-primary/20" />
                    </div>

                    <ul className="space-y-8">
                        {recipe.ingredients.map((ingredient: string, i: number) => (
                            <li key={i} className="flex gap-5 group">
                                <div className="h-7 w-7 rounded-xl bg-primary/5 border border-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className="text-slate-600 font-bold leading-relaxed flex-1 text-lg group-hover:text-slate-900 transition-colors">
                                    {ingredient}
                                </span>
                            </li>
                        ))}
                    </ul>
                </MoringaCard>
            </div>

            {/* Main: Instructions */}
            <div className="lg:col-span-7 xl:col-span-8">
              <MoringaCard className="p-10 md:p-20 bg-white border-slate-100/50 shadow-2xl shadow-primary/2" glass={true}>
                <div className="flex items-center justify-between mb-20">
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">The Alchemy</h3>
                    <Target className="w-8 h-8 text-primary/20" />
                </div>

                <div className="space-y-16">
                  {recipe.instructions.map((step: string, i: number) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-10 group"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-[2rem] bg-slate-50 text-slate-300 font-black flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white group-hover:shadow-2xl group-hover:shadow-primary/20 transition-all duration-700 ring-4 ring-transparent group-hover:ring-primary/5">
                           {String(i + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <div className="pt-3">
                        <p className="text-slate-500 text-2xl leading-[1.6] font-medium group-hover:text-slate-900 transition-colors duration-700 tracking-tight italic">
                          {step}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-24 pt-16 border-t border-slate-50 flex items-center justify-center">
                    <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] italic brightness-110">
                        Nourishment Architecture Complete
                    </div>
                </div>
              </MoringaCard>

              {/* Enhanced Bottom CTA */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-20"
              >
                <MoringaCard className="bg-gradient-to-br from-primary to-emerald-950 p-12 md:p-20 text-center text-white relative overflow-hidden border-none shadow-2xl shadow-primary/20" glass={false}>
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <circle cx="90" cy="10" r="30" fill="currentColor" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10 max-w-2xl mx-auto">
                    <span className="inline-flex px-5 py-2 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-secondary mb-8 backdrop-blur-md">
                      Botanical Integrity
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black mb-10 tracking-tighter italic">Elevate Your Recipe with Purity.</h3>
                    <Link href="/shop">
                      <Button size="lg" className="h-16 px-12 bg-white text-primary hover:bg-emerald-50 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-2xl group ring-0 flex items-center gap-4 mx-auto">
                        Shop Organic Moringa <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </MoringaCard>
              </motion.div>
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

