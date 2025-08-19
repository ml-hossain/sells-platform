"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import RichTextDisplay from '@/components/ui/rich-text-display'
import { ArrowLeft, MapPin, Calendar, GraduationCap, Loader2, ExternalLink, Users, BookOpen, Search, X, ChevronUp, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getUniversityBySlug, getUniversityById, University } from '@/lib/services/university-service'
import { toast } from '@/hooks/use-toast'
import '../../../styles/university-details.css'

export default function UniversityDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.id as string

  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentMatch, setCurrentMatch] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const pageRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (slug) {
      loadUniversity()
    }
  }, [slug])

  const loadUniversity = async () => {
    try {
      setLoading(true)
      console.log('Loading university with slug:', slug)
      console.log('Decoded slug:', decodeURIComponent(slug))
      
      let universityData = null
      
      // Try to get by slug first (for SEO-friendly URLs)
      universityData = await getUniversityBySlug(slug)
      console.log('getUniversityBySlug result:', universityData)
      
      // If not found by slug, try to get by ID (fallback for existing URLs)
      if (!universityData) {
        console.log('Trying getUniversityById with:', slug)
        universityData = await getUniversityById(slug)
        console.log('getUniversityById result:', universityData)
      }
      
      // If still not found, try with decoded slug
      if (!universityData) {
        const decodedSlug = decodeURIComponent(slug)
        console.log('Trying with decoded slug:', decodedSlug)
        universityData = await getUniversityBySlug(decodedSlug)
        console.log('Decoded getUniversityBySlug result:', universityData)
      }

      if (!universityData) {
        console.log('University not found for slug:', slug)
        console.log('Available options: Check /universities for valid university links')
        toast({
          title: "University not found",
          description: "The requested university could not be found. Redirecting to university list.",
          variant: "destructive"
        })
        router.push('/universities')
        return
      }

      setUniversity(universityData)
    } catch (error) {
      console.error('Error loading university:', error)
      toast({
        title: "Error",
        description: "Failed to load university details. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }
  const handleTripleClick = (e: React.MouseEvent) => {
    // Don't interfere with any interactive elements or table areas
    const target = e.target as HTMLElement
    
    // More comprehensive check for elements to ignore
    const shouldIgnore = (
      // Form elements
      target.tagName === 'A' || 
      target.tagName === 'BUTTON' || 
      target.tagName === 'INPUT' || 
      target.tagName === 'SELECT' ||
      target.tagName === 'TEXTAREA' ||
      // Table elements
      target.tagName === 'TABLE' ||
      target.tagName === 'TD' ||
      target.tagName === 'TH' ||
      target.tagName === 'TR' ||
      target.tagName === 'THEAD' ||
      target.tagName === 'TBODY' ||
      target.tagName === 'TFOOT' ||
      // Parent containers
      target.closest('button') || 
      target.closest('a') ||
      target.closest('table') ||
      target.closest('.table-scroll-wrapper') ||
      target.closest('[role="button"]') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('textarea') ||
      // Check if target has scrollable overflow
      getComputedStyle(target).overflowX === 'auto' ||
      getComputedStyle(target).overflowX === 'scroll'
    )
    
    if (shouldIgnore) {
      console.log('Triple-click ignored on:', target.tagName, target.className)
      return
    }

    setClickCount(prev => {
      const newCount = prev + 1

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current)
      }

      if (newCount === 3) {
        console.log('Triple-click detected, opening search')
        setShowSearch(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
        return 0
      }

      clickTimeoutRef.current = setTimeout(() => {
        setClickCount(0)
      }, 500)

      return newCount
    })
  }

  // Search functionality
  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text

    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-300 text-black rounded px-1">$1</mark>')
  }

  const searchInContent = (searchValue: string) => {
    if (!pageRef.current || !searchValue.trim()) {
      // Clear previous highlights by restoring original content
      if (pageRef.current && pageRef.current.dataset.originalContent) {
        pageRef.current.innerHTML = pageRef.current.dataset.originalContent
      }
      setTotalMatches(0)
      setCurrentMatch(0)
      return
    }

    // Store original content if not already stored
    if (!pageRef.current.dataset.originalContent) {
      pageRef.current.dataset.originalContent = pageRef.current.innerHTML
    }

    // Restore original content first
    pageRef.current.innerHTML = pageRef.current.dataset.originalContent

    // Use TreeWalker to find only text nodes and highlight them
    const walker = document.createTreeWalker(
      pageRef.current,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip text nodes that are inside script, style, or already highlighted elements
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT

          const tagName = parent.tagName.toLowerCase()
          if (['script', 'style', 'mark'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT
          }

          // Skip empty or whitespace-only text nodes
          if (!node.textContent || node.textContent.trim() === '') {
            return NodeFilter.FILTER_REJECT
          }

          return NodeFilter.FILTER_ACCEPT
        }
      }
    )

    const textNodes: Text[] = []
    let node
    while (node = walker.nextNode()) {
      textNodes.push(node as Text)
    }

    const escapedSearchValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedSearchValue})`, 'gi')
    let matchCount = 0

    // Process each text node
    textNodes.forEach(textNode => {
      const text = textNode.textContent || ''
      const matches = text.match(regex)

      if (matches) {
        matchCount += matches.length

        // Create highlighted version
        const highlightedHTML = text.replace(regex, '<mark class="bg-yellow-300 text-black rounded px-1 search-highlight">$1</mark>')

        // Create a temporary container
        const tempContainer = document.createElement('div')
        tempContainer.innerHTML = highlightedHTML

        // Replace the text node with highlighted content
        const fragment = document.createDocumentFragment()
        while (tempContainer.firstChild) {
          fragment.appendChild(tempContainer.firstChild)
        }

        textNode.parentNode?.replaceChild(fragment, textNode)
      }
    })

    setTotalMatches(matchCount)
    if (matchCount > 0) {
      setCurrentMatch(1)
      scrollToMatch(1)
    }
  }

  const scrollToMatch = (matchNumber: number) => {
    const marks = pageRef.current?.querySelectorAll('mark')
    if (marks && marks.length > 0) {
      // Remove previous active highlight ring
      marks.forEach(mark => mark.classList.remove('ring-2', 'ring-yellow-500'))

      const targetMark = marks[matchNumber - 1]
      if (targetMark) {
        targetMark.classList.add('ring-2', 'ring-yellow-500')
        targetMark.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    searchInContent(value)
  }

  const nextMatch = () => {
    if (currentMatch < totalMatches) {
      const next = currentMatch + 1
      setCurrentMatch(next)
      scrollToMatch(next)
    }
  }

  const prevMatch = () => {
    if (currentMatch > 1) {
      const prev = currentMatch - 1
      setCurrentMatch(prev)
      scrollToMatch(prev)
    }
  }

  const closeSearch = () => {
    setShowSearch(false)
    setSearchTerm('')
    setCurrentMatch(0)
    setTotalMatches(0)
    searchInContent('')
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSearch) {
        if (e.key === 'Escape') {
          closeSearch()
        } else if (e.key === 'Enter') {
          if (e.shiftKey) {
            prevMatch()
          } else {
            nextMatch()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSearch, currentMatch, totalMatches])

  if (loading) {
    return (
      <div className="py-8">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading university details...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="py-8">
        <div className="container">
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h1 className="text-2xl font-bold mb-2">University Not Found</h1>
            <p className="text-muted-foreground mb-6">The requested university could not be found.</p>
            <Button asChild>
              <Link href="/universities">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Universities
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      {/* Search Overlay - Outside the searchable area */}
      {showSearch && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 min-w-[320px]">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              ref={searchInputRef}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search in page..."
              className="flex-1"
            />
            <Button size="sm" variant="ghost" onClick={closeSearch}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {totalMatches > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {currentMatch} of {totalMatches} matches
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={prevMatch}
                  disabled={currentMatch <= 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={nextMatch}
                  disabled={currentMatch >= totalMatches}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {searchTerm && totalMatches === 0 && (
            <div className="text-sm text-gray-500">
              No matches found
            </div>
          )}

          <div className="text-xs text-gray-400 mt-2">
            Press Esc to close, Enter to find next, Shift+Enter for previous
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <div ref={pageRef} className="py-2 sm:py-4" onClick={handleTripleClick}>
        {/* Header Section - Full Width Layout */}
        <div className="w-full pl-4 pr-8 sm:pl-6 sm:pr-12 md:pl-8 md:pr-16 lg:pl-[5%] lg:pr-[25%] xl:pl-[8%] xl:pr-[28%] mb-4 sm:mb-6">
          <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/universities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Universities
            </Link>
          </Button>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* University Image */}
            <div className="w-full lg:w-96 flex-shrink-0">
              <img
                src={university.image || "/placeholder.svg"}
                alt={university.name}
                className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg border"
              />
            </div>

            {/* University Info */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {university.country}
                </Badge>
                <Badge variant={university.type === "Public" ? "default" : "outline"}>
                  {university.type}
                </Badge>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
                {university.name}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 font-light mb-4 sm:mb-6 leading-relaxed">
                {university.shortDescription}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Added {formatDate(university.createdAt instanceof Date
                    ? university.createdAt.toISOString()
                    : (university.createdAt instanceof Date ? university.createdAt : university.createdAt.toDate()).toISOString())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout - Responsive */}
        <div className="flex flex-col xl:flex-row w-full px-4 sm:px-6 md:px-8 lg:px-[5%] xl:px-[8%] gap-4 lg:gap-[1%]">
          {/* Main Content - Full width on mobile/tablet, 80% on desktop */}
          <div className="w-full xl:w-4/5 order-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BookOpen className="h-5 w-5" />
                  About {university.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-hidden px-2 sm:px-4 md:px-2">
                <RichTextDisplay content={university.details} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Full width on mobile/tablet, 20% on desktop */}
          <div className="w-full xl:w-1/5 order-2 xl:order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4 xl:space-y-4 xl:gap-0">
              {/* Quick Info */}
              <Card className="xl:mb-4">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Quick Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Country</span>
                    <Badge variant="secondary">
                      <MapPin className="h-3 w-3 mr-1" />
                      {university.country}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type</span>
                    <Badge variant={university.type === "Public" ? "default" : "outline"}>
                      {university.type}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Added</span>
                    <span className="text-xs sm:text-sm text-muted-foreground text-right">
                      {formatDate(university.createdAt instanceof Date
                        ? university.createdAt.toISOString()
                        : (university.createdAt instanceof Date ? university.createdAt : university.createdAt.toDate()).toISOString())}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-gradient-to-br from-violet-50 to-electric-50 border-violet-200 xl:mb-4">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg text-violet-700">Interested in this university?</CardTitle>
                  <CardDescription className="text-sm">
                    Get in touch with our experts for personalized guidance and application support.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-electric-600 hover:from-violet-700 hover:to-electric-700 text-sm sm:text-base" asChild>
                    <Link href="/#consultation-form">
                      <Users className="h-4 w-4 mr-2" />
                      Book Consultation
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full text-sm sm:text-base" asChild>
                    <Link href="/contact">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Contact Us
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Related Actions - Hidden on mobile, show on tablet+ */}
            <Card className="hidden sm:block xl:mt-0">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Explore More</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                  <Link href="/universities">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Browse All Universities
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                  <Link href="/success-stories">
                    <Users className="h-4 w-4 mr-2" />
                    Success Stories
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start text-sm" asChild>
                  <Link href="/services">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Our Services
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
