"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  GraduationCap, 
  MessageSquare, 
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Mail,
  Calendar
} from 'lucide-react'

// Import services
import { getConsultationRequests, ConsultationRequest } from '@/lib/services/consultation-service'
import { getUniversities, University } from '@/lib/services/university-service'
import { getContactMessages, ContactMessage } from '@/lib/services/contact-service'
import { getSuccessStories, SuccessStory } from '@/lib/services/success-stories-service'

interface DashboardStats {
  totalConsultations: number
  totalUniversities: number
  totalMessages: number
  successRate: number
  pendingConsultations: number
  newMessages: number
  avgRating: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConsultations: 0,
    totalUniversities: 0,
    totalMessages: 0,
    successRate: 0,
    pendingConsultations: 0,
    newMessages: 0,
    avgRating: 0
  })
  const [recentConsultations, setRecentConsultations] = useState<ConsultationRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [consultations, universities, messages, successStories] = await Promise.all([
        getConsultationRequests(),
        getUniversities(),
        getContactMessages(),
        getSuccessStories()
      ])

      // Calculate stats
      const totalConsultations = consultations.length
      const totalUniversities = universities.length
      const totalMessages = messages.length
      
      const pendingConsultations = consultations.filter(c => c.status === 'pending').length
      const newMessages = messages.filter(m => m.status === 'new').length
      
      const completedConsultations = consultations.filter(c => c.status === 'completed').length
      const successRate = totalConsultations > 0 ? (completedConsultations / totalConsultations) * 100 : 0
      
      const avgRating = successStories.length > 0 
        ? successStories.reduce((sum, story) => sum + story.rating, 0) / successStories.length 
        : 0

      setStats({
        totalConsultations,
        totalUniversities,
        totalMessages,
        successRate,
        pendingConsultations,
        newMessages,
        avgRating
      })

      // Set recent consultations (last 4)
      setRecentConsultations(consultations.slice(0, 4))
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="px-1">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
          Welcome back! Here's what's happening with NextGen EduMigrate today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border border-violet-100 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm font-medium text-gray-600">Total Consultations</CardTitle>
            <Users className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalConsultations}</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Clock className="h-3 w-3 mr-1" />
              {stats.pendingConsultations} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-violet-100 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm font-medium text-gray-600">Universities</CardTitle>
            <GraduationCap className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUniversities}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <GraduationCap className="h-3 w-3 mr-1" />
              Global partnerships
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-violet-100 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm font-medium text-gray-600">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalMessages}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <Mail className="h-3 w-3 mr-1" />
              {stats.newMessages} new messages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-violet-100 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-yellow-600 flex items-center mt-1">
              <Star className="h-3 w-3 mr-1" />
              {stats.avgRating.toFixed(1)} avg rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Consultations */}
        <Card className="bg-white/80 backdrop-blur-sm border border-violet-100">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
              Recent Consultations
            </CardTitle>
            <CardDescription className="text-sm">Latest consultation requests and their status</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {recentConsultations.length > 0 ? (
                recentConsultations.map((consultation) => (
                  <div key={consultation.id} className="flex items-start sm:items-center justify-between p-3 rounded-lg hover:bg-violet-50/50 transition-colors gap-3">
                    <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 to-electric-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                        {consultation.firstName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{consultation.firstName} {consultation.lastName}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{consultation.email}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {consultation.preferredDestination && `Destination: ${consultation.preferredDestination}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        consultation.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : consultation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : consultation.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : consultation.status === 'contacted'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {consultation.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {(consultation.createdAt instanceof Date ? consultation.createdAt : consultation.createdAt.toDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No consultations yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border border-violet-100">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center text-base sm:text-lg">
              <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Button 
                asChild
                className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 bg-gradient-to-br from-violet-500 to-electric-500 hover:from-violet-600 hover:to-electric-600 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              >
                <Link href="/admin/universities/add">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Add University</span>
                </Link>
              </Button>
              
              <Button 
                asChild
                className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              >
                <Link href="/admin/success-stories/new">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>Add Success Story</span>
                </Link>
              </Button>
              
              <Button 
                asChild
                className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              >
                <Link href="/admin/messages">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>View Messages</span>
                </Link>
              </Button>
              
              <Button 
                asChild
                className="h-16 sm:h-20 flex flex-col space-y-1 sm:space-y-2 bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
              >
                <Link href="/admin/analytics">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span>View Analytics</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
