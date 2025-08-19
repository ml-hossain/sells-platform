"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SuccessStoryForm } from '@/components/success-stories/SuccessStoryForm'
import { getSuccessStoryById, SuccessStory } from '@/lib/services/success-stories-service'
import { toast } from '@/hooks/use-toast'

export default function EditSuccessStoryPage() {
  const router = useRouter()
  const params = useParams()
  const [successStory, setSuccessStory] = useState<SuccessStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = params.id as string

  useEffect(() => {
    if (id) {
      loadSuccessStory()
    }
  }, [id])

  const loadSuccessStory = async () => {
    try {
      setLoading(true)
      setError(null)
      const story = await getSuccessStoryById(id)
      
      if (!story) {
        setError('Success story not found')
        toast({
          title: "Error",
          description: "Success story not found",
          variant: "destructive",
        })
        return
      }

      setSuccessStory(story)
    } catch (error) {
      setError('Failed to load success story')
      toast({
        title: "Error",
        description: "Failed to load success story. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    // Redirect back to list with success query parameter
    router.push('/admin/success-stories?success=true')
  }

  const handleCancel = () => {
    router.push('/admin/success-stories')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/success-stories">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Success Story</h1>
              <p className="text-muted-foreground">Loading success story...</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading success story...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !successStory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/success-stories">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Success Story</h1>
              <p className="text-muted-foreground">Error loading success story</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2">
              <Button onClick={loadSuccessStory} variant="outline">
                Try Again
              </Button>
              <Button asChild>
                <Link href="/admin/success-stories">
                  Back to List
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/success-stories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Success Story</h1>
            <p className="text-muted-foreground">
              Update {successStory.name}'s success story
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <SuccessStoryForm 
        mode="edit"
        initialData={successStory}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
