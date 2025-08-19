"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Settings,
  LogOut,
  User,
  Bell,
  Menu,
  Loader2,
  Mail
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getConsultationRequests } from '@/lib/services/consultation-service'
import { getContactMessages } from '@/lib/services/contact-service'
import type { ConsultationRequest } from '@/lib/services/consultation-service'
import type { ContactMessage } from '@/lib/services/contact-service'

interface AdminHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

// Helper to get a JS Date from Date | Timestamp
function getDisplayDate(date: Date | { toDate: () => Date }): Date {
  return (date instanceof Date) ? date : date.toDate();
}

export function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
  const { user, signOutUser } = useAuth()
  const [notifOpen, setNotifOpen] = useState(false)
  const [recentConsultations, setRecentConsultations] = useState<ConsultationRequest[]>([])
  const [recentContacts, setRecentContacts] = useState<ContactMessage[]>([])
  const [notifLoading, setNotifLoading] = useState(false)

  useEffect(() => {
    if (notifOpen) {
      fetchNotifications()
    }
  }, [notifOpen])

  const fetchNotifications = async () => {
    setNotifLoading(true)
    try {
      const consultations = await getConsultationRequests()
      const contacts = await getContactMessages()
      setRecentConsultations(consultations.slice(0, 5))
      setRecentContacts(contacts.slice(0, 5))
    } catch (e) {
      setRecentConsultations([])
      setRecentContacts([])
    } finally {
      setNotifLoading(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/admin" className="flex items-center group">
          <div className="relative">
            <Image
              src="/nems-logo.png"
              alt="NEMS Logo"
              width={40}
              height={40}
              className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-violet-600 rounded-full opacity-0 group-hover:opacity-10 group-hover:animate-ping" />
          </div>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-violet-50 transition-colors duration-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Notifications */}
          <Popover open={notifOpen} onOpenChange={setNotifOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex relative hover:bg-violet-50 transition-colors duration-200"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-violet-500 to-electric-500 rounded-full animate-pulse" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 p-0">
              <div className="p-4 border-b font-semibold text-base">Recent Notifications</div>
              {notifLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="ml-2">Loading...</span>
                </div>
              ) : (
                <div className="divide-y">
                  <div className="p-3">
                    <div className="font-semibold text-sm mb-2">Consultations</div>
                    {recentConsultations.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No recent consultations</div>
                    ) : recentConsultations.map((c, i) => (
                      <div key={c.id || i} className="flex items-center gap-2 py-1">
                        <User className="h-4 w-4 text-violet-500" />
                        <div className="flex-1">
                          <div className="font-medium text-xs">{c.firstName} {c.lastName}</div>
                          <div className="text-xs text-muted-foreground">{c.email}</div>
                        </div>
                        <div className="text-xs text-gray-400">{getDisplayDate(c.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3">
                    <div className="font-semibold text-sm mb-2">Contact Messages</div>
                    {recentContacts.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No recent contacts</div>
                    ) : recentContacts.map((c, i) => (
                      <div key={c.id || i} className="flex items-center gap-2 py-1">
                        <Mail className="h-4 w-4 text-blue-500" />
                        <div className="flex-1">
                          <div className="font-medium text-xs">{c.firstName} {c.lastName}</div>
                          <div className="text-xs text-muted-foreground">{c.email}</div>
                        </div>
                        <div className="text-xs text-gray-400">{getDisplayDate(c.createdAt).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-violet-200">
                  <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-electric-500 text-white font-semibold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-white/95 backdrop-blur-xl border border-violet-100 shadow-lg"
              align="end"
            >
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {user?.displayName && (
                    <p className="font-medium text-sm text-gray-900">{user.displayName}</p>
                  )}
                  {user?.email && (
                    <p className="w-48 truncate text-xs text-gray-500">{user.email}</p>
                  )}
                  {user?.uid && (
                    <p className="w-48 truncate text-xs text-gray-400">UID: {user.uid}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:bg-red-50 text-red-600 cursor-pointer"
                onClick={signOutUser}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
