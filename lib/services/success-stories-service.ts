import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  Timestamp,
  DocumentData
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { imgBBService } from './imgbb-service'

export interface SuccessStory {
  id?: string
  name: string
  country: string
  university: string
  program: string
  story: string
  image: string
  rating: number
  flag: string
  color: string
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface SuccessStoryFormData {
  name: string
  country: string
  university: string
  program: string
  story: string
  image: string | File
  rating: number
  flag: string
  color: string
}

const COLLECTION_NAME = 'successStories'

// Get all success stories
export const getSuccessStories = async (): Promise<SuccessStory[]> => {
  try {
    const successStoriesRef = collection(db, COLLECTION_NAME)
    const q = query(successStoriesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as SuccessStory))
  } catch (error) {
    throw new Error('Failed to fetch success stories')
  }
}

// Get success story by ID
export const getSuccessStoryById = async (id: string): Promise<SuccessStory | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as SuccessStory
    }
    
    return null
  } catch (error) {
    throw new Error('Failed to fetch success story')
  }
}

// Upload image to ImgBB
export const uploadSuccessStoryImage = async (file: File, name: string): Promise<string> => {
  try {
    // Validate the image file first
    const validation = imgBBService.validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid image file')
    }

    // Create a descriptive name for the image
    const imageName = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    
    // Upload to ImgBB
    const imageUrl = await imgBBService.uploadImage(file, imageName)
    
    return imageUrl
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to upload image')
  }
}

// Add new success story
export const addSuccessStory = async (data: SuccessStoryFormData): Promise<string> => {
  try {
    let imageUrl = ''
    
    // Upload image if it's a File object
    if (data.image && data.image instanceof File) {
      imageUrl = await uploadSuccessStoryImage(data.image, data.name)
    } else if (typeof data.image === 'string') {
      imageUrl = data.image
    }
    
    const successStoryData = {
      name: data.name,
      country: data.country,
      university: data.university,
      program: data.program,
      story: data.story,
      image: imageUrl,
      rating: data.rating,
      flag: data.flag,
      color: data.color,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), successStoryData)
    return docRef.id
  } catch (error) {
    throw new Error('Failed to add success story')
  }
}

// Update success story
export const updateSuccessStory = async (id: string, data: SuccessStoryFormData): Promise<void> => {
  try {
    let imageUrl = ''
    
    // Upload new image if it's a File object
    if (data.image && data.image instanceof File) {
      imageUrl = await uploadSuccessStoryImage(data.image, data.name)
    } else if (typeof data.image === 'string') {
      imageUrl = data.image
    }
    
    const updateData = {
      name: data.name,
      country: data.country,
      university: data.university,
      program: data.program,
      story: data.story,
      image: imageUrl,
      rating: data.rating,
      flag: data.flag,
      color: data.color,
      updatedAt: Timestamp.now(),
    }
    
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, updateData)
  } catch (error) {
    throw new Error('Failed to update success story')
  }
}

// Delete success story
export const deleteSuccessStory = async (id: string): Promise<void> => {
  try {
    // Delete the document
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
    
    // Note: ImgBB doesn't provide a way to delete images via API
    // Images will remain on ImgBB but won't be referenced in our database
    // Consider implementing a cleanup strategy if needed
  } catch (error) {
    throw new Error('Failed to delete success story')
  }
}

// Bulk delete success stories
export const bulkDeleteSuccessStories = async (ids: string[]): Promise<{ success: string[], failed: string[] }> => {
  const results = {
    success: [] as string[],
    failed: [] as string[]
  }
  
  for (const id of ids) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      await deleteDoc(docRef)
      results.success.push(id)
    } catch (error) {
      results.failed.push(id)
    }
  }
  
  return results
}

// Search success stories
export const searchSuccessStories = async (searchTerm: string): Promise<SuccessStory[]> => {
  try {
    const successStories = await getSuccessStories()
    
    if (!searchTerm.trim()) {
      return successStories
    }
    
    const searchLower = searchTerm.toLowerCase()
    return successStories.filter(story => 
      story.name.toLowerCase().includes(searchLower) ||
      story.country.toLowerCase().includes(searchLower) ||
      story.university.toLowerCase().includes(searchLower) ||
      story.program.toLowerCase().includes(searchLower) ||
      story.story.toLowerCase().includes(searchLower)
    )
  } catch (error) {
    throw new Error('Failed to search success stories')
  }
}
