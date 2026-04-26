"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="group w-full flex items-center justify-center gap-6 p-8 border border-border rounded-[2.5rem] bg-card hover:bg-destructive/10 hover:border-destructive/20 transition-all duration-500 overflow-hidden relative"
    >
      <div className="flex items-center gap-4 relative z-10">
        <LogOut className="h-5 w-5 text-muted-foreground/70 group-hover:text-destructive group-hover:-translate-x-2 transition-all duration-500" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground group-hover:text-destructive transition-colors">
          Neutralize Session
        </span>
      </div>
    </button>
  )
}
