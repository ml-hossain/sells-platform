"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Star, MapPin, GraduationCap, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { getSuccessStories, deleteSuccessStory, bulkDeleteSuccessStories, SuccessStory } from '@/lib/services/success-stories-service'
import { toast } from '@/hooks/use-toast'

export default function AdminSuccessStoriesPage() {
  const searchParams = useSearchParams()
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const filteredStories = stories.filter((story) => {
    const matchesSearch = 
      story.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.university.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = countryFilter === "all" || story.country === countryFilter
    const matchesRating = ratingFilter === "all" || story.rating.toString() === ratingFilter

    return matchesSearch && matchesCountry && matchesRating
  })

  const countries = [...new Set(stories.map((story) => story.country))]
  const ratings = [...new Set(stories.map((story) => story.rating.toString()))].sort((a, b) => Number(b) - Number(a))

  // Load success stories on component mount
  useEffect(() => {
    loadSuccessStories()
  }, [])

  // Check for success parameter and show toast
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Success",
        description: "Success story operation completed successfully!",
      })
      
      // Clean up the URL by removing the success parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  const loadSuccessStories = async () => {
    try {
      setLoading(true)
      const data = await getSuccessStories()
      setStories(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load success stories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStory = (id: string) => {
    setStoryToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (storyToDelete) {
      try {
        setDeleting(true)
        await deleteSuccessStory(storyToDelete)
        // Optimistic UI update
        setStories(stories.filter(story => story.id !== storyToDelete))
        toast({
          title: "Success",
          description: "Success story deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete success story. Please try again.",
          variant: "destructive",
        })
      } finally {
        setDeleting(false)
        setDeleteDialogOpen(false)
        setStoryToDelete(null)
      }
    }
  }

  const handleSelectStory = (storyId: string, checked: boolean) => {
    if (checked) {
      setSelectedStories(prev => [...prev, storyId])
    } else {
      setSelectedStories(prev => prev.filter(id => id !== storyId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredStories.map(story => story.id!).filter(Boolean)
      setSelectedStories(allIds)
    } else {
      setSelectedStories([])
    }
  }

  const handleBulkDelete = () => {
    if (selectedStories.length > 0) {
      setBulkDeleteDialogOpen(true)
    }
  }

  const confirmBulkDelete = async () => {
    if (selectedStories.length > 0) {
      try {
        setBulkDeleting(true)
        const results = await bulkDeleteSuccessStories(selectedStories)
        
        // Remove successfully deleted stories from the list
        setStories(prev => prev.filter(story => !results.success.includes(story.id!)))
        setSelectedStories([])
        
        if (results.failed.length > 0) {
          toast({
            title: "Partial Success",
            description: `${results.success.length} success stories deleted successfully. ${results.failed.length} failed to delete.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: `${results.success.length} success stories deleted successfully.`,
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete success stories. Please try again.",
          variant: "destructive",
        })
      } finally {
        setBulkDeleting(false)
        setBulkDeleteDialogOpen(false)
      }
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-muted-foreground">({rating})</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Success Stories Management</h1>
          <p className="text-muted-foreground">Manage student success stories and testimonials</p>
        </div>
        <Button asChild>
          <Link href="/admin/success-stories/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Story
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Success Stories List</CardTitle>
          <CardDescription>
            View and manage all success stories in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories by name, country, program, or university..."
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
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {ratings.map((rating) => (
                  <SelectItem key={rating} value={rating}>
                    {rating} Stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count and bulk actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredStories.length} of {stories.length} success stories
              {selectedStories.length > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({selectedStories.length} selected)
                </span>
              )}
            </div>
            
            {selectedStories.length > 0 && (
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
                    Delete Selected ({selectedStories.length})
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Success Stories Table */}
          <div className="border rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading success stories...</span>
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredStories.length > 0 && selectedStories.length === filteredStories.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all success stories"
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStories.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStories.includes(story.id!)}
                        onCheckedChange={(checked) => handleSelectStory(story.id!, checked as boolean)}
                        aria-label={`Select ${story.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        {story.image ? (
                          <img
                            src={story.image}
                            alt={story.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`h-10 w-10 rounded-full bg-gradient-to-r ${story.color || 'from-violet-500 to-violet-600'} flex items-center justify-center text-white font-bold text-sm`}>
                            {story.name
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .toUpperCase()
                              .slice(0, 2)
                            }
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{story.name}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {story.university}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span 
                          className="mr-2 text-lg"
                          style={{ color: story.color }}
                        >
                          {story.flag}
                        </span>
                        {story.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <GraduationCap className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="truncate max-w-xs">{story.program}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderStars(story.rating)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {story.createdAt instanceof Date 
                        ? story.createdAt.toLocaleDateString()
                        : (story.createdAt instanceof Date ? story.createdAt : story.createdAt.toDate()).toLocaleDateString()}
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
                            <Link href={`/admin/success-stories/${story.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteStory(story.id!)}
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

          {filteredStories.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No success stories found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setCountryFilter("all")
                  setRatingFilter("all")
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
              This action cannot be undone. This will permanently delete the success story
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
            <AlertDialogTitle>Delete Multiple Success Stories</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedStories.length} selected success stories?
              This action cannot be undone and will permanently delete all selected success stories
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
                `Delete ${selectedStories.length} Success Stories`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
