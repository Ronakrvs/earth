import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import Link from "next/link"
import { ChevronLeft, History, Package, ShoppingBag, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoringaCard } from "@/components/ui/moringa-card"

export default async function ProfileOrdersPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/profile/orders")

  const supabase = await createAdminClient()
  const email = session.user.email?.toLowerCase().trim()

  let ordersQuery = supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total,
      created_at,
      tracking_number,
      order_items (
        id,
        product_name,
        variant_weight,
        quantity,
        total_price
      )
    `)
    .order("created_at", { ascending: false })

  if (email) {
    ordersQuery = ordersQuery.or(`user_id.eq.${session.user.id},user_email.eq.${email}`)
  } else {
    ordersQuery = ordersQuery.eq("user_id", session.user.id)
  }

  const { data: orders } = await ordersQuery

  return (
    <div className="min-h-screen bg-background pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 py-12 max-w-5xl relative z-10">
        <div className="flex items-center gap-6 mb-12">
          <Link href="/profile" className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 hover:shadow-lg transition-all">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-foreground tracking-tighter italic flex items-center gap-3">
              Acquisition History.
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Your botanical heritage archive</p>
          </div>
        </div>

        {!orders || orders.length === 0 ? (
          <MoringaCard className="p-16 md:p-24 text-center space-y-8 border-white shadow-2xl" glass={true}>
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse" />
              <div className="w-24 h-24 bg-card rounded-[2rem] border border-border shadow-xl flex items-center justify-center mx-auto relative z-10">
                <History className="h-10 w-10 text-primary/30" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-foreground italic tracking-tighter">Archive Vacant.</h2>
              <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto">
                Your first order will appear here after payment is confirmed.
              </p>
            </div>

            <div className="pt-4">
              <Link href="/shop" className="inline-block">
                <Button className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all group flex items-center gap-4 border-none">
                  Initiate First Selection <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
            </div>
          </MoringaCard>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <MoringaCard key={order.id} className="p-6 md:p-8 border-border/60" glass={true}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-black text-foreground">Order {order.order_number}</h2>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-widest">
                      <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground">{order.status}</span>
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">{order.payment_status}</span>
                      {order.tracking_number && (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">{order.tracking_number}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-2xl font-black text-foreground">₹{Number(order.total).toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.order_items?.length || 0} item{(order.order_items?.length || 0) === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card/60 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variant_weight} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-sm font-bold text-foreground">₹{Number(item.total_price).toFixed(0)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Link href={`/profile/orders/${order.id}`}>
                    <Button variant="outline" className="rounded-2xl border-border font-bold">
                      View Tracking & Invoice <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </MoringaCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
