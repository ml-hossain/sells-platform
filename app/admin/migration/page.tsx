"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Database, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'

export default function MigrationPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [migrationComplete, setMigrationComplete] = useState(false)

  const runSlugMigration = async () => {
    setIsRunning(true)
    try {
      const response = await fetch('/api/admin/migrate-slugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Migration failed')
      }
      
      const result = await response.json()
      setMigrationComplete(true)
      toast({
        title: "Migration Complete",
        description: `Successfully updated ${result.updated || 0} universities with slugs.`,
      })
    } catch (error) {
      toast({
        title: "Migration Failed",
        description: "Failed to migrate university slugs. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Data Migration</h1>
              <p className="text-sm text-gray-600 mt-1">Run database migrations and utilities</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                University Slug Migration
              </CardTitle>
              <CardDescription>
                This migration will add SEO-friendly slug fields to all existing universities. 
                URLs will change from <code>/universities/university-name-6fOJul30Z5VDGyKi8PUh</code> to <code>/universities/university-name</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Before Running Migration:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• This will update all university records in the database</li>
                  <li>• Old URLs with IDs will still work (legacy support)</li>
                  <li>• New URLs will be clean and SEO-friendly</li>
                  <li>• Safe to run multiple times (skips records that already have slugs)</li>
                </ul>
              </div>

              {migrationComplete && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✅ Migration completed successfully!</p>
                  <p className="text-sm text-green-700 mt-1">
                    All universities now have SEO-friendly slug URLs.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={runSlugMigration}
                  disabled={isRunning || migrationComplete}
                  className="flex items-center gap-2"
                >
                  {isRunning && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isRunning ? 'Running Migration...' : 'Run Migration'}
                </Button>
                
                <Link href="/admin">
                  <Button variant="outline">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
