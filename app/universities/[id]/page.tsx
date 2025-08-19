"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import RichTextDisplay from '@/components/ui/rich-text-display'
import { ArrowLeft, MapPin, GraduationCap, Loader2, Users } from 'lucide-react'
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

  useEffect(() => {
    if (slug) {
      loadUniversity()
    }
  }, [slug])

  const loadUniversity = async () => {
    try {
      setLoading(true)
      
      let universityData = null
      
      // Try to get by slug first (for SEO-friendly URLs)
      universityData = await getUniversityBySlug(slug)
      
      // If not found by slug, try to get by ID (fallback for existing URLs)
      if (!universityData) {
        universityData = await getUniversityById(slug)
      }
      
      // If still not found, try with decoded slug
      if (!universityData) {
        const decodedSlug = decodeURIComponent(slug)
        universityData = await getUniversityBySlug(decodedSlug)
      }

      if (!universityData) {
        toast({
          title: "University not found",
          description: "The requested university could not be found.",
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
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-xl font-semibold mb-2">University Not Found</h1>
          <p className="text-gray-600 mb-4">The requested university could not be found.</p>
          <Button asChild>
            <Link href="/universities">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Universities
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="outline" asChild className="mb-6">
          <Link href="/universities">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Universities
          </Link>
        </Button>

        {/* University Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* University Image */}
            <div className="md:w-1/3">
              <img
                src={university.image || "/placeholder.svg"}
                alt={university.name}
                className="w-full h-48 md:h-64 object-cover rounded-lg border"
              />
            </div>

            {/* University Info */}
            <div className="md:w-2/3">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {university.country}
                </Badge>
                <Badge variant={university.type === "Public" ? "default" : "outline"}>
                  {university.type}
                </Badge>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                {university.name}
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {university.shortDescription}
              </p>

              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link href="/#consultation-form">
                  <Users className="h-4 w-4 mr-2" />
                  Get Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* University Details */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">About {university.name}</h2>
          <div className="prose prose-gray max-w-none">
            <RichTextDisplay content={university.details} />
          </div>
        </div>
      </div>
    </div>
  )
}
