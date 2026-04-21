import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/admin/Sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  // Basic session check
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/admin")
  }

  // Double check admin role from DB (same logic as in individual pages for consistency)
  const supabase = await createAdminClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  const userRole = session.user.role || profile?.role
  if (userRole !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <main className="flex-1 lg:pl-72 min-h-screen transition-all duration-300">
        <div className="p-4 lg:p-8 xl:p-12 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
