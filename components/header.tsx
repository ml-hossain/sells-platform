"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
const navigation = [
  { name: "Home", href: "/" },
  { name: "University", href: "/universities" },
  { name: "Travel Service", href: "/travel" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleConsultationClick = () => {
    // If we're already on the home page, just scroll to the form
    if (pathname === '/') {
      const consultationSection = document.getElementById('consultation-form')
      if (consultationSection) {
        consultationSection.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to home page with hash
      router.push('/#consultation-form')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative text-sm font-medium transition-colors hover:text-violet-600 group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-electric-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button
            size="sm"
            onClick={handleConsultationClick}
            className="bg-gradient-to-r from-violet-600 to-electric-600 hover:from-violet-700 hover:to-electric-700 shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105"
          >
            Get Consultation
          </Button>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-violet-50">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-white/95 backdrop-blur-xl">
            <div className="flex flex-col space-y-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-violet-600 p-2 rounded-lg hover:bg-violet-50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Button 
                  size="sm" 
                  onClick={() => {
                    const consultationSection = document.getElementById('consultation-form');
                    if (consultationSection) {
                      consultationSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    setIsOpen(false);
                  }}
                  className="bg-gradient-to-r from-violet-600 to-electric-600"
                >
                  Get Consultation
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
