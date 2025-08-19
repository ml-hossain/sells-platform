"use client"

import React, { useState } from 'react'
import { AuthProvider } from '@/contexts/auth-context'
import { AdminProtection } from '@/components/admin/AdminProtection'
import { AdminHeader } from './components/admin-header'
import { AdminSidebar } from './components/admin-sidebar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthProvider>
      <AdminProtection>
        <div className="min-h-screen bg-gray-50/50">
          <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex h-[calc(100vh-4rem)]">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 overflow-y-auto bg-white shadow-sm lg:rounded-tl-2xl">
              <div className="w-full h-full p-4 sm:p-6 lg:p-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </AdminProtection>
    </AuthProvider>
  )
}
