"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, Shield, Chrome } from 'lucide-react'

export default function AdminLogin() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && !loading) {
      router.push('/admin')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-electric-50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-violet-600 to-electric-600 rounded-full animate-pulse"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to admin
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-electric-50 p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-violet-100 shadow-lg">
        <CardHeader className="text-center space-y-6">
          {/* Logo - matching main site design */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <GraduationCap className="h-12 w-12 text-violet-600 group-hover:text-electric-500 transition-colors duration-300" />
                <div className="absolute inset-0 bg-violet-600 rounded-full opacity-0 group-hover:opacity-20 group-hover:animate-ping" />
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
                NextGen EduMigrate
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-gray-600">
              NextGen EduMigrate Administration
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Sign in with your Google account to access the admin dashboard
            </p>
            
            <Button
              onClick={signInWithGoogle}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              size="lg"
            >
              <Chrome className="mr-3 h-5 w-5" />
              Continue with Google
            </Button>
          </div>

          {/* Security Notice */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-violet-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-violet-900 mb-1">Secure Access</p>
                <p className="text-violet-700">
                  This portal is restricted to authorized administrators only. 
                  All login attempts are monitored and logged.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p>Protected by NextGen EduMigrate Security</p>
            <p className="mt-1">Version 2.0 • Admin Portal</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
