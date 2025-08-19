import type { Metadata } from "next"
import { UniversityList } from "@/components/universities/university-list"
import { UniversitySidebar } from "@/components/universities/university-sidebar"

export const metadata: Metadata = {
  title: "Universities - NextGen EduMigrate",
  description: "Explore top universities across 50+ countries. Get expert guidance for university selection and application process with NextGen EduMigrate.",
}

export default function UniversitiesPage() {
  return (
    <div className="py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Partner Universities</h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore our extensive network of partner universities across the globe. Find the perfect institution for
            your academic journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <UniversityList />
          </div>
          <div className="lg:col-span-1">
            <UniversitySidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
