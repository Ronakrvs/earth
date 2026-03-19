import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronLeft, Leaf, ArrowRight } from "lucide-react"

const POSTS: Record<string, any> = {
  "health-benefits-moringa-powder": {
    slug: "health-benefits-moringa-powder",
    title: "7 Science-Backed Health Benefits of Moringa Powder",
    category: "Health & Wellness",
    readTime: "5 min read",
    date: "February 20, 2025",
    image: "/images/powder2.png",
    content: `
Moringa oleifera — known as the "miracle tree" — has been used in Ayurvedic medicine for thousands of years. Modern science is now validating what traditional healers have known for centuries.

## 1. Packed with Nutrients
Moringa leaves contain 7× more Vitamin C than oranges, 4× more Calcium than milk, and 2× more Protein than yogurt. A single tablespoon of moringa powder can cover a significant portion of your daily nutrient requirements.

## 2. Powerful Anti-Inflammatory Properties
Moringa contains isothiocyanates, flavonoids, and phenolic acids — compounds with proven anti-inflammatory effects. Chronic inflammation is linked to most modern diseases, including heart disease, diabetes, and cancer.

## 3. Lowers Blood Sugar Levels
Several studies have shown moringa can reduce blood sugar levels. One study found that participants who consumed 1.5 teaspoons of moringa daily for 3 months had a 13.5% reduction in fasting blood sugar.

## 4. Reduces Cholesterol
High cholesterol is a major risk factor for heart disease. Moringa has been shown to lower LDL ("bad") cholesterol significantly, comparable to some pharmaceutical interventions.

## 5. Supporting Liver Health
Moringa protects the liver against damage caused by anti-tubercular drugs and can speed up its recovery. It also increases liver enzymes that detoxify the body.

## 6. Rich in Antioxidants
Antioxidants fight free radicals in your body. High levels of free radicals cause oxidative stress, linked to chronic diseases. Moringa contains quercetin and chlorogenic acid — two powerful antioxidants.

## 7. Nutritious and Easy to Add to Your Diet
Unlike many superfoods that require complex preparation, moringa powder can be added to any meal — smoothies, dals, rotis, or soups — without drastically changing the taste.

---

*Ready to try moringa?* Our organic moringa powder is stone-ground fresh from our certified farm in Udaipur, Rajasthan.
    `.trim(),
  },
  "moringa-sambar-recipe": {
    slug: "moringa-sambar-recipe",
    title: "Authentic South Indian Moringa Sambar — Grandma's Recipe",
    category: "Recipes",
    readTime: "8 min read",
    date: "January 5, 2025",
    image: "/images/drumstick2.png",
    content: `
Moringa drumsticks (sahjan ki phalli) are the star of authentic South Indian sambar. This recipe has been passed down through generations in our family's farm in Rajasthan.

## Ingredients
- 250g fresh moringa drumsticks (cut into 3-inch pieces)
- 1 cup toor dal (split pigeon peas)
- 2 medium tomatoes, chopped
- 1 small onion, diced
- 2 tbsp sambar powder
- 1 tsp turmeric
- Salt to taste
- 2 tbsp tamarind paste
- Fresh coriander for garnish

## Tempering
- 2 tbsp coconut oil
- 1 tsp mustard seeds
- 10 curry leaves
- 2 dried red chillies
- 1 tsp asafoetida (hing)

## Method

**Step 1:** Pressure cook dal with turmeric and 3 cups water for 3 whistles. Mash lightly and set aside.

**Step 2:** In a pot, cook drumsticks with tomatoes, onion and 1 cup water until tender (about 12 minutes).

**Step 3:** Add cooked dal, sambar powder, tamarind paste and salt. Simmer for 10 minutes.

**Step 4:** Prepare tempering — heat oil, add mustard seeds (let splutter), then curry leaves, red chillies and hing.

**Step 5:** Pour tempering over sambar. Garnish with coriander. Serve hot with rice or idli.

*Nutritional tip:* Moringa drumsticks provide folate, magnesium, and Vitamin B6. The sambar method preserves most of the nutrition through gentle cooking.
    `.trim(),
  },
}

// Generate for all slugs in listing
const ALL_SLUGS = Object.keys(POSTS)

export async function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = POSTS[slug]
  if (!post) return {}
  return { title: `${post.title} | Shigruvedas Blog`, description: post.title }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = POSTS[slug]

  // For posts without full content yet, show a coming-soon placeholder
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <Leaf className="h-14 w-14 text-green-200 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Article Coming Soon</h1>
          <p className="text-gray-500 mb-6">We're working on this article. Check back soon!</p>
          <Link href="/blog">
            <Button className="bg-green-600 hover:bg-green-700 text-white">← Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back link */}
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 mb-6">
          <ChevronLeft className="h-4 w-4" /> Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Hero image */}
          <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-50">
            <Image
              src={post.image}
              alt={post.title}
              width={800}
              height={450}
              className="w-full h-full object-contain p-10"
              priority
            />
          </div>

          <div className="p-6 md:p-10">
            <Badge className="bg-green-100 text-green-700 mb-4">{post.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b">
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {post.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
              <span className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-green-500" /> Shigruvedas</span>
            </div>

            {/* Post body */}
            <div className="prose prose-green max-w-none text-gray-700 leading-relaxed space-y-4">
              {post.content.split("\n\n").map((para: string, i: number) => {
                if (para.startsWith("## ")) {
                  return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{para.replace("## ", "")}</h2>
                }
                if (para.startsWith("---")) {
                  return <hr key={i} className="border-gray-200 my-6" />
                }
                if (para.startsWith("- ")) {
                  return (
                    <ul key={i} className="list-disc list-inside space-y-1 text-sm">
                      {para.split("\n").map((item, j) => (
                        <li key={j}>{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  )
                }
                if (para.startsWith("**Step")) {
                  return <p key={i} className="text-sm font-medium text-gray-800">{para}</p>
                }
                return <p key={i} className="text-sm text-gray-600 leading-7">{para}</p>
              })}
            </div>

            {/* CTA */}
            <div className="mt-10 bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="font-semibold text-green-800 mb-1">Try Organic Moringa Today 🌿</p>
              <p className="text-sm text-green-700 mb-4">Direct from our certified organic farm in Udaipur, Rajasthan</p>
              <Link href="/shop">
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
