"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface WhatsAppButtonProps {
  message?: string
  phoneNumber?: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode,
  showLogo?:boolean
}

export default function WhatsAppButton({
  message = "Hi! I'm interested in your organic moringa products. Can you help me?",
  phoneNumber = "917877255595", // Default phone number (replace with actual)
  className,
  variant = "default",
  size = "sm",
  children,
  showLogo=true,
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Button
      onClick={handleWhatsAppClick}
      variant={variant}
      size={size}
      className={cn(
        "bg-green-500 hover:bg-green-600 text-white border-green-500",
        variant === "outline" && "border-green-500 text-white hover:bg-green-50",
        className,
      )}
    >
      <MessageCircle className={showLogo ? "h-4 w-4 mr-2" : "h-4 w-4"} />
      {showLogo && (children || "WhatsApp")}
    </Button>
  )
}
