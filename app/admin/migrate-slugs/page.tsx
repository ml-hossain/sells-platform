"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Loader2, Database, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface MigrationResult {
  id: string
  name: string
  slug: string
  status: 'success' | 'error'
  error?: string
}

interface MigrationResponse {
  success: boolean
  message: string
  updated: number
  errors: number
  results: MigrationResult[]
}

export default function MigrateUniversitySlugsPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<MigrationResponse | null>(null)

  const runMigration = async () => {
    setIsRunning(true)
    setResults(null)

    try {
      const response = await fetch('/api/admin/migrate-slugs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data: MigrationResponse = await response.json()

      if (data.success) {
        setResults(data)
        toast({
          title: "Migration Completed",
          description: `Successfully updated ${data.updated} universities with SEO-friendly slugs.`,
        })
      } else {
        throw new Error(data.message || 'Migration failed')
      }
    } catch (error) {
      toast({
        title: "Migration Failed",
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Database Migration</h1>
          <p className="text-muted-foreground">Add SEO-friendly slugs to existing universities</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            University Slug Migration
          </CardTitle>
          <CardDescription>
            This migration will add SEO-friendly slug fields to all existing universities in the database.
            The slugs will be in the format: <code>university-name-{new Date().getFullYear()}-tuition-fees-structure</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h4 className="font-medium text-yellow-800 mb-1">Important Notes:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• This migration is safe to run multiple times</li>
              <li>• It will update the <code>slug</code> field for all universities</li>
              <li>• Existing URLs will continue to work via legacy support</li>
              <li>• New SEO-friendly URLs will be generated automatically</li>
            </ul>
          </div>

          <Button 
            onClick={runMigration} 
            disabled={isRunning}
            className="w-full sm:w-auto"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running Migration...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Run Migration
              </>
            )}
          </Button>

          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Success</p>
                        <p className="text-2xl font-bold text-green-600">{results.updated}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-800">Errors</p>
                        <p className="text-2xl font-bold text-red-600">{results.errors}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-800">Total</p>
                        <p className="text-2xl font-bold text-blue-600">{results.updated + results.errors}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Migration Results</CardTitle>
                  <CardDescription>Detailed results for each university</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {results.results.map((result) => (
                      <div
                        key={result.id}
                        className={`p-3 rounded-md border ${
                          result.status === 'success'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium">{result.name}</p>
                            {result.status === 'success' && (
                              <p className="text-sm text-muted-foreground font-mono">
                                Slug: {result.slug}
                              </p>
                            )}
                            {result.status === 'error' && result.error && (
                              <p className="text-sm text-red-600">{result.error}</p>
                            )}
                          </div>
                          <div className="ml-4">
                            {result.status === 'success' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
