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
import { extractIdFromSlug, createUniversitySlug } from '@/lib/utils'

export interface University {
  id?: string
  name: string
  slug?: string
  permalink?: string  // Custom permalink set by admin
  country: string
  type: 'Public' | 'Private'
  image: string
  shortDescription: string
  details: string
  status: 'draft' | 'published'
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface UniversityFormData {
  name: string
  permalink?: string  // Custom permalink field for admin
  country: string
  type: 'Public' | 'Private' | ''
  image: string | File
  shortDescription: string
  details: string
  status: 'draft' | 'published'
}

const COLLECTION_NAME = 'universities'

// Get all universities
export const getUniversities = async (): Promise<University[]> => {
  try {
    const universitiesRef = collection(db, COLLECTION_NAME)
    const q = query(universitiesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as University))
  } catch (error) {
    throw new Error('Failed to fetch universities')
  }
}

// Get university by ID (for admin use)
export const getUniversityById = async (id: string): Promise<University | null> => {
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
      } as University
    }

    return null
  } catch (error) {
    throw new Error('Failed to fetch university')
  }
}

// Get university by slug (SEO-friendly URL)
export const getUniversityBySlug = async (slug: string): Promise<University | null> => {
  try {
    console.log('🔍 getUniversityBySlug called with:', slug)
    
    // Decode URL-encoded slug
    const decodedSlug = decodeURIComponent(slug)
    console.log('🔍 Decoded slug:', decodedSlug)
    
    // Get all universities to search through them
    const universitiesRef = collection(db, COLLECTION_NAME)
    const allSnapshot = await getDocs(universitiesRef)
    
    if (allSnapshot.empty) {
      console.log('❌ No universities found in database')
      return null
    }
    
    console.log(`🔍 Searching through ${allSnapshot.docs.length} universities...`)
    
    for (const docSnap of allSnapshot.docs) {
      const data = docSnap.data()
      const university = { id: docSnap.id, ...data } as University
      
      console.log(`🔍 Checking university: "${university.name}"`)
      
      // 1. Check if slug field matches
      if (university.slug && (university.slug === slug || university.slug === decodedSlug)) {
        console.log('✅ Found by slug field:', university.slug)
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as University
      }
      
      // 2. Check if permalink matches
      if (university.permalink && (university.permalink === slug || university.permalink === decodedSlug)) {
        console.log('✅ Found by permalink field:', university.permalink)
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as University
      }
      
      // 3. Generate slug from name and compare
      const generatedSlug = createUniversitySlug(university.name)
      console.log(`🔍 Generated slug from name: "${generatedSlug}"`)
      
      if (generatedSlug === slug || generatedSlug === decodedSlug) {
        console.log('✅ Found by generated slug:', generatedSlug)
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as University
      }
      
      // 4. Try exact name match (for fallback)
      if (university.name && (university.name === slug || university.name === decodedSlug)) {
        console.log('✅ Found by exact name match:', university.name)
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as University
      }
    }

    // Legacy support: try to extract ID from slug (for old URLs)
    const id = extractIdFromSlug(slug)
    if (id) {
      console.log('🔍 Trying legacy ID extraction:', id)
      const docRef = doc(db, COLLECTION_NAME, id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        console.log('✅ Found by legacy ID')
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as University
      }
    }

    console.log('❌ University not found for slug:', slug)
    return null
  } catch (error) {
    throw new Error('Failed to fetch university by slug')
  }
}

// Generate slug for a university
export const getUniversitySlug = (university: University): string => {
  // If admin has set a custom permalink, use that (but make sure it's a clean slug)
  if (university.permalink?.trim()) {
    const cleanPermalink = createUniversitySlug(university.permalink.trim())
    return cleanPermalink
  }
  
  // If slug exists, use that
  if (university.slug?.trim()) {
    return university.slug.trim()
  }
  
  // Otherwise ALWAYS generate clean slug from name
  if (!university.name) {
    throw new Error('University must have name to generate slug')
  }
  
  // Generate clean slug from university name
  const cleanSlug = createUniversitySlug(university.name)
  console.log(`🔧 Generated clean slug for "${university.name}": "${cleanSlug}"`)
  return cleanSlug
}

// Upload image to ImgBB
export const uploadUniversityImage = async (file: File, universityName: string): Promise<string> => {
  try {
    // Validate the image file first
    const validation = imgBBService.validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid image file')
    }

    // Create a descriptive name for the image
    const imageName = `${universityName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

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

// Add new university
export const addUniversity = async (data: UniversityFormData): Promise<string> => {
  try {
    let imageUrl = ''

    // Upload image if it's a File object
    if (data.image && data.image instanceof File) {
      imageUrl = await uploadUniversityImage(data.image, data.name)
    } else if (typeof data.image === 'string') {
      imageUrl = data.image
    }

    // Generate clean slug from university name (if no custom permalink provided)
    const slug = data.permalink?.trim() || createUniversitySlug(data.name)

    const universityData = {
      name: data.name,
      slug: slug,
      permalink: data.permalink?.trim() || '', // Store custom permalink
      country: data.country,
      type: data.type as 'Public' | 'Private',
      image: imageUrl,
      shortDescription: data.shortDescription,
      details: data.details,
      status: data.status,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), universityData)
    return docRef.id
  } catch (error) {
    throw new Error('Failed to add university')
  }
}

// Update university
export const updateUniversity = async (id: string, data: UniversityFormData): Promise<void> => {
  try {
    let imageUrl = ''

    // Upload new image if it's a File object
    if (data.image && data.image instanceof File) {
      imageUrl = await uploadUniversityImage(data.image, data.name)
    } else if (typeof data.image === 'string') {
      imageUrl = data.image
    }

    // Generate clean slug from university name (if no custom permalink provided)
    const slug = data.permalink?.trim() || createUniversitySlug(data.name)

    const updateData = {
      name: data.name,
      slug: slug,
      permalink: data.permalink?.trim() || '', // Store custom permalink
      country: data.country,
      type: data.type as 'Public' | 'Private',
      image: imageUrl,
      shortDescription: data.shortDescription,
      details: data.details,
      status: data.status,
      updatedAt: Timestamp.now(),
    }

    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, updateData)
  } catch (error) {
    throw new Error('Failed to update university')
  }
}

// Delete university
export const deleteUniversity = async (id: string): Promise<void> => {
  try {
    // Delete the document
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)

    // Note: ImgBB doesn't provide a way to delete images via API
    // Images will remain on ImgBB but won't be referenced in our database
    // Consider implementing a cleanup strategy if needed
  } catch (error) {
    throw new Error('Failed to delete university')
  }
}

// Bulk delete universities
export const bulkDeleteUniversities = async (ids: string[]): Promise<{ success: string[], failed: string[] }> => {
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

// Bulk update universities status
export const bulkUpdateUniversitiesStatus = async (ids: string[], status: 'draft' | 'published'): Promise<{ success: string[], failed: string[] }> => {
  const results = {
    success: [] as string[],
    failed: [] as string[]
  }

  for (const id of ids) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      await updateDoc(docRef, {
        status: status,
        updatedAt: Timestamp.now(),
      })
      results.success.push(id)
    } catch (error) {
      results.failed.push(id)
    }
  }

  return results
}

// Search universities
export const searchUniversities = async (searchTerm: string): Promise<University[]> => {
  try {
    const universities = await getUniversities()

    if (!searchTerm.trim()) {
      return universities
    }

    const searchLower = searchTerm.toLowerCase()
    return universities.filter(uni =>
      uni.name.toLowerCase().includes(searchLower) ||
      uni.country.toLowerCase().includes(searchLower) ||
      uni.shortDescription.toLowerCase().includes(searchLower)
    )
  } catch (error) {
    throw new Error('Failed to search universities')
  }
}

// Filter universities by country
export const getUniversitiesByCountry = async (country: string): Promise<University[]> => {
  try {
    if (country === 'all') {
      return await getUniversities()
    }

    const universitiesRef = collection(db, COLLECTION_NAME)
    const q = query(
      universitiesRef,
      where('country', '==', country),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as University))
  } catch (error) {
    throw new Error('Failed to filter universities')
  }
}

// Filter universities by type
export const getUniversitiesByType = async (type: string): Promise<University[]> => {
  try {
    if (type === 'all') {
      return await getUniversities()
    }

    const universitiesRef = collection(db, COLLECTION_NAME)
    const q = query(
      universitiesRef,
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as University))
  } catch (error) {
    throw new Error('Failed to filter universities')
  }
}



// Migration function to add slug field to existing universities
export const migrateUniversitySlugs = async (): Promise<void> => {
  try {
    const universitiesRef = collection(db, COLLECTION_NAME)
    const snapshot = await getDocs(universitiesRef)

    const updatePromises = snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data()
      
      // Skip if slug already exists
      if (data.slug) {
        return
      }

      // Generate slug from name
      const slug = createUniversitySlug(data.name)
      
      // Update document with slug
      const docRef = doc(db, COLLECTION_NAME, docSnap.id)
      await updateDoc(docRef, { slug })
    })

    await Promise.all(updatePromises)
    console.log('Successfully migrated university slugs')
  } catch (error) {
    console.error('Error migrating university slugs:', error)
    throw new Error('Failed to migrate university slugs')
  }
}
