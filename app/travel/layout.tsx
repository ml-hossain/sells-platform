import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Travel Services - NextGen EduMigrate",
  description: "Comprehensive travel solutions for international travelers. Flight bookings, accommodation, travel insurance & airport assistance for your journey.",
}

export default function TravelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
