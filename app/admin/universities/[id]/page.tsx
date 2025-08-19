"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RichTextDisplay from '@/components/ui/rich-text-display'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, MapPin, Calendar, Loader2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { getUniversityById, deleteUniversity, University } from '@/lib/services/university-service'
import { toast } from '@/hooks/use-toast'


export default function UniversityDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const universityId = params.id as string

  const [university, setUniversity] = useState<University | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (universityId) {
      loadUniversity()
    }
  }, [universityId])

  const loadUniversity = async () => {
    try {
      setLoading(true)
      const data = await getUniversityById(universityId)
      setUniversity(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load university details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!university?.id) return

    try {
      setDeleting(true)
      await deleteUniversity(university.id)
      toast({
        title: "Success",
        description: "University deleted successfully.",
      })
      router.push('/admin/universities')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete university.",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/universities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Loading...</h1>
            <p className="text-muted-foreground">Loading university details</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading university details...</span>
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/universities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">University Not Found</h1>
            <p className="text-muted-foreground">The requested university could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/universities">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{university.name}</h1>
            <p className="text-muted-foreground">University Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/admin/universities/edit/${university.id}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>University Information</CardTitle>
            </CardHeader>
            <CardContent>
              {university.image && (
                <div className="mb-6">
                  <img
                    src={university.image}
                    alt={university.name}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-lg border"
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Country:</span>
                  <span>{university.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Type:</span>
                  <Badge variant={university.type === "Public" ? "default" : "outline"}>
                    {university.type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Short Description</h3>
                  <p className="text-muted-foreground">{university.shortDescription}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Detailed Information</h3>
                  <RichTextDisplay content={university.details} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Record Information</CardTitle>
              <CardDescription>System information about this university record</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(university.createdAt instanceof Date
                      ? university.createdAt.toISOString()
                      : (university.createdAt instanceof Date ? university.createdAt : university.createdAt.toDate()).toISOString())}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(university.updatedAt instanceof Date
                      ? university.updatedAt.toISOString()
                      : (university.updatedAt instanceof Date ? university.updatedAt : university.updatedAt.toDate()).toISOString())}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="font-medium mb-2">University ID</p>
                <p className="text-sm text-muted-foreground font-mono">
                  {university.id}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common actions for this university</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href={`/admin/universities/edit/${university.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit University
                </Link>
              </Button>

              <Button className="w-full" variant="outline" asChild>
                <Link href={`/universities/${university.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Public Site
                </Link>
              </Button>

              <Button className="w-full" variant="destructive" onClick={handleDelete} disabled={deleting}>
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete University
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
