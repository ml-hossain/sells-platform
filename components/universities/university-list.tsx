"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, Loader2, ArrowRight } from "lucide-react"
import usePublicUniversities from "@/lib/hooks/usePublicUniversities"
import { getUniversitySlug } from "@/lib/services/university-service"
import Link from "next/link"


export function UniversityList() {
  const { data: universities, loading, error } = usePublicUniversities()
  const [searchTerm, setSearchTerm] = useState("")
  const [countryFilter, setCountryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Loading universities...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading universities: {error.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (!universities || universities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No universities available.</p>
      </div>
    )
  }

  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch =
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCountry = countryFilter === "all" || uni.country === countryFilter
    const matchesType = typeFilter === "all" || uni.type.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesCountry && matchesType
  })

  const countries = [...new Set(universities.map((uni) => uni.country))]
  const types = [...new Set(universities.map((uni) => uni.type))]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search universities, countries, or descriptions..."
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
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {types.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredUniversities.length} of {universities.length} universities
      </div>

      {/* University Cards */}
      <div className="grid gap-6">
        {filteredUniversities.map((university) => (
          <Card key={university.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <Link href={`/universities/${getUniversitySlug(university)}`} className="block">
              <div className="grid md:grid-cols-3 gap-0">
                <div className="relative">
                  <img
                    src={university.image || "/placeholder.svg"}
                    alt={university.name}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-black">
                      <MapPin className="h-3 w-3 mr-1" />
                      {university.country}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant={university.type === "Public" ? "default" : "outline"}>{university.type}</Badge>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2 group-hover:text-violet-600 transition-colors">
                          {university.name}
                        </CardTitle>
                        <CardDescription className="mb-4">
                          {university.shortDescription}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Click to view details
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-violet-600 group-hover:text-white group-hover:border-violet-600 transition-colors"
                        onClick={(e) => {
                          e.preventDefault()
                          window.location.href = `/universities/${getUniversitySlug(university)}`
                        }}
                      >
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardHeader>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {filteredUniversities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No universities found matching your criteria.</p>
          <Button
            variant="outline"
            className="mt-4 bg-transparent"
            onClick={() => {
              setSearchTerm("")
              setCountryFilter("all")
              setTypeFilter("all")
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
