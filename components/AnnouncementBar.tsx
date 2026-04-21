"use client"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    async function fetchConfig() {
      // Default fallback configuration
      const defaultConfig = {
        announcement_text: "🌿 Premium Organic Moringa - Farm Fresh & Nutrient Dense",
        announcement_link: "/shop"
      }

      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "config")
          .maybeSingle() // maybeSingle is safer than single() as it won't throw on 0 results
        
        if (error) {
          // If table is missing (PGRST205) or other error, use defaults silently
          if (error.code !== "PGRST205") {
            console.error("AnnouncementBar fetch error:", error.message)
          }
          setConfig(defaultConfig)
          return
        }

        if (data?.value) {
          setConfig(data.value)
        } else {
          setConfig(defaultConfig)
        }
      } catch (err) {
        // Ultimate fallback
        setConfig(defaultConfig)
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  if (!visible || loading || !config?.announcement_text) return null

  return (
    <div className="relative z-50 bg-primary text-white text-center text-[13px] font-bold py-2.5 px-10">
      <div className="container mx-auto">
        <span>
          {config.announcement_text} &nbsp;·&nbsp;{" "}
          {config.announcement_link && (
            <Link href={config.announcement_link} className="underline underline-offset-2 hover:text-emerald-100 transition-colors">
              Check it out
            </Link>
          )}
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
