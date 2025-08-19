"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { isUserAdmin } from '@/lib/services/admin-service'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'

interface AdminProtectionProps {
  children: React.ReactNode
}

export function AdminProtection({ children }: AdminProtectionProps) {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const [adminCheckLoading, setAdminCheckLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!loading && user) {
        try {
          const adminStatus = await isUserAdmin(user)
          setIsAdmin(adminStatus)
          
          if (!adminStatus) {
            // Redirect non-admin users to home page
            router.push('/')
          }
        } catch (error) {
          setIsAdmin(false)
          router.push('/')
        } finally {
          setAdminCheckLoading(false)
        }
      } else if (!loading) {
        setAdminCheckLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, loading, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-4" />
            <p className="text-lg font-medium text-gray-900">Verifying access...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we check your permissions</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-violet-600" />
            </div>
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              You need to sign in with an admin account to access this area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={signInWithGoogle} 
              className="w-full bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700"
            >
              Sign in with Google
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show loading while checking admin status
  if (adminCheckLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600 mb-4" />
            <p className="text-lg font-medium text-gray-900">Checking admin permissions...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we verify your access level</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show access denied if user is not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel. 
              Only administrators can access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Current user:</strong> {user?.email}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                If you believe this is an error, please contact your system administrator.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.push('/')}
              className="w-full"
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated and is an admin - render children
  return <>{children}</>
}
