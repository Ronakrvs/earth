"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Phone, MapPin, Clock, Truck, Leaf } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import SuccessModal from "./successModal"

export default function ContactPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData.entries())

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to submit")
        setIsModalOpen(true)
        formRef.current?.reset()
      })
      .catch((error) => alert("Form submission failed: " + error.message))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm mx-auto">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            We'd Love to Hear From You
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Get in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-200">
              Touch
            </span>
          </h1>

          <p className="text-green-100 text-lg md:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
            Ready to experience the power of organic moringa? Place your order or inquire about bulk purchases today!
          </p>
        </div>
      </section>

      {/* ─── CONTACT SECTION ──────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Form */}
          <Card className="border-gray-100 shadow-xl rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 pb-8 pt-8 px-8">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                  <Leaf className="h-5 w-5 text-green-600" />
                </div>
                Place Your Order/Inquiry
              </CardTitle>
              <CardDescription className="text-gray-500 text-base">
                Fill out the form below and we'll get back to you with pricing and availability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8 px-8 pb-8">
              <form
                ref={formRef}
          name="contact"
          method="POST"
          data-netlify="true"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
    <input type="hidden" name="form-name" value="contact" />

    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input id="firstName" name="firstName" placeholder="Your first name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input id="lastName" name="lastName" placeholder="Your last name" required />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="email">Email Address *</Label>
      <Input id="email" name="email" type="email" placeholder="your@email.com" required />
    </div>

    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number *</Label>
      <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" required />
    </div>

    <div className="space-y-2">
      <Label htmlFor="address">Delivery Address</Label>
      <Textarea id="address" name="address" placeholder="Complete address for delivery..." className="min-h-[80px]" />
    </div>

    <div className="space-y-4">
      <Label className="text-base font-semibold">Products Needed *</Label>
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="fresh-leaves" name="freshLeaves" />
          <Label htmlFor="fresh-leaves" className="flex-1">Fresh Moringa Leaves</Label>
          <Input name="freshLeavesQty" placeholder="Quantity" className="w-24" />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="powder" name="powder" />
          <Label htmlFor="powder" className="flex-1">Moringa Powder</Label>
          <Input name="powderQty" placeholder="Quantity" className="w-24" />
        </div>
        {/* <div className="flex items-center space-x-2">
          <Checkbox id="drumsticks" name="drumsticks" />
          <Label htmlFor="drumsticks" className="flex-1">Fresh Drumsticks</Label>
          <Input name="drumsticksQty" placeholder="Quantity" className="w-24" />
        </div> */}
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="order-type">Order Type</Label>
      <Select name="orderType">
        <SelectTrigger>
          <SelectValue placeholder="Select order type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="personal">Personal Use</SelectItem>
          <SelectItem value="bulk">Bulk Purchase</SelectItem>
          <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
          <SelectItem value="retail">Retail Partnership</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-2">
      <Label htmlFor="message">Additional Requirements</Label>
      <Textarea
        id="message"
        name="message"
        placeholder="Any specific requirements, delivery preferences, or questions..."
        className="min-h-[100px]"
      />
    </div>

    <div className="flex items-center space-x-2">
      <Checkbox id="terms" name="terms" />
      <Label htmlFor="terms" className="text-sm">
        I agree to receive updates about my order and promotional offers from shigruvedas
      </Label>
    </div>

    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-12 rounded-xl shadow-lg">
      Submit Order Request
    </Button>
  </form>
            </CardContent>
          </Card>
          <SuccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

     
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center mr-4">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                Get in Touch
              </h3>
              <p className="text-gray-500 mb-8 border-b border-gray-100 pb-6">Multiple ways to reach us for orders and inquiries.</p>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Email Orders</h3>
                    <p className="text-gray-600">shigruvedas@gmail.com</p>
                    {/* <p className="text-gray-600">sales@shigruvedas.com</p> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold">Phone Orders</h3>
                    <p className="text-gray-600">+91 7877255595 (Orders)</p>
                    {/* <p className="text-gray-600">+91 87654 32109 (Bulk Inquiry)</p> */}
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">Shigruvedas Agro Export</p>
                    {/* <p className="text-gray-600">Village Wellness Road</p> */}
                    <p className="text-gray-600">248, A-Block,hiran magri,saweena,sector 9,udaipur, raj 313002</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Order Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 8:00 AM - 7:00 PM</p>
                    <p className="text-gray-600">Sunday: 9:00 AM - 5:00 PM</p>
                    {/* <p className="text-gray-600">Harvest Season: Extended Hours</p> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Bulk Purchase Info */}
            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-amber-900 flex items-center mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center mr-4">
                  <Truck className="h-5 w-5 text-amber-600" />
                </div>
                Bulk Purchase Benefits
              </h3>
              <div className="space-y-4">
                <ul className="space-y-3 text-amber-950/80">
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold mr-3 mt-0.5">✓</div>
                    Special wholesale pricing for bulk orders
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold mr-3 mt-0.5">✓</div>
                    Free delivery for orders above ₹5,000
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold mr-3 mt-0.5">✓</div>
                    Custom packaging options available
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold mr-3 mt-0.5">✓</div>
                    Regular supply contracts for businesses
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-amber-800 text-xs font-bold mr-3 mt-0.5">✓</div>
                    Quality certificates and lab reports
                  </li>
                </ul>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold h-12 rounded-xl shadow-md mt-6">Request Bulk Pricing</Button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 rounded-3xl p-8 border border-blue-100 shadow-sm hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold text-blue-900 mb-6 border-b border-blue-200/50 pb-4">Delivery Information</h3>
              <div className="space-y-4 text-blue-950/80">
                <p>
                  <strong className="text-blue-900">Local Delivery:</strong> Same day for orders before 2 PM
                </p>
                <p>
                  <strong className="text-blue-900">Regional Delivery:</strong> 1-2 business days
                </p>
                <p>
                  <strong className="text-blue-900">Pan-India:</strong> 2-5 business days via courier
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
