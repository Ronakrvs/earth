import type { Metadata } from "next"
import { Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy — Shigruvedas",
  description: "Our privacy policy explains how we collect, use, and protect your personal information.",
  robots: "index, follow",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex h-16 w-16 rounded-3xl bg-primary/10 items-center justify-center mb-8">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-6 leading-none">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Your privacy is important to us. Learn how we protect your information.
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

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create an account</li>
                <li>Make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us via email or forms</li>
                <li>Leave reviews or feedback</li>
              </ul>
              <p className="mt-4">
                This information may include your name, email address, phone number, shipping address, payment information, and any other details you choose to provide.
              </p>
              <p>
                We also automatically collect certain information about your device and how you interact with our website, including IP address, browser type, pages visited, and referral information.
              </p>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Send transactional emails (order confirmations, shipping updates)</li>
                <li>Provide customer support</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          {/* 3. Data Security */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              3. Data Security
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. This includes SSL encryption, secure payment processing through trusted providers, and regular security audits.
              </p>
              <p>
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* 4. Sharing Your Information */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              4. Sharing Your Information
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                We do not sell, trade, or rent your personal information to third parties. We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Service providers who assist us in operating our website and conducting our business</li>
                <li>Payment processors to process your transactions</li>
                <li>Shipping partners to deliver your orders</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="mt-4">
                All third parties are required to maintain the confidentiality and security of your information.
              </p>
            </div>
          </section>

          {/* 5. Cookies and Tracking */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              5. Cookies and Tracking
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                Our website uses cookies and similar tracking technologies to enhance your browsing experience. These help us understand how you use our site, remember your preferences, and provide personalized content.
              </p>
              <p>
                You can control cookies through your browser settings, but disabling them may affect your ability to use certain features of our website.
              </p>
            </div>
          </section>

          {/* 6. Your Rights */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              6. Your Rights
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at privacy@shigruvedas.com.
              </p>
            </div>
          </section>

          {/* 7. Children's Privacy */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              7. Children's Privacy
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                Our website is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will delete such information promptly.
              </p>
            </div>
          </section>

          {/* 8. Changes to This Policy */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              8. Changes to This Policy
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </div>
          </section>

          {/* 9. Contact Us */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              9. Contact Us
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                If you have questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <div className="bg-card border border-border/60 rounded-xl p-6 mt-4">
                <p className="font-medium text-foreground">Shigruvedas</p>
                <p>Email: privacy@shigruvedas.com</p>
                <p>Address: Rajasthan, India</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
