"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const universities = [
  {
    id: "university-of-toronto",
    name: "University of Toronto",
    country: "Canada",
    ranking: "#1 in Canada",
    rating: 4.8,
    students: "97,000+",
    tuition: "$58,160",
    programs: ["Computer Science", "Business", "Medicine", "Engineering"],
    image: "/placeholder.jpg",
    featured: true
  },
  {
    id: "mit",
    name: "MIT",
    country: "USA",
    ranking: "#2 Global",
    rating: 4.9,
    students: "11,500+",
    tuition: "$57,986",
    programs: ["Engineering", "Computer Science", "Physics", "Economics"],
    image: "/placeholder.jpg",
    featured: true
  },
  {
    id: "oxford",
    name: "University of Oxford",
    country: "UK",
    ranking: "#4 Global",
    rating: 4.7,
    students: "24,000+",
    tuition: "$47,000",
    programs: ["Law", "Medicine", "Philosophy", "Literature"],
    image: "/placeholder.jpg",
    featured: false
  },
  {
    id: "melbourne",
    name: "University of Melbourne",
    country: "Australia",
    ranking: "#33 Global",
    rating: 4.6,
    students: "51,000+",
    tuition: "$45,824",
    programs: ["Medicine", "Engineering", "Business", "Arts"],
    image: "/placeholder.jpg",
    featured: false
  },
  {
    id: "eth-zurich",
    name: "ETH Zurich",
    country: "Switzerland",
    ranking: "#8 Global",
    rating: 4.8,
    students: "22,000+",
    tuition: "$1,460",
    programs: ["Engineering", "Computer Science", "Mathematics", "Physics"],
    image: "/placeholder.jpg",
    featured: true
  },
  {
    id: "nus",
    name: "National University of Singapore",
    country: "Singapore",
    ranking: "#11 Global",
    rating: 4.5,
    students: "40,000+",
    tuition: "$37,550",
    programs: ["Engineering", "Business", "Computer Science", "Medicine"],
    image: "/placeholder.jpg",
    featured: false
  }
]

export function UniversityHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Universities We Partner With
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access to world's leading institutions with personalized guidance for your academic journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {universities.map((university, index) => (
            <Card key={university.id} className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 ${university.featured ? 'ring-2 ring-orange-500' : ''}`}>
              <CardContent className="p-0">
                <div className="relative">
                  <Image
                    src={university.image}
                    alt={university.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {university.featured && (
                    <Badge className="absolute top-3 left-3 bg-orange-600 hover:bg-orange-700">
                      Featured
                    </Badge>
                  )}
                  <Badge className="absolute top-3 right-3 bg-white text-gray-900">
                    {university.ranking}
                  </Badge>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {university.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{university.country}</span>
                    <div className="flex items-center gap-1 ml-auto">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{university.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Students</span>
                      </div>
                      <span className="text-sm font-medium">{university.students}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Tuition</span>
                      </div>
                      <span className="text-sm font-medium">{university.tuition}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Popular Programs:</p>
                    <div className="flex flex-wrap gap-1">
                      {university.programs.slice(0, 3).map((program, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {program}
                        </Badge>
                      ))}
                      {university.programs.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{university.programs.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Link href={`/universities/${university.id}`} className="block w-full">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link href="/universities">
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              View All Universities
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
