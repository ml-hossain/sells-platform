"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { 
  Users, 
  GraduationCap, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Mail,
  Globe,
  Star,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download
} from 'lucide-react'

// Import services
import { getConsultationRequests, ConsultationRequest } from '@/lib/services/consultation-service'
import { getUniversities, University } from '@/lib/services/university-service'
import { getContactMessages, ContactMessage } from '@/lib/services/contact-service'
import { getSuccessStories, SuccessStory } from '@/lib/services/success-stories-service'

interface AnalyticsData {
  consultations: ConsultationRequest[]
  universities: University[]
  messages: ContactMessage[]
  successStories: SuccessStory[]
}

interface Stats {
  totalConsultations: number
  totalUniversities: number
  totalMessages: number
  totalSuccessStories: number
  pendingConsultations: number
  newMessages: number
  successRate: number
  avgRating: number
}

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    consultations: [],
    universities: [],
    messages: [],
    successStories: []
  })
  const [stats, setStats] = useState<Stats>({
    totalConsultations: 0,
    totalUniversities: 0,
    totalMessages: 0,
    totalSuccessStories: 0,
    pendingConsultations: 0,
    newMessages: 0,
    successRate: 0,
    avgRating: 0
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [consultations, universities, messages, successStories] = await Promise.all([
        getConsultationRequests(),
        getUniversities(),
        getContactMessages(),
        getSuccessStories()
      ])

      const analyticsData = {
        consultations,
        universities,
        messages,
        successStories
      }

      setData(analyticsData)
      calculateStats(analyticsData)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (data: AnalyticsData) => {
    const totalConsultations = data.consultations.length
    const totalUniversities = data.universities.length
    const totalMessages = data.messages.length
    const totalSuccessStories = data.successStories.length
    
    const pendingConsultations = data.consultations.filter(c => c.status === 'pending').length
    const newMessages = data.messages.filter(m => m.status === 'new').length
    
    const completedConsultations = data.consultations.filter(c => c.status === 'completed').length
    const successRate = totalConsultations > 0 ? (completedConsultations / totalConsultations) * 100 : 0
    
    const avgRating = data.successStories.length > 0 
      ? data.successStories.reduce((sum, story) => sum + story.rating, 0) / data.successStories.length 
      : 0

    setStats({
      totalConsultations,
      totalUniversities,
      totalMessages,
      totalSuccessStories,
      pendingConsultations,
      newMessages,
      successRate,
      avgRating
    })
  }

  const getConsultationStatusData = () => {
    const statusCounts = data.consultations.reduce((acc, consultation) => {
      acc[consultation.status] = (acc[consultation.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: ((count / data.consultations.length) * 100).toFixed(1)
    }))
  }

  const getMessageStatusData = () => {
    const statusCounts = data.messages.reduce((acc, message) => {
      acc[message.status] = (acc[message.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }))
  }

  const getUniversityCountryData = () => {
    const countryCounts = data.universities.reduce((acc, university) => {
      acc[university.country] = (acc[university.country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }

  const getTimelineData = () => {
    const now = new Date()
    const days = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const consultationsCount = data.consultations.filter(c => {
        const cDate = c.createdAt instanceof Date ? c.createdAt : c.createdAt.toDate()
        return cDate.toISOString().split('T')[0] === dateStr
      }).length
      
      const messagesCount = data.messages.filter(m => {
        const mDate = m.createdAt instanceof Date ? m.createdAt : m.createdAt.toDate()
        return mDate.toISOString().split('T')[0] === dateStr
      }).length

      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        consultations: consultationsCount,
        messages: messagesCount
      })
    }
    
    return days
  }

  const getSuccessStoriesRatingData = () => {
    const ratings = [1, 2, 3, 4, 5]
    return ratings.map(rating => ({
      rating: `${rating} Star${rating > 1 ? 's' : ''}`,
      count: data.successStories.filter(story => Math.floor(story.rating) === rating).length
    }))
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Comprehensive insights into your business performance and trends.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-gradient-to-r from-violet-600 to-electric-600 w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-violet-700">Total Consultations</CardTitle>
            <Users className="h-4 w-4 text-violet-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-violet-900">{stats.totalConsultations}</div>
            <p className="text-xs text-violet-600 flex items-center mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {stats.pendingConsultations} pending
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-emerald-700">Universities</CardTitle>
            <GraduationCap className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-emerald-900">{stats.totalUniversities}</div>
            <p className="text-xs text-emerald-600 flex items-center mt-1">
              <Globe className="h-3 w-3 mr-1" />
              Global partnerships
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-blue-900">{stats.totalMessages}</div>
            <p className="text-xs text-blue-600 flex items-center mt-1">
              <Mail className="h-3 w-3 mr-1" />
              {stats.newMessages} new messages
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-orange-700">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold text-orange-900">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-orange-600 flex items-center mt-1">
              <Star className="h-3 w-3 mr-1" />
              {stats.avgRating.toFixed(1)} avg rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Overview</TabsTrigger>
          <TabsTrigger value="consultations" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Consultations</TabsTrigger>
          <TabsTrigger value="universities" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Universities</TabsTrigger>
          <TabsTrigger value="success" className="text-xs sm:text-sm px-2 sm:px-4 py-2">Success Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Timeline Chart */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Activity Timeline</CardTitle>
                <CardDescription className="text-sm">Daily consultations and messages over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={getTimelineData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="consultations" 
                      stroke="#8B5CF6" 
                      strokeWidth={2}
                      name="Consultations"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="messages" 
                      stroke="#06B6D4" 
                      strokeWidth={2}
                      name="Messages"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Consultation Status Distribution */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Consultation Status</CardTitle>
                <CardDescription className="text-sm">Distribution of consultation statuses</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={getConsultationStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getConsultationStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="consultations" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Consultation Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>Consultation requests by priority level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { priority: 'Low', count: data.consultations.filter(c => c.priority === 'low').length },
                    { priority: 'Medium', count: data.consultations.filter(c => c.priority === 'medium').length },
                    { priority: 'High', count: data.consultations.filter(c => c.priority === 'high').length },
                    { priority: 'Urgent', count: data.consultations.filter(c => c.priority === 'urgent').length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="priority" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Consultations */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Consultations</CardTitle>
                <CardDescription>Latest consultation requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {data.consultations.slice(0, 10).map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <p className="font-medium">{consultation.firstName} {consultation.lastName}</p>
                        <p className="text-sm text-gray-600">{consultation.email}</p>
                        <p className="text-xs text-gray-500">
                          {(consultation.createdAt instanceof Date ? consultation.createdAt : consultation.createdAt.toDate()).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        consultation.status === 'completed' ? 'default' :
                        consultation.status === 'pending' ? 'secondary' :
                        consultation.status === 'scheduled' ? 'outline' : 'destructive'
                      }>
                        {consultation.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="universities" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Universities by Country */}
            <Card>
              <CardHeader>
                <CardTitle>Universities by Country</CardTitle>
                <CardDescription>Top 10 countries with most universities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getUniversityCountryData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* University Types */}
            <Card>
              <CardHeader>
                <CardTitle>University Types</CardTitle>
                <CardDescription>Distribution of public vs private universities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Public', value: data.universities.filter(u => u.type === 'Public').length },
                        { name: 'Private', value: data.universities.filter(u => u.type === 'Private').length }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#8B5CF6" />
                      <Cell fill="#06B6D4" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="success" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Success Stories Rating Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Success stories by rating</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getSuccessStoriesRatingData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Success Stories */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Success Stories</CardTitle>
                <CardDescription>Latest success stories added</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {data.successStories.slice(0, 5).map((story) => (
                    <div key={story.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                      <img 
                        src={story.image} 
                        alt={story.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{story.name}</p>
                        <p className="text-sm text-gray-600">{story.university}, {story.country}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${i < Math.floor(story.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">{story.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
