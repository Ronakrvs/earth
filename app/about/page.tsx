import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Leaf, Sun, Droplets, Heart, Users, Award, MapPin, Calendar, Sprout, Camera, Shield } from "lucide-react"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import WhatsAppButton from "@/components/whatsapp-button"
import moringa from '@/public/moringa.webp'
import moringa1 from '@/public/moringa7.webp'
import moringa2 from '@/public/moringa2.webp'
import moringa3 from '@/public/morinag3.webp'
import moringa4 from '@/public/moringa4.webp'
import moringa5 from '@/public/moringa6.webp'

export default function AboutPage() {
  // Structured Data for Farm/Agricultural Business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Farm"],
    "name": "Shigruvedas Organic Moringa Farm",
    "description": "Certified organic moringa farm in Rajasthan  10000+ trees, and chemical-free farming experience. Premium moringa products direct from farm.",
    "url": "https://shigruvedas.com/about",
    "telephone": "+91-7877255595",
    "email": "shigruvedas@gmail.com",
    keywords: [
    "organic moringa Rajasthan",
    "organic moringa",
    "moringa leaves",
    "moringa powder",
    "moringa",
    "moringa supplier",
    "moringa leaves Udaipur", 
    "moringa powder bulk order",
    "fresh moringa drumsticks",
    "organic farming Rajasthan",
    "moringa supplier India",
    "shigruvedas moringa",
    "certified organic moringa",
    "moringa farm Udaipur",
    "wholesale moringa products",
    "chemical-free moringa",
    "ayurvedic moringa"
  ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "248, A-Block, hiran magri",
      "addressLocality": "Udaipur",
      "addressRegion": "Rajasthan",
      "postalCode": "313002",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates", 
      "latitude": "24.571267",
      "longitude": "73.691544"
    },
    "foundingDate": "2019",
    "knowsAbout": ["Organic Farming", "Moringa Cultivation", "Sustainable Agriculture", "Ayurvedic Plants"],
    "areaServed": "India",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Organic Moringa Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Organic Moringa Leaves",
            "category": "Agricultural Product"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product", 
            "name": "Organic Moringa Powder",
            "category": "Health Supplement"
          }
        }
      ]
    }
  };

  // Farm gallery images data (you can replace these with your actual image paths)
  const farmGalleryImages = [
    {
      src: moringa2,
      alt: "Aerial view of Shigruvedas organic moringa farm in Udaipur Rajasthan",
      title: "Our Organic Farm"
    },
    {
      src: moringa1.src, 
      alt: "Healthy moringa trees plantation with 10000+ trees at Shigruvedas organic farm",
      title: "1000+ Healthy Moringa Trees"
    },
    {
      src: moringa,
      alt: "Farmers hand-picking fresh organic moringa leaves at Shigruvedas farm Rajasthan",
      title: "Hand-Picked with Care"
    },
    {
      src: moringa3,
      alt: "Organic farming methods using natural fertilizers at Shigruvedas moringa farm",
      title: "100% Organic Methods"
    },
    {
      src: moringa4.src,
      alt: "Traditional sun-drying process for moringa leaves at Shigruvedas organic processing unit",
      title: "Traditional Sun-Drying"
    },
    {
      src: moringa5.src,
      alt: "Quality control and testing of organic moringa products at Shigruvedas",
      title: "Quality Control Testing"
    }
  ];

  return (
    <>
      <Head>
        <title>Our Organic Moringa Farm Story - Rajasthan | Shigruvedas</title>
        <meta 
          name="description" 
          content="Discover Shigruvedas organic moringa farm story in Udaipur, Rajasthan with 10000+ trees, 5+ years chemical-free farming. Visit our sustainable moringa cultivation process." 
        />
        <meta name="keywords" content="organic moringa farm Rajasthan, moringa cultivation Udaipur, sustainable farming, organic agriculture, moringa farm visit, chemical-free farming, Shigruvedas farm story" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://shigruvedas.com/about" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Shigruvedas Organic Moringa Farm - 50+ Acres in Rajasthan" />
        <meta property="og:description" content="Visit our certified organic moringa farm in Udaipur, Rajasthan. 5+ years of sustainable farming with 1000+ healthy moringa trees." />
        <meta property="og:image" content="https://shigruvedas.com/images/farm-aerial-view.jpg" />
        <meta property="og:url" content="https://shigruvedas.com/about" />
        <meta property="og:type" content="website" />
        
        {/* Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Geo Meta Tags */}
        <meta name="geo.region" content="IN-RJ" />
        <meta name="geo.placename" content="Udaipur, Rajasthan" />
        <meta name="geo.position" content="24.571267;73.691544" />
        <meta name="ICBM" content="24.571267, 73.691544" />
      </Head>

      <div className="min-h-screen bg-white">
        {/* ─── HERO ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

          <div className="relative container mx-auto px-4 py-20 md:py-28 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm mx-auto">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Certified Organic Farm, Udaipur, Rajasthan
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Our Organic Moringa <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
                Farm Story
              </span>
            </h1>
            
            <p className="text-green-100 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
              Shigruvedas represents our commitment to bringing you the purest, most nutritious moringa products straight from our 50+ acre certified organic farm in Udaipur, Rajasthan. Every leaf tells a story of sustainable farming, traditional wisdom, and wellness.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-green-200">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Udaipur, Rajasthan, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Established 2019</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Certified Organic</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FARM GALLERY ───────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="bg-green-100 text-green-700 mb-3">Farm Gallery</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Our Organic Moringa Farm
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Take a virtual tour of our certified organic moringa farm in Rajasthan. From cultivation to harvest, see how we grow the finest moringa products using traditional sustainable farming methods.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {farmGalleryImages.map((image, index) => (
                <div key={index} className="bg-white rounded-3xl border border-gray-100 hover:border-green-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-6 left-6 text-white">
                        <Camera className="h-5 w-5 mb-2 text-green-400" />
                        <p className="text-sm font-bold">{image.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <WhatsAppButton
                message="Hi! I'm interested in visiting your organic moringa farm in Rajasthan. Can you provide details about farm tours?"
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
              >
                Schedule Farm Visit
              </WhatsAppButton>
            </div>
          </div>
        </section>

        {/* ─── MISSION & VISION ───────────────────────────────────────── */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                <p className="text-gray-500 leading-relaxed">
                  To cultivate and deliver the finest organic moringa products from our Rajasthan farm while promoting sustainable farming practices that benefit both our customers' health and our planet's wellbeing. We are committed to chemical-free agriculture, supporting local farming communities, and preserving traditional Ayurvedic knowledge.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 rounded-3xl p-8 shadow-lg text-white">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                  <Heart className="h-8 w-8 text-green-300" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-green-100 leading-relaxed">
                  To be the leading provider of premium organic moringa products from Rajasthan, making this miracle tree's benefits accessible to families worldwide while supporting sustainable agriculture and empowering local farming communities. We envision a healthier world through organic nutrition.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FARMING PROCESS ────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="bg-green-100 text-green-700 mb-3">Sustainable Farming</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Our Certified Organic Process
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Discover how we cultivate premium moringa using traditional organic methods, sustainable water management, and chemical-free practices on our 50+ acre farm in Udaipur, Rajasthan.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                  <Sun className="h-7 w-7 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Natural Cultivation Methods</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">Traditional organic farming under Rajasthan's natural sunlight</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Our 10000+ moringa trees are cultivated using time-tested organic farming methods passed down through generations in Rajasthan. We use only natural fertilizers, cow dung manure, and compost to ensure no harmful chemicals contaminate your moringa products.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-yellow-50 text-yellow-700 border-none shadow-none font-medium">Zero Pesticides</Badge>
                  <Badge className="bg-yellow-50 text-yellow-700 border-none shadow-none font-medium">Natural Fertilizers</Badge>
                  <Badge className="bg-yellow-50 text-yellow-700 border-none shadow-none font-medium">Cow Dung Manure</Badge>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <Droplets className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Sustainable Water Management</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">Pure groundwater, rainwater harvesting & drip irrigation</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Our moringa farm practices sustainable water management with pure groundwater sources, advanced rainwater harvesting systems, and an efficient drip irrigation setup. This ensures precise, chemical-free irrigation while conserving precious water resources in Rajasthan's arid climate.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-50 text-blue-700 border-none shadow-none font-medium">Pure Groundwater</Badge>
                  <Badge className="bg-blue-50 text-blue-700 border-none shadow-none font-medium">Rainwater Harvesting</Badge>
                  <Badge className="bg-blue-50 text-blue-700 border-none shadow-none font-medium">Drip Irrigation</Badge>
                  <Badge className="bg-blue-50 text-blue-700 border-none shadow-none font-medium">Water Conservation</Badge>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Sprout className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-2">Expert Hand Harvesting</h3>
                <p className="text-sm font-medium text-gray-500 mb-4">Experienced farmers ensure premium quality</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Every moringa leaf and drumstick is hand-picked by our experienced local farmers from Rajasthan at optimal maturity. Our quality control experts inspect each harvest to ensure only the finest, nutrient-rich products reach your table.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-50 text-green-700 border-none shadow-none font-medium">Hand-Picked Daily</Badge>
                  <Badge className="bg-green-50 text-green-700 border-none shadow-none font-medium">Quality Inspected</Badge>
                  <Badge className="bg-green-50 text-green-700 border-none shadow-none font-medium">Expert Farmers</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FARM STATISTICS ────────────────────────────────────────── */}
        <section className="py-16 px-4 bg-gradient-to-r from-green-900 to-emerald-800 text-white relative">
          <div className="container mx-auto max-w-6xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">
              Shigruvedas Farm Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-4xl md:text-5xl font-extrabold mb-2 text-green-300">7+</div>
                <div className="text-sm font-bold opacity-90">Acres of Certified Farm</div>
                <div className="text-xs text-green-200 mt-1">Located in Udaipur</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-extrabold mb-2 text-green-300">10k+</div>
                <div className="text-sm font-bold opacity-90">Healthy Moringa Trees</div>
                <div className="text-xs text-green-200 mt-1">Producing fresh leaves</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-extrabold mb-2 text-green-300">5+</div>
                <div className="text-sm font-bold opacity-90">Years of Organic Farming</div>
                <div className="text-xs text-green-200 mt-1">Established since 2019</div>
              </div>
              <div className="group">
                <div className="text-4xl md:text-5xl font-extrabold mb-2 text-green-300">100%</div>
                <div className="text-sm font-bold opacity-90">Chemical-Free Guarantee</div>
                <div className="text-xs text-green-200 mt-1">Certified organic</div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── WHY MORINGA ────────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge className="bg-green-100 text-green-700 mb-3">The Miracle Tree</Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                Why Moringa in Ayurveda
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Discover the incredible nutritional and health benefits that have made moringa a treasured superfood in traditional Ayurvedic medicine for over 4000 years.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-green-200 transition-all">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Award className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Exceptional Nutritional Profile</h3>
                <p className="text-sm text-gray-500 mb-6">Nature's most complete superfood from our organic farm</p>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 text-green-800 text-xs font-bold">✓</div>
                    <div><span className="font-bold">7x more Vitamin C than oranges</span><br/><span className="text-sm text-gray-500">Powerful immune system support</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 text-green-800 text-xs font-bold">✓</div>
                    <div><span className="font-bold">4x more Calcium than milk</span><br/><span className="text-sm text-gray-500">Strong bones and teeth naturally</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 text-green-800 text-xs font-bold">✓</div>
                    <div><span className="font-bold">3x more Potassium than bananas</span><br/><span className="text-sm text-gray-500">Heart health and blood pressure</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0 text-green-800 text-xs font-bold">✓</div>
                    <div><span className="font-bold">2x more Protein than yogurt</span><br/><span className="text-sm text-gray-500">Complete amino acid profile</span></div>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-amber-200 transition-all">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Traditional Ayurvedic Benefits</h3>
                <p className="text-sm text-gray-500 mb-6">Time-tested wellness applications for modern health</p>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold">✓</div>
                    <div><span className="font-bold">Natural immune system booster</span><br/><span className="text-sm text-gray-500">Rich antioxidants and vitamins</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold">✓</div>
                    <div><span className="font-bold">Anti-inflammatory compounds</span><br/><span className="text-sm text-gray-500">Traditional pain relief properties</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold">✓</div>
                    <div><span className="font-bold">Digestive health promotion</span><br/><span className="text-sm text-gray-500">High fiber and enzyme content</span></div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold">✓</div>
                    <div><span className="font-bold">Sustained natural energy</span><br/><span className="text-sm text-gray-500">Without caffeine crashes or jitters</span></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ────────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Experience Premium Rajasthan Moringa
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
              Ready to experience the finest organic moringa products directly from our certified farm in Rajasthan? Contact us for fresh orders, bulk purchases, or to schedule a visit to our sustainable moringa farm.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 font-bold shadow-lg">
                  Order Fresh Moringa
                </Button>
              </Link>
              <WhatsAppButton
                message="Hi! I'd like to know more about your organic moringa farm in Rajasthan and visit your facilities. Can you provide details?"
                size="lg"
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50 gap-2"
              >
                Schedule Farm Visit
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}