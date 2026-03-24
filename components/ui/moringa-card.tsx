"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MoringaCardProps {
  children: ReactNode
  className?: string
  delay?: number
  hoverEffect?: "scale" | "lift" | "glow"
  glass?: boolean
}

export function MoringaCard({
  children,
  className,
  delay = 0,
  hoverEffect = "lift",
  glass = true,
}: MoringaCardProps) {
  const animations = {
    lift: { whileHover: { y: -8, transition: { duration: 0.3 } } },
    scale: { whileHover: { scale: 1.02, transition: { duration: 0.3 } } },
    glow: { whileHover: { boxShadow: "0 0 25px rgba(6, 78, 59, 0.2)", transition: { duration: 0.3 } } },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      {...animations[hoverEffect]}
      className={cn(
        "relative isolate overflow-hidden rounded-[1.5rem] border bg-card text-card-foreground shadow-sm transition-all duration-300",
        glass && "glass",
        className
      )}
    >
      {children}

      {/* Subtle background glow for premium feel */}
      <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 -z-10 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
    </motion.div>
  )
}

export function BentoGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-1 md:grid-cols-12 gap-6", className)}>{children}</div>
}

export function BentoItem({
  children,
  className,
  colSpan = 4,
  rowSpan = 1,
}: {
  children: ReactNode
  className?: string
  colSpan?: number
  rowSpan?: number
}) {
  const colSpans: Record<number, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
    9: "md:col-span-9",
    10: "md:col-span-10",
    11: "md:col-span-11",
    12: "md:col-span-12",
  }

  const rowSpans: Record<number, string> = {
    1: "md:row-span-1",
    2: "md:row-span-2",
    3: "md:row-span-3",
    4: "md:row-span-4",
    5: "md:row-span-5",
    6: "md:row-span-6",
  }

  return (
    <div
      className={cn(
        "relative h-full w-full min-h-[200px]",
        colSpans[colSpan] || "md:col-span-4",
        rowSpans[rowSpan] || "md:row-span-1",
        className
      )}
    >
      {children}
    </div>
  )
}
