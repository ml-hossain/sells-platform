"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, MoreHorizontal, Trash2, Eye, CheckCircle, Clock, Reply, Loader2, Mail, User } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  getContactMessages, 
  deleteContactMessage,
  bulkDeleteContactMessages, 
  updateContactMessage,
  markMessageAsRead,
  markMessageAsReplied,
  ContactMessage 
} from '@/lib/services/contact-service'
import { toast } from '@/hooks/use-toast'

function AdminMessagesPageContent() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || message.status === statusFilter
    const matchesSubject = subjectFilter === "all" || message.subject === subjectFilter

    return matchesSearch && matchesStatus && matchesSubject
  })

  const statuses = [...new Set(messages.map((message) => message.status))]
  const subjects = [...new Set(messages.map((message) => message.subject))]

  // Load messages on component mount
  useEffect(() => {
    loadMessages()
  }, [])

  // Check for success parameter and show toast
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast({
        title: "Success",
        description: "Message operation completed successfully!",
      })
      
      // Clean up the URL by removing the success parameter
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchParams])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await getContactMessages()
      setMessages(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMessage = (id: string) => {
    setMessageToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (messageToDelete) {
      try {
        setDeleting(true)
        await deleteContactMessage(messageToDelete)
        // Optimistic UI update
        setMessages(messages.filter(message => message.id !== messageToDelete))
        toast({
          title: "Success",
          description: "Message deleted successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete message. Please try again.",
          variant: "destructive",
        })
      } finally {
        setDeleting(false)
        setDeleteDialogOpen(false)
        setMessageToDelete(null)
      }
    }
  }

  const handleSelectMessage = (messageId: string, checked: boolean) => {
    if (checked) {
      setSelectedMessages(prev => [...prev, messageId])
    } else {
      setSelectedMessages(prev => prev.filter(id => id !== messageId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredMessages.map(message => message.id!).filter(Boolean)
      setSelectedMessages(allIds)
    } else {
      setSelectedMessages([])
    }
  }

  const handleBulkDelete = () => {
    if (selectedMessages.length > 0) {
      setBulkDeleteDialogOpen(true)
    }
  }

  const confirmBulkDelete = async () => {
    if (selectedMessages.length > 0) {
      try {
        setBulkDeleting(true)
        const results = await bulkDeleteContactMessages(selectedMessages)
        
        // Remove successfully deleted messages from the list
        setMessages(prev => prev.filter(message => !results.success.includes(message.id!)))
        setSelectedMessages([])
        
        if (results.failed.length > 0) {
          toast({
            title: "Partial Success",
            description: `${results.success.length} messages deleted successfully. ${results.failed.length} failed to delete.`,
            variant: "destructive",
          })
        } else {
          toast({
            title: "Success",
            description: `${results.success.length} messages deleted successfully.`,
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete messages. Please try again.",
          variant: "destructive",
        })
      } finally {
        setBulkDeleting(false)
        setBulkDeleteDialogOpen(false)
      }
    }
  }

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message)
    setViewDialogOpen(true)
    
    // Mark as read if it's new
    if (message.status === 'new') {
      try {
        await markMessageAsRead(message.id!)
        // Update local state
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, status: 'read' as const } : m
        ))
      } catch (error) {
      }
    }
  }

  const handleMarkAsReplied = async (id: string) => {
    try {
      await markMessageAsReplied(id)
      // Update local state
      setMessages(prev => prev.map(m => 
        m.id === id ? { ...m, status: 'replied' as const, repliedAt: new Date() } : m
      ))
      toast({
        title: "Success",
        description: "Message marked as replied.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="destructive">New</Badge>
      case 'read':
        return <Badge variant="secondary">Read</Badge>
      case 'replied':
        return <Badge variant="default">Replied</Badge>
      case 'closed':
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const getSubjectLabel = (subject: string) => {
    const subjectLabels: { [key: string]: string } = {
      'consultation': 'Free Consultation',
      'application': 'Application Assistance',
      'visa': 'Visa Support',
      'travel': 'Travel Services',
      'general': 'General Inquiry',
      'other': 'Other'
    }
    return subjectLabels[subject] || subject
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">Manage customer inquiries and contact form submissions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messages List</CardTitle>
          <CardDescription>
            View and manage all contact form submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages by name, email, subject, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {getSubjectLabel(subject)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count and bulk actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredMessages.length} of {messages.length} messages
              {selectedMessages.length > 0 && (
                <span className="ml-2 text-primary font-medium">
                  ({selectedMessages.length} selected)
                </span>
              )}
            </div>
            
            {selectedMessages.length > 0 && (
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
                    Delete Selected ({selectedMessages.length})
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Messages Table */}
          <div className="border rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading messages...</span>
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredMessages.length > 0 && selectedMessages.length === filteredMessages.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all messages"
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedMessages.includes(message.id!)}
                        onCheckedChange={(checked) => handleSelectMessage(message.id!, checked as boolean)}
                        aria-label={`Select message from ${message.firstName} ${message.lastName}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-electric-500 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">{message.firstName} {message.lastName}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {message.email}
                          </div>
                          {message.phone && (
                            <div className="text-xs text-muted-foreground">
                              {message.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="truncate max-w-xs">{getSubjectLabel(message.subject)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(message.status)}
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(message.priority)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {message.createdAt instanceof Date 
                        ? message.createdAt.toLocaleDateString()
                        : (message.createdAt instanceof Date ? message.createdAt : message.createdAt.toDate()).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewMessage(message)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Message
                          </DropdownMenuItem>
                          {message.status !== 'replied' && (
                            <DropdownMenuItem onClick={() => handleMarkAsReplied(message.id!)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Mark as Replied
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMessage(message.id!)}
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

          {filteredMessages.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No messages found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setSubjectFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message Details</DialogTitle>
            <DialogDescription>
              Message from {selectedMessage?.firstName} {selectedMessage?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p>{selectedMessage.firstName} {selectedMessage.lastName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p>{selectedMessage.email}</p>
                </div>
              </div>
              
              {selectedMessage.phone && (
                <div>
                  <Label className="font-semibold">Phone</Label>
                  <p>{selectedMessage.phone}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Subject</Label>
                  <p>{getSubjectLabel(selectedMessage.subject)}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedMessage.status)}
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Message</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <Label className="font-semibold">Created</Label>
                  <p>{selectedMessage.createdAt instanceof Date 
                    ? selectedMessage.createdAt.toLocaleString()
                    : (selectedMessage.createdAt instanceof Date ? selectedMessage.createdAt : selectedMessage.createdAt.toDate()).toLocaleString()}</p>
                </div>
                {selectedMessage.repliedAt && (
                  <div>
                    <Label className="font-semibold">Replied</Label>
                    <p>{selectedMessage.repliedAt instanceof Date 
                      ? selectedMessage.repliedAt.toLocaleString()
                      : (selectedMessage.repliedAt instanceof Date ? selectedMessage.repliedAt : selectedMessage.repliedAt.toDate()).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                {selectedMessage.status !== 'replied' && (
                  <Button onClick={() => {
                    handleMarkAsReplied(selectedMessage.id!)
                    setViewDialogOpen(false)
                  }}>
                    <Reply className="h-4 w-4 mr-2" />
                    Mark as Replied
                  </Button>
                )}
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message
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
            <AlertDialogTitle>Delete Multiple Messages</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedMessages.length} selected messages?
              This action cannot be undone and will permanently delete all selected messages
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
                `Delete ${selectedMessages.length} Messages`
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Wrap with dynamic import to prevent hydration issues from browser extensions
const AdminMessagesPage = dynamic(() => Promise.resolve(AdminMessagesPageContent), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    </div>
  )
})

export default AdminMessagesPage
