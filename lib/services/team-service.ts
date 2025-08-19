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
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { imgBBService } from './imgbb-service'
import type { 
  TeamMember, 
  TeamMemberFormData 
} from '@/lib/types/team-member'

const COLLECTION_NAME = 'teamMembers'

// Get all team members (ordered by display order)
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  try {
    const teamMembersRef = collection(db, COLLECTION_NAME)
    const q = query(teamMembersRef, orderBy('order', 'asc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as TeamMember))
  } catch (error) {
    throw new Error('Failed to fetch team members')
  }
}

// Get team member by ID
export const getTeamMemberById = async (id: string): Promise<TeamMember | null> => {
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
      } as TeamMember
    }
    
    return null
  } catch (error) {
    throw new Error('Failed to fetch team member')
  }
}

// Upload team member image to ImgBB
export const uploadTeamMemberImage = async (file: File, name: string): Promise<string> => {
  try {
    // Validate the image file first
    const validation = imgBBService.validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid image file')
    }

    // Create a descriptive name for the image
    const imageName = `team-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    
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

// Add new team member
export const addTeamMember = async (data: TeamMemberFormData): Promise<string> => {
  try {
    let imageUrl = ''
    
    // Upload image if it's a File object
    if (data.image && data.image instanceof File) {
      imageUrl = await uploadTeamMemberImage(data.image, data.name)
    } else if (typeof data.image === 'string') {
      imageUrl = data.image
    }
    
    const teamMemberData = {
      name: data.name,
      role: data.role,
      image: imageUrl,
      bio: data.bio,
      order: data.order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), teamMemberData)
    return docRef.id
  } catch (error) {
    throw new Error('Failed to add team member')
  }
}

// Update team member
export const updateTeamMember = async (id: string, data: TeamMemberFormData): Promise<void> => {
  try {
    let imageUrl = ''
    
    // Upload new image if it's a File object
    if (data.image && data.image instanceof File) {
      imageUrl = await uploadTeamMemberImage(data.image, data.name)
    } else if (typeof data.image === 'string') {
      imageUrl = data.image
    }
    
    const updateData = {
      name: data.name,
      role: data.role,
      image: imageUrl,
      bio: data.bio,
      order: data.order,
      updatedAt: Timestamp.now(),
    }
    
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, updateData)
  } catch (error) {
    throw new Error('Failed to update team member')
  }
}

// Delete team member
export const deleteTeamMember = async (id: string): Promise<void> => {
  try {
    // Delete the document
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
    
    // Note: ImgBB doesn't provide a way to delete images via API
    // Images will remain on ImgBB but won't be referenced in our database
  } catch (error) {
    throw new Error('Failed to delete team member')
  }
}

// Bulk delete team members
export const bulkDeleteTeamMembers = async (ids: string[]): Promise<{ success: string[], failed: string[] }> => {
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

// Search team members
export const searchTeamMembers = async (searchTerm: string): Promise<TeamMember[]> => {
  try {
    const teamMembers = await getTeamMembers()
    
    if (!searchTerm.trim()) {
      return teamMembers
    }
    
    const searchLower = searchTerm.toLowerCase()
    return teamMembers.filter(member => 
      member.name.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower) ||
      member.bio.toLowerCase().includes(searchLower)
    )
  } catch (error) {
    throw new Error('Failed to search team members')
  }
}
