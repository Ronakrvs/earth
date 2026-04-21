"use client"

export default function InvoiceClient({ order }: { order: any }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div className="no-print" style={{ marginBottom: 16 }}>
        <button onClick={() => window.print()} style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #ccc", background: "#f6f6f6", cursor: "pointer" }}>
          Download / Print Invoice
        </button>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28 }}>Invoice</h1>
            <p style={{ margin: "8px 0 0", color: "#555" }}>Shigruvedas</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div><strong>Order:</strong> {order.order_number}</div>
            <div><strong>Date:</strong> {new Date(order.created_at).toLocaleString("en-IN")}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
          <div>
            <h3 style={{ marginTop: 0 }}>Bill To</h3>
            <p style={{ margin: "6px 0" }}>{order.shipping_name}</p>
            <p style={{ margin: "6px 0" }}>{order.shipping_phone}</p>
            <p style={{ margin: "6px 0" }}>{order.shipping_address}</p>
            <p style={{ margin: "6px 0" }}>{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
          </div>
          <div>
            <h3 style={{ marginTop: 0 }}>Payment</h3>
            <p style={{ margin: "6px 0" }}>Paid via Razorpay</p>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>Item</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>Qty</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "10px 0" }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items?.map((item: any) => (
              <tr key={item.id}>
                <td style={{ borderBottom: "1px solid #f1f5f9", padding: "12px 0" }}>
                  <div style={{ fontWeight: 600 }}>{item.product_name}</div>
                  <div style={{ color: "#666", fontSize: 12 }}>{item.variant_weight}</div>
                </td>
                <td style={{ borderBottom: "1px solid #f1f5f9", padding: "12px 0" }}>{item.quantity}</td>
                <td style={{ borderBottom: "1px solid #f1f5f9", padding: "12px 0" }}>₹{Number(item.total_price).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginLeft: "auto", width: 280 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Subtotal</span>
            <span>₹{Number(order.subtotal).toFixed(0)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Shipping</span>
            <span>₹{Number(order.shipping_amount).toFixed(0)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span>Discount</span>
            <span>-₹{Number(order.discount_amount).toFixed(0)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", paddingTop: 10, fontSize: 18, fontWeight: 700 }}>
            <span>Total</span>
            <span>₹{Number(order.total).toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
