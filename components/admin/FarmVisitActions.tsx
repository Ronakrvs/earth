"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FarmVisitActionsProps {
  id: string
  currentStatus: string
}

export default function FarmVisitActions({ id, currentStatus }: FarmVisitActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const updateStatus = async (status: string) => {
    try {
      setLoading(status)
      const response = await fetch(`/api/admin/farm-visits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      const contentType = response.headers.get("content-type")
      if (!response.ok || !contentType || !contentType.includes("application/json")) {
        throw new Error("Failed to update status (Invalid Response)")
      }

      await response.json()
      
      toast.success(`Visit ${status === 'confirmed' ? 'approved' : 'cancelled'}`)
      router.refresh()
    } catch (error: any) {
      console.error("Update error:", error)
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  if (currentStatus !== "pending") return null

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() => updateStatus("confirmed")}
        disabled={!!loading}
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-9 gap-1.5 px-3"
      >
        {loading === "confirmed" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <CheckCircle2 className="h-3.5 w-3.5" />
        )}
        Approve
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => updateStatus("cancelled")}
        disabled={!!loading}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold h-9 gap-1.5 px-3"
      >
        {loading === "cancelled" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <XCircle className="h-3.5 w-3.5" />
        )}
        Cancel
      </Button>
    </div>
  )
}
