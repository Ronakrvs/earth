"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    rating: 5,
    text: "The moringa powder from shigruvedas has been a game-changer for my family's health. The quality is exceptional and you can taste the freshness. My energy levels have improved significantly since I started using it daily.",
    avatar: "/placeholder.svg?height=60&width=60",
    product: "Moringa Powder",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Delhi, NCR",
    rating: 5,
    text: "As a restaurant owner, I was looking for fresh, organic drumsticks for my menu. shigruvedas delivers consistently fresh products and their bulk pricing is very reasonable. My customers love the authentic taste!",
    avatar: "/placeholder.svg?height=60&width=60",
    product: "Fresh Drumsticks",
  },
  {
    id: 3,
    name: "Dr. Meera Patel",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    text: "I recommend shigruvedas moringa products to my patients. The nutritional value is outstanding and the organic certification gives me confidence. The fresh leaves are perfect for my daily green smoothies.",
    avatar: "/placeholder.svg?height=60&width=60",
    product: "Fresh Moringa Leaves",
  },
  {
    id: 4,
    name: "Anita Reddy",
    location: "Bangalore, Karnataka",
    rating: 5,
    text: "I've been ordering from shigruvedas for over a year now. The packaging is excellent, delivery is always on time, and the quality never disappoints. Their customer service is also very responsive.",
    avatar: "/placeholder.svg?height=60&width=60",
    product: "Moringa Powder",
  },
  {
    id: 5,
    name: "Suresh Gupta",
    location: "Pune, Maharashtra",
    rating: 5,
    text: "Started with a small order and now I'm a regular bulk customer. The freshness and quality of their moringa products is unmatched. Great for my health food store business!",
    avatar: "/placeholder.svg?height=60&width=60",
    product: "Bulk Orders",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="container mx-auto px-4 py-16 bg-gradient-to-r from-green-50 to-amber-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-green-800">What Our Customers Say</h2>
      <p className="text-center text-green-600 mb-12 max-w-2xl mx-auto text-lg">
        Real experiences from our satisfied customers across India
      </p>

      <div className="relative max-w-4xl mx-auto">
        <Card className="border-green-200 shadow-xl overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="text-center">
              {/* Quote Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="h-8 w-8 text-green-600" />
              </div>

              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg md:text-xl text-gray-700 mb-8 italic leading-relaxed">
                "{currentTestimonial.text}"
              </blockquote>

              {/* Customer Info */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={currentTestimonial.avatar || "/placeholder.svg"} alt={currentTestimonial.name} />
                  <AvatarFallback className="bg-green-100 text-green-600 text-lg font-semibold">
                    {currentTestimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h4 className="font-semibold text-green-800 text-lg">{currentTestimonial.name}</h4>
                  <p className="text-gray-600">{currentTestimonial.location}</p>
                  <p className="text-sm text-green-600 font-medium">Purchased: {currentTestimonial.product}</p>
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
          onClick={prevTestimonial}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
          onClick={nextTestimonial}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
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

      {/* Customer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 text-center">
        <div>
          <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
          <div className="text-gray-600">Happy Customers</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-amber-600 mb-2">4.9/5</div>
          <div className="text-gray-600">Average Rating</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-emerald-600 mb-2">1000+</div>
          <div className="text-gray-600">Orders Delivered</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
          <div className="text-gray-600">Bulk Partners</div>
        </div>
      </div>
    </section>
  )
}
