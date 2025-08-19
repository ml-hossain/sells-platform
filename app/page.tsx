import type { Metadata } from "next"
import { HeroSection } from "@/components/home/hero-section"
import { QuickStats } from "@/components/home/quick-stats"
import { ServicesSection } from "@/components/home/services-section"
import { SuccessStories } from "@/components/home/success-stories"
import { MeetCEO } from "@/components/home/meet-ceo"
import { ConsultationForm } from "@/components/home/consultation-form"

export const metadata: Metadata = {
  title: "NextGen EduMigrate - Study Abroad Consultancy",
  description: "Expert education consultancy for studying abroad. 15+ years experience, 98% success rate. University selection, visa assistance & travel services.",
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <QuickStats />
      <div>
        <ServicesSection />
        <SuccessStories />
        <MeetCEO />
        <ConsultationForm />
      </div>
    </div>
  )
}
