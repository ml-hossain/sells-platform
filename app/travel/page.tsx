"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plane, Hotel, Shield, MapPin, Clock, CheckCircle } from "lucide-react"

const services = [
  {
    icon: Plane,
    title: "Flight Booking Services",
    description: "Competitive rates on international flights with flexible booking options.",
    features: ["Best rates", "Flexible dates", "24/7 support", "Group bookings"],
  },
  {
    icon: Hotel,
    title: "Accommodation Assistance",
    description: "Help finding suitable housing options in your destination city.",
    features: ["Hotels", "Private apartments", "Homestay options", "Safety verified"],
  },
  {
    icon: Shield,
    title: "Travel Insurance",
    description: "Comprehensive travel and health insurance coverage for international travelers.",
    features: ["Medical coverage", "Trip cancellation", "Emergency evacuation", "24/7 assistance"],
  },
  {
    icon: MapPin,
    title: "Airport Transfer",
    description: "Safe and reliable airport pickup and drop-off services in major cities.",
    features: ["Meet & greet", "Luggage assistance", "Direct to accommodation", "Multilingual drivers"],
  },
]



export default function TravelPage() {
  const router = useRouter()

  const handleBookConsultation = () => {
    // Navigate to home page with consultation form
    router.push('/#consultation-form')
  }


  const handleGetQuote = () => {
    // Navigate to contact page for travel quote
    router.push('/contact')
  }

  return (
    <div className="py-8">
      <div className="container space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold">Travel Services for International Travelers</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive travel solutions to make your international journey smooth and hassle-free. From flight
            bookings to accommodation, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleGetQuote}>Get Travel Quote</Button>
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Travel Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              End-to-end travel solutions designed for international travelers
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>


        {/* Process */}
        <section className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to get your travel arrangements sorted
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold mb-2">Consultation</h3>
              <p className="text-sm text-muted-foreground">
                Discuss your travel needs and preferences with our experts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold mb-2">Planning</h3>
              <p className="text-sm text-muted-foreground">
                We create a customized travel plan based on your requirements
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold mb-2">Booking</h3>
              <p className="text-sm text-muted-foreground">We handle all bookings and arrangements on your behalf</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="font-bold mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">24/7 support throughout your journey and arrival</p>
            </div>
          </div>
        </section>


        {/* CTA */}
        <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Plan Your Journey?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let our travel experts handle all the details while you focus on preparing for your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={handleBookConsultation}>
              <Clock className="h-5 w-5 mr-2" />
              Book Consultation
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
