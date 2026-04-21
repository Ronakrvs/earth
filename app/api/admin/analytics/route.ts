import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/server"
import { isAdminSession } from "@/lib/admin-auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const supabase = await createAdminClient()
    
    // Auth check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!isAdminSession(session, profile?.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Basic stats
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
    const { data: orders } = await supabase.from('orders').select('total_amount, status, created_at')
    const { count: lowStockCount } = await supabase.from('product_variants').select('*', { count: 'exact', head: true }).lte('stock', 5)
    const { count: b2bCount } = await supabase.from('b2b_inquiries').select('*', { count: 'exact', head: true }).eq('status', 'new')
    const { count: pendingReviews } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_approved', false)

    const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0
    const deliveredOrders = orders?.filter(o => o.status === 'delivered').length || 0
    const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'processing').length || 0

    // Sales by day (last 7 days)
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().split('T')[0]
    }).reverse()

    const salesOverTime = last7Days.map(date => {
      const dayOrders = orders?.filter(o => o.created_at.startsWith(date)) || []
      const revenue = dayOrders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0)
      return { date, revenue, count: dayOrders.length }
    })

    return NextResponse.json({
      summary: {
        totalUsers: userCount || 0,
        totalProducts: productCount || 0,
        totalRevenue,
        lowStockCount: lowStockCount || 0,
        newB2BInquiries: b2bCount || 0,
        pendingReviews: pendingReviews || 0,
        deliveredOrders,
        pendingOrders,
      },
      salesOverTime
    })
  } catch (error: any) {
    console.error("Fetch analytics error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
