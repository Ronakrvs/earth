import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { resolve } from "path"

// Simple .env.local parser
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local")
    const envContent = readFileSync(envPath, "utf-8")
    envContent.split("\n").forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        let value = match[2] || ""
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
        process.env[match[1]] = value
      }
    })
  } catch (err) {}
}

loadEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing Supabase environment variables.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

const BLOG_POSTS = [
  {
    title: "Moringa: The Ultimate Superfood for 2026",
    slug: "moringa-ultimate-superfood-2026",
    excerpt: "Discover why Moringa is taking the wellness world by storm this year.",
    content: "Moringa oleifera, often called the 'drumstick tree' or 'miracle tree,' is a plant that has been praised for its health benefits for thousands of years. It is very rich in healthy antioxidants and bioactive plant compounds. Scientists have only investigated a fraction of the many reputed health benefits...",
    cover_image: "https://images.unsplash.com/photo-1515023115689-589c39455d36?q=80&w=1000",
    tags: ["moringa", "superfood", "health"],
    is_published: true
  },
  {
    title: "10 Easy Ways to Include Shigru in Your Daily Diet",
    slug: "10-ways-include-shigru-diet",
    excerpt: "Small changes can lead to big health benefits with these shigru tips.",
    content: "Including Shigru (Moringa) in your daily routine doesn't have to be complicated. From morning smoothies to evening curries, here are 10 simple ways to boost your nutrition with this powerful Ayurvedic herb...",
    cover_image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000",
    tags: ["shigru", "nutrition", "diet"],
    is_published: true
  },
  {
    title: "The Science Behind Moringa's Energy-Boosting Properties",
    slug: "science-moringa-energy-boost",
    excerpt: "Forget caffeine jitters—here's how Moringa provides sustained energy.",
    content: "Unlike coffee, which can lead to energy crashes, Moringa provides a sustained boost due to its high concentration of B vitamins, iron, and magnesium. These nutrients are essential for the body's energy production processes...",
    cover_image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000",
    tags: ["energy", "science", "wellness"],
    is_published: true
  },
  {
    title: "Why Moringa is Better Than Matcha for Focus",
    slug: "moringa-vs-matcha-focus",
    excerpt: "A deep dive comparison between two of nature's most powerful green powders.",
    content: "While Matcha is lauded for its antioxidants, Moringa actually contains higher levels of certain key nutrients, including fiber and calcium. When it comes to mental clarity, Moringa's high iron content helps oxygenate the brain...",
    cover_image: "https://images.unsplash.com/photo-1515696955266-4f67e13219e8?q=80&w=1000",
    tags: ["moringa", "matcha", "productivity"],
    is_published: true
  },
  {
    title: "Moringa and Skin Health: The Natural Glow Secret",
    slug: "moringa-skin-health-glow",
    excerpt: "Get radiant skin from the inside out with the help of Moringa nutrients.",
    content: "Moringa is packed with Vitamin A, Vitamin C, and Vitamin E—all of which are crucial for maintaining healthy skin. Vitamin C helps in collagen production, while Vitamin A supports skin cell renewal...",
    cover_image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1000",
    tags: ["beauty", "skincare", "natural"],
    is_published: true
  },
  {
    title: "Detox Your Body Naturally with Moringa Tea",
    slug: "detox-naturally-moringa-tea",
    excerpt: "Cleanse your system without harsh chemicals using this gentle herbal tea.",
    content: "Moringa tea is a gentle yet effective way to help your body flush out toxins. Its high antioxidant content supports liver function and helps neutralize free radicals that can cause cellular damage...",
    cover_image: "https://images.unsplash.com/photo-1544787210-28272530afeb?q=80&w=1000",
    tags: ["detox", "tea", "cleansing"],
    is_published: true
  },
  {
    title: "Moringa for Athletes: Recovery and Performance",
    slug: "moringa-athletes-recovery",
    excerpt: "How professional athletes are using Moringa to reduce inflammation and recover faster.",
    content: "The anti-inflammatory properties of Moringa make it an excellent supplement for post-workout recovery. High in protein and essential amino acids, it helps repair muscle tissue and reduce soreness...",
    cover_image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000",
    tags: ["fitness", "sports", "recovery"],
    is_published: true
  },
  {
    title: "The History of Shigru in Ancient Ayurveda",
    slug: "history-shigru-ayurveda",
    excerpt: "Tracing the roots of the 'miracle tree' back to ancient Vedic texts.",
    content: "Shigru has been a staple in Ayurvedic medicine for over 4,000 years. Known as 'Shobhanjana' in Sanskrit, it was traditionally used to treat over 300 different conditions, from digestive issues to eye problems...",
    cover_image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000",
    tags: ["ayurveda", "history", "tradition"],
    is_published: true
  },
  {
    title: "Moringa Leaf Powder vs. Fresh Leaves: Which is Better?",
    slug: "moringa-powder-vs-fresh-leaves",
    excerpt: "Comparing the nutritional profiles of different Moringa forms.",
    content: "While fresh Moringa leaves are delicious, the drying process actually concentrates many of the nutrients. Gram for gram, Moringa powder often contains higher levels of vitamins and minerals than the fresh leaves...",
    cover_image: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?q=80&w=1000",
    tags: ["nutrition", "facts", "lifestyle"],
    is_published: true
  },
  {
    title: "Boosting Immunity with Moringa and Ginger",
    slug: "boosting-immunity-moringa-ginger",
    excerpt: "A powerful duo to keep you healthy during flu season.",
    content: "Combining the anti-inflammatory power of Ginger with the nutrient density of Moringa creates a potent immunity-boosting tonic. This combination helps stimulate the production of white blood cells...",
    cover_image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1000",
    tags: ["immunity", "winter-health", "ginger"],
    is_published: true
  },
  {
    title: "Moringa's Role in Managing Blood Sugar Levels",
    slug: "moringa-blood-sugar-management",
    excerpt: "Understanding how Moringa can help stabilize glucose and insulin.",
    content: "Several studies have shown that Moringa can help lower blood sugar levels. This is likely due to plant compounds like isothiocyanates, which have been linked to improved insulin sensitivity...",
    cover_image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000",
    tags: ["diabetes", "health", "research"],
    is_published: true
  },
  {
    title: "The Environmental Benefits of Growing Moringa",
    slug: "environmental-benefits-growing-moringa",
    excerpt: "How the Moringa tree is helping fight climate change and soil erosion.",
    content: "Moringa is a remarkably resilient tree that can thrive in arid conditions where other crops fail. It requires very little water and its extensive root system helps prevent soil erosion in dry climates...",
    cover_image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000",
    tags: ["environment", "sustainability", "eco"],
    is_published: true
  },
  {
    title: "Moringa and Bone Health: The Calcium Powerhouse",
    slug: "moringa-bone-health-calcium",
    excerpt: "Why Moringa might be better for your bones than milk.",
    content: "Moringa contains significantly more calcium than milk, making it an excellent choice for maintaining bone density. It also contains boron and magnesium, which help the body absorb calcium effectively...",
    cover_image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=1000",
    tags: ["bones", "calcium", "vegan-calcium"],
    is_published: true
  },
  {
    title: "5 Moringa Smoothies for a Perfect Morning",
    slug: "5-moringa-smoothies-morning",
    excerpt: "Start your day with a burst of nutrients and flavor.",
    content: "Looking for breakfast inspiration? We've curated 5 of our favorite Moringa smoothie recipes that are as delicious as they are nutritious. From tropical mango to deep berry blends...",
    cover_image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=1000",
    tags: ["breakfast", "smoothie", "recipes"],
    is_published: true
  },
  {
    title: "Moringa as a Natural Multivitamin",
    slug: "moringa-natural-multivitamin",
    excerpt: "Why you might want to swap your synthetic vitamins for this natural alternative.",
    content: "Synthetic vitamins are often poorly absorbed by the body. Moringa, being a whole food source, provides nutrients in a highly bioavailable form, along with co-factors that aid absorption...",
    cover_image: "https://images.unsplash.com/photo-1584017945516-997e5550d858?q=80&w=1000",
    tags: ["supplements", "natural", "vitamins"],
    is_published: true
  },
  {
    title: "How Moringa Helps in Reducing Inflammation",
    slug: "moringa-reducing-inflammation",
    excerpt: "Combatting chronic inflammation with one of nature's best remedies.",
    content: "Chronic inflammation is at the root of many modern diseases. Moringa contains 36 different anti-inflammatory agents, including quercetin and caffeic acid, which help reduce oxidative stress...",
    cover_image: "https://images.unsplash.com/photo-1512132411229-c30391241dd8?q=80&w=1000",
    tags: ["inflammation", "health", "chronic-pain"],
    is_published: true
  },
  {
    title: "Moringa for Mental Clarity and Stress Relief",
    slug: "moringa-mental-clarity-stress",
    excerpt: "Find your calm and focus with the help of this adaptogenic tree.",
    content: "While not always classified as a traditional adaptogen, Moringa has many adaptogenic properties that help the body manage stress. Its focus-enhancing nutrients help clear brain fog and improve productivity...",
    cover_image: "https://images.unsplash.com/photo-1499209974431-9eaa37a219be?q=80&w=1000",
    tags: ["mental-health", "focus", "stress"],
    is_published: true
  },
  {
    title: "Incorporating Moringa into Traditional Indian Cooking",
    slug: "incorporating-moringa-indian-cooking",
    excerpt: "Modern takes on age-old traditions using Moringa leaf and pods.",
    content: "From 'Saijan Ki Phalli' curry to Moringa-infused Rotis, traditional Indian cuisine has many ways to use the Moringa tree. We explore some forgotten regional recipes that celebrate this ingredient...",
    cover_image: "https://images.unsplash.com/photo-1585932231552-05b719c30def?q=80&w=1000",
    tags: ["indian-food", "cooking", "cuisine"],
    is_published: true
  },
  {
    title: "The Truth About Moringa Capsules: Do They Work?",
    slug: "truth-about-moringa-capsules",
    excerpt: "A critical look at the convenience vs. potency of Moringa supplements.",
    content: "For people with busy lifestyles, Moringa capsules seem like the perfect solution. But are they as effective as the powder? We look at what to look for when buying supplements...",
    cover_image: "https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?q=80&w=1000",
    tags: ["capsules", "review", "buying-guide"],
    is_published: true
  },
  {
    title: "Why Every Vegan Needs Moringa in Their Diet",
    slug: "why-vegans-need-moringa",
    excerpt: "Filling the nutritional gaps in a plant-based diet with the 'miracle tree'.",
    content: "Moringa is one of the few plants that contains all 9 essential amino acids, making it a complete protein source. For vegans, it provides crucial iron, B12 precursors, and calcium that can sometimes be lacking...",
    cover_image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=1000",
    tags: ["vegan", "plant-based", "protein"],
    is_published: true
  }
];

const RECIPES = [
  {
    name: "Moringa Green Smoothie Bowl",
    slug: "moringa-green-smoothie-bowl",
    description: "A refreshing and nutrient-dense start to your day.",
    ingredients: ["1 tsp Moringa powder", "2 frozen bananas", "1 cup spinach", "1/2 cup almond milk", "Toppings: Granola, chia seeds, berries"],
    instructions: ["Place all ingredients in a blender.", "Blend until smooth and creamy.", "Pour into a bowl and add your favorite toppings.", "Enjoy immediately!"],
    prep_time: 5,
    cook_time: 0,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Breakfast",
    calories: 280,
    tags: ["smoothie", "breakfast", "raw"],
    image_url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1000",
    is_active: true
  },
  {
    name: "Shigru Infused Dal Tadka",
    slug: "shigru-infused-dal-tadka",
    description: "A comforting lentil soup with a superfood twist.",
    ingredients: ["1 cup yellow moong dal", "1 tbsp Moringa powder", "1 tsp turmeric", "2 cups water", "Salt to taste", "Tadka: Cumin seeds, garlic, dried red chili"],
    instructions: ["Pressure cook dal with water, turmeric, and salt.", "Whisk in the Moringa powder.", "Prepare tadka in a separate pan.", "Pour tadka over dal and serve hot."],
    prep_time: 10,
    cook_time: 20,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Indian",
    calories: 180,
    tags: ["dal", "lentils", "protein"],
    image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=1000",
    is_active: true
  },
  {
      name: "Moringa & Almond Energy Balls",
      slug: "moringa-almond-energy-balls",
      description: "Perfect bite-sized snacks for pre or post-workout.",
      ingredients: ["1 cup dates", "1/2 cup almonds", "1 tbsp Moringa powder", "String of vanilla extract", "Pinch of salt"],
      instructions: ["Pulse almonds in a food processor.", "Add dates and Moringa powder.", "Process until a sticky dough forms.", "Roll into small balls and refrigerate."],
      prep_time: 15,
      cook_time: 0,
      servings: 10,
      difficulty: "Easy",
      cuisine: "Snacks",
      calories: 95,
      tags: ["energy", "snacks", "dates"],
      image_url: "https://images.unsplash.com/photo-1590080875515-3252086433e5?q=80&w=1000",
      is_active: true
  },
  {
    name: "Fresh Moringa Leaf Salad",
    slug: "fresh-moringa-leaf-salad",
    description: "Light and zesty salad using fresh Moringa greens.",
    ingredients: ["2 cups fresh Moringa leaves", "1 cucumber, sliced", "1/2 red onion, diced", "1/4 cup lemon juice", "2 tbsp olive oil"],
    instructions: ["Rinse and dry the Moringa leaves.", "Combine leaves with vegetables in a large bowl.", "Whisk lemon juice and olive oil.", "Drizzle over salad and toss gently."],
    prep_time: 10,
    cook_time: 0,
    servings: 2,
    difficulty: "Easy",
    cuisine: "Salads",
    calories: 120,
    tags: ["fresh", "summer", "salad"],
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa Pesto Pasta",
    slug: "moringa-pesto-pasta",
    description: "A vibrant green pasta sauce that's dairy-free and delicious.",
    ingredients: ["2 cups basil", "1 tbsp Moringa powder", "1/2 cup walnuts", "1/3 cup olive oil", "2 cloves garlic", "250g whole wheat pasta"],
    instructions: ["Boil pasta according to package directions.", "Blend basil, Moringa, walnuts, oil, and garlic until smooth.", "Reserve some pasta water.", "Toss pasta with pesto, adding water as needed for consistency."],
    prep_time: 15,
    cook_time: 10,
    servings: 3,
    difficulty: "Medium",
    cuisine: "Italian",
    calories: 420,
    tags: ["pasta", "pesto", "vegan"],
    image_url: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?q=80&w=1000",
    is_active: true
  },
  {
    name: "Creamy Moringa & Coconut Soup",
    slug: "creamy-moringa-coconut-soup",
    description: "A rich, heartwarming soup with exotic flavors.",
    ingredients: ["1 can coconut milk", "2 cups vegetable broth", "2 tbsp Moringa powder", "1 ginger piece, minced", "1 tsp curry powder"],
    instructions: ["Simmer broth with ginger and curry powder.", "Whisk in coconut milk and Moringa powder.", "Adjust seasoning with salt and pepper.", "Garnish with fresh cilantro."],
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    difficulty: "Medium",
    cuisine: "Asian Fusion",
    calories: 210,
    tags: ["soup", "coconut", "creamy"],
    image_url: "https://images.unsplash.com/photo-1547592115-0dec630ec8b4?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa Tea with Honey and Lime",
    slug: "moringa-tea-honey-lime",
    description: "A soothing and detoxifying herbal beverage.",
    ingredients: ["1 tsp Moringa powder", "1 cup hot water", "1 tsp honey", "1 slice of lime"],
    instructions: ["Whisk Moringa powder in hot (not boiling) water.", "Add honey and stir until dissolved.", "Squeeze in the lime slice.", "Drink warm or cold over ice."],
    prep_time: 5,
    cook_time: 0,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Beverage",
    calories: 45,
    tags: ["tea", "detox", "refreshing"],
    image_url: "https://images.unsplash.com/photo-1544787210-28272530afeb?q=80&w=1000",
    is_active: true
  },
  {
    name: "Spicy Moringa & Chickpea Curry",
    slug: "spicy-moringa-chickpea-curry",
    description: "A high-protein vegan meal with plenty of spice.",
    ingredients: ["2 cans chickpeas", "1 onion, chopped", "3 tomatoes, pureed", "2 tbsp Moringa powder", "Spices: Cumin, coriander, garam masala"],
    instructions: ["Saute onions until translucent.", "Add spices and tomato puree, cook until oil separates.", "Add chickpeas and Moringa powder with 1 cup water.", "Simmer for 15 minutes."],
    prep_time: 10,
    cook_time: 25,
    servings: 5,
    difficulty: "Medium",
    cuisine: "Indian",
    calories: 310,
    tags: ["curry", "vegan", "protein"],
    image_url: "https://images.unsplash.com/photo-1585932231552-05b719c30def?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa Oatmeal with Berries",
    slug: "moringa-oatmeal-berries",
    description: "Power up your morning with this antioxidant powerhouse.",
    ingredients: ["1/2 cup rolled oats", "1 cup milk (any type)", "1 tsp Moringa powder", "Handful of blueberries", "Maple syrup to taste"],
    instructions: ["Cook oats in milk until creamy.", "Remove from heat and stir in Moringa powder.", "Top with fresh blueberries.", "Drizzle with maple syrup before serving."],
    prep_time: 5,
    cook_time: 10,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Breakfast",
    calories: 340,
    tags: ["oats", "breakfast", "fiber"],
    image_url: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=1000",
    is_active: true
  },
  {
    name: "Baked Moringa & Spinach Fritters",
    slug: "baked-moringa-spinach-fritters",
    description: "A healthy, oven-baked alternative to traditional pakoras.",
    ingredients: ["2 cups spinach, chopped", "1 tsp Moringa powder", "1 cup gram flour (besan)", "1/2 cup water", "Ajwain seeds"],
    instructions: ["Mix flour, Moringa, and spices with water to form a batter.", "Fold in the chopped spinach.", "Drop spoonfuls onto a baking sheet.", "Bake at 200C for 20-25 minutes until golden."],
    prep_time: 15,
    cook_time: 25,
    servings: 12,
    difficulty: "Medium",
    cuisine: "Healthy Snacks",
    calories: 60,
    tags: ["baked", "gluten-free", "snacks"],
    image_url: "https://images.unsplash.com/photo-1605851867184-1420b923769c?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa Guacamole",
    slug: "moringa-guacamole",
    description: "Give your classic guac a superhero upgrade.",
    ingredients: ["2 ripe avocados", "1 tsp Moringa powder", "1 tomato, diced", "1/2 onion, minced", "Cilantro and jalapeño"],
    instructions: ["Mash avocados in a bowl.", "Mix in the Moringa powder thoroughly.", "Fold in tomatoes, onions, and herbs.", "Serve with veggie sticks or healthy chips."],
    prep_time: 10,
    cook_time: 0,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Mexican",
    calories: 160,
    tags: ["avocado", "dip", "healthy-fats"],
    image_url: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000",
    is_active: true
  },
  {
    name: "Quinoa & Moringa Power Bowl",
    slug: "quinoa-moringa-power-bowl",
    description: "A complete meal in a bowl for sustained energy.",
    ingredients: ["1 cup cooked quinoa", "1 tbsp Moringa powder", "Roasted sweet potato", "Steamed broccoli", "Tahini dressing"],
    instructions: ["Whisk Moringa powder into your tahini dressing.", "Arrange quinoa and veggies in a bowl.", "Drizzle the green dressing over everything.", "Toss and enjoy cold or warm."],
    prep_time: 15,
    cook_time: 0,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Modern Veg",
    calories: 390,
    tags: ["quinoa", "lunch", "grain-bowl"],
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa & Ginger Detox Juice",
    slug: "moringa-ginger-detox-juice",
    description: "A zingy juice to refresh your system.",
    ingredients: ["2 green apples", "3 celery stalks", "1 inch ginger", "1 tsp Moringa powder"],
    instructions: ["Juice the apples, celery, and ginger.", "Pour into a glass and whisk in Moringa powder.", "Add ice if desired.", "Drink immediately for best results."],
    prep_time: 10,
    cook_time: 0,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Juice",
    calories: 140,
    tags: ["juice", "ginger", "detox"],
    image_url: "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=1000",
    is_active: true
  },
  {
    name: "Roasted Veggies with Moringa Sprinkle",
    slug: "roasted-veggies-moringa-sprinkle",
    description: "Elevate your basic roast veg with this nutrient boost.",
    ingredients: ["Assorted vegetables (carrots, potatoes, beets)", "Olive oil", "1 tsp Moringa powder", "Salt and Dried Rosemary"],
    instructions: ["Toss vegetables with oil and herbs.", "Roast until tender and charred.", "Just before serving, sprinkle Moringa powder over.", "Toss once more and serve."],
    prep_time: 10,
    cook_time: 40,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Sides",
    calories: 180,
    tags: ["roasted", "sides", "vegetables"],
    image_url: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa Chia Pudding",
    slug: "moringa-chia-pudding",
    description: "The ultimate make-ahead healthy breakfast.",
    ingredients: ["1/4 cup chia seeds", "1 cup almond milk", "1 tsp Moringa powder", "1 tsp vanilla extract", "Honey"],
    instructions: ["Mix all ingredients in a jar.", "Shake well and refrigerate for at least 4 hours.", "Top with seeds and nuts.", "Can be kept for up to 3 days."],
    prep_time: 5,
    cook_time: 0,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Breakfast",
    calories: 220,
    tags: ["chia", "breakfast", "make-ahead"],
    image_url: "https://images.unsplash.com/photo-1490474418645-4491e70e900c?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa & Garlic Hummus",
    slug: "moringa-garlic-hummus",
    description: "Classic hummus with a vibrant green health-kick.",
    ingredients: ["1 can chickpeas", "2 tbsp tahini", "1 tsp Moringa powder", "2 cloves garlic", "Lemon juice"],
    instructions: ["Blend all ingredients in a food processor.", "Add cold water slowly until smooth.", "Transfer to a bowl and drizzle with oil.", "Serve with warm pita bread."],
    prep_time: 10,
    cook_time: 0,
    servings: 6,
    difficulty: "Easy",
    cuisine: "Middle Eastern",
    calories: 130,
    tags: ["dip", "hummus", "vegan"],
    image_url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa Pancakes",
    slug: "moringa-pancakes",
    description: "Green pancakes that kids will love calling 'Monster Pancakes'.",
    ingredients: ["1 cup oat flour", "1 tbsp Moringa powder", "1 egg or flax egg", "1/2 cup milk", "1 tsp baking powder"],
    instructions: ["Whisk dry ingredients together.", "Whisk in wet ingredients to form batter.", "Cook on a non-stick griddle over medium heat.", "Serve with fruit and maple syrup."],
    prep_time: 10,
    cook_time: 15,
    servings: 2,
    difficulty: "Medium",
    cuisine: "Breakfast",
    calories: 320,
    tags: ["pancakes", "breakfast", "oats"],
    image_url: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?q=80&w=1000",
    is_active: true
  },
  {
    name: "Stuffed Paratha with Moringa",
    slug: "stuffed-paratha-moringa",
    description: "Traditional Indian flatbread with a hidden superfood.",
    ingredients: ["2 cups whole wheat flour", "1/2 cup Moringa leaves, chopped", "1 green chili, minced", "Spices: Cumin, salt", "Ghee for frying"],
    instructions: ["Knead a soft dough with flour.", "Mix Moringa leaves and spices for the filling.", "Stuff dough balls, roll out into flatbreads.", "Cook on a tawa using ghee until golden."],
    prep_time: 20,
    cook_time: 15,
    servings: 4,
    difficulty: "Hard",
    cuisine: "Indian",
    calories: 240,
    tags: ["paratha", "indian", "breakfast"],
    image_url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000",
    is_active: true
  },
  {
    name: "Moringa & Turmeric Latte",
    slug: "moringa-turmeric-latte",
    description: "The 'Golden-Green' milk for ultimate relaxation.",
    ingredients: ["1 cup warm milk", "1/2 tsp Moringa powder", "1/2 tsp turmeric powder", "Pinch of black pepper", "Cinnamon"],
    instructions: ["Heat milk until just simmered.", "Froth with the powders and spices.", "Add black pepper (helps turmeric absorption).", "Sweeten with jaggery or honey."],
    prep_time: 5,
    cook_time: 5,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Beverage",
    calories: 110,
    tags: ["latte", "turmeric", "relax"],
    image_url: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=1000",
    is_active: true
  },
  {
    name: "Mango & Moringa Smoothie",
    slug: "mango-moringa-tropical-smoothie",
    description: "Tropical sweetness masks the earthy Moringa flavor perfectly.",
    ingredients: ["1 ripe mango", "1 tsp Moringa powder", "1/2 cup coconut water", "Ice cubes"],
    instructions: ["Peel and cube the mango.", "Blend with all other ingredients.", "Adjust thickness with more coconut water if needed.", "Serve cold with a garnish of mint."],
    prep_time: 5,
    cook_time: 0,
    servings: 1,
    difficulty: "Easy",
    cuisine: "Breakfast",
    calories: 210,
    tags: ["mango", "tropical", "smoothie"],
    image_url: "https://images.unsplash.com/photo-1544908913-0419745ac15b?q=80&w=1000",
    is_active: true
  }
];

async function seed() {
  console.log("🚀 Starting seed process...");

  // 1. Get or Create Author
  let { data: adminUser } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1).single();
  
  if (!adminUser) {
    console.log("⚠️ No admin user found. Checking for any user...");
    const { data: anyUser } = await supabase.from('profiles').select('id').limit(1).single();
    adminUser = anyUser;
  }

  if (!adminUser) {
    console.error("❌ No users found in database. Please register a user first.");
    process.exit(1);
  }

  const authorId = adminUser.id;
  console.log(`👤 Using author ID: ${authorId}`);

  // 2. Insert Blogs
  console.log("✍️ Inserting 20 blog posts...");
  const { error: blogError } = await supabase.from('blog_posts').insert(
    BLOG_POSTS.map(post => ({ ...post, author_id: authorId }))
  );

  if (blogError) {
    console.error("❌ Error inserting blogs:", blogError.message);
  } else {
    console.log("✅ Successfully inserted 20 blog posts.");
  }

  // 3. Insert Recipes
  console.log("🍳 Inserting 20 recipes...");
  const { error: recipeError } = await supabase.from('recipes').insert(
    RECIPES.map(recipe => ({ ...recipe, updated_at: new Date().toISOString() }))
  );

  if (recipeError) {
    console.error("❌ Error inserting recipes:", recipeError.message);
  } else {
    console.log("✅ Successfully inserted 20 recipes.");
  }

  console.log("✨ Seeding complete!");
}

seed();
