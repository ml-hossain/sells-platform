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

export interface ContactMessage {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: string
  notes?: string
  repliedAt?: Timestamp | Date | null
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
}

const COLLECTION_NAME = 'contactMessages'

// Format contact data for Telegram notification
const formatContactNotification = (data: ContactFormData): string => {
  return `📞 <b>New Contact Message</b>\n\n` +
    `👤 <b>Name:</b> ${data.firstName} ${data.lastName}\n` +
    `📧 <b>Email:</b> ${data.email}\n` +
    (data.phone ? `📱 <b>Phone:</b> ${data.phone}\n` : '') +
    `📋 <b>Subject:</b> ${data.subject}\n` +
    `💬 <b>Message:</b>\n${data.message}\n` +
    `\n⏰ <b>Submitted:</b> ${new Date().toLocaleString()}`
}

// Get all contact messages
export const getContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const messagesRef = collection(db, COLLECTION_NAME)
    const q = query(messagesRef, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      repliedAt: doc.data().repliedAt?.toDate() || null,
    } as ContactMessage))
  } catch (error) {
    throw new Error('Failed to fetch contact messages')
  }
}

// Get contact message by ID
export const getContactMessageById = async (id: string): Promise<ContactMessage | null> => {
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
        repliedAt: data.repliedAt?.toDate() || null,
      } as ContactMessage
    }

    return null
  } catch (error) {
    throw new Error('Failed to fetch contact message')
  }
}

// Add new contact message
export const addContactMessage = async (data: ContactFormData): Promise<string> => {
  try {
    const messageData = {
      ...data,
      status: 'new' as const,
      priority: 'medium' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), messageData)

    // Send Telegram notification (don't block the main operation if it fails)
    try {
      const telegramMessage = formatContactNotification(data)
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
    throw new Error('Failed to add contact message')
  }
}

// Update contact message
export const updateContactMessage = async (
  id: string,
  data: Partial<ContactMessage>
): Promise<void> => {
  try {
    const updateData = {
      ...data,
      updatedAt: Timestamp.now(),
    }

    // Convert Date to Timestamp if repliedAt is provided
    if (data.repliedAt && data.repliedAt instanceof Date) {
      updateData.repliedAt = Timestamp.fromDate(data.repliedAt)
    }

    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, updateData)
  } catch (error) {
    throw new Error('Failed to update contact message')
  }
}

// Delete contact message
export const deleteContactMessage = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await deleteDoc(docRef)
  } catch (error) {
    throw new Error('Failed to delete contact message')
  }
}

// Bulk delete contact messages
export const bulkDeleteContactMessages = async (ids: string[]): Promise<{ success: string[], failed: string[] }> => {
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

// Get contact messages by status
export const getContactMessagesByStatus = async (status: string): Promise<ContactMessage[]> => {
  try {
    if (status === 'all') {
      return await getContactMessages()
    }

    const messagesRef = collection(db, COLLECTION_NAME)
    const q = query(
      messagesRef,
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      repliedAt: doc.data().repliedAt?.toDate() || null,
    } as ContactMessage))
  } catch (error) {
    throw new Error('Failed to filter contact messages')
  }
}

// Get contact messages by subject
export const getContactMessagesBySubject = async (subject: string): Promise<ContactMessage[]> => {
  try {
    if (subject === 'all') {
      return await getContactMessages()
    }

    const messagesRef = collection(db, COLLECTION_NAME)
    const q = query(
      messagesRef,
      where('subject', '==', subject),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      repliedAt: doc.data().repliedAt?.toDate() || null,
    } as ContactMessage))
  } catch (error) {
    throw new Error('Failed to filter contact messages')
  }
}

// Search contact messages
export const searchContactMessages = async (searchTerm: string): Promise<ContactMessage[]> => {
  try {
    const messages = await getContactMessages()

    if (!searchTerm.trim()) {
      return messages
    }

    const searchLower = searchTerm.toLowerCase()
    return messages.filter(message =>
      message.firstName.toLowerCase().includes(searchLower) ||
      message.lastName.toLowerCase().includes(searchLower) ||
      message.email.toLowerCase().includes(searchLower) ||
      (message.phone && message.phone.includes(searchTerm)) ||
      message.subject.toLowerCase().includes(searchLower) ||
      message.message.toLowerCase().includes(searchLower)
    )
  } catch (error) {
    throw new Error('Failed to search contact messages')
  }
}

// Mark message as read
export const markMessageAsRead = async (id: string): Promise<void> => {
  try {
    await updateContactMessage(id, { status: 'read' })
  } catch (error) {
    throw new Error('Failed to mark message as read')
  }
}

// Mark message as replied
export const markMessageAsReplied = async (id: string): Promise<void> => {
  try {
    await updateContactMessage(id, {
      status: 'replied',
      repliedAt: new Date()
    })
  } catch (error) {
    throw new Error('Failed to mark message as replied')
  }
}
