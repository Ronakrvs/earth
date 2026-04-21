import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || []
  const email = req.auth?.user?.email?.toLowerCase()
  const isAdmin =
    req.auth?.user?.role === "admin" ||
    (email ? adminEmails.includes(email) : false)
  const path = nextUrl.pathname

  // Protected user routes
  const isUserRoute = path.startsWith("/profile")
  const isCheckoutRoute = path.startsWith("/checkout")
  // Protected admin routes
  const isAdminRoute = path.startsWith("/admin")

  if (isAdminRoute && !isAdmin) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login?callbackUrl=/admin", nextUrl))
    }
    // Logged in but not admin
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  if ((isUserRoute || isCheckoutRoute) && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodeURIComponent(path)}`, nextUrl)
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/profile/:path*",
    "/checkout/:path*",
    "/admin/:path*",
  ],
}
