"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Star, Quote, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/components/animations/scroll-reveal"
import { getSuccessStories, type SuccessStory } from "@/lib/services/success-stories-service"

// Default values for missing fields
const getDefaultFlag = (country: string): string => {
  const flags: { [key: string]: string } = {
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'UK': '🇬🇧',
    'United Kingdom': '🇬🇧',
    'USA': '🇺🇸',
    'United States': '🇺🇸',
    'America': '🇺🇸',
    'US': '🇺🇸',
    'Germany': '🇩🇪',
    'Netherlands': '🇳🇱',
    'Holland': '🇳🇱',
    'France': '🇫🇷',
    'Ireland': '🇮🇪',
    'New Zealand': '🇳🇿',
    'Sweden': '🇸🇪',
    'Denmark': '🇩🇰',
    'Norway': '🇳🇴',
    'Finland': '🇫🇮',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'Korea': '🇰🇷',
    'China': '🇨🇳',
    'India': '🇮🇳',
    'Singapore': '🇸🇬',
    'Malaysia': '🇲🇾',
    'Thailand': '🇹🇭',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Portugal': '🇵🇹',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'Belgium': '🇧🇪',
    'Poland': '🇵🇱',
    'Czech Republic': '🇨🇿',
    'Hungary': '🇭🇺',
    'Russia': '🇷🇺',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Mexico': '🇲🇽',
    'Chile': '🇨🇱',
    'South Africa': '🇿🇦',
    'Turkey': '🇹🇷',
    'UAE': '🇦🇪',
    'Israel': '🇮🇱',
    'Egypt': '🇪🇬',
  }
  
  // Try exact match first
  if (flags[country]) {
    return flags[country]
  }
  
  // Try case-insensitive match
  const countryLower = country.toLowerCase()
  for (const [key, value] of Object.entries(flags)) {
    if (key.toLowerCase() === countryLower) {
      return value
    }
  }
  
  // Return generic globe emoji for unknown countries
  return '🌍'
}

const getDefaultColor = (index: number): string => {
  const colors = [
    'from-violet-500 to-violet-600',
    'from-emerald-500 to-emerald-600',
    'from-electric-500 to-electric-600',
    'from-sunset-500 to-sunset-600',
    'from-violet-500 to-electric-500',
    'from-emerald-500 to-sunset-500',
  ]
  return colors[index % colors.length]
}

export function SuccessStories() {
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Responsive stories per page
  const getStoriesPerPage = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 1 : 3
    }
    return 3
  }

  const [storiesPerPage, setStoriesPerPage] = useState(getStoriesPerPage())
  const totalPages = Math.ceil(successStories.length / storiesPerPage)

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      const newStoriesPerPage = getStoriesPerPage()
      const wasMobile = storiesPerPage === 1
      const isNowMobile = newStoriesPerPage === 1

      if (wasMobile !== isNowMobile) {
        setStoriesPerPage(newStoriesPerPage)
        setCurrentPage(0) // Reset to first page when layout changes
      }
      setIsMobile(window.innerWidth < 768)
    }

    handleResize() // Check initial size
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [storiesPerPage])

  // Fetch success stories from Firestore
  useEffect(() => {
    const fetchSuccessStories = async () => {
      try {
        setLoading(true)
        setError(null)
        const stories = await getSuccessStories()

        // Add default values for missing fields
        const storiesWithDefaults = stories.map((story, index) => ({
          ...story,
          flag: story.flag || getDefaultFlag(story.country),
          color: story.color || getDefaultColor(index),
          rating: story.rating || 5, // Default to 5 stars if not set
        }))

        setSuccessStories(storiesWithDefaults)
      } catch (err) {
        console.error('Failed to load success stories:', err)
        setError('Failed to load success stories')
      } finally {
        setLoading(false)
      }
    }

    fetchSuccessStories()
  }, [])

  const getCurrentStories = () => {
    const start = currentPage * storiesPerPage
    return successStories.slice(start, start + storiesPerPage)
  }

  // Reset to first page when stories change
  useEffect(() => {
    setCurrentPage(0)
  }, [successStories.length])

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <section className="py-16 bg-gradient-to-br from-violet-50/50 via-electric-50/30 to-emerald-50/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-violet-400/20 to-electric-400/20 rounded-full blur-2xl animate-float" />
      <div
        className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-emerald-400/20 to-sunset-400/20 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="container relative">
        <ScrollReveal>
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-electric-100 text-emerald-700 text-sm font-medium mb-4 animate-bounce-in">
              <Sparkles className="h-4 w-4 mr-2" />
              Student Success Stories
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-electric-600 bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from our successful students who achieved their dreams of studying abroad
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {loading ? (
            // Skeleton loading animation
            [...Array(storiesPerPage)].map((_, index) => (
              <ScrollReveal key={`skeleton-${index}`} delay={index * 100}>
                <Card className="relative h-[16rem] sm:h-[18rem] md:h-[16rem] lg:h-[18rem] overflow-hidden border-2 border-violet-100">
                  <CardContent className="p-3 sm:p-4 md:p-4 flex flex-col h-full">
                    <div className="absolute top-3 right-3">
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>

                    <Skeleton className="h-5 w-5 sm:h-6 sm:w-6 mb-2 sm:mb-3" />
                    <div className="space-y-2 mb-3 sm:mb-4 flex-grow">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-3 w-3" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <div className="text-red-500 mb-4">
                <Quote className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-medium">Failed to load success stories</p>
                <p className="text-sm text-gray-600 mt-2">{error}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-violet-200 text-violet-600 hover:bg-violet-50"
              >
                Try Again
              </Button>
            </div>
          ) : successStories.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <Quote className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-600">No success stories available</p>
              <p className="text-sm text-gray-500 mt-2">Check back later for inspiring student journeys!</p>
            </div>
          ) : (
            // Success stories content
            getCurrentStories().map((story, index) => (
              <ScrollReveal key={story.id} delay={index * 100}>
                <Card className="relative h-[16rem] sm:h-[18rem] md:h-[16rem] lg:h-[18rem] overflow-hidden group hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500 hover:-translate-y-2 border-2 border-violet-100 hover:border-violet-200">
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${story.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <CardContent className="p-3 sm:p-4 md:p-4 relative z-10 flex flex-col h-full">
                    <div
                      className="absolute top-3 right-3 text-lg sm:text-xl animate-float"
                      style={{ animationDelay: `${index * 0.5}s` }}
                    >
                      {story.flag || '🌍'}
                    </div>

                    <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-violet-300 mb-2 sm:mb-3 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                    
                    {/* Story text with fixed height and scroll */}
                    <div className="flex-1 mb-3 sm:mb-4 min-h-0">
                      <p className="text-gray-600 italic leading-relaxed group-hover:text-gray-700 transition-colors break-words text-xs sm:text-sm h-full overflow-y-auto pr-2 custom-scrollbar">
                        &ldquo;{story.story}&rdquo;
                      </p>
                    </div>

                    {/* Student info section with fixed height */}
                    <div className="flex items-start space-x-2 sm:space-x-3 mb-2 sm:mb-3 flex-shrink-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${story.color} flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
                      >
                        {story.image ? (
                          <img
                            src={story.image}
                            alt={story.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              e.currentTarget.style.display = 'none'
                              const nextElement = e.currentTarget.nextElementSibling as HTMLElement
                              if (nextElement) {
                                nextElement.style.display = 'flex'
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="w-full h-full rounded-full flex items-center justify-center text-xs"
                          style={{ display: story.image ? 'none' : 'flex' }}
                        >
                          {story.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors text-xs sm:text-sm truncate">
                          {story.name}
                        </h4>
                        <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors truncate">
                          {story.program}
                        </p>
                        <p
                          className={`text-xs bg-gradient-to-r ${story.color} bg-clip-text text-transparent font-medium truncate`}
                        >
                          {story.university}, {story.country}
                        </p>
                      </div>
                    </div>

                    {/* Rating section with fixed height */}
                    <div className="flex items-center flex-shrink-0">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform"
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))
          )}
        </div>

        {!loading && !error && successStories.length > 0 && totalPages > 1 && (
          <ScrollReveal>
            <div className="flex items-center justify-center space-x-2 md:space-x-4">
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={prevPage}
                disabled={currentPage === 0}
                className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 bg-transparent px-2 md:px-3"
              >
                <ChevronLeft className="h-4 w-4" />
                {isMobile && <span className="ml-1 text-xs">Prev</span>}
              </Button>

              <div className="flex space-x-1 md:space-x-2">
                {isMobile ? (
                  // Mobile: Show current page info
                  <div className="flex items-center px-3 py-2 rounded-md bg-gradient-to-r from-violet-600 to-electric-600 text-white text-sm font-medium">
                    {currentPage + 1} of {totalPages}
                  </div>
                ) : (
                  // Desktop: Show all page numbers
                  [...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      className={`w-10 h-10 p-0 transition-all duration-300 hover:scale-110 ${currentPage === i
                        ? "bg-gradient-to-r from-violet-600 to-electric-600 shadow-lg"
                        : "border-violet-200 text-violet-600 hover:bg-violet-50"
                        }`}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i + 1}
                    </Button>
                  ))
                )}
              </div>

              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="border-violet-200 text-violet-600 hover:bg-violet-50 hover:border-violet-300 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 bg-transparent px-2 md:px-3"
              >
                {isMobile && <span className="mr-1 text-xs">Next</span>}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}
