"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar,
  Search, 
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  User,
  Globe,
  GraduationCap
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  getConsultationRequests,
  updateConsultationRequest,
  deleteConsultationRequest,
  searchConsultationRequests,
  getConsultationRequestsByStatus,
  type ConsultationRequest
} from '@/lib/services/consultation-service'
import { useToast } from '@/hooks/use-toast'

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([])
  const [filteredConsultations, setFilteredConsultations] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  // Load consultations
  const loadConsultations = async () => {
    try {
      setLoading(true)
      const data = await getConsultationRequests()
      setConsultations(data)
      setFilteredConsultations(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load consultation requests",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConsultations()
  }, [])

  // Handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredConsultations(consultations)
      return
    }
    
    try {
      const results = await searchConsultationRequests(term)
      setFilteredConsultations(results)
    } catch (error) {
    }
  }

  // Handle status filter
  const handleStatusFilter = async (status: string) => {
    setStatusFilter(status)
    try {
      const results = await getConsultationRequestsByStatus(status)
      setFilteredConsultations(results)
    } catch (error) {
    }
  }

  // Handle update status
  const handleUpdateStatus = async (id: string, newStatus: ConsultationRequest['status']) => {
    try {
      setUpdating(true)
      await updateConsultationRequest(id, { status: newStatus })
      await loadConsultations()
      toast({
        title: "Success",
        description: "Consultation status updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update consultation status",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Handle update priority
  const handleUpdatePriority = async (id: string, newPriority: ConsultationRequest['priority']) => {
    try {
      setUpdating(true)
      await updateConsultationRequest(id, { priority: newPriority })
      await loadConsultations()
      toast({
        title: "Success",
        description: "Consultation priority updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update consultation priority",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!selectedConsultation?.id) return

    try {
      setUpdating(true)
      await deleteConsultationRequest(selectedConsultation.id)
      await loadConsultations()
      setIsDeleteDialogOpen(false)
      setSelectedConsultation(null)
      toast({
        title: "Success",
        description: "Consultation request deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete consultation request",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  // Get status badge variant and icon
  const getStatusDisplay = (status: ConsultationRequest['status']) => {
    switch (status) {
      case 'pending':
        return { 
          variant: 'secondary' as const, 
          icon: Clock, 
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
        }
      case 'contacted':
        return { 
          variant: 'default' as const, 
          icon: Phone, 
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
        }
      case 'scheduled':
        return { 
          variant: 'default' as const, 
          icon: Calendar, 
          className: 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
        }
      case 'completed':
        return { 
          variant: 'default' as const, 
          icon: CheckCircle2, 
          className: 'bg-green-100 text-green-800 hover:bg-green-200' 
        }
      case 'cancelled':
        return { 
          variant: 'destructive' as const, 
          icon: XCircle, 
          className: 'bg-red-100 text-red-800 hover:bg-red-200' 
        }
      default:
        return { 
          variant: 'secondary' as const, 
          icon: AlertCircle, 
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200' 
        }
    }
  }

  // Get priority badge
  const getPriorityDisplay = (priority: ConsultationRequest['priority']) => {
    switch (priority) {
      case 'urgent':
        return { className: 'bg-red-100 text-red-800', label: 'Urgent' }
      case 'high':
        return { className: 'bg-orange-100 text-orange-800', label: 'High' }
      case 'medium':
        return { className: 'bg-blue-100 text-blue-800', label: 'Medium' }
      case 'low':
        return { className: 'bg-gray-100 text-gray-800', label: 'Low' }
      default:
        return { className: 'bg-gray-100 text-gray-800', label: 'Medium' }
    }
  }

  const stats = [
    {
      title: 'Total Consultations',
      value: consultations.length,
      icon: MessageSquare,
      color: 'text-violet-600'
    },
    {
      title: 'Pending',
      value: consultations.filter(c => c.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Scheduled',
      value: consultations.filter(c => c.status === 'scheduled').length,
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Completed',
      value: consultations.filter(c => c.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-green-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
          Consultation Requests
        </h1>
        <p className="text-gray-600 mt-2">
          Manage and track consultation requests from prospective students
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/80 backdrop-blur-sm border border-violet-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm border border-violet-100">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or destination..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consultations List */}
      <Card className="bg-white/80 backdrop-blur-sm border border-violet-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-violet-600" />
            Consultation Requests
          </CardTitle>
          <CardDescription>
            {filteredConsultations.length} of {consultations.length} requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConsultations.map((consultation) => {
              const statusDisplay = getStatusDisplay(consultation.status)
              const priorityDisplay = getPriorityDisplay(consultation.priority)
              const StatusIcon = statusDisplay.icon

              return (
                <div 
                  key={consultation.id} 
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-violet-50/50 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-12 w-12 border-2 border-violet-200">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-electric-500 text-white font-semibold">
                        {consultation.firstName.charAt(0)}{consultation.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {consultation.firstName} {consultation.lastName}
                        </p>
                        <Badge className={priorityDisplay.className}>
                          {priorityDisplay.label}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{consultation.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{consultation.phone}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {consultation.preferredDestination && (
                          <div className="flex items-center space-x-1">
                            <Globe className="h-3 w-3" />
                            <span className="capitalize">{consultation.preferredDestination}</span>
                          </div>
                        )}
                        {consultation.programLevel && (
                          <div className="flex items-center space-x-1">
                            <GraduationCap className="h-3 w-3" />
                            <span className="capitalize">{consultation.programLevel}</span>
                          </div>
                        )}
                        <span>
                          {(consultation.createdAt instanceof Date ? consultation.createdAt : consultation.createdAt.toDate()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className={statusDisplay.className}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {consultation.status}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border border-violet-100">
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedConsultation(consultation)
                            setIsViewDialogOpen(true)
                          }}
                          className="hover:bg-violet-50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedConsultation(consultation)
                            setIsEditDialogOpen(true)
                          }}
                          className="hover:bg-violet-50"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Status
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => window.open(`mailto:${consultation.email}`, '_blank')}
                          className="hover:bg-green-50"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => window.open(`tel:${consultation.phone}`, '_blank')}
                          className="hover:bg-blue-50"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedConsultation(consultation)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )
            })}

            {filteredConsultations.length === 0 && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No consultation requests found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Consultation Request Details</DialogTitle>
            <DialogDescription>
              Complete information about this consultation request
            </DialogDescription>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Name</Label>
                  <p className="text-sm">{selectedConsultation.firstName} {selectedConsultation.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={getStatusDisplay(selectedConsultation.status).className}>
                    {selectedConsultation.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm">{selectedConsultation.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="text-sm">{selectedConsultation.phone}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Preferred Destination</Label>
                  <p className="text-sm capitalize">{selectedConsultation.preferredDestination || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Program Level</Label>
                  <p className="text-sm capitalize">{selectedConsultation.programLevel || 'Not specified'}</p>
                </div>
              </div>
              
              {selectedConsultation.message && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Message</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedConsultation.message}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Created</Label>
                  <p className="text-sm">{(selectedConsultation.createdAt instanceof Date ? selectedConsultation.createdAt : selectedConsultation.createdAt.toDate()).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Priority</Label>
                  <Badge className={getPriorityDisplay(selectedConsultation.priority).className}>
                    {getPriorityDisplay(selectedConsultation.priority).label}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Consultation</DialogTitle>
            <DialogDescription>
              Change the status and priority of this consultation request
            </DialogDescription>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={selectedConsultation.status}
                  onValueChange={(value) => 
                    setSelectedConsultation({
                      ...selectedConsultation,
                      status: value as ConsultationRequest['status']
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Priority</Label>
                <Select
                  value={selectedConsultation.priority}
                  onValueChange={(value) => 
                    setSelectedConsultation({
                      ...selectedConsultation,
                      priority: value as ConsultationRequest['priority']
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={async () => {
                if (selectedConsultation?.id) {
                  await handleUpdateStatus(selectedConsultation.id, selectedConsultation.status)
                  await handleUpdatePriority(selectedConsultation.id, selectedConsultation.priority)
                  setIsEditDialogOpen(false)
                }
              }}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Consultation Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this consultation request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDelete}
              disabled={updating}
            >
              {updating ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
