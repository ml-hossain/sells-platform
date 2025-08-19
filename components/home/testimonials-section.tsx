"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    program: "Computer Science",
    university: "MIT",
    country: "USA",
    rating: 5,
    image: "/placeholder-user.jpg",
    quote: "Global Study Hub made my dream of studying at MIT a reality. Their guidance through the application process was exceptional, and I couldn't have done it without their support.",
    achievement: "Full Scholarship Recipient"
  },
  {
    name: "Ahmed Hassan", 
    program: "Medicine",
    university: "University of Toronto",
    country: "Canada",
    rating: 5,
    image: "/placeholder-user.jpg",
    quote: "The visa guidance was incredible. They prepared me so well for the interview that I felt confident throughout the process. Now I'm pursuing my medical degree in Canada!",
    achievement: "Student Visa Approved"
  },
  {
    name: "Priya Sharma",
    program: "Business Administration",
    university: "Oxford University", 
    country: "UK",
    rating: 5,
    image: "/placeholder-user.jpg",
    quote: "From university selection to accommodation, they handled everything perfectly. The mentorship program connected me with current students who helped me settle in quickly.",
    achievement: "MBA Graduate"
  },
  {
    name: "Carlos Rodriguez",
    program: "Engineering",
    university: "ETH Zurich",
    country: "Switzerland", 
    rating: 5,
    image: "/placeholder-user.jpg",
    quote: "The personalized approach really stood out. They understood my goals and matched me with the perfect program. The 24/7 support was invaluable during stressful times.",
    achievement: "Research Assistant"
  },
  {
    name: "Emily Johnson",
    program: "Data Science",
    university: "University of Melbourne",
    country: "Australia",
    rating: 5,
    image: "/placeholder-user.jpg",
    quote: "Their application essay guidance was phenomenal. They helped me craft a compelling story that showcased my passion for data science. Got accepted with a scholarship!",
    achievement: "Merit Scholarship Winner"
  },
  {
    name: "David Kim",
    program: "Finance",
    university: "NUS Singapore",
    country: "Singapore",
    rating: 5,
    image: "/placeholder-user.jpg",
    quote: "The end-to-end service was remarkable. From initial consultation to pre-departure orientation, every step was handled professionally. Highly recommend their services!",
    achievement: "Finance Analyst"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Success Stories from Our Students
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who achieved their study abroad dreams with our guidance
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-blue-200" />
                  <blockquote className="text-gray-700 italic leading-relaxed pl-4">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.program}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">University:</span>
                    <span className="text-sm font-medium text-gray-900">{testimonial.university}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Country:</span>
                    <span className="text-sm font-medium text-gray-900">{testimonial.country}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {testimonial.achievement}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">5,000+</div>
              <div className="text-gray-600">Students Placed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">98%</div>
              <div className="text-gray-600">Visa Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-2">1,000+</div>
              <div className="text-gray-600">Partner Universities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
