import nodemailer from "nodemailer"

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("[email] SMTP not configured — skipping email to:", to)
    return
  }

  try {
    const transporter = createTransporter()
    const from = `"${process.env.SMTP_FROM_NAME || "Shigruvedas"}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`
    await transporter.sendMail({ from, to, subject, html })
    console.log("[email] Sent to:", to, "| Subject:", subject)
  } catch (err: any) {
    // Never crash the order flow due to email failure
    console.error("[email] Failed to send:", err?.message || err)
  }
}
