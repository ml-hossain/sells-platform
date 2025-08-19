"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, FileCheck, Plane, Shield, MessageCircle } from "lucide-react"

const features = [
  {
    icon: GraduationCap,
    title: "University Selection",
    description: "AI-powered matching with 1000+ universities based on your profile and preferences.",
    color: "orange"
  },
  {
    icon: FileCheck,
    title: "Application Support",
    description: "End-to-end application assistance including essays, documents, and submission.",
    color: "red"
  },
  {
    icon: Shield,
    title: "Visa Guidance",
    description: "Expert visa consultation with 98% approval rate and interview preparation.",
    color: "pink"
  },
  {
    icon: Plane,
    title: "Pre-Departure",
    description: "Complete preparation including accommodation, insurance, and travel arrangements.",
    color: "amber"
  },
  {
    icon: Users,
    title: "Mentorship Program",
    description: "Connect with current students and alumni from your target universities.",
    color: "rose"
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    description: "Round-the-clock support throughout your entire study abroad journey.",
    color: "coral"
  }
]

const colorClasses = {
  orange: "from-orange-500 to-red-500 bg-orange-50 text-orange-700",
  red: "from-red-500 to-pink-500 bg-red-50 text-red-700",
  pink: "from-pink-500 to-rose-500 bg-pink-50 text-pink-700",
  amber: "from-amber-500 to-orange-500 bg-amber-50 text-amber-700",
  rose: "from-rose-500 to-pink-500 bg-rose-50 text-rose-700",
  coral: "from-orange-400 to-red-400 bg-orange-50 text-orange-600"
}

export function FeaturesGrid() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Global Study Hub?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive support at every step of your international education journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colorClass = colorClasses[feature.color as keyof typeof colorClasses]
            const [bgClass, iconBgClass, textClass] = colorClass.split(' ')
            
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${bgClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
