"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Profile Assessment",
    description: "Complete evaluation of your academic background, goals, and preferences",
    duration: "1-2 days",
    features: [
      "Academic transcript review",
      "Career goal alignment",
      "Budget planning",
      "Country preference analysis"
    ],
    status: "active"
  },
  {
    number: "02", 
    title: "University Matching",
    description: "AI-powered selection of best-fit universities based on your profile",
    duration: "3-5 days",
    features: [
      "Personalized university list",
      "Program compatibility check",
      "Admission probability analysis",
      "Scholarship opportunities"
    ],
    status: "upcoming"
  },
  {
    number: "03",
    title: "Application Preparation",
    description: "Complete assistance with application materials and submission",
    duration: "2-4 weeks",
    features: [
      "Statement of purpose writing",
      "Letter of recommendation guidance", 
      "Document compilation",
      "Application submission"
    ],
    status: "upcoming"
  },
  {
    number: "04",
    title: "Visa Processing",
    description: "Expert guidance through visa application and interview preparation",
    duration: "4-8 weeks",
    features: [
      "Visa application filing",
      "Interview preparation",
      "Document verification",
      "Embassy coordination"
    ],
    status: "upcoming"
  },
  {
    number: "05",
    title: "Pre-Departure",
    description: "Final preparations including accommodation, travel, and orientation",
    duration: "2-3 weeks",
    features: [
      "Accommodation booking",
      "Flight arrangements",
      "Insurance setup",
      "Pre-departure orientation"
    ],
    status: "upcoming"
  }
]

export function ProcessSteps() {
  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Study Abroad Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A step-by-step roadmap to make your international education dreams a reality
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 w-8 h-px bg-gradient-to-r from-orange-200 to-transparent z-10">
                    <ArrowRight className="absolute -right-2 -top-2 h-4 w-4 text-orange-400" />
                  </div>
                )}
                
                <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 ${step.status === 'active' ? 'ring-2 ring-orange-500' : ''}`}>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        step.status === 'active' 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-orange-50 group-hover:text-orange-600'
                      } transition-colors`}>
                        {step.number}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{step.duration}</span>
                      </div>
                      
                      {step.status === 'active' && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          Current Step
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">What's Included:</h4>
                      <ul className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <span className="text-sm text-orange-700 font-medium">Current Step</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">Upcoming Steps</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Start Your Journey Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
