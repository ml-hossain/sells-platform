"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Calendar, Phone, Mail } from "lucide-react"
import { useState } from "react"

export function CTASection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-orange-900 via-red-800 to-pink-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge className="bg-white/10 text-white hover:bg-white/20 mb-6">
            🎓 Start Your Journey Today
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Study Abroad?
          </h2>
          
          <p className="text-xl text-orange-100 max-w-2xl mx-auto mb-8">
            Get personalized guidance from our expert counselors and take the first step towards your international education dream.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>No Hidden Costs</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Newsletter Signup */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Get Free Study Abroad Guide
              </h3>
              <p className="text-orange-100 mb-6">
                Subscribe to receive our comprehensive guide with university rankings, application tips, and scholarship opportunities.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-orange-200"
                    required
                  />
                  <Button 
                    type="submit" 
                    className="bg-white text-orange-900 hover:bg-orange-50 px-6"
                    disabled={isSubmitted}
                  >
                    {isSubmitted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <>
                        Get Guide
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
                {isSubmitted && (
                  <p className="text-green-400 text-sm">
                    ✅ Thank you! Check your email for the guide.
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
          
          {/* Contact Options */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Book Free Consultation
              </h3>
              <p className="text-orange-100 mb-6">
                Speak with our expert counselors to get personalized advice for your study abroad journey.
              </p>
              
              <div className="space-y-4">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Online Meeting
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                  
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Mail className="mr-2 h-4 w-4" />
                    Email Us
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-orange-200 text-sm text-center">
                  Available 24/7 • Response within 2 hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Trust Indicators */}
        <div className="text-center mt-16">
          <p className="text-orange-200 mb-6">Trusted by students worldwide</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-white text-sm">ISO Certified</div>
            <div className="w-px h-6 bg-white/30"></div>
            <div className="text-white text-sm">Government Authorized</div>
            <div className="w-px h-6 bg-white/30"></div>
            <div className="text-white text-sm">ICEF Accredited</div>
            <div className="w-px h-6 bg-white/30"></div>
            <div className="text-white text-sm">5-Star Rated</div>
          </div>
        </div>
      </div>
    </section>
  )
}
