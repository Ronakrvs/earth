"use client";

import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Instagram, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Do not show footer on admin pages or auth pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) {
    return null;
  }

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (res.ok) {
        toast.success("You're in! 🌿 Welcome to the Shigruvedas circle.");
        setEmail("");
      } else {
        const d = await res.json();
        toast.error(d.error || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentYear = new Date().getFullYear();

  // Social media links - replace with your actual social media URLs
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/1DNrEMqNDx/",
      icon: Facebook,
      color: "text-blue-600 hover:text-blue-700"
    },
    {
      name: "Instagram", 
      url: "https://www.instagram.com/shigruvedas?utm_source=qr&igsh=eHc2bXQwMDg3a2dx",
      icon: Instagram,
      color: "text-pink-600 hover:text-pink-700"
    },
    // {
    //   name: "Twitter",
    //   url: "https://twitter.com/shigruvedas", 
    //   icon: Twitter,
    //   color: "text-blue-400 hover:text-blue-500"
    // },
    // {
    //   name: "YouTube",
    //   url: "https://youtube.com/@shigruvedas",
    //   icon: Youtube,
    //   color: "text-red-600 hover:text-red-700"
    // },
    // {
    //   name: "LinkedIn",
    //   url: "https://linkedin.com/company/shigruvedas",
    //   icon: Linkedin,
    //   color: "text-blue-700 hover:text-blue-800"
    // }
  ];

  return (
    <footer className="relative bg-background pt-32 pb-12 overflow-hidden text-foreground border-t border-border/50">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2" />
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          {/* Brand & Mission */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-4 mb-8 group">
              <div className="h-12 w-12 rounded-2xl bg-card/70 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-500">
                <Image src="/images/logo.png" alt="Logo" width={32} height={32} />
              </div>
              <span className="text-2xl font-black tracking-tighter">SHIGRUVEDAS</span>
            </Link>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-sm">
              Cultivating the "Miracle Tree" with ancestral wisdom and modern precision. Pure, organic, and direct from our sun-drenched Rajasthan farm.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-12 w-12 rounded-2xl bg-card/70 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-8" suppressHydrationWarning>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-8">Sanctuary</h4>
              <ul className="space-y-4">
                {[
                  { n: "Our Story", h: "/about" },
                  { n: "Shop All", h: "/shop" },
                  { n: "Recipes", h: "/recipes" },
                  { n: "Blog Journal", h: "/blog" },
                ].map((l) => (
                  <li key={l.n}>
                    <Link href={l.h} className="text-muted-foreground hover:text-primary font-bold transition-colors">
                      {l.n}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-8">Assistance</h4>
              <ul className="space-y-4">
                {[
                  { n: "Track Order", h: "/track-order" },
                  { n: "FAQ", h: "/faq" },
                  { n: "Contact Us", h: "/contact" },
                  { n: "Shipping Policy", h: "/shipping" },
                ].map((l) => (
                  <li key={l.n}>
                    <Link href={l.h} className="text-muted-foreground hover:text-primary font-bold transition-colors">
                      {l.n}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-8">Partners</h4>
              <ul className="space-y-4">
                {[
                  { n: "Bulk / Wholesale", h: "/b2b" },
                  { n: "Contract Farming", h: "/contract-farming" },
                  { n: "Farm Visit", h: "/farm-visit" },
                ].map((l) => (
                  <li key={l.n}>
                    <Link href={l.h} className="text-muted-foreground hover:text-primary font-bold transition-colors">
                      {l.n}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-8">Reach Out</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-card/70 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  248, A-Block, Hiran Magri<br />
                  Udaipur, Rajasthan 313002
                </p>
              </div>
              
              <div className="flex items-center gap-4 group">
                <div className="h-10 w-10 rounded-xl bg-card/70 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Link href="tel:+919166599895" className="block text-lg font-black text-foreground hover:text-primary transition-colors">+91 9166599895</Link>
                  <Link href="tel:+917877255595" className="block text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">+91 7877255595</Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-card/70 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <Link href="mailto:shigruvedas@gmail.com" className="text-muted-foreground font-bold hover:text-foreground transition-colors">
                  shigruvedas@gmail.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter - Glassmorphic Card */}
        <div className="relative mb-24 p-8 md:p-12 rounded-[32px] bg-card/70 border border-border/60 backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
            <Leaf className="h-24 w-24 text-primary rotate-45" />
          </div>
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-black mb-4">Join the Healing <span className="text-gradient">Circle</span></h3>
            <p className="text-muted-foreground font-medium mb-8">Subscribe for weekly health tips, moringa recipes, and exclusive offers. 8,000+ families already in.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 h-14 bg-card/70 border border-white/10 rounded-2xl px-6 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Button
                type="submit"
                disabled={loading}
                className="h-14 px-8 bg-primary hover:bg-primary-dark text-white font-black rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? "Subscribing…" : "Subscribe Free →"}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground/60 mt-3 font-medium">No spam. Unsubscribe anytime. 💚</p>
          </div>
        </div>

        <div className="pt-12 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground font-bold text-sm" suppressHydrationWarning>
              &copy; {currentYear} SHIGRUVEDAS. <span className="font-medium">CRAFTED FOR YOUR SOUL.</span>
            </p>
            <p className="text-muted-foreground/50 text-xs mt-1 font-medium">
              FSSAI Lic. No.: 22226088000XXX &nbsp;
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-[12px] font-black uppercase tracking-widest text-muted-foreground">
            {["Privacy", "Terms", "Shipping", "FAQ"].map((t) => (
              <Link key={t} href={`/${t.toLowerCase()}`} className="hover:text-primary transition-colors">{t}</Link>
            ))}
            <Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link>
          </div>
        </div>

        {/* SEO Keywords Footer */}
        <div className="mt-16 pt-8 border-t border-border/60 text-[10px] text-muted-foreground/80 font-medium text-center tracking-[0.1em] uppercase">
          <p className="mb-2 leading-relaxed max-w-4xl mx-auto">
            Organic Moringa Rajasthan · Moringa Farm Udaipur · Fresh Moringa Leaves · Organic Moringa Powder · Drumsticks · Chemical-free 
            Farming · Sustainable Agriculture · Bulk Moringa Supplier India · Moringa Wellness Rajasthan · Contract Farming India
          </p>
          <p className="text-primary/40">
            Rajasthan's Purest Harvest · From Our Soil to Your Soul
          </p>
        </div>
      </div>

    </footer>
  )
}