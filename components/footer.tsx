import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import WhatsAppButton from "@/components/whatsapp-button"

export default function Footer() {
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
    <footer className="bg-gradient-to-b from-green-800 to-green-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Company Information */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Image
                src="/images/image.png"
                alt="Shigruvedas Organic Moringa Farm Logo"
                width={120}
                height={120}
                className="mb-4 bg-white/10 rounded-full p-2"
              />
              <h3 className="text-xl font-bold mb-2">Shigruvedas</h3>
              <p className="text-green-100 text-sm mb-4 leading-relaxed">
                Premium organic moringa products directly from our
                organic farm in Rajasthan, chemical-free sustainable farming.
              </p>
            </div>
            
            {/* Social Media Links */}
            <div>
              <h4 className="font-semibold mb-3 text-green-200">Follow Us</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${social.color}`}
                      aria-label={`Follow Shigruvedas on ${social.name}`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-green-200">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Our Farm Story
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Moringa Products
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Order Now
                </Link>
              </li>
              <li>
                <Link href="/bulk-order" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/farm-visit" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Farm Visits
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4 text-green-200">Our Products</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products/fresh-leaves" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Fresh Moringa Leaves
                </Link>
              </li>
              <li>
                <Link href="/products/powder" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Organic Moringa Powder
                </Link>
              </li>
              <li>
                <Link href="/products/drumsticks" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Fresh Drumsticks
                </Link>
              </li>
              <li>
                <Link href="/products/seeds" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Moringa Seeds
                </Link>
              </li>
              <li>
                <Link href="/products/oil" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Moringa Oil
                </Link>
              </li>
              <li>
                <Link href="/wholesale" className="text-green-100 hover:text-white transition-colors duration-200 hover:underline">
                  Wholesale Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-semibold mb-4 text-green-200">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-green-300 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-100">
                    248, A-Block, Hiran Magri<br />
                    Udaipur, Rajasthan 313002<br />
                    India
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-300 flex-shrink-0" />
                <Link 
                  href="tel:+917877255595" 
                  className="text-green-100 hover:text-white transition-colors duration-200"
                >
                  +91 7877255595
                </Link>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-green-300 flex-shrink-0" />
                <Link 
                  href="mailto:shigruvedas@gmail.com" 
                  className="text-green-100 hover:text-white transition-colors duration-200"
                >
                  shigruvedas@gmail.com
                </Link>
              </div>
              
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-green-300 mt-0.5 flex-shrink-0" />
                <div className="text-green-100">
                  <p>Mon-Sat: 8:00 AM - 7:00 PM</p>
                  <p>Sunday: 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <div className="mt-6">
              <WhatsAppButton
                message="Hi! I'm interested in your organic moringa products from Rajasthan. Can you help me?"
                className="bg-green-600 hover:bg-green-500 text-white text-sm py-2 px-4"
                size="sm"
              >
                WhatsApp Us
              </WhatsAppButton>
            </div>
          </div>
        </div>

        <Separator className="bg-green-700 mb-6" />

        {/* Newsletter Signup */}
        <div className="text-center mb-8">
          <h4 className="font-semibold mb-2 text-green-200">Stay Updated with Shigruvedas</h4>
          <p className="text-green-100 text-sm mb-4">
            Get updates on fresh harvest, seasonal offers, and moringa health tips
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <Button className="bg-green-600 hover:bg-green-500 px-6">
              Subscribe
            </Button>
          </div>
        </div>

        <Separator className="bg-green-700 mb-6" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-green-200">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} Shigruvedas. All rights reserved.</p>
          </div>
          
          {/* <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-white transition-colors duration-200">
              Terms & Conditions
            </Link>
            <Link href="/shipping-policy" className="hover:text-white transition-colors duration-200">
              Shipping Policy
            </Link>
            <Link href="/return-policy" className="hover:text-white transition-colors duration-200">
              Return Policy
            </Link>
          </div> */}
        </div>

        {/* SEO Footer Content */}
        <div className="mt-6 pt-6 border-t border-green-700 text-xs text-green-300 text-center " >
          <p className="mb-2">
            Organic Moringa Rajasthan, Moringa Farm Udaipur, Fresh Moringa Leaves, 
            Moringa Powder, Drumsticks, Chemical-free Farming, Bulk Moringa Supplier India
          </p>
          <p>
            Shigruvedas - Your trusted source for premium organic moringa products from certified organic farms in Rajasthan, India
          </p>
        </div>
      </div>

      {/* Structured Data for Organization */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Shigruvedas",
            "url": "https://shigruvedas.com",
            "logo": "https://shigruvedas.com/images/image.png",
            "sameAs": socialLinks.map(link => link.url),
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-7877255595",
              "contactType": "customer service",
              "email": "shigruvedas@gmail.com",
              "availableLanguage": ["English", "Hindi"]
            },
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "248, A-Block, Hiran Magri",
              "addressLocality": "Udaipur",
              "addressRegion": "Rajasthan",
              "postalCode": "313002",
              "addressCountry": "IN"
            }
          })
        }}
      />
    </footer>
  )
}