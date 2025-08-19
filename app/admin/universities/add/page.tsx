
"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import RichTextEditor from '@/components/ui/rich-text-editor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Upload, Save } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { addUniversity, UniversityFormData } from '@/lib/services/university-service'
import { imgBBService } from '@/lib/services/imgbb-service'
import { toast } from '@/hooks/use-toast'


export default function AddUniversityPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fullPageView, setFullPageView] = useState(false)
  const [formData, setFormData] = useState<UniversityFormData>({
    name: '',
    permalink: '',
    country: '',
    type: '',
    image: '',
    shortDescription: '',
    details: '',
    status: 'draft'
  })
  const [errors, setErrors] = useState<Partial<UniversityFormData>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleInputChange = (field: keyof UniversityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'University name is required'
    if (!formData.country.trim()) newErrors.country = 'Country is required'
    if (!formData.type) newErrors.type = 'University type is required'
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required'
    if (!formData.status) newErrors.status = 'Publication status is required'
    // Check if details content is empty (handle HTML content)
    const detailsText = formData.details.replace(/\u003c[^\u003e]*\u003e/g, '').trim()
    if (!detailsText) newErrors.details = 'Detailed information is required'

    if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description must be less than 200 characters'
    }

    setErrors(newErrors as Partial<UniversityFormData>)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Prepare form data with image file if selected
      const submitData: UniversityFormData = {
        ...formData,
        image: imageFile || formData.image
      }

      const universityId = await addUniversity(submitData)

      toast({
        title: "Success",
        description: "University added successfully.",
      })

      // Redirect to universities list page
      router.push('/admin/universities')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add university. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Use ImgBB service validation
      const validation = imgBBService.validateImageFile(file)

      if (!validation.valid) {
        toast({
          title: "Error",
          description: validation.error || "Invalid image file.",
          variant: "destructive",
        })
        return
      }

      setImageFile(file)
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, image: imageUrl }))
    }
  }



  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/universities">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Link>
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Add New University</h1>
              <p className="text-sm text-gray-600 mt-1">Create a new university listing</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Basic Information</CardTitle>
                  <CardDescription className="text-sm">Enter the basic details about the university</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">University Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter university name"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="permalink">Custom Permalink (Optional)</Label>
                    <Input
                      id="permalink"
                      value={formData.permalink || ''}
                      onChange={(e) => handleInputChange('permalink', e.target.value)}
                      placeholder="e.g., university-of-malaya-admission-guide (leave empty to auto-generate)"
                      className={errors.permalink ? 'border-red-500' : ''}
                    />
                    <p className="text-xs text-gray-500">
                      This will be used in the URL: yoursite.com/universities/<strong>{formData.permalink || 'auto-generated-from-name'}</strong>
                    </p>
                    {errors.permalink && <p className="text-sm text-red-500">{errors.permalink}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Enter country"
                      className={errors.country ? 'border-red-500' : ''}
                    />
                    {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">University Type *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select university type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public">Public</SelectItem>
                        <SelectItem value="Private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shortDescription">Short Description *</Label>
                    <Textarea
                      id="shortDescription"
                      value={formData.shortDescription}
                      onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                      placeholder="Brief description of the university (max 200 characters)"
                      rows={3}
                      className={errors.shortDescription ? 'border-red-500' : ''}
                    />
                    <div className="text-xs text-muted-foreground">
                      {formData.shortDescription.length}/200 characters
                    </div>
                    {errors.shortDescription && <p className="text-sm text-red-500">{errors.shortDescription}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Additional Details</CardTitle>
                  <CardDescription className="text-sm">Upload image and set publication status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">University Image</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      {formData.image && (
                        <span className="text-sm text-green-600">Image uploaded</span>
                      )}
                    </div>
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="University preview"
                          className="w-32 h-24 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Publication Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as 'draft' | 'published')}>
                      <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select publication status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                    <div className="text-xs text-muted-foreground">
                      Draft: Only visible to admins. Published: Visible to all users.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Detailed Information</CardTitle>
                <CardDescription className="text-sm">Provide comprehensive details about the university</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="details">Detailed Information *</Label>
                  <RichTextEditor
                    content={formData.details}
                    onChange={(content) => handleInputChange('details', content)}
                    placeholder="Detailed description about the university, its history, programs, facilities, etc."
                    error={!!errors.details}
                    fullPageView={fullPageView}
                    onToggleFullPage={() => setFullPageView(!fullPageView)}
                  />
                  {errors.details && <p className="text-sm text-red-500">{errors.details}</p>}
                </div>


              </CardContent>
            </Card>

            <Card className="w-full">
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                  <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                    <Link href="/admin/universities">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save University
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
