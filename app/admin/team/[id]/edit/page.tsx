"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TeamMemberForm } from '@/components/team/TeamMemberForm'
import { getTeamMemberById } from '@/lib/services/team-service'
import type { TeamMember } from '@/lib/types/team-member'
import { toast } from '@/hooks/use-toast'

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = params.id as string

  useEffect(() => {
    if (id) {
      loadTeamMember()
    }
  }, [id])

  const loadTeamMember = async () => {
    try {
      setLoading(true)
      setError(null)
      const member = await getTeamMemberById(id)
      
      if (!member) {
        setError('Team member not found')
        toast({
          title: "Error",
          description: "Team member not found",
          variant: "destructive",
        })
        return
      }

      setTeamMember(member)
    } catch (error) {
      setError('Failed to load team member')
      toast({
        title: "Error",
        description: "Failed to load team member. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    // Redirect back to list with success query parameter
    router.push('/admin/team?success=true')
  }

  const handleCancel = () => {
    router.push('/admin/team')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/team">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Team Member</h1>
              <p className="text-muted-foreground">Loading team member...</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading team member...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !teamMember) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/team">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to List
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Team Member</h1>
              <p className="text-muted-foreground">Error loading team member</p>
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
              <Button onClick={loadTeamMember} variant="outline">
                Try Again
              </Button>
              <Button asChild>
                <Link href="/admin/team">
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
            <Link href="/admin/team">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Team Member</h1>
            <p className="text-muted-foreground">
              Update {teamMember.name}'s profile information
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <TeamMemberForm 
        mode="edit"
        initialData={teamMember}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}
