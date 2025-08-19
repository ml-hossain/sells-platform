import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ConditionalLayout } from "@/components/conditional-layout"
import ErrorBoundary from "@/components/error-boundary"
import ServiceWorkerRegistration from "@/components/service-worker-registration"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Global Study Hub - Your Path to International Education",
  description: "Professional education consultancy for overseas studies, university admissions, and student visa services.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ConditionalLayout>{children}</ConditionalLayout>
          <ServiceWorkerRegistration />
        </ErrorBoundary>
      </body>
    </html>
  )
}
