"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
}

export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  const getAnimationClass = () => {
    switch (direction) {
      case "left":
        return isVisible ? "animate-fade-in-left" : "opacity-0 -translate-x-8"
      case "right":
        return isVisible ? "animate-fade-in-right" : "opacity-0 translate-x-8"
      case "down":
        return isVisible ? "animate-fade-in" : "opacity-0 -translate-y-8"
      default:
        return isVisible ? "animate-slide-up" : "opacity-0 translate-y-8"
    }
  }

  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${getAnimationClass()} ${className}`}>
      {children}
    </div>
  )
}
