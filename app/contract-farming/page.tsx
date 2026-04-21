"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
    Trees, Sprout, TrendingUp, ShieldCheck, 
    ArrowRight, MapPin, LandPlot, MessageSquare,
    Leaf, Zap, CheckCircle2, Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MoringaCard } from "@/components/ui/moringa-card"
import { toast } from "sonner"
import Image from "next/image"

export default function ContractFarmingPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        try {
            const res = await fetch("/api/contract-farming", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setSubmitted(true)
                toast.success("Submission received! Our team will contact you soon.")
            } else {
                toast.error("Something went wrong. Please try again.")
            }
        } catch (error) {
            toast.error("Network error.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden bg-slate-950 text-white">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                        >
                            <Trees className="h-4 w-4" /> Global Partnership
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] italic mb-8"
                        >
                            Scale Your Harvest with <span className="text-emerald-500">Shigruvedas</span>.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12 max-w-2xl"
                        >
                            Partner with India's leading organic moringa producer. From buy-back guarantees to technical expertise, we empower landowners to manifest premium organic assets.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button 
                                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className="h-16 px-10 bg-emerald-500 text-white hover:bg-emerald-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all group border-none"
                            >
                                Apply Now <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-32 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { 
                                icon: ShieldCheck, 
                                title: "Buy-back Guarantees", 
                                desc: "Secure your future with pre-harvest purchase agreements at competitive market rates.",
                                delay: 0.1
                            },
                            { 
                                icon: Sprout, 
                                title: "Technical Support", 
                                desc: "Access 15+ years of organic moringa expertise. We guide you from seed selection to harvest.",
                                delay: 0.2
                            },
                            { 
                                icon: TrendingUp, 
                                title: "Yield Optimization", 
                                desc: "Manifest up to 30% higher yields with our proprietary stone-ground management protocols.",
                                delay: 0.3
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: item.delay }}
                                className="space-y-6 group"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-500">
                                    <item.icon className="h-8 w-8 text-emerald-500 group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">{item.title}</h3>
                                <p className="text-slate-500 font-medium text-lg leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Premium Stats Section */}
            <section className="py-24 bg-slate-50 border-y border-slate-100">
                 <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tight italic text-slate-900">The Power of Moringa.</h2>
                            <p className="text-slate-500 font-medium max-w-md">Join over 20 growers across Rajasthan and Gujarat in our network.</p>
                        </div>
                        <div className="flex gap-12 md:gap-24">
                            <div>
                                <div className="text-5xl font-black italic text-emerald-600">500+</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Active Acres</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black italic text-emerald-600">₹2Cr+</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Grower Income</div>
                            </div>
                            <div>
                                <div className="text-5xl font-black italic text-emerald-600">100%</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mt-2">Organic Path</div>
                            </div>
                        </div>
                    </div>
                 </div>
            </section>

            {/* Submission Form Section */}
            <section id="contact-form" className="py-32 bg-white relative">
                 <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-20">
                        <div className="lg:w-1/3 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black tracking-tighter italic leading-none">Apply to Join Our Network.</h2>
                                <p className="text-slate-500 font-medium text-lg">Send us details about your land and we'll manifest a partnership together.</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-900 font-black italic">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Minimum 2 Acres
                                </div>
                                <div className="flex items-center gap-4 text-slate-900 font-black italic">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Soil Eligibility Analysis
                                </div>
                                <div className="flex items-center gap-4 text-slate-900 font-black italic">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Organic Commitment
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            {submitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-16 bg-emerald-50 border border-emerald-100 rounded-[3rem] text-center space-y-6"
                                >
                                    <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white">
                                        <CheckCircle2 className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-3xl font-black text-emerald-900 italic">Submission Successful!</h3>
                                    <p className="text-emerald-700 font-medium max-w-sm mx-auto">
                                        Your details have been registered in our database. Our agricultural specialist will contact you within 48 business hours.
                                    </p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl border-emerald-200 text-emerald-600 font-bold px-8">
                                        Send another application
                                    </Button>
                                </motion.div>
                            ) : (
                                <MoringaCard className="p-10 md:p-16 border-slate-100 shadow-2xl relative overflow-hidden" glass={true}>
                                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="full_name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Full Name</Label>
                                                <Input 
                                                    id="full_name" name="full_name" required 
                                                    className="h-14 bg-white border-slate-100 rounded-2xl font-bold shadow-sm focus:ring-emerald-500/20" 
                                                    placeholder="John Doe" 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Email Protocol</Label>
                                                <Input 
                                                    id="email" name="email" type="email" required 
                                                    className="h-14 bg-white border-slate-100 rounded-2xl font-bold shadow-sm focus:ring-emerald-500/20" 
                                                    placeholder="john@example.com" 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Number</Label>
                                                <Input 
                                                    id="phone" name="phone" required 
                                                    className="h-14 bg-white border-slate-100 rounded-2xl font-bold shadow-sm focus:ring-emerald-500/20" 
                                                    placeholder="+91 ...." 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Farm Location</Label>
                                                <Input 
                                                    id="location" name="location" required 
                                                    className="h-14 bg-white border-slate-100 rounded-2xl font-bold shadow-sm focus:ring-emerald-500/20" 
                                                    placeholder="City, State" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="land_size" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Approximate Land Size (Acres)</Label>
                                            <Input 
                                                id="land_size" name="land_size" required 
                                                className="h-14 bg-white border-slate-100 rounded-2xl font-bold shadow-sm focus:ring-emerald-500/20" 
                                                placeholder="e.g. 5 Acres" 
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Message / Additional Details</Label>
                                            <Textarea 
                                                id="message" name="message" 
                                                className="min-h-[120px] bg-white border-slate-100 rounded-2xl font-bold shadow-sm focus:ring-emerald-500/20 p-4" 
                                                placeholder="Tell us about your current crops or water source..." 
                                            />
                                        </div>
                                        <Button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full h-16 bg-slate-900 text-white hover:bg-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all disabled:opacity-70"
                                        >
                                            {loading ? <span className="flex items-center gap-3 italic"><Zap className="h-4 w-4 animate-spin" /> Transmitting...</span> : "Establish Partnership"}
                                        </Button>
                                    </form>
                                </MoringaCard>
                            )}
                        </div>
                    </div>
                 </div>
            </section>
        </div>
    )
}
