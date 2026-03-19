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
        
        // If user already has a role (e.g. from Credentials authorize), use it.
        // Otherwise (e.g. Google), fetch it from the database.
        if ((user as any).role) {
          token.role = (user as any).role
        } else {
          // Fetch from Supabase directly
          const { createClient: createSimpleSupabase } = await import("@supabase/supabase-js")
          const supabase = createSimpleSupabase(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()
          
          token.role = profile?.role || "customer"
        }
      }
      if (trigger === "update" && session?.user) {
        token.name = session.user.name
        token.image = session.user.image
        token.role = session.user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
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
  },
})
