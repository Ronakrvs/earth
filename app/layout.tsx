import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Providers from "@/components/Providers"
import { Toaster } from "sonner"
import Script from "next/script"


const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: "Shigruvedas - Organic Moringa Farm | Fresh Leaves, Powder & Drumsticks",
    template: "%s | Shigruvedas - Organic Moringa Farm"
  },
  description: "Premium organic moringa products directly from our farm in India. Fresh moringa leaves, pure powder, drumsticks & seeds. Wholesale & retail. Chemical-free farming. Nutrition from Earth to Wellness.",
  keywords: [
    "organic moringa",
    "moringa farming", 
    "moringa leaves",
    "moringa powder",
    "drumsticks",
    "moringa seeds",
    "organic farming",
    "wholesale moringa",
    "fresh moringa",
    "shigruvedas",
    "moringa supplier India",
    "bulk moringa orders"
  ],
  authors: [{ name: "Shigruvedas Organic Farm" }],
  creator: "Shigruvedas",
  publisher: "Shigruvedas",
  applicationName: "Shigruvedas",
  generator: "Next.js",
  category: "Agriculture",
  classification: "Organic Farming",
  
  // Open Graph
  openGraph: {
    type: "website",
    siteName: "Shigruvedas - Organic Moringa Farm",
    title: "Shigruvedas - Premium Organic Moringa Products",
    description: "Fresh organic moringa leaves, powder & drumsticks directly from our farm. Wholesale & retail orders available.",
    url: "https://shigruvedas.com",
    images: [
      {
        url: "/og-image.jpg", // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Shigruvedas Organic Moringa Farm - Fresh leaves and powder",
      }
    ],
    locale: "en_IN",
  },

  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    site: "@shigruvedas", // Add your Twitter handle
    creator: "@shigruvedas",
    title: "Shigruvedas - Organic Moringa Farm",
    description: "Premium organic moringa products from our farm. Fresh leaves, powder & drumsticks.",
    images: ["/twitter-image.jpg"], // Add this image to your public folder
  },

  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add these once you get them)
  verification: {
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },

  // Alternate languages if you plan to add them
  alternates: {
    canonical: "https://shigruvedas.com",
    languages: {
      'en-IN': 'https://shigruvedas.com',
      // 'hi-IN': 'https://shigruvedas.com/hi', // If you add Hindi
    },
  },

  // Additional metadata
  other: {
    'contact:email': 'shigruvedas@gmail.com',
    'contact:phone_number': '+91-7877255595',
    'business:contact_data:street_address': '248, A-Block, hiran magri',
    'business:contact_data:locality': 'Udaipur',
    'business:contact_data:region': 'Rajasthan',
    'business:contact_data:postal_code': '313002',
    'business:contact_data:country_name': 'India',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#22c55e" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        
        {/* Additional SEO meta tags */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        
        {/* Structured Data - Enhanced LocalBusiness Schema with Products */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Shigruvedas - Organic Moringa Farm",
              "alternateName": "Shigruvedas",
              "description": "Premium organic moringa products directly from our certified organic farm in Rajasthan. Fresh moringa leaves, powder, and drumsticks with free delivery.",
              "url": "https://shigruvedas.com",
              "telephone": "+91-7877255595",
              "email": "shigruvedas@gmail.com",
              "logo": "https://shigruvedas.com/logo.png",
              "image": "https://shigruvedas.com/moringa-farm.jpg",
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
              "openingHours": "Mo-Sa 08:00-19:00, Su 09:00-17:00",
              "sameAs": [
                "https://wa.me/917877255595"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-7877255595",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"],
                "areaServed": "IN"
              },
              "priceRange": "$",
              "paymentAccepted": ["Cash", "Credit Card", "UPI", "Bank Transfer"],
              "currenciesAccepted": "INR",
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Organic Moringa Products",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Fresh Organic Moringa Leaves",
                      "description": "Hand-picked daily from our organic farms in Rajasthan. Rich in 90+ nutrients including Vitamin C, Iron, and Protein.",
                      "category": "Organic Vegetables",
                      "brand": {
                        "@type": "Brand",
                        "name": "Shigruvedas"
                      }
                    },
                    "availability": "https://schema.org/InStock",
                    "priceCurrency": "INR"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Organic Moringa Powder",
                      "description": "Premium quality dried and powdered moringa leaves. Perfect for smoothies, cooking, and daily supplements.",
                      "category": "Health Supplements",
                      "brand": {
                        "@type": "Brand",
                        "name": "Shigruvedas"
                      }
                    },
                    "availability": "https://schema.org/InStock",
                    "priceCurrency": "INR"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Fresh Moringa Drumsticks",
                      "description": "Young, tender moringa pods perfect for traditional Indian cooking. Rich in fiber, vitamins, and minerals.",
                      "category": "Organic Vegetables",
                      "brand": {
                        "@type": "Brand",
                        "name": "Shigruvedas"
                      }
                    },
                    "availability": "https://schema.org/InStock",
                    "priceCurrency": "INR"
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": "127"
              }
            })
          }}
        />

        {/* Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Shigruvedas - Organic Moringa Farm",
              "alternateName": "Shigruvedas",
              "url": "https://shigruvedas.com",
              "logo": "https://shigruvedas.com/logo.png",
              "description": "Certified organic moringa farming company in Rajasthan specializing in fresh leaves, powder, and drumsticks",
              "foundingDate": "2020", // Update with actual founding date
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "248, A-Block, hiran magri",
                "addressLocality": "Udaipur",
                "addressRegion": "Rajasthan",
                "postalCode": "313002",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-7877255595",
                "email": "shigruvedas@gmail.com",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://wa.me/917877255595"
              ]
            })
          }}
        />
      </head>
      
      <body className={inter.className}>
        <Providers>
          {/* Skip to main content for accessibility */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50">
            Skip to main content
          </a>
          
          <Navbar />
          
          <main id="main-content" role="main">
            {children}
          </main>
          
          <Footer />
          <Toaster position="top-right" richColors closeButton />

          {/* Google Analytics - Replace with your GA4 measurement ID */}
          {process.env.NODE_ENV === 'production' && (
            <>
              <Script
                src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
                strategy="afterInteractive"
              />
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_MEASUREMENT_ID');
                `}
              </Script>
            </>
          )}
        </Providers>
      </body>
    </html>
  )
}