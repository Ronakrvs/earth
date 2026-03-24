"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Phone, Building2, User, Globe, Package, Zap, Send } from "lucide-react"
import SuccessModal from "@/components/success-modal"
import * as motion from "framer-motion/client"
import { MoringaCard } from "@/components/ui/moringa-card"
import Link from "next/link"

export function B2BForm() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const body = Object.fromEntries(formData.entries())

    try {
      const res = await fetch("/api/b2b/inquiry", {
        method: "POST",
        body: formData, // the API expects formData
      })

      if (!res.ok) throw new Error("Submission failed")

      setIsModalOpen(true)
      formRef.current?.reset()
    } catch (error: any) {
      alert("Error: " + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-3">
            <Label htmlFor="company_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Institutional Title</Label>
            <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input id="company_name" name="company_name" placeholder="Wellness Co. Ltd." required className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-3">
            <Label htmlFor="contact_name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Representative Name</Label>
            <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input id="contact_name" name="contact_name" placeholder="Ronak Sharma" required className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none" />
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-3">
            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Corporate Correspondence</Label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input id="email" name="email" type="email" placeholder="you@company.com" required className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-3">
            <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Direct Communication</Label>
            <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input id="phone" name="phone" placeholder="+91 98765 43210" required className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none" />
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-3">
            <Label htmlFor="business_type" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Entity Classification</Label>
            <Select name="business_type">
              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                <SelectItem value="retailer">Retailer / Distributor</SelectItem>
                <SelectItem value="restaurant">Restaurant / Food Service</SelectItem>
                <SelectItem value="health_store">Health Food Store</SelectItem>
                <SelectItem value="clinic">Ayurvedic / Wellness Clinic</SelectItem>
                <SelectItem value="exporter">Global Exporter</SelectItem>
                <SelectItem value="other">Other Entity</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-3">
            <Label htmlFor="monthly_quantity" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Projected Volume (Monthly)</Label>
            <div className="relative">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input id="monthly_quantity" name="monthly_quantity" placeholder="e.g., 50 kg / month" required className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none" />
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-3">
            <Label htmlFor="products" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Portfolio Interest</Label>
            <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <Input id="products" name="products" placeholder="e.g., Moringa Powder, Fresh Leaves" className="h-14 pl-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all font-medium ring-0 focus-visible:ring-0 shadow-none" />
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="space-y-3">
          <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-4">Strategic Requirements / Notes</Label>
          <Textarea 
            id="message" 
            name="message" 
            placeholder="Tell us about your architectural requirements, white-labeling needs, or specific botanical standards..." 
            className="min-h-[160px] rounded-[2.5rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-primary/20 transition-all py-6 px-6 font-medium ring-0 focus-visible:ring-0 shadow-none" 
          />
        </motion.div>

        <Button 
            disabled={isSubmitting}
            type="submit" 
            className="w-full h-18 bg-primary text-white hover:bg-emerald-900 font-black text-xl rounded-2xl shadow-2xl transition-all active:scale-[0.98] group flex items-center justify-center gap-4 border-none"
        >
          {isSubmitting ? "Initiating B2B Nexus..." : <>Submit Institutional Inquiry <Send className="h-5 w-5 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" /></>}
        </Button>
      </form>

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="B2B Application Received."
        description="Your institutional profile is being reviewed by our partnership artisans. Expect a bespoke proposal within 24 hours."
      />
    </>
  )
}
