import type { Metadata } from "next"
import { Truck } from "lucide-react"

export const metadata: Metadata = {
  title: "Shipping Policy — Shigruvedas",
  description: "Learn about our shipping options, delivery times, and shipping costs for your Moringa orders.",
  robots: "index, follow",
}

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex h-16 w-16 rounded-3xl bg-primary/10 items-center justify-center mb-8">
            <Truck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-6 leading-none">
            Shipping Policy
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Fast, reliable delivery of premium organic moringa to your doorstep.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <div className="space-y-12 text-muted-foreground">
          {/* Last Updated */}
          <div className="bg-card border border-border/60 rounded-2xl p-8">
            <p className="text-sm font-medium">
              <span className="text-foreground font-bold">Last Updated:</span> March 2026
            </p>
          </div>

          {/* 1. Shipping Options */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              1. Shipping Options & Delivery Times
            </h2>
            <div className="space-y-6">
              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Standard Delivery</h3>
                <p className="mb-2"><span className="font-semibold text-foreground">Delivery Time:</span> 5-7 business days</p>
                <p><span className="font-semibold text-foreground">Cost:</span> Free for orders above ₹500</p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Express Delivery</h3>
                <p className="mb-2"><span className="font-semibold text-foreground">Delivery Time:</span> 2-3 business days</p>
                <p><span className="font-semibold text-foreground">Cost:</span> ₹99 (Available in major cities)</p>
              </div>

              <div className="bg-card border border-border/60 rounded-xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-2">Same-Day Delivery</h3>
                <p className="mb-2"><span className="font-semibold text-foreground">Delivery Time:</span> Same day (if ordered before 2 PM)</p>
                <p><span className="font-semibold text-foreground">Cost:</span> ₹149 (Select cities only)</p>
              </div>
            </div>
          </section>

          {/* 2. Domestic Shipping */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              2. Domestic Shipping
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                We ship to all locations across India. All orders are carefully packaged to ensure your fresh moringa products arrive in perfect condition. Packaging includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Protective cushioning for product safety</li>
                <li>Temperature-controlled packaging for organic products</li>
                <li>Tamper-evident seals to ensure authenticity</li>
                <li>Eco-friendly recyclable materials</li>
              </ul>
              <p className="mt-4">
                Orders are typically processed and dispatched within 24 hours of order confirmation on business days.
              </p>
            </div>
          </section>

          {/* 3. International Shipping */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              3. International Shipping
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                We currently offer international shipping to select countries. International orders typically take 10-21 business days depending on the destination country and customs procedures.
              </p>
              <p>
                International shipping costs vary by location and weight. Customers are responsible for any customs duties, taxes, or additional charges imposed by their country's customs authority.
              </p>
              <p>
                For international inquiries or to check if we ship to your country, please contact us at shipping@shigruvedas.com.
              </p>
            </div>
          </section>

          {/* 4. Order Tracking */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              4. Order Tracking
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                Once your order is dispatched, you will receive a tracking number via email. You can use this tracking number to monitor your package's journey in real-time through our shipping partner's portal.
              </p>
              <p>
                Tracking information is typically available within 24 hours of shipment.
              </p>
            </div>
          </section>

          {/* 5. Shipping Restrictions */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              5. Shipping Restrictions
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                We cannot ship to certain remote areas or to addresses marked as PO Boxes. For orders to remote locations, we recommend using Registered Parcel services at checkout.
              </p>
            </div>
          </section>

          {/* 6. Shipping Costs */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              6. Shipping Costs
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><span className="font-semibold">Orders below ₹500:</span> Standard shipping ₹49</li>
                <li><span className="font-semibold">Orders ₹500 - ₹2000:</span> Free standard shipping</li>
                <li><span className="font-semibold">Orders above ₹2000:</span> Free express shipping</li>
              </ul>
            </div>
          </section>

          {/* 7. Delivery Address Requirements */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              7. Delivery Address Requirements
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                To ensure smooth delivery, please provide:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Complete and accurate name</li>
                <li>Correct postal address with city and pin code</li>
                <li>Active phone number</li>
                <li>Directions or nearby landmarks (for remote areas)</li>
              </ul>
              <p className="mt-4">
                Incorrect addresses may result in delivery delays or returns. We are not responsible for delays caused by incomplete or incorrect address information.
              </p>
            </div>
          </section>

          {/* 8. Delivery Issues and Claims */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              8. Delivery Issues and Claims
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                If your order arrives damaged or does not arrive within the promised delivery window, please report it within 48 hours of the expected delivery date with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Order number</li>
                <li>Tracking number</li>
                <li>Photographs of the damaged package (if applicable)</li>
              </ul>
              <p className="mt-4">
                Contact our support team at support@shigruvedas.com with these details to file a claim.
              </p>
            </div>
          </section>

          {/* 9. Lost Packages */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              9. Lost Packages
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                If your package is lost in transit, we will file a claim with the shipping carrier. Once the claim is approved (typically 7-14 days), we will either replace the order or issue a full refund.
              </p>
              <p>
                Please keep the tracking number and all shipping documents for reference.
              </p>
            </div>
          </section>

          {/* 10. Contact Us */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              10. Contact Us
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                For shipping inquiries or concerns, please reach out:
              </p>
              <div className="bg-card border border-border/60 rounded-xl p-6 mt-4">
                <p className="font-medium text-foreground">Shipping Support</p>
                <p>Email: shipping@shigruvedas.com</p>
                <p>Email: support@shigruvedas.com</p>
                <p>Address: Rajasthan, India</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
