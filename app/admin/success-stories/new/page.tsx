"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SuccessStoryForm } from '@/components/success-stories/SuccessStoryForm'

export default function NewSuccessStoryPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect back to list with success query parameter
    router.push('/admin/success-stories?success=true')
  }

  const handleCancel = () => {
    router.push('/admin/success-stories')
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
            <h1 className="text-3xl font-bold">Add New Success Story</h1>
            <p className="text-muted-foreground">Create a new student success story</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <SuccessStoryForm 
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
