"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRef, useState } from "react"
import SuccessModal from "@/components/success-modal"
import * as motion from "framer-motion/client"
import { Send, ArrowRight, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function ContactForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
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
      .finally(() => setIsSubmitting(false))
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Full Identity</Label>
            <Input id="name" name="name" placeholder="John Doe" required className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 10 }} 
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Digital Mail</Label>
            <Input id="email" name="email" type="email" placeholder="john@example.com" required className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0" />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Direct Connection</Label>
            <Input id="phone" name="phone" placeholder="+91 12345 67890" required className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 10 }} 
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            <Label htmlFor="subject" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Inquiry Nature</Label>
            <Select name="subject" required>
              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none">
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                <SelectItem value="general">General Botanical Inquiry</SelectItem>
                <SelectItem value="bulk">Wholesale / B2B Request</SelectItem>
                <SelectItem value="farm">Scheduled Farm Visit</SelectItem>
                <SelectItem value="support">Wellness Support</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Your Intent</Label>
          <Textarea id="message" name="message" placeholder="How can we assist your botanical journey?" required className="min-h-[160px] rounded-[2.5rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all py-6 px-6 font-medium ring-0 focus-visible:ring-0 shadow-none" />
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center space-x-4 bg-primary/5 p-6 rounded-3xl border border-primary/5"
        >
          <Checkbox id="terms" required className="w-6 h-6 rounded-lg border-primary/20 ring-0 focus-visible:ring-0" />
          <Label htmlFor="terms" className="text-xs text-slate-500 italic leading-relaxed font-medium">
            I acknowledge that my data will be handled with integrity as per the <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </Label>
        </motion.div>

        <Button 
            disabled={isSubmitting}
            type="submit" 
            className="w-full h-18 bg-primary text-white hover:bg-emerald-900 font-black text-xl rounded-2xl shadow-2xl transition-all active:scale-[0.98] group flex items-center justify-center gap-4 border-none"
        >
          {isSubmitting ? "Initiating Alchemy..." : <>Manifest Message <Send className="h-5 w-5 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" /></>}
        </Button>
      </form>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Botanical Intent Received."
        description="Our artisans of wellness will review your inquiry and connect with you within one solar cycle (24 hours)."
      />
    </>
  )
}
