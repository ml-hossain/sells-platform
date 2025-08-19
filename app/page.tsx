import type { Metadata } from "next"
import { NewHeroSection } from "@/components/home/new-hero-section"
import { FeaturesGrid } from "@/components/home/features-grid"
import { UniversityHighlights } from "@/components/home/university-highlights"
import { ProcessSteps } from "@/components/home/process-steps"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CTASection } from "@/components/home/cta-section"

export const metadata: Metadata = {
  title: "Global Study Hub - International Education Consultancy",
  description: "Expert guidance for studying abroad. 10+ years experience, 95% success rate. University selection, visa assistance & student support services.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <NewHeroSection />
      <FeaturesGrid />
      <UniversityHighlights />
      <ProcessSteps />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
