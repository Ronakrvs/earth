interface OrderItem {
  product_name: string
  variant_weight: string
  quantity: number
  unit_price: number
  total_price: number
}

interface OrderEmailData {
  orderNumber: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shippingAmount: number
  discountAmount: number
  total: number
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
  }
  createdAt: string
  paymentId?: string
}

export function buildOrderInvoiceEmail(data: OrderEmailData): string {
  const formattedDate = new Date(data.createdAt).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  })

  const itemRows = data.items
    .map(
      (item) => `
    <tr style="border-bottom:1px solid #f1f5f9;">
      <td style="padding:12px 8px;">
        <div style="font-weight:700;color:#0f172a;">${item.product_name}</div>
        <div style="font-size:12px;color:#64748b;">${item.variant_weight}</div>
      </td>
      <td style="padding:12px 8px;text-align:center;color:#475569;">${item.quantity}</td>
      <td style="padding:12px 8px;text-align:right;color:#475569;">₹${Number(item.unit_price).toFixed(0)}</td>
      <td style="padding:12px 8px;text-align:right;font-weight:700;color:#0f172a;">₹${Number(item.total_price).toFixed(0)}</td>
    </tr>`
    )
    .join("")

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation — ${data.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:40px 40px 32px;">
            <table width="100%">
              <tr>
                <td>
                  <div style="font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;font-style:italic;">SHIGRUVEDAS</div>
                  <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);letter-spacing:0.2em;text-transform:uppercase;margin-top:4px;">Earth to Wellness</div>
                </td>
                <td align="right">
                  <div style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.8);text-transform:uppercase;letter-spacing:0.15em;">Order Confirmed</div>
                  <div style="font-size:18px;font-weight:900;color:#ffffff;margin-top:4px;">${data.orderNumber}</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:40px 40px 0;">
            <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;font-style:italic;">
              Thank you, ${data.customerName.split(" ")[0]}! 🌿
            </h1>
            <p style="margin:0;color:#475569;font-size:15px;line-height:1.6;">
              Your order has been confirmed and payment received. We'll notify you when it ships.
            </p>
            <div style="margin-top:16px;font-size:12px;color:#94a3b8;">${formattedDate}</div>
          </td>
        </tr>

        <!-- Items Table -->
        <tr>
          <td style="padding:32px 40px 0;">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#16a34a;margin-bottom:16px;">Order Items</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <thead>
                <tr style="background:#f8fafc;border-radius:8px;">
                  <th style="padding:10px 8px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Product</th>
                  <th style="padding:10px 8px;text-align:center;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Qty</th>
                  <th style="padding:10px 8px;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Price</th>
                  <th style="padding:10px 8px;text-align:right;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.1em;">Total</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
            </table>
          </td>
        </tr>

        <!-- Totals -->
        <tr>
          <td style="padding:24px 40px 0;">
            <table width="100%" style="border-top:2px solid #f1f5f9;padding-top:16px;">
              <tr>
                <td style="padding:4px 0;color:#64748b;font-size:14px;">Subtotal</td>
                <td style="padding:4px 0;text-align:right;font-size:14px;color:#475569;">₹${Number(data.subtotal).toFixed(0)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#64748b;font-size:14px;">Shipping</td>
                <td style="padding:4px 0;text-align:right;font-size:14px;color:#475569;">${data.shippingAmount === 0 ? "FREE" : `₹${Number(data.shippingAmount).toFixed(0)}`}</td>
              </tr>
              ${data.discountAmount > 0 ? `
              <tr>
                <td style="padding:4px 0;color:#16a34a;font-size:14px;">Discount Applied</td>
                <td style="padding:4px 0;text-align:right;font-size:14px;color:#16a34a;">-₹${Number(data.discountAmount).toFixed(0)}</td>
              </tr>` : ""}
              <tr style="border-top:1px solid #e2e8f0;">
                <td style="padding:12px 0 4px;font-weight:900;font-size:16px;color:#0f172a;">Total Paid</td>
                <td style="padding:12px 0 4px;text-align:right;font-weight:900;font-size:20px;color:#16a34a;">₹${Number(data.total).toFixed(0)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Shipping Address -->
        <tr>
          <td style="padding:32px 40px 0;">
            <div style="background:#f8fafc;border-radius:16px;padding:20px;">
              <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.2em;color:#16a34a;margin-bottom:12px;">Shipping To</div>
              <div style="font-weight:700;color:#0f172a;margin-bottom:4px;">${data.shippingAddress.name}</div>
              <div style="color:#475569;font-size:14px;line-height:1.6;">
                ${data.shippingAddress.phone}<br>
                ${data.shippingAddress.address}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}
              </div>
            </div>
          </td>
        </tr>

        <!-- Track Order CTA -->
        <tr>
          <td style="padding:32px 40px;">
            <div style="text-align:center;">
              <a href="${process.env.NEXTAUTH_URL || "https://shigruvedas.com"}/profile/orders" style="display:inline-block;background:#16a34a;color:#ffffff;font-weight:700;font-size:13px;text-decoration:none;padding:14px 32px;border-radius:12px;letter-spacing:0.05em;text-transform:uppercase;">
                View Your Order →
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;">Questions? Reply to this email or contact us at support@shigruvedas.com</p>
            <p style="margin:0;font-size:12px;font-weight:700;color:#16a34a;">SHIGRUVEDAS — Earth to Wellness 🌿</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
