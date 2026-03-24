import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Flame, ChefHat, ArrowRight, Droplet, UtensilsCrossed, Leaf, Star } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/server"
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Moringa Kitchen Alchemy | Shigruvedas",
  description: "Discover the art of botanical cooking. From vibrant morning smoothies to nutrient-dense meals, explore our chef-curated moringa recipes.",
}

export const revalidate = 3600

export default async function RecipesPage() {
  const supabase = await createAdminClient()
  
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const liquidKeywords = ["smoothie", "drink", "beverage", "tea", "soup", "lassi", "mojito", "juice", "coffee", "latte", "water"]
  
  const liquid = (recipes || []).filter(r => 
    r.tags?.some((tag: string) => liquidKeywords.some(kw => tag.toLowerCase().includes(kw))) || 
    liquidKeywords.some(kw => r.name.toLowerCase().includes(kw))
  )
  
  const solid = (recipes || []).filter(r => !liquid.includes(r))

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* ─── RECIPE HERO ─────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Organic Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/5 px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase text-primary mb-8"
          >
            <ChefHat className="h-4 w-4" /> Kitchen Alchemy
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-none"
          >
            Crafting <span className="text-gradient">Vitality</span> <br />
            in Every Dish
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-12"
          >
            Explore our curated collection of nutrient-dense recipes, where Rajasthan's farm-fresh moringa meets contemporary botanical cooking.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-widest"
          >
            <span className="flex items-center gap-2"><Star className="h-4 w-4 text-accent fill-accent" /> Expertly Tested</span>
            <span className="flex items-center gap-2"><Star className="h-4 w-4 text-accent fill-accent" /> 100% Vegetarian</span>
            <span className="flex items-center gap-2"><Star className="h-4 w-4 text-accent fill-accent" /> Highly Nutritious</span>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4">
        {recipes?.length === 0 ? (
          <div className="text-center py-32 opacity-20">
            <Leaf className="h-20 w-20 mx-auto mb-6" />
            <p className="text-xl font-black uppercase tracking-[0.2em]">Developing New Alchemies</p>
          </div>
        ) : (
          <>
            {/* ─── LIQUID SECTION ──────────────────────────────────────── */}
            <section className="py-20">
              <div className="flex items-center gap-6 mb-16">
                <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center">
                  <Droplet className="h-8 w-8 text-primary/40" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">Vibrant Liquids</h2>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Hydration & Elixirs</p>
                </div>
                <div className="h-px flex-1 bg-slate-100 hidden md:block" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {liquid.map((recipe, idx) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 4) * 0.1 }}
                  >
                    <Link href={`/recipes/${recipe.id}`} className="group block h-full">
                      <MoringaCard className="p-0 border-primary/5 overflow-hidden h-full flex flex-col group-hover:shadow-2xl transition-all" glass={true}>
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={recipe.image_url || "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000"}
                            alt={recipe.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary border border-primary/5">{recipe.difficulty}</span>
                          </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-primary transition-colors mb-4 line-clamp-2 tracking-tight leading-tight">
                            {recipe.name}
                          </h3>
                          <p className="text-slate-500 text-sm line-clamp-2 mb-8 font-medium italic italic">"{recipe.description}"</p>
                          
                          <div className="mt-auto grid grid-cols-3 gap-2 pt-6 border-t border-slate-50">
                            <div className="flex flex-col items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-primary/30" />
                              <span className="text-[10px] font-black text-slate-400">{(recipe.prep_time || 0) + (recipe.cook_time || 0)}m</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 border-x border-slate-50">
                              <Users className="h-3.5 w-3.5 text-primary/30" />
                              <span className="text-[10px] font-black text-slate-400">{recipe.servings}P</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <Flame className="h-3.5 w-3.5 text-primary/30" />
                              <span className="text-[10px] font-black text-slate-400">{recipe.calories}</span>
                            </div>
                          </div>
                        </div>
                      </MoringaCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ─── SOLID SECTION ────────────────────────────────────────── */}
            <section className="py-20 mt-10">
              <div className="flex items-center gap-6 mb-16">
                <div className="h-16 w-16 rounded-2xl bg-secondary/5 flex items-center justify-center">
                  <UtensilsCrossed className="h-8 w-8 text-secondary/40" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">Nutrient Solids</h2>
                  <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Wholesome Meals & Snacks</p>
                </div>
                <div className="h-px flex-1 bg-slate-100 hidden md:block" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {solid.map((recipe, idx) => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (idx % 4) * 0.1 }}
                  >
                    <Link href={`/recipes/${recipe.id}`} className="group block h-full">
                      <MoringaCard className="p-0 border-primary/5 overflow-hidden h-full flex flex-col group-hover:shadow-2xl transition-all" glass={true}>
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={recipe.image_url || "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000"}
                            alt={recipe.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-primary border border-primary/5">{recipe.difficulty}</span>
                          </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-primary transition-colors mb-4 line-clamp-2 tracking-tight leading-tight">
                            {recipe.name}
                          </h3>
                          <p className="text-slate-500 text-sm line-clamp-2 mb-8 font-medium italic italic">"{recipe.description}"</p>
                          
                          <div className="mt-auto grid grid-cols-3 gap-2 pt-6 border-t border-slate-50">
                            <div className="flex flex-col items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-primary/30" />
                              <span className="text-[10px] font-black text-slate-400">{(recipe.prep_time || 0) + (recipe.cook_time || 0)}m</span>
                            </div>
                            <div className="flex flex-col items-center gap-1 border-x border-slate-50">
                              <Users className="h-3.5 w-3.5 text-primary/30" />
                              <span className="text-[10px] font-black text-slate-400">{recipe.servings}P</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                              <Flame className="h-3.5 w-3.5 text-primary/30" />
                              <span className="text-[10px] font-black text-slate-400">{recipe.calories}</span>
                            </div>
                          </div>
                        </div>
                      </MoringaCard>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ─── NEWSLETTER CTA ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32"
        >
          <MoringaCard className="bg-gradient-to-br from-primary to-emerald-950 p-12 md:p-24 text-center text-white relative overflow-hidden border-none" glass={false}>
            {/* Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <circle cx="90" cy="10" r="30" fill="currentColor" />
                <circle cx="10" cy="90" r="20" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex h-16 w-16 rounded-3xl bg-white/10 items-center justify-center mb-8 backdrop-blur-md">
                <ChefHat className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Join the Botanical <br/> Kitchen 🌿</h2>
              <p className="text-emerald-100/70 text-lg mb-12 font-medium">Get chef-curated moringa recipes and culinary research delivered to your inbox every Sunday.</p>
              
              <form className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Your culinary email"
                  className="flex-1 px-8 py-5 rounded-2xl bg-white/10 text-white placeholder:text-emerald-200/50 text-sm border border-white/20 focus:outline-none focus:ring-4 focus:ring-white/10 backdrop-blur-xl transition-all outline-none font-bold"
                />
                <Button size="lg" className="h-16 px-12 bg-white text-primary hover:bg-emerald-50 rounded-2xl font-black text-lg shadow-2xl transition-all active:scale-95">
                  Get Recipes
                </Button>
              </form>
              <p className="text-emerald-300/40 text-[10px] mt-6 font-bold uppercase tracking-[0.2em] italic">Join 3,000+ botanical home cooks.</p>
            </div>
          </MoringaCard>
        </motion.div>
      </div>
    </div>
  )
}
