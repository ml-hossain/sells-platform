"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  GraduationCap,
  Settings,
  BarChart3,
  Mail,
  Calendar,
  Quote,
  Users,
  UserCheck
} from 'lucide-react'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Consultations',
    href: '/admin/consultations',
    icon: Calendar,
  },
  {
    title: 'Universities',
    href: '/admin/universities',
    icon: GraduationCap,
  },
  {
    title: 'Success Stories',
    href: '/admin/success-stories',
    icon: Quote,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: Mail,
  },
  {
    title: 'Team',
    href: '/admin/team',
    icon: Users,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: UserCheck,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface AdminSidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AdminSidebar({ sidebarOpen, setSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static top-16 lg:top-0 bottom-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-xl border-r border-violet-100 shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none lg:shadow-sm
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full py-6">
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-violet-500 to-electric-500 text-white shadow-lg shadow-violet-500/25"
                      : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-violet-600"
                    )}
                  />
                  {item.title}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-4 pt-4 border-t border-violet-100">
            <div className="bg-gradient-to-br from-violet-50 to-electric-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-electric-500 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                  <p className="text-xs text-gray-500 truncate">Version 2.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
