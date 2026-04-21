import type { Session } from "next-auth"

export function isAdminSession(session: Session | null | undefined, profileRole?: string | null) {
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || []
  const email = session?.user?.email?.toLowerCase()

  return (
    session?.user?.role === "admin" ||
    profileRole === "admin" ||
    (email ? adminEmails.includes(email) : false)
  )
}
