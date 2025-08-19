"use client"

import { Users, Globe, GraduationCap, TrendingUp } from "lucide-react"
import { ScrollReveal } from "@/components/animations/scroll-reveal"

export function QuickStats() {
  // Mock data - no backend integration
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Students Helped",
      description: "Successfully guided students to their dream universities",
      color: "from-violet-500 to-violet-600",
      iconColor: "text-violet-600",
      bgColor: "bg-violet-100",
      hoverColor: "hover:bg-violet-200",
    },
    {
      icon: Globe,
      value: "10+",
      label: "Countries",
      description: "Global network of educational opportunities",
      color: "from-electric-500 to-electric-600",
      iconColor: "text-electric-600",
      bgColor: "bg-electric-100",
      hoverColor: "hover:bg-electric-200",
    },
    {
      icon: GraduationCap,
      value: "30+",
      label: "University Partners",
      description: "Partnerships with top universities worldwide",
      color: "from-emerald-500 to-emerald-600",
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
      hoverColor: "hover:bg-emerald-200",
    },
    {
      icon: TrendingUp,
      value: "100%",
      label: "Success Rate",
      description: "Proven track record of successful applications",
      color: "from-sunset-500 to-sunset-600",
      iconColor: "text-sunset-600",
      bgColor: "bg-sunset-100",
      hoverColor: "hover:bg-sunset-200",
    },
  ]
  return (
    <section className="py-16 bg-gradient-to-r from-violet-50/50 via-electric-50/50 to-emerald-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)]" />

      <div className="container relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
              Our Impact in Numbers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of students worldwide for their international education journey
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="text-center space-y-2 sm:space-y-4 group cursor-pointer">
                <div
                  className={`mx-auto w-16 h-16 sm:w-20 sm:h-20 ${stat.bgColor} ${stat.hoverColor} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl`}
                >
                  <stat.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${stat.iconColor}`} />
                </div>
                <div className="space-y-1 sm:space-y-2 group-hover:transform group-hover:scale-105 transition-all duration-300">
                  <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-800">{stat.label}</div>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed px-2 sm:px-0">{stat.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
