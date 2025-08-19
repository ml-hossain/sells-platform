"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, MapPin, Loader2, FileText } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { getUniversities, deleteUniversity, bulkDeleteUniversities, bulkUpdateUniversitiesStatus, University } from '@/lib/services/university-service'
import { toast } from '@/hooks/use-toast'


export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [universityToDelete, setUniversityToDelete] = useState<string | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [bulkStatusDialogOpen, setBulkStatusDialogOpen] = useState(false)
  const [bulkStatusUpdating, setBulkStatusUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<'draft' | 'published'>('draft')

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = countryFilter === "all" || uni.country === countryFilter
    const matchesType = typeFilter === "all" || uni.type.toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || uni.status === statusFilter

    return matchesSearch && matchesCountry && matchesType && matchesStatus
  })

  const countries = [...new Set(universities.map((uni) => uni.country))]

  // Load universities on component mount
  useEffect(() => {
    loadUniversities()
  }, [])

  const loadUniversities = async () => {
    try {
      setLoading(true)
      const data = await getUniversities()
      setUniversities(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load universities. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUniversity = (id: string) => {
    setUniversityToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (universityToDelete) {
      try {
        setDeleting(true)
        await deleteUniversity(universityToDelete)
        setUniversities(universities.filter(uni => uni.id !== universityToDelete))
        toast({
          title: "Success",
          description: "University deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete university. Please try again.",
          variant: "destructive",
        })
      } finally {
        setDeleting(false)
        setDeleteDialogOpen(false)
        setUniversityToDelete(null)
      }
    }
  }

  const handleSelectUniversity = (universityId: string, checked: boolean) => {
    if (checked) {
      setSelectedUniversities(prev => [...prev, universityId])
    } else {
      setSelectedUniversities(prev => prev.filter(id => id !== universityId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredUniversities.map(uni => uni.id!).filter(Boolean)
      setSelectedUniversities(allIds)
    } else {
      setSelectedUniversities([])
    }
  }

  const handleBulkDelete = () => {
    if (selectedUniversities.length > 0) {
      setBulkDeleteDialogOpen(true)
    }
  }

  const handleBulkStatusChange = () => {
    if (selectedUniversities.length > 0) {
      setBulkStatusDialogOpen(true)
    }
  }

  const confirmBulkDelete = async () => {
    if (selectedUniversities.length > 0) {
      try {
        setBulkDeleting(true)
        const results = await bulkDeleteUniversities(selectedUniversities)

        // Remove successfully deleted universities from the list
        setUniversities(prev => prev.filter(uni => !results.success.includes(uni.id!)))
        setSelectedUniversities([])

        if (results.failed.length > 0) {
          toast({
            title: "Partial Success",
            description: `${results.success.length} universities deleted successfully. ${results.failed.length} failed to delete.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: `${results.success.length} universities deleted successfully.`,
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete universities. Please try again.",
          variant: "destructive",
        })
      } finally {
        setBulkDeleting(false)
        setBulkDeleteDialogOpen(false)
      }
    }
  }

  const confirmBulkStatusChange = async () => {
    if (selectedUniversities.length > 0) {
      try {
        setBulkStatusUpdating(true)
        const results = await bulkUpdateUniversitiesStatus(selectedUniversities, selectedStatus)

        // Update the status of successfully updated universities in the list
        setUniversities(prev => prev.map(uni =>
          results.success.includes(uni.id!)
            ? { ...uni, status: selectedStatus, updatedAt: new Date() }
            : uni
        ))
        setSelectedUniversities([])

        if (results.failed.length > 0) {
          toast({
            title: "Partial Success",
            description: `${results.success.length} universities updated successfully. ${results.failed.length} failed to update.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: `${results.success.length} universities updated to ${selectedStatus === 'published' ? 'Published' : 'Draft'} successfully.`,
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update universities. Please try again.",
          variant: "destructive",
        })
      } finally {
        setBulkStatusUpdating(false)
        setBulkStatusDialogOpen(false)
      }
    }
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Universities Management</h1>
              <p className="text-sm text-gray-600 mt-1">Manage university listings and information</p>
            </div>
            <Button asChild className="shrink-0 w-full sm:w-auto">
              <Link href="/admin/universities/add">
                <Plus className="h-4 w-4 mr-2" />
                Add University
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>University List</CardTitle>
              <CardDescription>
                View and manage all universities in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search universities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results count and bulk actions */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredUniversities.length} of {universities.length} universities
                  {selectedUniversities.length > 0 && (
                    <span className="ml-2 text-primary font-medium">
                      ({selectedUniversities.length} selected)
                    </span>
                  )}
                </div>

                {selectedUniversities.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkStatusChange}
                      disabled={bulkStatusUpdating}
                    >
                      {bulkStatusUpdating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Change Status ({selectedUniversities.length})
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkDelete}
                      disabled={bulkDeleting}
                    >
                      {bulkDeleting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Selected ({selectedUniversities.length})
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Universities Table */}
              <div className="border rounded-lg">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading universities...</span>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={filteredUniversities.length > 0 && selectedUniversities.length === filteredUniversities.length}
                            onCheckedChange={handleSelectAll}
                            aria-label="Select all universities"
                          />
                        </TableHead>
                        <TableHead>University</TableHead>
                        <TableHead>Country</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUniversities.map((university) => (
                        <TableRow key={university.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedUniversities.includes(university.id!)}
                              onCheckedChange={(checked) => handleSelectUniversity(university.id!, checked as boolean)}
                              aria-label={`Select ${university.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={university.image}
                                alt={university.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                              <div>
                                <div className="font-medium">{university.name}</div>
                                <div className="text-sm text-muted-foreground truncate max-w-xs">
                                  {university.shortDescription}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              {university.country}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={university.type === "Public" ? "default" : "outline"}>
                              {university.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={university.status === "published" ? "default" : "secondary"}>
                              {university.status === "published" ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {university.createdAt instanceof Date
                              ? university.createdAt.toLocaleDateString()
                              : (university.createdAt instanceof Date ? university.createdAt : university.createdAt.toDate()).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {university.updatedAt instanceof Date
                              ? university.updatedAt.toLocaleDateString()
                              : (university.updatedAt instanceof Date ? university.updatedAt : university.updatedAt.toDate()).toLocaleDateString()}
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
                                  <Link href={`/admin/universities/${university.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/universities/edit/${university.id}`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/universities/${university.id}#additional-files`}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Additional Files
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteUniversity(university.id!)}
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

              {filteredUniversities.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No universities found matching your criteria.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("")
                      setCountryFilter("all")
                      setTypeFilter("all")
                      setStatusFilter("all")
                    }}
                  >
                    Clear Filters
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
                  This action cannot be undone. This will permanently delete the university
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
                <AlertDialogTitle>Delete Multiple Universities</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedUniversities.length} selected universities?
                  This action cannot be undone and will permanently delete all selected universities
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
                    `Delete ${selectedUniversities.length} Universities`
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Bulk Status Change Dialog */}
          <AlertDialog open={bulkStatusDialogOpen} onOpenChange={setBulkStatusDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Change Status for Multiple Universities</AlertDialogTitle>
                <AlertDialogDescription>
                  Select the new status for {selectedUniversities.length} selected universities.
                  This will update the publication status of all selected universities.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-status">New Status</Label>
                  <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as 'draft' | 'published')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-muted-foreground">
                    Draft: Only visible to admins. Published: Visible to all users.
                  </div>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmBulkStatusChange}
                  disabled={bulkStatusUpdating}
                >
                  {bulkStatusUpdating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    `Update ${selectedUniversities.length} Universities`
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
