"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, CheckCircle } from 'lucide-react'

export default function AdminTest() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
          Middleware Test Page
        </h1>
        <p className="text-gray-600 mt-2">
          If you can see this page, the middleware protection is working correctly!
        </p>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm border border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <CheckCircle className="mr-2 h-5 w-5" />
            Authentication Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">
                Route Protection Active
              </p>
              <p className="text-sm text-gray-600">
                This page is protected by the middleware and requires a valid Firebase auth token.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border border-violet-100">
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="font-medium text-gray-900 mb-2">✅ Middleware Features:</p>
            <ul className="space-y-1 text-gray-600 pl-4">
              <li>• Intercepts all routes starting with <code className="bg-gray-100 px-1 rounded">/admin</code></li>
              <li>• Allows access to <code className="bg-gray-100 px-1 rounded">/admin/login</code> without authentication</li>
              <li>• Checks for <code className="bg-gray-100 px-1 rounded">firebaseAuthToken</code> cookie</li>
              <li>• Redirects to login page when token is missing</li>
              <li>• Cookie is automatically set on successful Firebase authentication</li>
              <li>• Cookie is removed on sign out</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
