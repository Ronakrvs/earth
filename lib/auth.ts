import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

// Helper to check if a string is a valid UUID
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
              storage: {
                getItem: (_key: string) => null,
                setItem: (_key: string, _value: string) => {},
                removeItem: (_key: string) => {},
              },
            },
          }
        )

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        })

        if (error || !data.user) {
          console.error("[auth] login failed:", error?.message)
          return null
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, role")
          .eq("id", data.user.id)
          .single()

        return {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.full_name || data.user.user_metadata?.full_name || null,
          image: profile?.avatar_url || data.user.user_metadata?.avatar_url || null,
          role: profile?.role || "customer",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On first sign-in, populate token from user object
      if (user) {
        token.id = user.id ?? token.sub
        token.email = user.email
        token.role = (user as any).role || "customer"

        // Override with admin email list
        const adminEmails =
          process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || []
        if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          token.role = "admin"
        }
      }

      // Allow manual session role updates
      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role
      }

      return token
    },

    async session({ session, token }) {
      try {
        // Set basic fields from token (always safe)
        session.user.id = (token.id ?? token.sub ?? "") as string
        session.user.role = (token.role as string) || "customer"

        // Try to fetch the latest role from Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !serviceKey) {
          console.warn("[auth/session] Missing Supabase env vars — using token role")
          return session
        }

        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        })

        const adminEmails =
          process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) || []

        let profileRole: string | null = null

        const id = (token.id ?? token.sub) as string | undefined
        if (id) {
          session.user.id = id
        }

        // Credentials users may have a UUID profile; Google OAuth users often do not.
        if (id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
          const { data, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", id)
            .maybeSingle()

          if (error) {
            console.error("[auth/session] UUID lookup error:", error.message)
          } else {
            profileRole = data?.role ?? null
          }
        }

        // Google OAuth users can still inherit admin/customer role from the profile row matched by email.
        if (!profileRole && token.email) {
          const { data, error } = await supabase
            .from("profiles")
            .select("role")
            .eq("email", token.email as string)
            .maybeSingle()

          if (error) {
            console.error("[auth/session] Email lookup error:", error.message)
          } else {
            profileRole = data?.role ?? null
          }
        }

        // Admin email list always wins
        const email = token.email as string | undefined
        if (email && adminEmails.includes(email.toLowerCase())) {
          session.user.role = "admin"
        } else {
          session.user.role = profileRole || (token.role as string) || "customer"
        }
      } catch (err) {
        // Never crash — return session with fallback role
        console.error("[auth/session] Unexpected error:", err)
        session.user.role = (token.role as string) || "customer"
      }

      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
})
