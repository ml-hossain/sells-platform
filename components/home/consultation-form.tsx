"use client"

import type React from "react"

import { useState } from "react"
import { addConsultationRequest } from "@/lib/services/consultation-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, CheckCircle, Sparkles } from "lucide-react"
import { ScrollReveal } from "@/components/animations/scroll-reveal"

export function ConsultationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [lastSubmission, setLastSubmission] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simple client-side rate limiting
    if (lastSubmission && Date.now() - lastSubmission < 30000) {
      setError('You are submitting too frequently. Please wait 30 seconds.');
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const consultationData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        preferredDestination: formData.get('preferredDestination') as string || undefined,
        programLevel: formData.get('programLevel') as string || undefined,
        message: formData.get('message') as string || undefined,
        agreeToTerms: true, // Default to true since we removed the checkbox
        subscribeNewsletter: false, // Default to false since we removed the checkbox
      }

      await addConsultationRequest(consultationData)
      setIsSubmitted(true)
      setLastSubmission(Date.now());
    } catch (err) {
      setError('Failed to submit consultation request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="consultation-form" className="py-16 bg-gradient-to-br from-emerald-50/50 via-electric-50/30 to-violet-50/50 relative overflow-hidden">
        {/* Success animation background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />

        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="border-2 border-emerald-200 shadow-2xl shadow-emerald-500/20 animate-bounce-in">
              <CardContent className="p-8">
                <div className="relative">
                  <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-4 animate-bounce-in" />
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-electric-600 bg-clip-text text-transparent">
                  Thank You!
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Your consultation request has been submitted successfully. Our team will contact you within 24 hours
                  to schedule your free consultation.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-gradient-to-r from-emerald-600 to-electric-600 hover:from-emerald-700 hover:to-electric-700 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                >
                  Submit Another Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="consultation-form" className="py-16 bg-gradient-to-br from-violet-50/50 via-electric-50/30 to-emerald-50/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-violet-400/20 to-electric-400/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-emerald-400/20 to-sunset-400/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="container relative">
        <ScrollReveal>
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-violet-100 to-emerald-100 text-violet-700 text-sm font-medium mb-3">
              <Sparkles className="h-4 w-4 mr-2" />
              Expert Education Guidance
            </div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
              Schedule Your Study Abroad Consultation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with our education specialists to explore your international study options and create a personalized plan.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <ScrollReveal direction="left">
            <Card className="border-2 border-violet-100 hover:border-violet-200 shadow-xl hover:shadow-2xl hover:shadow-violet-500/20 transition-all duration-500">

              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-violet-600 to-emerald-600 bg-clip-text text-transparent">
                  Consultation Request Form
                </CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        className="border-violet-200 focus:border-violet-400 focus:ring-violet-400 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        className="border-violet-200 focus:border-violet-400 focus:ring-violet-400 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="border-violet-200 focus:border-violet-400 focus:ring-violet-400 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="border-violet-200 focus:border-violet-400 focus:ring-violet-400 transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-gray-700">
                      Preferred Study Destination
                    </Label>
                    <Select name="preferredDestination">
                      <SelectTrigger className="border-violet-200 focus:border-violet-400 focus:ring-violet-400 transition-all duration-300">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                        <SelectItem value="germany">Germany</SelectItem>
                        <SelectItem value="netherlands">Netherlands</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program" className="text-gray-700">
                      Interested Program Level
                    </Label>
                    <Select name="programLevel">
                      <SelectTrigger className="border-violet-200 focus:border-violet-400 focus:ring-violet-400 transition-all duration-300">
                        <SelectValue placeholder="Select program level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                        <SelectItem value="phd">PhD</SelectItem>
                        <SelectItem value="diploma">Diploma/Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-700">
                      Tell us about your goals
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Share your academic background, career goals, and any specific questions you have..."
                      rows={4}
                      className="border-violet-200 focus:border-violet-400 focus:ring-violet-400 transition-all duration-300"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isLoading ? 'Submitting...' : 'Book Free Consultation'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>

          {/* Info Panel */}
          <div className="space-y-6">
            <ScrollReveal direction="right" delay={100}>
              <Card className="border-2 border-emerald-100 hover:border-emerald-200 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">

                <CardHeader>
                  <CardTitle className="flex items-center bg-gradient-to-r from-emerald-600 to-electric-600 bg-clip-text text-transparent">
                    <CalendarDays className="h-5 w-5 mr-2 text-emerald-600" />
                    What to Expect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-electric-50 hover:from-emerald-100 hover:to-electric-100 transition-all duration-300 cursor-pointer group">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-electric-500 rounded-full mt-2" />
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        Personalized Assessment
                      </h4>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        We'll evaluate your academic background and career goals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-electric-50 to-violet-50 hover:from-electric-100 hover:to-violet-100 transition-all duration-300 cursor-pointer group">
                    <div className="w-2 h-2 bg-gradient-to-r from-electric-500 to-violet-500 rounded-full mt-2" />
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        University Recommendations
                      </h4>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        Get tailored suggestions based on your profile
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-emerald-50 hover:from-violet-100 hover:to-emerald-100 transition-all duration-300 cursor-pointer group">
                    <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full mt-2" />
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        Application Strategy
                      </h4>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        Develop a comprehensive plan for your applications
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-sunset-50 hover:from-emerald-100 hover:to-sunset-100 transition-all duration-300 cursor-pointer group">
                    <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-sunset-500 rounded-full mt-2" />
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                        Visa Guidance
                      </h4>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                        Understand visa requirements and documentation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={200}>
              <Card className="border-2 border-electric-100 hover:border-electric-200 shadow-xl hover:shadow-2xl hover:shadow-electric-500/20 transition-all duration-500">

                <CardHeader>
                  <CardTitle className="flex items-center bg-gradient-to-r from-electric-600 to-violet-600 bg-clip-text text-transparent">
                    <Clock className="h-5 w-5 mr-2 text-electric-600" />
                    Consultation Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">

                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-electric-50 transition-colors">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-semibold text-gray-800">Video Call / In-Person</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-emerald-50 transition-colors">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-semibold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg hover:bg-violet-50 transition-colors">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-semibold text-violet-600">Within 24 hours</span>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>

          </div>
        </div>
      </div>
    </section>
  )
}
