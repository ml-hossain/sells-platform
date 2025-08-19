"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"
import { getCompanySettings, CompanySettings } from "@/lib/services/settings-service"

export function Footer() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getCompanySettings()
        setSettings(data)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])
  return (
    <footer className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 border-t relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(139,92,246,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.05),transparent_50%)]" />

      <div className="container py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="h-8 w-8 bg-gradient-to-br from-violet-600 to-electric-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform duration-300">
                  GSH
                </div>
                <div className="absolute inset-0 bg-violet-600 rounded-lg opacity-0 group-hover:opacity-10 group-hover:animate-ping" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-violet-600 to-electric-600 bg-clip-text text-transparent">
                Global Study Hub
              </span>
            </div>
            {(!loading && settings?.description) ? (
              <p className="text-sm text-gray-600 leading-relaxed">
                {settings.description}
              </p>
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">
                Your trusted partner for international education opportunities and student success worldwide.
              </p>
            )}
            <div className="flex space-x-4">
              {/* Facebook - only show if available */}
              {!loading && settings?.socialMedia?.facebook && (
                <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5 text-gray-500 hover:text-violet-600 cursor-pointer transition-all duration-300 hover:scale-110" />
                </a>
              )}

              {/* Twitter - only show if available */}
              {!loading && settings?.socialMedia?.twitter && (
                <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5 text-gray-500 hover:text-electric-600 cursor-pointer transition-all duration-300 hover:scale-110" />
                </a>
              )}

              {/* Instagram - only show if available */}
              {!loading && settings?.socialMedia?.instagram && (
                <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5 text-gray-500 hover:text-emerald-600 cursor-pointer transition-all duration-300 hover:scale-110" />
                </a>
              )}

              {/* LinkedIn - only show if available */}
              {!loading && settings?.socialMedia?.linkedin && (
                <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5 text-gray-500 hover:text-blue-600 cursor-pointer transition-all duration-300 hover:scale-110" />
                </a>
              )}

              {/* YouTube - only show if available */}
              {!loading && settings?.socialMedia?.youtube && (
                <a href={settings.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5 text-gray-500 hover:text-red-600 cursor-pointer transition-all duration-300 hover:scale-110" />
                </a>
              )}
            </div>
          </div>

          {/* Mobile Footer - Services and Quick Links in one row, Contact below */}
          <div className="flex flex-col gap-4 col-span-1 md:hidden">
            {/* Row with Quick Links and Services */}
            <div className="grid grid-cols-2 gap-4">
              {/* Quick Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">Quick Links</h3>
                <div className="space-y-1.5">
                  <Link
                    href="/"
                    className="text-xs text-gray-600 hover:text-violet-600 block transition-colors duration-300 hover:translate-x-1"
                  >
                    Home
                  </Link>
                  <Link
                    href="/universities"
                    className="text-xs text-gray-600 hover:text-violet-600 block transition-colors duration-300 hover:translate-x-1"
                  >
                    Universities
                  </Link>
                  <Link
                    href="/about"
                    className="text-xs text-gray-600 hover:text-violet-600 block transition-colors duration-300 hover:translate-x-1"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="text-xs text-gray-600 hover:text-violet-600 block transition-colors duration-300 hover:translate-x-1"
                  >
                    Contact
                  </Link>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-800">Services</h3>
                <div className="space-y-1.5">
                  <Link
                    href="/#consultation-form"
                    className="text-xs text-gray-600 hover:text-emerald-600 block transition-colors duration-300 hover:translate-x-1"
                  >
                    Study Consultation
                  </Link>
                  <Link
                    href="/travel"
                    className="text-xs text-gray-600 hover:text-emerald-600 block transition-colors duration-300 hover:translate-x-1"
                  >
                    Student Support
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Info Row */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-800">Contact</h3>
              <div className="space-y-1.5">
                {/* Phone - only show if available */}
                {!loading && settings?.contact?.phoneNumbers && settings.contact.phoneNumbers.length > 0 && (
                  <div className="flex items-center space-x-1 group cursor-pointer">
                    <Phone className="h-3 w-3 text-gray-500 group-hover:text-violet-600 transition-colors duration-300" />
                    <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {settings.contact.phoneNumbers[0].number}
                    </span>
                  </div>
                )}

                {/* Email - only show if available */}
                {!loading && settings?.emails?.general && (
                  <div className="flex items-center space-x-1 group cursor-pointer">
                    <Mail className="h-3 w-3 text-gray-500 group-hover:text-electric-600 transition-colors duration-300" />
                    <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {settings.emails.general}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Quick Links - hidden on mobile */}
          <div className="hidden md:block space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-violet-600 block transition-colors duration-300 hover:translate-x-1"
              >
                Home
              </Link>
              <Link
                href="/universities"
                className="text-sm text-gray-600 hover:text-violet-600 block transition-colors duration-300 hover:translate-x-1"
              >
                Universities
              </Link>
              <Link
                href="/about"
                className="text-sm text-gray-600 hover:text-violet-600 block transition-colors duration-300 hover:translate-x-1"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-600 hover:text-violet-600 block transition-colors duration-300 hover:translate-x-1"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Services - hidden on mobile */}
          <div className="hidden md:block space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Services</h3>
            <div className="space-y-2">
              <Link
                href="/#consultation-form"
                className="text-sm text-gray-600 hover:text-emerald-600 block transition-colors duration-300 hover:translate-x-1"
              >
                Study Consultation
              </Link>
              <Link
                href="/travel"
                className="text-sm text-gray-600 hover:text-emerald-600 block transition-colors duration-300 hover:translate-x-1"
              >
                Student Support
              </Link>
            </div>
          </div>

          {/* Desktop Contact Info - hidden on mobile */}
          <div className="hidden md:block space-y-4">
            <h3 className="text-sm font-semibold text-gray-800">Contact Info</h3>
            <div className="space-y-3">
              {/* Phone - only show if available */}
              {!loading && settings?.contact?.phoneNumbers && settings.contact.phoneNumbers.length > 0 && (
                <div className="flex items-center space-x-2 group cursor-pointer">
                  <Phone className="h-4 w-4 text-gray-500 group-hover:text-violet-600 transition-colors duration-300" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {settings.contact.phoneNumbers[0].number}
                  </span>
                </div>
              )}

              {/* Email - only show if available */}
              {!loading && settings?.emails?.general && (
                <div className="flex items-center space-x-2 group cursor-pointer">
                  <Mail className="h-4 w-4 text-gray-500 group-hover:text-electric-600 transition-colors duration-300" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {settings.emails.general}
                  </span>
                </div>
              )}

              {/* Address - only show if available */}
              {!loading && settings?.mainOffice?.address && (
                <div className="flex items-start space-x-2 group cursor-pointer">
                  <MapPin className="h-4 w-4 text-gray-500 group-hover:text-emerald-600 transition-colors duration-300 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300 leading-relaxed">
                    {settings.mainOffice.address}
                    {settings.mainOffice.suite && (
                      <><br />{settings.mainOffice.suite}</>
                    )}
                    {settings.mainOffice.city && settings.mainOffice.state && (
                      <><br />{settings.mainOffice.city}, {settings.mainOffice.state} {settings.mainOffice.postalCode || ''}</>
                    )}
                    {settings.mainOffice.country && (
                      <><br />{settings.mainOffice.country}</>
                    )}
                  </span>
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {!loading && settings?.companyName ? settings.companyName : 'Global Study Hub'}. All rights reserved.
            <br />
            Created by <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-300">StudyTech Solutions</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
