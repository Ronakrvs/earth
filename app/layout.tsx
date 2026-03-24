import type React from "react"
import type { Metadata, Viewport } from "next"
import { Outfit, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Providers from "@/components/Providers"
import ThemeWrapper from "@/components/layout/ThemeWrapper"
import { Toaster } from "sonner"
import Script from "next/script"

const outfit = Outfit({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-outfit'
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-jakarta'
})

export const metadata: Metadata = {
  // ... existing metadata stays the same
  metadataBase: new URL('https://shigruvedas.com'),
  title: {
    default: "Shigruvedas - Organic Moringa Farm | Fresh Leaves, Powder & Drumsticks",
    template: "%s | Shigruvedas"
  },
  description: "Premium organic moringa products directly from our farm in India. Fresh moringa leaves, pure powder, drumsticks & seeds. Wholesale & retail. Chemical-free farming. Nutrition from Earth to Wellness.",
  keywords: [
    "organic moringa India",
    "moringa farming Rajasthan", 
    "moringa leaves benefits",
    "pure moringa powder",
    "fresh drumsticks online",
    "organic moringa seeds",
    "wholesale moringa supplier",
    "shigruvedas organic",
    "buy moringa powder India"
  ],
  authors: [{ name: "Shigruvedas Organic Farm" }],
  creator: "Shigruvedas",
  publisher: "Shigruvedas",
  openGraph: {
    type: "website",
    siteName: "Shigruvedas",
    title: "Shigruvedas - Premium Organic Moringa Products",
    description: "Fresh organic moringa leaves, powder & drumsticks directly from our farm. Wholesale & retail orders available.",
    url: "https://shigruvedas.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Shigruvedas Organic Moringa Farm",
      }
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shigruvedas - Organic Moringa Farm",
    description: "Premium organic moringa products from our farm. Fresh leaves, powder & drumsticks.",
    images: ["/twitter-image.jpg"],
  },
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
  alternates: {
    canonical: "https://shigruvedas.com",
  },
}

export const viewport: Viewport = {
  themeColor: "#064e3b",
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-IN" className={`${outfit.variable} ${jakarta.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
        {/* ... existing scripts ... */}
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
              "telephone": "+91-9166599895",
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
                "https://wa.me/9166599895"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9166599895",
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
              "foundingDate": "2020",
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
                "telephone": "+91-9166599895",
                "email": "shigruvedas@gmail.com",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://wa.me/9166599895"
              ]
            })
          }}
        />
      </head>
      
      <body className={`${outfit.className} bg-background font-outfit selection:bg-primary/20 selection:text-primary`}>
        <Providers>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-primary text-white p-2 z-50 rounded-b-lg">
            Skip to main content
          </a>
          
          <ThemeWrapper>
            <Navbar />
            <main id="main-content" role="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </ThemeWrapper>
          
          <Toaster position="top-right" richColors closeButton />

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