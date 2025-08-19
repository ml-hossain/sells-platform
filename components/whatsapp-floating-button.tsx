"use client"

import React, { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import { getCompanySettings } from '@/lib/services/settings-service'

const WhatsAppFloatingButton: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const settings = await getCompanySettings()
        
        if (settings && settings.contact && settings.contact.phoneNumbers && settings.contact.phoneNumbers.length > 0) {
          // Get the first phone number from the settings
          const firstPhone = settings.contact.phoneNumbers[0].number
          // Clean the phone number (remove spaces, dashes, etc.) and ensure it starts with country code
          const cleanedPhone = firstPhone.replace(/\s+/g, '').replace(/[-()]/g, '')
          setPhoneNumber(cleanedPhone)
        }
      } catch (error) {
        console.error('Error fetching phone number:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhoneNumber()
  }, [])

  const handleWhatsAppClick = () => {
    if (phoneNumber) {
      // Format the phone number for WhatsApp (remove any leading + and ensure it starts with country code)
      const whatsappNumber = phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello! I would like to know more about your education consultancy services.`
      window.open(whatsappUrl, '_blank')
    }
  }

  // Don't render if loading or no phone number
  if (isLoading || !phoneNumber) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Main floating button */}
      <button
        onClick={handleWhatsAppClick}
        className="group flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        title={`WhatsApp: ${phoneNumber}`}
        aria-label="Contact us on WhatsApp"
        style={{ zIndex: 9999 }}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
      
      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20 pointer-events-none"></div>
      
      {/* Notification badge */}
      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce pointer-events-none">
        1
      </div>
    </div>
  )
}

export default WhatsAppFloatingButton
