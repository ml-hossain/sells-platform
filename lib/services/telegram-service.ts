import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface TelegramSettings {
  botToken?: string
  chatId?: string
  enabled: boolean
  lastUpdated: Timestamp | Date
  updatedBy?: string
}

const SETTINGS_DOC_ID = 'telegram-settings'
const COLLECTION_NAME = 'settings'

// Get Telegram settings
export const getTelegramSettings = async (): Promise<TelegramSettings | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        ...data,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      } as TelegramSettings
    }
    
    return null
  } catch (error) {
    throw new Error('Failed to fetch Telegram settings')
  }
}

// Save Telegram settings
export const saveTelegramSettings = async (settings: Omit<TelegramSettings, 'lastUpdated'>): Promise<void> => {
  try {
    const settingsData = {
      ...settings,
      lastUpdated: Timestamp.now(),
    }
    
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID)
    await setDoc(docRef, settingsData, { merge: true })
  } catch (error) {
    throw new Error('Failed to save Telegram settings')
  }
}

// Send notification to Telegram
export const sendTelegramNotification = async (message: string): Promise<boolean> => {
  try {
    const settings = await getTelegramSettings()
    
    if (!settings?.enabled || !settings.botToken || !settings.chatId) {
      return false
    }

    const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return false
    }

    const result = await response.json()
    return true
  } catch (error) {
    return false
  }
}

// Format consultation request for Telegram
export const formatConsultationNotification = (data: {
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredDestination?: string
  programLevel?: string
  message?: string
}): string => {
  const timestamp = new Date().toLocaleString()
  
  let notification = `🎓 <b>New Consultation Request</b>\n\n`
  notification += `👤 <b>Name:</b> ${data.firstName} ${data.lastName}\n`
  notification += `📧 <b>Email:</b> ${data.email}\n`
  notification += `📱 <b>Phone:</b> ${data.phone}\n`
  
  if (data.preferredDestination) {
    notification += `🌍 <b>Preferred Destination:</b> ${data.preferredDestination.charAt(0).toUpperCase() + data.preferredDestination.slice(1)}\n`
  }
  
  if (data.programLevel) {
    notification += `🎯 <b>Program Level:</b> ${data.programLevel.charAt(0).toUpperCase() + data.programLevel.slice(1)}\n`
  }
  
  if (data.message) {
    notification += `💬 <b>Message:</b> ${data.message.length > 200 ? data.message.substring(0, 200) + '...' : data.message}\n`
  }
  
  notification += `\n⏰ <b>Submitted:</b> ${timestamp}`
  
  return notification
}

// Format contact message for Telegram
export const formatContactNotification = (data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
}): string => {
  const timestamp = new Date().toLocaleString()
  
  let notification = `📬 <b>New Contact Message</b>\n\n`
  notification += `👤 <b>Name:</b> ${data.firstName} ${data.lastName}\n`
  notification += `📧 <b>Email:</b> ${data.email}\n`
  
  if (data.phone) {
    notification += `📱 <b>Phone:</b> ${data.phone}\n`
  }
  
  notification += `📋 <b>Subject:</b> ${getSubjectLabel(data.subject)}\n`
  notification += `💬 <b>Message:</b> ${data.message.length > 200 ? data.message.substring(0, 200) + '...' : data.message}\n`
  notification += `\n⏰ <b>Submitted:</b> ${timestamp}`
  
  return notification
}

// Helper function to get subject labels
const getSubjectLabel = (subject: string): string => {
  const subjects: Record<string, string> = {
    'consultation': 'Free Consultation',
    'application': 'Application Assistance',
    'visa': 'Visa Support',
    'travel': 'Travel Services',
    'general': 'General Inquiry',
    'other': 'Other'
  }
  
  return subjects[subject] || subject
}

// Test Telegram connection
export const testTelegramConnection = async (botToken: string, chatId: string): Promise<{ success: boolean; message: string }> => {
  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    
    const testMessage = `🤖 <b>Test Message</b>\n\nThis is a test message from NextGen EduMigrate admin panel.\n\n✅ Telegram integration is working correctly!\n\n⏰ ${new Date().toLocaleString()}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: testMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        message: errorData.description || 'Failed to send test message'
      }
    }

    return {
      success: true,
      message: 'Test message sent successfully!'
    }
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
