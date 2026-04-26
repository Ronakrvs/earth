interface StatusUpdateItem {
  product_name: string
  variant_weight: string
  quantity: number
  total_price: number
}

interface StatusUpdateData {
  orderNumber: string
  customerName: string
  status: string
  trackingNumber?: string | null
  items?: StatusUpdateItem[]
  total?: number
}

function getTrackingInfo(trackingNumber: string): { url: string; carrier: string } {
  if (/^[A-Z]{2}[0-9]{9}IN$/i.test(trackingNumber.trim())) {
    return {
      url: `https://www.indiapost.gov.in/VAS/Pages/trackconsignment.aspx?consignmentNo=${encodeURIComponent(trackingNumber.trim())}`,
      carrier: "India Post",
    }
  }
  return {
    url: `https://www.shiprocket.in/shipment-tracking/?awb=${encodeURIComponent(trackingNumber)}`,
    carrier: "Shiprocket",
  }
}

export function buildOrderStatusUpdateEmail(data: StatusUpdateData): string {
  const { status, trackingNumber, orderNumber, customerName } = data

  const statusConfig: Record<string, { color: string; label: string; message: string; emoji: string }> = {
    processing: {
      color: "#2563eb",
      label: "Processing",
      message: "We've received your order and our team is preparing it for dispatch.",
      emoji: "⚙️",
    },
    shipped: {
      color: "#7c3aed",
      label: "Shipped",
      message: "Great news! Your order has been dispatched and is on its way to you.",
      emoji: "🚚",
    },
    delivered: {
      color: "#16a34a",
      label: "Delivered",
      message: "Your order has been delivered! We hope you enjoy your Shigruvedas products.",
      emoji: "✅",
    },
    cancelled: {
      color: "#dc2626",
      label: "Cancelled",
      message: "Your order has been cancelled. If you have any questions, please reach out to us.",
      emoji: "❌",
    },
  }

  const cfg = statusConfig[status] ?? {
    color: "#f59e0b",
    label: status.charAt(0).toUpperCase() + status.slice(1),
    message: `Your order status has been updated to ${status}.`,
    emoji: "📦",
  }

  const showTracking = trackingNumber && (status === "shipped" || status === "processing" || !statusConfig[status])
  const tracking = showTracking ? getTrackingInfo(trackingNumber!) : null

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shigruvedas.com"

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /><title>Order ${cfg.label} — ${orderNumber}</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.10);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#14532d 0%,#16a34a 100%);padding:36px 40px;text-align:center;">
      <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">🌿 SHIGRUVEDAS</div>
      <div style="color:rgba(255,255,255,0.75);font-size:11px;margin-top:6px;letter-spacing:3px;text-transform:uppercase;">Order Notification</div>
    </div>

    <!-- Body -->
    <div style="padding:36px 40px;">
      <p style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0f172a;">Hello, ${customerName}! ${cfg.emoji}</p>
      <p style="margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.7;">${cfg.message}</p>

      <!-- Status badge -->
      <div style="margin-bottom:24px;">
        <span style="display:inline-block;background:${cfg.color}18;border:2px solid ${cfg.color}40;border-radius:99px;padding:7px 22px;color:${cfg.color};font-weight:800;font-size:13px;text-transform:uppercase;letter-spacing:1.5px;">${cfg.label}</span>
      </div>

      <!-- Order number chip -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;color:#94a3b8;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Order Reference</p>
        <p style="margin:6px 0 0;color:#0f172a;font-size:22px;font-weight:900;font-family:monospace;">${orderNumber}</p>
      </div>

      ${tracking ? `
      <!-- Tracking card -->
      <div style="background:#f0fdf4;border:1.5px solid #bbf7d0;border-radius:14px;padding:20px 24px;margin-bottom:28px;">
        <p style="margin:0 0 4px;font-weight:800;font-size:15px;color:#15803d;">📦 Tracking Information</p>
        <p style="margin:0 0 4px;font-size:14px;color:#374151;"><strong>AWB / Tracking No:</strong> <span style="font-family:monospace;font-weight:700;color:#0f172a;">${trackingNumber}</span></p>
        <p style="margin:0 0 16px;font-size:14px;color:#374151;"><strong>Carrier:</strong> ${tracking.carrier}</p>
        <a href="${tracking.url}" target="_blank" style="display:inline-block;background:#16a34a;color:#ffffff;padding:11px 26px;border-radius:9px;text-decoration:none;font-weight:700;font-size:14px;">Track Your Package →</a>
      </div>` : ""}

      ${data.items && data.items.length > 0 ? `
      <!-- Items table -->
      <p style="margin:0 0 12px;font-weight:700;font-size:14px;color:#0f172a;text-transform:uppercase;letter-spacing:0.5px;">Your Items</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
        <tbody>
          ${data.items.map(item => `
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:11px 0;color:#374151;font-size:14px;">
              ${item.product_name}
              <br/><span style="color:#94a3b8;font-size:12px;">${item.variant_weight} × ${item.quantity}</span>
            </td>
            <td style="padding:11px 0;text-align:right;font-weight:700;color:#0f172a;font-size:14px;">₹${Number(item.total_price).toFixed(0)}</td>
          </tr>`).join("")}
          ${data.total ? `
          <tr>
            <td style="padding:14px 0 0;font-weight:700;color:#0f172a;font-size:15px;">Total</td>
            <td style="padding:14px 0 0;text-align:right;font-weight:900;color:#16a34a;font-size:20px;">₹${data.total}</td>
          </tr>` : ""}
        </tbody>
      </table>` : ""}

      <!-- CTA -->
      <div style="text-align:center;margin-top:28px;">
        <a href="${appUrl}/profile/orders" style="display:inline-block;background:#15803d;color:#ffffff;padding:14px 36px;border-radius:12px;text-decoration:none;font-weight:800;font-size:15px;letter-spacing:0.3px;">View Your Orders →</a>
      </div>

      <p style="text-align:center;margin:24px 0 0;font-size:13px;color:#94a3b8;">
        Need help? <a href="https://wa.me/919166599895" style="color:#16a34a;font-weight:700;text-decoration:none;">Chat on WhatsApp</a>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">© Shigruvedas · 248 A-Block, Hiran Magri, Udaipur, Rajasthan 313002</p>
      <p style="margin:4px 0 0;font-size:11px;color:#cbd5e1;">You received this email because you placed an order with us.</p>
    </div>
  </div>
</body>
</html>`
}
