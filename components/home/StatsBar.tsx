"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface StatProps {
  value: string
  label: string
  suffix?: string
}

function Counter({ value, suffix = "" }: { value: string, suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  const numericValue = parseInt(value)
  
  useEffect(() => {
    if (isInView && !isNaN(numericValue)) {
      let start = 0
      const end = numericValue
      const duration = 2000
      const increment = end / (duration / 16)
      
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 16)
      return () => clearInterval(timer)
    }
  }, [isInView, numericValue])

  return (
    <span ref={ref} className="font-extrabold text-3xl md:text-5xl tracking-tighter">
      {isNaN(numericValue) ? value : count}{suffix}
    </span>
  )
}

const STATS = [
  { value: "7", label: "Acres of Organic Farm", suffix: "+" },
  { value: "90", label: "Nutrients in Moringa", suffix: "+" },
  { value: "500", label: "Happy Customers", suffix: "+" },
  { value: "100", label: "Chemical-Free", suffix: "%" },
]

export default function StatsBar() {
  return (
    <div className="relative -mt-16 z-20 container mx-auto px-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass p-8 md:p-12 rounded-[2.5rem] bg-white/80 border-white/40 shadow-2xl backdrop-blur-3xl"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 divide-x-0 lg:divide-x divide-slate-200">
          {STATS.map((stat, idx) => (
            <div key={stat.label} className="text-center lg:px-4">
              <div className="text-primary mb-2 flex justify-center items-baseline gap-0.5">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-widest leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
