import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, FileText, Plane, ArrowRight, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/components/animations/scroll-reveal"

const services = [
  {
    icon: GraduationCap,
    title: "University Selection & Admission",
    description:
      "Comprehensive guidance for choosing the right university and program based on your academic goals and budget.",
    features: ["University Matching", "Application Support", "Admission Strategy", "Scholarship Guidance"],
    gradient: "from-violet-500 to-violet-600",
    bgGradient: "from-violet-50 to-violet-100",
    borderColor: "border-violet-200",
    hoverShadow: "hover:shadow-violet-500/25",
  },
  {
    icon: Plane,
    title: "Student Visa & Immigration",
    description:
      "Professional assistance with student visa applications, documentation, and immigration requirements.",
    features: ["Visa Applications", "Document Preparation", "Interview Coaching", "Post-Arrival Support"],
    gradient: "from-emerald-500 to-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100",
    borderColor: "border-emerald-200",
    hoverShadow: "hover:shadow-emerald-500/25",
  },
  {
    icon: FileText,
    title: "Career Counseling & Guidance",
    description:
      "Professional career guidance to help you choose the right path and maximize your international education investment.",
    features: ["Career Assessment", "Industry Insights", "Skill Development", "Job Market Analysis"],
    gradient: "from-electric-500 to-electric-600",
    bgGradient: "from-electric-50 to-electric-100",
    borderColor: "border-electric-200",
    hoverShadow: "hover:shadow-electric-500/25",
  },
]

export function ServicesSection() {
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-violet-50/30 to-emerald-50/30" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-violet-400/20 to-electric-400/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-sunset-400/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-electric-100 text-violet-700 text-sm font-medium mb-4 animate-bounce-in">
              <Sparkles className="h-4 w-4 mr-2" />
              Comprehensive Solutions
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
              Our Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for your international education journey
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <Card
                className={`relative overflow-hidden group hover:shadow-2xl ${service.hoverShadow} transition-all duration-500 hover:-translate-y-2 border-2 ${service.borderColor} hover:border-opacity-50 h-full flex flex-col`}
              >
                {/* Gradient top border */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.gradient}`} />

                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                />

                <CardHeader className="relative z-10">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-gray-800 transition-colors">{service.title}</CardTitle>
                  <CardDescription className="group-hover:text-gray-700 transition-colors">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 relative z-10 flex-grow flex flex-col">
                  <ul className="space-y-3 flex-grow">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm group-hover:text-gray-700 transition-colors"
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${service.gradient} rounded-full mr-3`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
