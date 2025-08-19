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

export interface ConsultationRequest {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredDestination?: string
  programLevel?: string
  message?: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  notes?: string
  scheduledDate?: Timestamp | Date | null
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface ConsultationFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredDestination?: string
  programLevel?: string
  message?: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

const COLLECTION_NAME = 'consultations'

// Format consultation data for Telegram notification
const formatConsultationNotification = (data: ConsultationFormData): string => {
  return `🎓 <b>New Free Consultation Request</b>\n\n` +
    `👤 <b>Name:</b> ${data.firstName} ${data.lastName}\n` +
    `📧 <b>Email:</b> ${data.email}\n` +
    `📱 <b>Phone:</b> ${data.phone}\n` +
    (data.preferredDestination ? `🌍 <b>Preferred Destination:</b> ${data.preferredDestination}\n` : '') +
    (data.programLevel ? `🎯 <b>Program Level:</b> ${data.programLevel}\n` : '') +
    (data.message ? `💬 <b>Message:</b>\n${data.message}\n` : '') +
    `\n📋 <b>Agreements:</b>\n` +
    `${data.agreeToTerms ? '✅' : '❌'} Terms and Conditions\n` +
    `${data.subscribeNewsletter ? '✅' : '❌'} Newsletter Subscription\n` +
    `\n⏰ <b>Submitted:</b> ${new Date().toLocaleString()}`
}

// Get all consultation requests
export const getConsultationRequests = async (): Promise<ConsultationRequest[]> => {
  try {
    const consultationsRef = collection(db, COLLECTION_NAME)
    const q = query(consultationsRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      scheduledDate: doc.data().scheduledDate?.toDate() || null,
    } as ConsultationRequest))
  } catch (error) {
    throw new Error('Failed to fetch consultation requests')
  }
}

// Get consultation request by ID
export const getConsultationRequestById = async (id: string): Promise<ConsultationRequest | null> => {
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
        scheduledDate: data.scheduledDate?.toDate() || null,
      } as ConsultationRequest
    }

    return null
  } catch (error) {
    throw new Error('Failed to fetch consultation request')
  }
}

// Add new consultation request
export const addConsultationRequest = async (data: ConsultationFormData): Promise<string> => {
  try {
    const consultationData = {
      ...data,
      status: 'pending' as const,
      priority: 'medium' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), consultationData)

    // Send Telegram notification (don't block the main operation if it fails)
    try {
      const telegramMessage = formatConsultationNotification(data)
      const response = await fetch('/api/telegram/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: telegramMessage }),
      })

      if (!response.ok) {
        const errorData = await response.json()
      }
    } catch (telegramError) {
      // Don't throw the error, just log it
    }

    return docRef.id
  } catch (error) {
    throw new Error('Failed to add consultation request')
  }
}

// Update consultation request
export const updateConsultationRequest = async (
  id: string,
  data: Partial<ConsultationRequest>
): Promise<void> => {
  try {
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    }

    // Convert Date to Timestamp if scheduledDate is provided
    if (data.scheduledDate && data.scheduledDate instanceof Date) {
      updateData.scheduledDate = Timestamp.fromDate(data.scheduledDate)
    }

    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, updateData)
  } catch (error) {
    throw new Error('Failed to update consultation request')
  }
}

// Delete consultation request
export const deleteConsultationRequest = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    throw new Error('Failed to delete consultation request')
  }
}

// Get consultation requests by status
export const getConsultationRequestsByStatus = async (status: string): Promise<ConsultationRequest[]> => {
  try {
    if (status === 'all') {
      return await getConsultationRequests()
    }

    const consultationsRef = collection(db, COLLECTION_NAME)
    const q = query(
      consultationsRef,
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      scheduledDate: doc.data().scheduledDate?.toDate() || null,
    } as ConsultationRequest))
  } catch (error) {
    throw new Error('Failed to filter consultation requests')
  }
}

// Get consultation requests by priority
export const getConsultationRequestsByPriority = async (priority: string): Promise<ConsultationRequest[]> => {
  try {
    if (priority === 'all') {
      return await getConsultationRequests()
    }

    const consultationsRef = collection(db, COLLECTION_NAME)
    const q = query(
      consultationsRef,
      where('priority', '==', priority),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      scheduledDate: doc.data().scheduledDate?.toDate() || null,
    } as ConsultationRequest))
  } catch (error) {
    throw new Error('Failed to filter consultation requests')
  }
}

// Search consultation requests
export const searchConsultationRequests = async (searchTerm: string): Promise<ConsultationRequest[]> => {
  try {
    const consultations = await getConsultationRequests()

    if (!searchTerm.trim()) {
      return consultations
    }

    const searchLower = searchTerm.toLowerCase()
    return consultations.filter(consultation =>
      consultation.firstName.toLowerCase().includes(searchLower) ||
      consultation.lastName.toLowerCase().includes(searchLower) ||
      consultation.email.toLowerCase().includes(searchLower) ||
      consultation.phone.includes(searchTerm) ||
      (consultation.preferredDestination && consultation.preferredDestination.toLowerCase().includes(searchLower)) ||
      (consultation.message && consultation.message.toLowerCase().includes(searchLower))
    )
  } catch (error) {
    throw new Error('Failed to search consultation requests')
  }
}
