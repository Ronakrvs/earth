"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ThemeWrapperProps {
  children: ReactNode
}

export default function ThemeWrapper({ children }: ThemeWrapperProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Initial reveal animation for the whole page
    gsap.fromTo(
      "body",
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: "power2.out" }
    )

    // Setup scroll triggers for any element with .reveal-up class
    const reveals = document.querySelectorAll(".reveal-up")
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [pathname])

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="min-h-screen flex flex-col"
      suppressHydrationWarning
    >
      {children}
    </motion.div>
  )
}
