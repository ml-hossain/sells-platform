interface ImgBBResponse {
  data: {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    width: number
    height: number
    size: number
    time: number
    expiration: number
    image: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    thumb: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    medium: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    delete_url: string
  }
  success: boolean
  status: number
}

class ImgBBService {
  private baseUrl = '/api/upload/image'

  constructor() {}

  /**
   * Upload image to ImgBB via server-side API
   * @param file - Image file to upload
   * @param name - Optional name for the image
   * @returns Promise with image URL
   */
  async uploadImage(file: File, name?: string): Promise<string> {
    // Client-side validation
    const validation = this.validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }


    try {
      // Prepare form data for server API
      const formData = new FormData()
      formData.append('file', file)
      
      if (name) {
        formData.append('name', name)
      }
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        body: formData,
      })


      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Image upload failed')
      }

      return result.url
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to upload image')
    }
  }

  /**
   * Upload image from URL to ImgBB (deprecated - use uploadImage with File instead)
   * @param imageUrl - URL of the image to upload
   * @param name - Optional name for the image
   * @returns Promise with image URL
   */
  async uploadImageFromUrl(imageUrl: string, name?: string): Promise<string> {
    
    // For URL uploads, we'll need to fetch the image first and convert to File
    try {
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${response.status}`)
      }
      
      const blob = await response.blob()
      const file = new File([blob], name || 'image', { type: blob.type })
      
      return await this.uploadImage(file, name)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to upload image from URL')
    }
  }

  /**
   * Convert File to base64 string
   * @param file - File to convert
   * @returns Promise with base64 string
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        // Remove the data:image/jpeg;base64, part and keep only the base64 string
        const base64String = result.split(',')[1]
        resolve(base64String)
      }
      reader.onerror = (error) => {
        reject(error)
      }
    })
  }


  /**
   * Test API key validity via server-side API
   * @returns Promise with test result
   */
  async testApiKey(): Promise<{ valid: boolean; error?: string }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET'
      })

      const result = await response.json()
      if (!response.ok) {
        return { 
          valid: false, 
          error: result.error || `API test failed: ${response.status}` 
        }
      }

      return { valid: result.success, error: result.error }
    } catch (error) {
      return { 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Validate image file
   * @param file - File to validate
   * @returns boolean indicating if file is valid
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' }
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return { valid: false, error: 'Image size must be less than 10MB' }
    }

    // Check for supported formats
    const supportedFormats = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp'
    ]

    if (!supportedFormats.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Unsupported image format. Please use JPEG, PNG, GIF, WebP, or BMP.' 
      }
    }

    return { valid: true }
  }
}

// Export singleton instance
export const imgBBService = new ImgBBService()

// Export for direct usage
export default imgBBService
