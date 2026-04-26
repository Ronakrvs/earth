import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"

function isUuid(value: string | null | undefined) {
  return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getOrCreateProfileByEmail(
  supabase: any,
  email: string,
  fullName?: string | null,
  avatarUrl?: string | null
) {
  const normalizedEmail = email.toLowerCase().trim()

  // Step 1: Look up existing profile by email (service role bypasses RLS)
  const { data: existing, error: lookupErr } = await supabase
    .from("profiles")
    .select("id, role, full_name, avatar_url")
    .eq("email", normalizedEmail)
    .maybeSingle()

  if (lookupErr) console.error("[auth] profile lookup error:", lookupErr.code, lookupErr.message)
  if (existing?.id) return existing

  // Step 2: Insert new profile — separate from select so we can capture the error
  const newId = randomUUID()
  const { error: insertErr } = await supabase
    .from("profiles")
    .insert({
      id: newId,
      email: normalizedEmail,
      full_name: fullName || "Botanist",
      avatar_url: avatarUrl || null,
    })

  if (insertErr) {
    // 23505 = unique_violation: profile was created concurrently (harmless race)
    // 23503 = fk_violation: profiles.id → auth.users.id FK still exists — run migrations.sql
    if (insertErr.code !== "23505") {
      console.error("[auth] profile insert error:", insertErr.code, insertErr.message, insertErr.details || "")
    }

    // FK violation: profiles.id references auth.users.id. Create the auth user first.
    if (insertErr.code === "23503") {
      console.error("[auth] FK constraint detected — attempting auth.admin.createUser as workaround. Run migrations.sql in Supabase to fix permanently.")
      try {
        const { data: authData, error: adminErr } = await supabase.auth.admin.createUser({
          email: normalizedEmail,
          email_confirm: true,
          user_metadata: { full_name: fullName, avatar_url: avatarUrl },
        })
        if (adminErr) console.error("[auth] auth.admin.createUser error:", adminErr.code, adminErr.message)
        if (authData?.user?.id) {
          const { data: withAuthId } = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              email: normalizedEmail,
              full_name: fullName || "Botanist",
              avatar_url: avatarUrl || null,
            })
            .select("id, role, full_name, avatar_url")
            .maybeSingle()
          if (withAuthId?.id) return withAuthId
        }
      } catch (adminEx) {
        console.error("[auth] auth.admin.createUser threw:", adminEx instanceof Error ? adminEx.message : String(adminEx))
      }
    }
  }

  // Step 3: Always SELECT after insert attempt — handles success, race conditions, and conflicts
  const { data: final, error: retryErr } = await supabase
    .from("profiles")
    .select("id, role, full_name, avatar_url")
    .eq("email", normalizedEmail)
    .maybeSingle()

  if (retryErr) console.error("[auth] profile retry error:", retryErr.code, retryErr.message)
  if (final?.id) return final

  const errMsg = [
    lookupErr && `lookup(${lookupErr.code})`,
    insertErr && `insert(${insertErr.code}: ${insertErr.message})`,
    retryErr && `retry(${retryErr.code})`,
  ].filter(Boolean).join(" | ")
  throw new Error(`Profile bootstrap failed for ${normalizedEmail}: ${errMsg || "unknown"}`)
}

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
        let profileId: string | null = null

        const id = (token.id ?? token.sub) as string | undefined
        if (id) {
          session.user.id = id
        }

        if (id && isUuid(id)) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, role")
            .eq("id", id)
            .maybeSingle()

          if (error) {
            console.error("[auth/session] UUID lookup error:", error.message)
          } else {
            profileId = data?.id ?? null
            profileRole = data?.role ?? null
          }
        }

        if (!profileId && token.email) {
          try {
            const profile = await getOrCreateProfileByEmail(
              supabase,
              token.email as string,
              (token.name as string) || null,
              (token.picture as string) || null
            )
            profileId = profile.id
            profileRole = profile.role ?? null
          } catch (error) {
            const msg = error instanceof Error ? error.message : JSON.stringify(error)
            console.error("[auth/session] Email bootstrap error:", msg)
          }
        }

        if (profileId) {
          session.user.id = profileId
          token.id = profileId
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
