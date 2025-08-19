"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Loader2 } from "lucide-react"
import useUniversities from "@/lib/hooks/useUniversities"
import Link from "next/link"


export function UniversitySidebar() {
  const { data: universities, loading, error } = useUniversities()
  
  // Get top 5 universities (first 5 from the database)
  const topUniversities = universities?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      {/* Top Universities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Star className="h-5 w-5 mr-2 text-yellow-500" />
            Top Universities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-sm text-red-500 mb-2">Error loading universities</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : topUniversities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No universities available</p>
            </div>
          ) : (
            topUniversities.map((uni, index) => (
              <Link href={`/universities/${uni.id}`} key={uni.id}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="flex-1">
                    <div className="font-medium text-sm group-hover:text-violet-600 transition-colors">
                      {uni.name}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {uni.country}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))
          )}
          <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm" asChild>
            <Link href="/universities">
              View All Universities
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-6 text-center">
          <h3 className="font-bold mb-2">Need Help Choosing?</h3>
          <p className="text-sm opacity-90 mb-4">Get personalized university recommendations based on your profile.</p>
          <Button variant="secondary" size="sm" className="w-full" asChild>
            <Link href="/#consultation-form">
              Get Free Consultation
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
