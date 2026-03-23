"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone } from "lucide-react"
import SuccessModal from "@/components/success-modal"

export function B2BInquiryStatus() {
  const [showModal, setShowModal] = useState(false)
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('submitted') === 'true') {
      setShowModal(true)
      // Clean up URL
      const url = new URL(window.location.href)
      url.searchParams.delete('submitted')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  return (
    <SuccessModal 
      isOpen={showModal} 
      onClose={() => setShowModal(false)} 
      title="B2B Inquiry Received"
      description="Thank you for your interest in our wholesale program. Our team will review your inquiry and get back to you within 24 hours."
    />
  )
}

export function B2BForm() {
  return (
    <form action="/api/b2b/inquiry" method="POST" className="bg-gray-50 rounded-2xl border border-gray-200 p-8 space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Company Name *</Label>
          <Input name="company_name" placeholder="Wellness Co. Ltd." className="mt-1 bg-white" required />
        </div>
        <div>
          <Label>Contact Name *</Label>
          <Input name="contact_name" placeholder="Ronak Sharma" className="mt-1 bg-white" required />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Email Address *</Label>
          <Input name="email" type="email" placeholder="you@company.com" className="mt-1 bg-white" required />
        </div>
        <div>
          <Label>Phone Number *</Label>
          <Input name="phone" placeholder="+91 98765 43210" className="mt-1 bg-white" required />
        </div>
      </div>
      <div>
        <Label>Business Type</Label>
        <select name="business_type" className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300">
          <option value="">Select business type</option>
          <option value="retailer">Retailer / Distributor</option>
          <option value="restaurant">Restaurant / Food Service</option>
          <option value="health_store">Health Food Store</option>
          <option value="clinic">Ayurvedic / Wellness Clinic</option>
          <option value="exporter">Exporter</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label>Products Interested In</Label>
          <Input name="products" placeholder="e.g., Moringa Powder, Leaves" className="mt-1 bg-white" />
        </div>
        <div>
          <Label>Monthly Quantity Needed</Label>
          <Input name="monthly_quantity" placeholder="e.g., 50 kg / month" className="mt-1 bg-white" />
        </div>
      </div>
      <div>
        <Label>Additional Message</Label>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your business requirements, custom packaging needs, etc."
          className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
        />
      </div>
      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-11 gap-2 border-none">
        <Mail className="h-4 w-4" /> Submit Inquiry
      </Button>
      <p className="text-xs text-center text-gray-400">
        We respond within 24 hours. You can also call/WhatsApp us at{" "}
        <a href="tel:+9166599895" className="text-green-600">+91 9166599895</a>
      </p>
    </form>
  )
}
