import type { Metadata } from "next"
import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service — Shigruvedas",
  description: "Read our terms of service to understand the rules and conditions for using Shigruvedas.",
  robots: "index, follow",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <div className="inline-flex h-16 w-16 rounded-3xl bg-primary/10 items-center justify-center mb-8">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-6 leading-none">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Please read these terms carefully before using our website.
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

          {/* 1. Agreement to Terms */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              1. Agreement to Terms
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                By accessing and using Shigruvedas website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </section>

          {/* 2. Use License */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              2. Use License
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Shigruvedas for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software on the website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                <li>Using the materials for any illegal purpose or in violation of any laws or regulations</li>
              </ul>
            </div>
          </section>

          {/* 3. Disclaimer */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              3. Disclaimer
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                The materials on Shigruvedas website are provided on an 'as is' basis. Shigruvedas makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
              <p>
                Further, Shigruvedas does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
              </p>
            </div>
          </section>

          {/* 4. Limitations */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              4. Limitations
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                In no event shall Shigruvedas or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Shigruvedas, even if Shigruvedas or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>
          </section>

          {/* 5. Accuracy of Materials */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              5. Accuracy of Materials
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                The materials appearing on Shigruvedas website could include technical, typographical, or photographic errors. Shigruvedas does not warrant that any of the materials on its website are accurate, complete, or current. Shigruvedas may make changes to the materials contained on its website at any time without notice.
              </p>
            </div>
          </section>

          {/* 6. Materials and Links */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              6. Materials and Links
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                Shigruvedas has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Shigruvedas of the site. Use of any such linked website is at the user's own risk.
              </p>
            </div>
          </section>

          {/* 7. Modifications */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              7. Modifications
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                Shigruvedas may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>
          </section>

          {/* 8. Governing Law */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              8. Governing Law
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Rajasthan.
              </p>
            </div>
          </section>

          {/* 9. User Accounts */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              9. User Accounts
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                If you create an account on our website, you are responsible for maintaining the confidentiality of your account information and password. You agree to accept responsibility for all activities that occur under your account. You agree not to provide false, misleading, inaccurate, or fraudulent information.
              </p>
            </div>
          </section>

          {/* 10. Prohibited Conduct */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              10. Prohibited Conduct
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                You agree that you will not engage in any conduct that restricts or inhibits anyone's use or enjoyment of the website. Prohibited behavior includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Harassing or causing embarrassment to any users</li>
                <li>Interrupting the normal flow of dialogue in our community forums</li>
                <li>Posting obscene, offensive, or hateful messages</li>
                <li>Uploading or transmitting viruses or malicious code</li>
                <li>Spamming or posting repetitive messages</li>
              </ul>
            </div>
          </section>

          {/* 11. Limitation of Liability */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              11. Limitation of Liability
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                In no case shall Shigruvedas, its officers, directors, or representatives be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the website or the products/services offered, even if Shigruvedas has been advised of the possibility of such damages.
              </p>
            </div>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6 tracking-tight">
              12. Contact Us
            </h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-card border border-border/60 rounded-xl p-6 mt-4">
                <p className="font-medium text-foreground">Shigruvedas</p>
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
