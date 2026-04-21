import type { Metadata } from "next"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions | Shigruvedas",
  description:
    "Answers to your most common questions about Shigruvedas organic moringa products, shipping, returns, certifications, and more.",
}

const faqs = [
  {
    category: "Products & Quality",
    items: [
      {
        q: "What makes Shigruvedas moringa different from supermarket brands?",
        a: "Our moringa is grown on our own 7+ acre certified organic farm in the Aravali Foothills, Udaipur. We control the entire process — from seed to packaging — with zero chemicals, zero middlemen, and zero compromise. Supermarket brands often third-party source and blend moringa of unknown origin. Every batch we produce is lab-tested and carries a harvest date.",
      },
      {
        q: "Is the moringa powder raw and unprocessed?",
        a: "Yes. Our moringa leaves are sun-dried at controlled low temperatures (below 40°C) to preserve nutrients, then stone-ground into a fine powder. We never use spray-drying or high-heat processing, which destroy heat-sensitive vitamins like Vitamin C.",
      },
      {
        q: "Do you have lab test reports / COA?",
        a: "Yes. Every production batch is third-party lab tested for pesticides, heavy metals, microbiology, and nutritional profile. You can request the current batch COA by emailing us at shigruvedas@gmail.com or WhatsApping us at +91 91665 99895.",
      },
      {
        q: "Are your products FSSAI certified?",
        a: "Yes. We are registered under FSSAI (Food Safety and Standards Authority of India). Our license number is displayed on all product packaging and in our footer.",
      },
      {
        q: "What is the shelf life of moringa powder?",
        a: "Sealed moringa powder stays fresh for 18 months. Once opened, store it in a cool, dry place away from direct sunlight and use within 6 months for best nutritional potency. Do not refrigerate — moisture reduces shelf life.",
      },
    ],
  },
  {
    category: "Health & Usage",
    items: [
      {
        q: "How much moringa powder should I take per day?",
        a: "Start with ½ teaspoon (about 2g) per day for the first week, then increase to 1 teaspoon (4–5g) daily. You can mix it into warm water, smoothies, dal, soups, or any recipe. Do not exceed 2 teaspoons per day without consulting a healthcare provider.",
      },
      {
        q: "Can pregnant women use moringa?",
        a: "Moringa leaves and powder are commonly used during pregnancy in traditional Indian medicine. However, moringa root, bark, and seeds should be avoided during pregnancy. We recommend consulting your doctor before adding any supplement to your routine during pregnancy.",
      },
      {
        q: "Is moringa suitable for diabetics?",
        a: "Research shows moringa may help regulate blood sugar levels. However, if you are on diabetes medication, consult your doctor before starting moringa supplementation as it may interact with your medication. Start with small quantities and monitor your levels.",
      },
      {
        q: "Can children use moringa powder?",
        a: "Yes. Moringa has been used for child nutrition across Africa and South Asia for decades. For children under 12, limit to ¼ teaspoon mixed into food daily. For infants, consult a paediatrician first.",
      },
    ],
  },
  {
    category: "Ordering & Shipping",
    items: [
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders above ₹499. For orders below ₹499, a flat shipping fee of ₹49 applies.",
      },
      {
        q: "How long does delivery take?",
        a: "Orders are typically dispatched within 1–2 business days. Delivery time varies by location: Metro cities (Delhi, Mumbai, Bangalore, Hyderabad, Chennai): 2–3 days. Tier 2/3 cities: 3–5 days. Remote areas and North-East India: 5–7 days.",
      },
      {
        q: "Do you deliver outside India?",
        a: "Currently, we ship within India only. We are working towards international shipping for the UAE, UK, and USA. If you are located outside India, please contact us — we may be able to arrange a special shipment.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is dispatched, you'll receive a WhatsApp/SMS message with your tracking number and courier partner. You can also use our Track Order page on the website.",
      },
      {
        q: "Do you offer Cash on Delivery (COD)?",
        a: "Yes, COD is available for most Indian pin codes. COD orders may have an additional handling fee of ₹30.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We have a 7-day return policy for unopened, undamaged products. If your product arrives damaged or is not as described, we will replace it or issue a full refund immediately — no questions asked. Please share a photo of the issue via WhatsApp or email.",
      },
      {
        q: "My order arrived damaged. What do I do?",
        a: "We're sorry to hear that! Please WhatsApp us at +91 91665 99895 with a photo of the damaged product and your order number within 48 hours of delivery. We will send a replacement within 24–48 hours of confirming the issue.",
      },
    ],
  },
  {
    category: "Wholesale & B2B",
    items: [
      {
        q: "Do you supply moringa in bulk for businesses?",
        a: "Yes. We supply organic moringa powder, leaves, seeds, and oil to Ayurvedic brands, supplement companies, restaurants, wellness centres, exporters, and retailers. Minimum bulk order starts at 5kg. Visit our Wholesale page or contact us at shigruvedas@gmail.com for a custom quote.",
      },
      {
        q: "Do you offer white-label / custom packaging?",
        a: "Yes, for orders above 50kg we can provide custom packaging with your brand label. Lead time is 7–10 business days. Contact us to discuss specifications.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-24 px-4 bg-gradient-to-b from-primary/5 to-background text-center">
        <div className="container mx-auto max-w-3xl">
          <Badge className="bg-primary/10 text-primary border-none mb-6 px-5 py-1.5 text-xs font-black uppercase tracking-widest">
            FAQ
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Frequently Asked <span className="text-primary italic">Questions</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Everything you need to know about our organic moringa products, shipping, and more.
            Can't find your answer? We're a WhatsApp message away.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="https://wa.me/919166599895" target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary text-white h-12 px-8 rounded-2xl font-bold">
                Ask on WhatsApp
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" className="h-12 px-8 rounded-2xl font-bold">
                Email Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl space-y-16">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-black uppercase tracking-widest text-primary mb-8 pb-4 border-b border-primary/10">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.items.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-slate-900 hover:text-primary transition-colors gap-4">
                      <span className="text-[15px] leading-snug">{faq.q}</span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                    </summary>
                    <div className="px-6 pb-6 text-slate-600 text-[15px] leading-relaxed font-medium border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black mb-4">Still have questions?</h2>
          <p className="text-slate-500 mb-8 font-medium">
            Our team is available Mon–Sat, 9am–7pm IST. We typically respond within 2 hours on WhatsApp.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/919166599895" target="_blank" rel="noopener noreferrer">
              <Button className="bg-primary text-white h-14 px-10 rounded-2xl font-bold text-base">
                💬 Chat on WhatsApp
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" className="h-14 px-10 rounded-2xl font-bold text-base">
                Send Email
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
