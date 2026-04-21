import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import InvoiceClient from "@/components/orders/InvoiceClient"

export default async function OrderInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/profile/orders")

  const { id } = await params
  const supabase = await createAdminClient()
  const email = session.user.email?.toLowerCase().trim()

  let orderQuery = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      created_at,
      shipping_name,
      shipping_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
      subtotal,
      shipping_amount,
      discount_amount,
      total,
      order_items (
        id,
        product_name,
        variant_weight,
        quantity,
        unit_price,
        total_price
      )
    `)
    .eq("id", id)

  if (email) {
    orderQuery = orderQuery.or(`user_id.eq.${session.user.id},user_email.eq.${email}`)
  } else {
    orderQuery = orderQuery.eq("user_id", session.user.id)
  }

  const { data: order } = await orderQuery.single()

  if (!order) notFound()

  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", background: "#fff", color: "#111", margin: 0, padding: 24 }}>
        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { padding: 0; }
          }
        `}</style>
        <InvoiceClient order={order} />
      </body>
    </html>
  )
}
