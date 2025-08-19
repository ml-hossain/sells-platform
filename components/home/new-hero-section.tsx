"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Play, Users, Globe, Award, BookOpen, Target, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export function NewHeroSection() {
  const router = useRouter()

  const handleExploreUniversities = () => {
    router.push('/universities')
  }

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 overflow-hidden">
      {/* Geometric Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 left-16 w-64 h-64 bg-gradient-to-br from-orange-300 to-red-300 rounded-3xl rotate-12 opacity-20 animate-pulse"></div>
        <div className="absolute top-64 right-20 w-48 h-48 bg-gradient-to-br from-pink-300 to-rose-300 rounded-full opacity-25 animate-bounce-slow"></div>
        <div className="absolute bottom-32 left-1/3 w-56 h-56 bg-gradient-to-br from-amber-300 to-orange-300 rounded-2xl -rotate-12 opacity-15 animate-pulse"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 right-1/4 animate-float">
          <div className="p-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
            <BookOpen className="h-6 w-6 text-orange-600" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-float-delayed">
          <div className="p-3 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
            <Globe className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 text-sm font-medium">
                🚀 #1 Study Abroad Platform
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                  <span className="text-gray-900">Study</span>
                  <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                    Beyond Borders
                  </span>
                </h1>
                
                <p className="text-xl text-gray-700 leading-relaxed max-w-xl font-medium">
                  Unlock global opportunities with personalized guidance from industry experts. Your international education journey starts here.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                  onClick={handleExploreUniversities}
                >
                  Start Your Journey
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg font-semibold"
                >
                  <Play className="mr-3 h-5 w-5" />
                  Watch Story
                </Button>
              </div>
              
              {/* Achievement Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">12K+</div>
                  <div className="text-gray-600 font-medium">Students Placed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">99%</div>
                  <div className="text-gray-600 font-medium">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">65+</div>
                  <div className="text-gray-600 font-medium">Countries</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Feature Cards */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Top Row */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Perfect Match</h3>
                  <p className="text-gray-600 text-sm">AI-powered university matching based on your profile</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 mt-6">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Fast Track</h3>
                  <p className="text-gray-600 text-sm">Express application processing in just 7 days</p>
                </CardContent>
              </Card>
              
              {/* Bottom Row */}
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 mt-4">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Scholarships</h3>
                  <p className="text-gray-600 text-sm">Access to exclusive funding opportunities</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Expert Mentors</h3>
                  <p className="text-gray-600 text-sm">24/7 guidance from certified counselors</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Floating Trust Badge */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <Card className="bg-white shadow-2xl border-0">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white"></div>
                      ))}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">2,500+ reviews</div>
                      <div className="text-orange-600 text-xs flex items-center gap-1">
                        ⭐⭐⭐⭐⭐ 4.9/5 rating
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
