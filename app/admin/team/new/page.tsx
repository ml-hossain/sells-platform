"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TeamMemberForm } from '@/components/team/TeamMemberForm'

export default function NewTeamMemberPage() {
  const router = useRouter()

  const handleSuccess = () => {
    // Redirect back to list with success query parameter
    router.push('/admin/team?success=true')
  }

  const handleCancel = () => {
    router.push('/admin/team')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Team Member</h1>
            <p className="text-muted-foreground">Create a new team member profile</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <TeamMemberForm 
        mode="create"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
