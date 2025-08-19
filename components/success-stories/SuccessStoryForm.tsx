"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Upload, Save, X, Star, CheckCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { addSuccessStory, updateSuccessStory, SuccessStoryFormData } from '@/lib/services/success-stories-service'
import { SuccessStory, SUPPORTED_COUNTRIES, GRADIENT_COLORS } from '@/lib/types/success-story'
import { imgBBService } from '@/lib/services/imgbb-service'

// Zod validation schema
const successStorySchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  country: z.string()
    .min(2, "Country name must be at least 2 characters")
    .max(50, "Country name must be less than 50 characters"),
  university: z.string()
    .min(2, "University name must be at least 2 characters")
    .max(100, "University name must be less than 100 characters"),
  program: z.string()
    .min(2, "Program name must be at least 2 characters")
    .max(100, "Program name must be less than 100 characters"),
  story: z.string()
    .min(50, "Story must be at least 50 characters")
    .max(500, "Story must be less than 500 characters"),
  rating: z.number()
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  flag: z.string()
    .min(1, "Please enter a flag emoji"),
  color: z.string()
    .min(1, "Please select a gradient color"),
})

type FormData = z.infer<typeof successStorySchema>

interface SuccessStoryFormProps {
  mode?: 'create' | 'edit'
  initialData?: SuccessStory
  onSuccess?: () => void
  onCancel?: () => void
}

export function SuccessStoryForm({ mode, initialData, onSuccess, onCancel }: SuccessStoryFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)

  const isEditMode = !!initialData

  const form = useForm<FormData>({
    resolver: zodResolver(successStorySchema),
    defaultValues: {
      name: initialData?.name || '',
      country: initialData?.country || '',
      university: initialData?.university || '',
      program: initialData?.program || '',
      story: initialData?.story || '',
      rating: initialData?.rating || 5,
      flag: initialData?.flag || '',
      color: initialData?.color || GRADIENT_COLORS[0],
    }
  })

  const watchedName = form.watch('name')
  const watchedColor = form.watch('color')
  const watchedStory = form.watch('story')

  // Generate initials for preview
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get country flag emoji
  const getCountryFlag = (country: string) => {
    const flagMap: Record<string, string> = {
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'UK': '🇬🇧',
      'United Kingdom': '🇬🇧',
      'USA': '🇺🇸',
      'United States': '🇺🇸',
      'America': '🇺🇸',
      'US': '🇺🇸',
      'Germany': '🇩🇪',
      'Netherlands': '🇳🇱',
      'Holland': '🇳🇱',
      'France': '🇫🇷',
      'Ireland': '🇮🇪',
      'New Zealand': '🇳🇿',
      'Sweden': '🇸🇪',
      'Denmark': '🇩🇰',
      'Norway': '🇳🇴',
      'Finland': '🇫🇮',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Korea': '🇰🇷',
      'China': '🇨🇳',
      'India': '🇮🇳',
      'Singapore': '🇸🇬',
      'Malaysia': '🇲🇾',
      'Thailand': '🇹�',
      'Italy': '�🇮🇹',
      'Spain': '🇪🇸',
      'Portugal': '🇵🇹',
      'Switzerland': '🇨🇭',
      'Austria': '🇦🇹',
      'Belgium': '🇧🇪',
      'Poland': '🇵🇱',
      'Czech Republic': '🇨🇿',
      'Hungary': '🇭🇺',
      'Russia': '🇷🇺',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Mexico': '🇲🇽',
      'Chile': '🇨🇱',
      'South Africa': '🇿🇦',
      'Turkey': '🇹🇷',
      'UAE': '🇦🇪',
      'Israel': '🇮🇱',
      'Egypt': '🇪🇬',
    }
    
    // Try exact match first
    if (flagMap[country]) {
      return flagMap[country]
    }
    
    // Try case-insensitive match
    const countryLower = country.toLowerCase()
    for (const [key, value] of Object.entries(flagMap)) {
      if (key.toLowerCase() === countryLower) {
        return value
      }
    }
    
    // Return generic globe emoji for unknown countries
    return '🌍'
  }

  // Auto-set flag when country changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name: fieldName }) => {
      if (fieldName === 'country' && value.country) {
        const flag = getCountryFlag(value.country)
        form.setValue('flag', flag)
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

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
      setImagePreview(imageUrl)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setUploadProgress(10)

    try {
      const formData: SuccessStoryFormData = {
        name: data.name,
        country: data.country,
        university: data.university,
        program: data.program,
        story: data.story,
        image: imageFile || imagePreview,
        rating: data.rating,
        flag: data.flag,
        color: data.color,
      }

      setUploadProgress(30)

      if (isEditMode && initialData?.id) {
        setUploadProgress(60)
        await updateSuccessStory(initialData.id, formData)
        setUploadProgress(100)
        
        toast({
          title: "Success",
          description: "Success story updated successfully!",
        })
      } else {
        setUploadProgress(60)
        await addSuccessStory(formData)
        setUploadProgress(100)
        
        toast({
          title: "Success",
          description: "Success story added successfully!",
        })
      }

      setIsSuccess(true)
      setTimeout(() => {
        onSuccess?.()
      }, 1500)

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save success story. Please try again.",
        variant: "destructive",
      })
      setUploadProgress(0)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="border-2 border-emerald-200 shadow-2xl shadow-emerald-500/20 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-electric-600 bg-clip-text text-transparent">
              {isEditMode ? 'Updated!' : 'Success!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isEditMode 
                ? 'The success story has been updated successfully.'
                : 'The success story has been added successfully.'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Enter the student's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter student's full name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Study Destination *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter country name (e.g., Canada, Australia, UK, USA)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Type the name of the country where the student studied
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter university name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program/Field of Study *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter program or field of study" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Image and Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Student Photo & Preview</CardTitle>
              <CardDescription>Upload photo and see how it will look</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image-upload">Student Photo</Label>
                <div className="flex items-center gap-4">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('image-upload')?.click()}
                    disabled={isSubmitting}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {imageFile ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {imagePreview && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  {imageFile && (
                    <span className="text-sm text-green-600">
                      New image selected
                    </span>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Student preview"
                      className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Supported formats: JPEG, PNG, GIF, WebP, BMP (max 10MB)
                </p>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="p-4 border rounded-lg bg-gradient-to-br from-violet-50/50 to-emerald-50/50">
                  <div className="flex items-center space-x-3">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-r ${watchedColor} flex items-center justify-center text-white font-bold shadow-lg`}
                      >
                        {getInitials(watchedName)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {watchedName || 'Student Name'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {form.watch('program') || 'Program'}
                      </p>
                      <p className={`text-sm bg-gradient-to-r ${watchedColor} bg-clip-text text-transparent font-medium`}>
                        {form.watch('university') || 'University'}, {form.watch('country') || 'Country'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gradient Color Selection */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gradient Color</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gradient color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GRADIENT_COLORS.map((color, index) => (
                          <SelectItem key={color} value={color}>
                            <div className="flex items-center space-x-2">
                              <div
                                className={`w-4 h-4 rounded-full bg-gradient-to-r ${color}`}
                              />
                              <span>Gradient {index + 1}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Story and Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Success Story</CardTitle>
            <CardDescription>Share the student's success story and experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="story"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Success Story *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share the student's success story, their experience with our services, and achievements..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {watchedStory.length}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating *</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center space-x-1">
                              {[...Array(rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="ml-2">{rating} Star{rating > 1 ? 's' : ''}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country Flag</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="🇨🇦" 
                        {...field}
                        maxLength={4}
                      />
                    </FormControl>
                    <FormDescription>
                      Flag emoji (auto-filled when country is selected)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        {isSubmitting && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="text-sm text-gray-600">
                  {uploadProgress < 30 && "Preparing submission..."}
                  {uploadProgress >= 30 && uploadProgress < 60 && "Uploading image..."}
                  {uploadProgress >= 60 && uploadProgress < 100 && "Saving success story..."}
                  {uploadProgress === 100 && "Complete!"}
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-end gap-4">
              {onCancel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditMode ? 'Update Success Story' : 'Add Success Story'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}
