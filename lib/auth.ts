import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
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

        // Use a no-op storage adapter so Supabase doesn't try to
        // save/read cookies in the server-side RSC context.
        // NextAuth manages the session via JWT — Supabase session not needed here.
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

        // Fetch profile for role info
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
      if (user) {
        token.id = user.id
        token.email = user.email
        
        // Initial role check
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || []
        if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          token.role = "admin"
        } else {
          token.role = (user as any).role || "customer"
        }
      }
      
      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        
        // Fetch latest role directly from Supabase to ensure real-time updates
        // even if the JWT itself is stale.
        try {
          const { createClient: createSimpleSupabase } = await import("@supabase/supabase-js")
          
          // Use service role key to bypass RLS in server-side session callback
          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
          
          if (supabaseUrl && serviceKey) {
            const supabase = createSimpleSupabase(supabaseUrl, serviceKey)
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", token.id)
              .maybeSingle()
            
            if (error) {
              console.error("[auth] dynamic role fetch error:", error.message)
            }
            
            if (profile?.role) {
              session.user.role = profile.role
            } else {
              // Fallback: Check by email if ID lookup fails or returns no role
              // Useful for OAuth users who might not have a profile record yet
              const { data: emailProfile } = await supabase
                .from("profiles")
                .select("role")
                .eq("email", token.email)
                .maybeSingle()
              
              if (emailProfile?.role) {
                session.user.role = emailProfile.role
              } else {
                // Secondary fallback: Admin emails env var
                const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || []
                if (token.email && adminEmails.includes((token.email as string).toLowerCase())) {
                   session.user.role = "admin"
                } else {
                   session.user.role = (token.role as string) || "customer"
                }
              }
            }
          } else {
            // Fallback: Admin emails env var if Supabase client cannot be created
            const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || []
            if (token.email && adminEmails.includes((token.email as string).toLowerCase())) {
              session.user.role = "admin"
            } else {
              session.user.role = (token.role as string) || "customer"
            }
          }
        } catch (error) {
          console.error("Error fetching role for session:", error)
          session.user.role = (token.role as string) || "customer"
        }
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
  },
})
