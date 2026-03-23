"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRef, useState } from "react"
import SuccessModal from "@/components/success-modal"

export default function ContactForm() {
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
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-bold">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required className="rounded-xl border-gray-200 focus:ring-green-500 h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-bold">Email Address</Label>
            <Input id="email" name="email" type="email" placeholder="john@example.com" required className="rounded-xl border-gray-200 focus:ring-green-500 h-12" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700 font-bold">Phone Number</Label>
            <Input id="phone" name="phone" placeholder="+91 12345 67890" required className="rounded-xl border-gray-200 focus:ring-green-500 h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-gray-700 font-bold">Subject</Label>
            <Select name="subject" required>
              <SelectTrigger className="rounded-xl border-gray-200 focus:ring-green-500 h-12">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="bulk">Bulk Order Request</SelectItem>
                <SelectItem value="farm">Farm Visit</SelectItem>
                <SelectItem value="support">Customer Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-gray-700 font-bold">Your Message</Label>
          <Textarea id="message" name="message" placeholder="How can we help you today?" required className="min-h-[150px] rounded-xl border-gray-200 focus:ring-green-500 py-3" />
        </div>

        <div className="flex items-center space-x-2 bg-gray-50 p-4 rounded-xl">
          <Checkbox id="terms" required />
          <Label htmlFor="terms" className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            I agree to the privacy policy and consent to being contacted.
          </Label>
        </div>

        <Button type="submit" className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-green-200 transition-all hover:scale-[1.01] active:scale-[0.99]">
          Send Message
        </Button>
      </form>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Message Sent Successfully!"
        description="Thank you for reaching out to Shigruvedas. Our team will get back to you within 24 hours."
      />
    </>
  )
}
