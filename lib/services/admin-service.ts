import { doc, getDoc, setDoc, getDocs, deleteDoc, collection, query, orderBy, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { User } from 'firebase/auth'

export interface UserRole {
  uid: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
  permissions?: string[]
}

const USERS_COLLECTION = 'users'

/**
 * Check if a user has admin role in Firebase
 * @param user - Firebase user object
 * @returns Promise<boolean> - Whether user is admin
 */
export const isUserAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false

  try {
    const userDocRef = doc(db, USERS_COLLECTION, user.uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      // Create user document with default role if it doesn't exist
      await createUserRole(user, 'user')
      return false
    }

    const userData = userDoc.data() as UserRole
    return userData.role === 'admin'
  } catch (error) {
    return false
  }
}

/**
 * Create or update user role in Firebase
 * @param user - Firebase user object
 * @param role - Role to assign
 * @param permissions - Optional permissions array
 */
export const createUserRole = async (
  user: User,
  role: 'admin' | 'user',
  permissions?: string[]
): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, user.uid)
    const userData: UserRole = {
      uid: user.uid,
      email: user.email || '',
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      permissions: permissions || []
    }

    await setDoc(userDocRef, userData, { merge: true })
  } catch (error) {
    throw new Error('Failed to create user role')
  }
}

/**
 * Get user role from Firebase
 * @param uid - User ID
 * @returns Promise<UserRole | null>
 */
export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      return null
    }

    return userDoc.data() as UserRole
  } catch (error) {
    return null
  }
}

/**
 * Update user role
 * @param uid - User ID
 * @param role - New role
 * @param permissions - Optional permissions
 */
export const updateUserRole = async (
  uid: string,
  role: 'admin' | 'user',
  permissions?: string[]
): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid)
    const updateData = {
      role,
      updatedAt: new Date(),
      ...(permissions && { permissions })
    }

    await setDoc(userDocRef, updateData, { merge: true })
  } catch (error) {
    throw new Error('Failed to update user role')
  }
}

/**
 * Get all users from Firebase
 * @returns Promise<UserRole[]>
 */
export const getAllUsers = async (): Promise<UserRole[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as UserRole))
  } catch (error) {
    throw new Error('Failed to fetch users')
  }
}

/**
 * Get users by role
 * @param role - Role to filter by
 * @returns Promise<UserRole[]>
 */
export const getUsersByRole = async (role: 'admin' | 'user'): Promise<UserRole[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION)
    const q = query(usersRef, where('role', '==', role), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    } as UserRole))
  } catch (error) {
    throw new Error('Failed to fetch users by role')
  }
}

/**
 * Delete user
 * @param uid - User ID to delete
 */
export const deleteUser = async (uid: string): Promise<void> => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid)
    await deleteDoc(userDocRef)
  } catch (error) {
    throw new Error('Failed to delete user')
  }
}

/**
 * Bulk delete users
 * @param uids - Array of user IDs to delete
 * @returns Promise<{ success: string[], failed: string[] }>
 */
export const bulkDeleteUsers = async (uids: string[]): Promise<{ success: string[], failed: string[] }> => {
  const results = {
    success: [] as string[],
    failed: [] as string[]
  }

  for (const uid of uids) {
    try {
      await deleteUser(uid)
      results.success.push(uid)
    } catch (error) {
      results.failed.push(uid)
    }
  }

  return results
}

/**
 * Bulk update user roles
 * @param updates - Array of { uid, role } objects
 * @returns Promise<{ success: string[], failed: string[] }>
 */
export const bulkUpdateUserRoles = async (
  updates: { uid: string; role: 'admin' | 'user' }[]
): Promise<{ success: string[], failed: string[] }> => {
  const results = {
    success: [] as string[],
    failed: [] as string[]
  }

  for (const update of updates) {
    try {
      await updateUserRole(update.uid, update.role)
      results.success.push(update.uid)
    } catch (error) {
      results.failed.push(update.uid)
    }
  }

  return results
}
