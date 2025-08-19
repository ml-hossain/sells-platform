"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { FloatingElements } from "@/components/animations/floating-elements"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()

  const handleStartJourney = () => {
    router.push('/universities')
  }

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-electric-50 to-emerald-50 dark:from-violet-950/20 dark:via-electric-950/20 dark:to-emerald-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)] animate-pulse" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <FloatingElements />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <ScrollReveal direction="left">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-sm font-medium">
                  #1 Trusted Education Consultancy
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Your Gateway to{" "}
                  <span className="bg-gradient-to-r from-violet-600 via-electric-500 to-emerald-500 bg-clip-text text-transparent animate-gradient-x">
                    Global Education
                  </span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed">
                  Expert guidance for studying abroad, visa assistance, and comprehensive travel solutions. Turn your
                  international education dreams into reality.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={200}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleStartJourney}
                  className="text-lg px-8 bg-gradient-to-r from-violet-600 to-electric-600 hover:from-violet-700 hover:to-electric-700 shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105 group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 border-2 border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 hover:scale-105 group bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Success Stories
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={400}>
              <div className="flex items-center justify-center sm:justify-start space-x-4 sm:space-x-8 pt-8">
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-electric-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    2+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-electric-500 to-emerald-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    10+
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Countries</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-sunset-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    100%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="right" delay={300}>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-violet-400 via-electric-400 to-emerald-400 p-1 shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 hover:scale-105">
                <img
                  src="/placeholder.svg?height=600&width=600&text=Students+Celebrating+Success"
                  alt="International students celebrating their successful admission and visa approvals through NextGen EduMigrate consultancy services"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Floating success notification */}
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white dark:bg-gray-900 p-2 sm:p-4 rounded-xl shadow-lg border border-emerald-200 animate-bounce-in hover:scale-105 transition-transform cursor-pointer">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-sm sm:text-xl">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-700 text-xs sm:text-sm">Visa Approved!</div>
                    <div className="text-xs text-gray-600"></div>
                  </div>
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -top-3 -right-3 sm:-top-6 sm:-right-6 bg-white dark:bg-gray-900 p-2 sm:p-4 rounded-xl shadow-lg border border-violet-200 animate-float hover:scale-105 transition-transform cursor-pointer">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-violet-600 to-electric-500 bg-clip-text text-transparent">
                    1K+
                  </div>
                  <div className="text-xs text-gray-600">Happy Students</div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
