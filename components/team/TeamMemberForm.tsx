"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { Upload, X, Save, User } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { addTeamMember, updateTeamMember } from '@/lib/services/team-service'
import type { TeamMember, TeamMemberFormData } from '@/lib/types/team-member'

// Validation schema
const teamMemberSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters'),
  role: z.string()
    .min(2, 'Role must be at least 2 characters')
    .max(100, 'Role must not exceed 100 characters'),
  bio: z.string()
    .min(10, 'Bio must be at least 10 characters')
    .max(500, 'Bio must not exceed 500 characters'),
  order: z.number()
    .min(0, 'Order must be a positive number')
    .max(999, 'Order must not exceed 999'),
})

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>

interface TeamMemberFormProps {
  mode: 'create' | 'edit'
  initialData?: TeamMember
  onSuccess?: () => void
  onCancel?: () => void
}

export function TeamMemberForm({ 
  mode, 
  initialData, 
  onSuccess, 
  onCancel 
}: TeamMemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const isEditMode = mode === 'edit'

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: initialData?.name || '',
      role: initialData?.role || '',
      bio: initialData?.bio || '',
      order: initialData?.order || 0,
    },
  })

  // Watch form values for preview
  const watchedName = form.watch('name')
  const watchedRole = form.watch('role')
  const watchedBio = form.watch('bio')

  // Set initial image preview for edit mode
  useEffect(() => {
    if (isEditMode && initialData?.image) {
      setImagePreview(initialData.image)
    }
  }, [isEditMode, initialData])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPEG, PNG, GIF, WebP, or BMP).",
        variant: "destructive",
      })
      return
    }

    // Validate file size (10MB limit)
    const maxSizeInBytes = 10 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB.",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(isEditMode && initialData?.image ? initialData.image : '')
    
    // Clear the input
    const input = document.getElementById('image-upload') as HTMLInputElement
    if (input) {
      input.value = ''
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const onSubmit = async (data: TeamMemberFormValues) => {
    try {
      setIsSubmitting(true)
      setUploadProgress(10)

      // Prepare form data
      const formData: TeamMemberFormData = {
        ...data,
        image: imageFile || (isEditMode && initialData?.image ? initialData.image : ''),
      }

      setUploadProgress(30)

      if (isEditMode && initialData?.id) {
        await updateTeamMember(initialData.id, formData)
      } else {
        await addTeamMember(formData)
      }

      setUploadProgress(100)

      toast({
        title: "Success",
        description: `Team member ${isEditMode ? 'updated' : 'added'} successfully!`,
      })

      // Reset form for create mode
      if (!isEditMode) {
        form.reset()
        setImageFile(null)
        setImagePreview('')
      }

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'add'} team member. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Team Member Information</CardTitle>
              <CardDescription>Enter the team member's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter team member's full name" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title/Role *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter job title or role" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Lower numbers appear first (0 = first position)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Image and Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo & Preview</CardTitle>
              <CardDescription>Upload photo and see how it will look</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image-upload">Profile Photo</Label>
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
                      alt="Team member preview"
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
                  <div className="text-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-r from-violet-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg">
                        {getInitials(watchedName || 'Team Member')}
                      </div>
                    )}
                    <h3 className="text-lg font-bold mb-2">{watchedName || 'Team Member Name'}</h3>
                    <div className="mb-4">
                      <span className="inline-block bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded-full">
                        {watchedRole || 'Role'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {watchedBio || 'Bio description will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
            <CardDescription>Describe the team member's background and expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share the team member's background, expertise, and what they bring to the team..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {watchedBio.length}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  {uploadProgress >= 60 && uploadProgress < 100 && "Saving team member..."}
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
                    {isEditMode ? 'Update Team Member' : 'Add Team Member'}
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
