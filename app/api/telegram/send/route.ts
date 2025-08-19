import { NextRequest, NextResponse } from 'next/server'
import https from 'https'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

interface TelegramMessage {
  message: string
}

// Helper function to get Telegram settings from Firestore
async function getTelegramSettings() {
  try {
    const settingsRef = doc(db, 'settings', 'telegram-settings')
    const settingsSnap = await getDoc(settingsRef)

    if (settingsSnap.exists()) {
      const data = settingsSnap.data()
      return {
        botToken: data.botToken,
        chatId: data.chatId,
        enabled: data.enabled || false
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching Telegram settings:', error)
    return null
  }
}

// Helper function to make Telegram API calls using Node.js https module
async function sendToTelegram(botToken: string, chatId: string, message: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    })

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
      timeout: 10000, // 10 second timeout
    }

    const req = https.request(options, (res) => {
      let responseData = ''

      res.on('data', (chunk) => {
        responseData += chunk
      })

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(responseData)

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData)
          } else {
            reject(new Error(jsonData.description || `HTTP ${res.statusCode}: ${res.statusMessage}`))
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${responseData}`))
        }
      })
    })

    req.on('error', (error) => {
      reject(new Error(`Network error: ${error.message}`))
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    req.write(data)
    req.end()
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get Telegram settings from Firestore
    const telegramSettings = await getTelegramSettings()

    if (!telegramSettings || !telegramSettings.enabled) {
      return NextResponse.json(
        { success: false, error: 'Telegram notifications are disabled' },
        { status: 503 }
      )
    }

    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      return NextResponse.json(
        { success: false, error: 'Telegram not configured properly' },
        { status: 500 }
      )
    }

    // Parse request body
    const { message }: TelegramMessage = await request.json()

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Send message to Telegram
    await sendToTelegram(telegramSettings.botToken, telegramSettings.chatId, message)

    return NextResponse.json({
      success: true,
      message: 'Telegram notification sent successfully'
    })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Test connection endpoint
export async function GET() {
  try {
    // Get Telegram settings from Firestore
    const telegramSettings = await getTelegramSettings()

    if (!telegramSettings || !telegramSettings.enabled) {
      return NextResponse.json(
        { success: false, error: 'Telegram notifications are disabled' },
        { status: 503 }
      )
    }

    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      return NextResponse.json(
        { success: false, error: 'Telegram not configured properly in Firestore' },
        { status: 500 }
      )
    }

    // Test message
    const testMessage = `🤖 <b>Test Message</b>\n\nThis is a test message from NextGen EduMigrate.\n\n✅ Telegram integration is working correctly!\n\n⏰ ${new Date().toLocaleString()}`

    // Send test message
    await sendToTelegram(telegramSettings.botToken, telegramSettings.chatId, testMessage)

    return NextResponse.json({
      success: true,
      message: 'Test message sent successfully!'
    })

  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
