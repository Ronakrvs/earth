import { createClient as createSupabaseClient } from "@supabase/supabase-js"

function getEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
      "Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your build environment."
    )
  }
  return { supabaseUrl, supabaseKey }
}

/**
 * Browser-safe Supabase client for DB queries only.
 * Auth session management is handled by NextAuth — so we disable
 * Supabase's built-in auto-refresh to prevent ERR_CONNECTION_CLOSED spam.
 */
export function createClient() {
  const { supabaseUrl, supabaseKey } = getEnvVars()
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      // Use an isolated, non-persistent auth namespace so old Supabase
      // sessions from previous implementations do not get revived in the browser.
      storageKey: "shigruvedas-browser-auth",
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: {
        getItem: (_key: string) => null,
        setItem: (_key: string, _value: string) => {},
        removeItem: (_key: string) => {},
      },
    },
  })
}

// Alias kept for backwards compatibility
export const createSimpleClient = createClient
