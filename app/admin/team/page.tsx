"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Search, MoreHorizontal, Edit, Trash2, User, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { getTeamMembers, deleteTeamMember, bulkDeleteTeamMembers } from '@/lib/services/team-service'
import type { TeamMember } from '@/lib/types/team-member'
import { toast } from '@/hooks/use-toast'

export default function AdminTeamPage() {
  const searchParams = useSearchParams()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.bio.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  // Load team members on component mount
  useEffect(() => {
    loadTeamMembers()
  }, [])

  // Check for success parameter and show toast
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Success",
        description: "Team member operation completed successfully!",
      })
      
      // Clean up the URL by removing the success parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  const loadTeamMembers = async () => {
    try {
      setLoading(true)
      const data = await getTeamMembers()
      setTeamMembers(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load team members. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = (id: string) => {
    setMemberToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (memberToDelete) {
      try {
        setDeleting(true)
        await deleteTeamMember(memberToDelete)
        // Optimistic UI update
        setTeamMembers(teamMembers.filter(member => member.id !== memberToDelete))
        toast({
          title: "Success",
          description: "Team member deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete team member. Please try again.",
          variant: "destructive",
        })
      } finally {
        setDeleting(false)
        setDeleteDialogOpen(false)
        setMemberToDelete(null)
      }
    }
  }

  const handleSelectMember = (memberId: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId])
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredMembers.map(member => member.id!).filter(Boolean)
      setSelectedMembers(allIds)
    } else {
      setSelectedMembers([])
    }
  }

  const handleBulkDelete = () => {
    if (selectedMembers.length > 0) {
      setBulkDeleteDialogOpen(true)
    }
  }

  const confirmBulkDelete = async () => {
    if (selectedMembers.length > 0) {
      try {
        setBulkDeleting(true)
        const results = await bulkDeleteTeamMembers(selectedMembers)
        
        // Remove successfully deleted members from the list
        setTeamMembers(prev => prev.filter(member => !results.success.includes(member.id!)))
        setSelectedMembers([])
        
        if (results.failed.length > 0) {
          toast({
            title: "Partial Success",
            description: `${results.success.length} team members deleted successfully. ${results.failed.length} failed to delete.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: `${results.success.length} team members deleted successfully.`,
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete team members. Please try again.",
          variant: "destructive",
        })
      } finally {
        setBulkDeleting(false)
        setBulkDeleteDialogOpen(false)
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Team Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage team members and their information</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/admin/team/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Team Members List</CardTitle>
          <CardDescription className="text-sm">
            View and manage all team members in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {/* Search Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team members by name, role, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results count and bulk actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {teamMembers.length} team members
              {selectedMembers.length > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({selectedMembers.length} selected)
                </span>
              )}
            </div>
            
            {selectedMembers.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={bulkDeleting}
                className="w-full sm:w-auto"
              >
                {bulkDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedMembers.length})
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Team Members Table */}
          <div className="border rounded-lg overflow-x-auto">{loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading team members...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={filteredMembers.length > 0 && selectedMembers.length === filteredMembers.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all team members"
                      />
                    </TableHead>
                    <TableHead className="min-w-[200px]">Member</TableHead>
                    <TableHead className="hidden sm:table-cell">Role</TableHead>
                    <TableHead className="hidden md:table-cell">Order</TableHead>
                    <TableHead className="hidden lg:table-cell">Bio</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.includes(member.id!)}
                          onCheckedChange={(checked) => handleSelectMember(member.id!, checked as boolean)}
                          aria-label={`Select ${member.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {member.image ? (
                            <img
                              src={member.image}
                              alt={member.name}
                              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0">
                              {getInitials(member.name)}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base truncate">{member.name}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate">
                              ID: {member.id}
                            </div>
                            {/* Show role on mobile */}
                            <div className="sm:hidden">
                              <Badge variant="secondary" className="text-xs mt-1">
                                {member.role}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="secondary">
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center space-x-1">
                          <span className="font-mono text-sm">{member.order}</span>
                          {member.order === 0 && (
                            <ArrowUp className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="max-w-xs truncate text-sm text-muted-foreground">
                          {member.bio}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {member.createdAt instanceof Date 
                          ? member.createdAt.toLocaleDateString()
                          : member.createdAt.toDate().toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/team/${member.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMember(member.id!)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {filteredMembers.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No team members found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the team member
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Team Members</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedMembers.length} selected team members?
              This action cannot be undone and will permanently delete all selected team members
              and their associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete} 
              className="bg-red-600 hover:bg-red-700"
              disabled={bulkDeleting}
            >
              {bulkDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                `Delete ${selectedMembers.length} Team Members`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
