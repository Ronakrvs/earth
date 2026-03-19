"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Leaf, Heart, Shield } from "lucide-react"
import Image from "next/image"
import WhatsAppButton from "./whatsapp-button"

const products = [
  {
    id: 1,
    name: "Fresh Moringa Leaves",
    image: "/images/leaves.png",
    description: "Hand-picked, rich in vitamins and minerals",
    benefits: ["High in Vitamin C", "Rich in Iron", "Natural Protein"],
    icon: Leaf,
    color: "green",
  },
  {
    id: 2,
    name: "Premium Moringa Powder",
    image: "/images/powder.png",
    description: "Dried and ground to preserve nutrients",
    benefits: ["Antioxidant Rich", "High Calcium", "Natural Energy"],
    icon: Heart,
    color: "amber",
  },
  // {
  //   id: 3,
  //   name: "Fresh Drumsticks",
  //   image: "/images/drumstick.png",
  //   description: "Tender moringa pods perfect for cooking",
  //   benefits: ["High Fiber", "Rich in Folate", "Natural Minerals"],
  //   icon: Shield,
  //   color: "emerald",
  // },
  // {
  //   id: 4,
  //   name: "Moringa Tea Leaves",
  //   image: "/placeholder.svg?height=400&width=600",
  //   description: "Specially processed for brewing healthy tea",
  //   benefits: ["Detoxifying", "Immune Boost", "Natural Caffeine"],
  //   icon: Leaf,
  //   color: "green",
  // },
  // {
  //   id: 5,
  //   name: "Moringa Oil",
  //   image: "/placeholder.svg?height=400&width=600",
  //   description: "Cold-pressed oil from moringa seeds",
  //   benefits: ["Skin Care", "Hair Health", "Cooking Oil"],
  //   icon: Heart,
  //   color: "amber",
  // },
]

export default function ProductGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length)
  }

  const currentProduct = products[currentIndex]
  const IconComponent = currentProduct.icon

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-green-800">Product Gallery</h2>
      <p className="text-center text-green-600 mb-12 max-w-2xl mx-auto text-lg">
        Explore our complete range of organic moringa products
      </p>

      <div className="relative max-w-4xl mx-auto">
        <Card className="overflow-hidden border-green-200 shadow-xl">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-80 md:h-96">
                <Image
                  src={currentProduct.image ?? "images/logo.png"}
                  alt={currentProduct.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-green-50 to-amber-50">
                <div
                  className={`w-16 h-16 bg-${currentProduct.color}-100 rounded-full flex items-center justify-center mb-4`}
                >
                  <IconComponent className={`h-8 w-8 text-${currentProduct.color}-600`} />
                </div>

                <h3 className="text-2xl font-bold text-green-800 mb-3">{currentProduct.name}</h3>
                <p className="text-gray-600 mb-4 text-lg">{currentProduct.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {currentProduct.benefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={`bg-${currentProduct.color}-100 text-${currentProduct.color}-700`}
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <Button className={`w-full bg-${currentProduct.color}-600 hover:bg-${currentProduct.color}-700`}>
                    Order {currentProduct.name}
                  </Button>
                  <WhatsAppButton
                    message={`Hi! I'm interested in ${currentProduct.name}. Can you provide pricing and availability?`}
                    className="w-full"
                    variant="outline"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex ? "bg-green-600 scale-125" : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
