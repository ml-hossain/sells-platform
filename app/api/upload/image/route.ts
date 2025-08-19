import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

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

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  return buffer.toString('base64')
}

// Helper to get ImgBB API key from Firestore
async function getImgBBApiKey() {
  try {
    const settingsRef = doc(db, 'settings', 'imgbb')
    const settingsSnap = await getDoc(settingsRef)
    if (settingsSnap.exists()) {
      const data = settingsSnap.data()
      return data.apiKey || null
    }
    return null
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from Firestore
    const apiKey = await getImgBBApiKey()

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'Upload service not configured' },
        { status: 500 }
      )
    }

    const contentType = request.headers.get('content-type')
    let base64String: string
    let fileName: string

    // Handle JSON requests (for base64 file uploads)
    if (contentType?.includes('application/json')) {
      const { base64, name, isFile } = await request.json()

      if (!base64 || !name) {
        return NextResponse.json(
          { success: false, error: 'Missing base64 data or name' },
          { status: 400 }
        )
      }

      base64String = base64
      fileName = name

      // For file uploads, we don't validate image types
      if (!isFile) {
        // This is still an image upload via JSON, validate it
        // Note: We can't validate MIME type from base64 alone easily
        // but ImgBB will reject invalid images anyway
      }
    } else {
      // Handle form data requests (for traditional file uploads)
      const formData = await request.formData()
      const file = formData.get('file') as File
      const name = formData.get('name') as string

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        )
      }

      // Validate file type for traditional uploads
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'File must be an image' },
          { status: 400 }
        )
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File size must be less than 10MB' },
          { status: 400 }
        )
      }

      // Validate supported formats
      const supportedFormats = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp'
      ]

      if (!supportedFormats.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'Unsupported image format. Please use JPEG, PNG, GIF, WebP, or BMP.' },
          { status: 400 }
        )
      }

      // Convert to base64
      base64String = await fileToBase64(file)
      fileName = name || file.name
    }

    // Prepare ImgBB form data
    const imgbbFormData = new FormData()
    imgbbFormData.append('key', apiKey)
    imgbbFormData.append('image', base64String)

    if (fileName) {
      imgbbFormData.append('name', fileName)
    }

    // Upload to ImgBB
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: imgbbFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    const result: ImgBBResponse = await response.json()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'File upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: result.data.display_url,
      data: {
        id: result.data.id,
        url: result.data.display_url,
        width: result.data.width || 0,
        height: result.data.height || 0,
        size: result.data.size
      }
    })

  } catch (error) {

    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Test endpoint to verify API key
export async function GET() {
  try {
    // Get API key from Firestore
    const apiKey = await getImgBBApiKey()

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'ImgBB API key not configured in Firestore' },
        { status: 500 }
      )
    }

    // Test with a simple 1x1 pixel image
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='

    const formData = new FormData()
    formData.append('key', apiKey)
    formData.append('image', testImageBase64)
    formData.append('name', 'api-test')

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    const responseText = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `API test failed: ${response.status} - ${responseText}` },
        { status: 400 }
      )
    }

    const result = JSON.parse(responseText)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: `API key invalid: ${JSON.stringify(result)}` },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'ImgBB API key is valid and working!'
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
