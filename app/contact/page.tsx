"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2 } from "lucide-react"
import { addContactMessage } from "@/lib/services/contact-service"
import { getCompanySettings, CompanySettings } from "@/lib/services/settings-service"

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(true);
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
      const contactData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string || undefined,
        subject: formData.get('subject') as string,
        message: formData.get('message') as string,
      }

      await addContactMessage(contactData)
      setIsSubmitted(true)
      setLastSubmission(Date.now());
    } catch (err) {
      setError('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Load company settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getCompanySettings()
        setSettings(data)
      } catch (error) {
      } finally {
        setSettingsLoading(false)
      }
    }

    loadSettings()
  }, [])

  return (
    <div className="py-4 sm:py-6 lg:py-8">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Contact Us</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Ready to start your international education journey? Get in touch with our expert consultants today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="order-2 lg:order-1">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">Send us a Message</CardTitle>
              <CardDescription className="text-sm sm:text-base">Fill out the form below and we'll get back to you within 24 hours</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {isSubmitted ? (
                <div className="text-center py-6 sm:py-8">
                  <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4 px-2">
                    Thank you for contacting us. We'll respond within 24 hours.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} className="w-full sm:w-auto">Send Another Message</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                      <Input id="firstName" name="firstName" required className="h-10 sm:h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                      <Input id="lastName" name="lastName" required className="h-10 sm:h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input id="email" name="email" type="email" required className="h-10 sm:h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" className="h-10 sm:h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">Subject *</Label>
                    <Select name="subject" required>
                      <SelectTrigger className="h-10 sm:h-11">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Free Consultation</SelectItem>
                        <SelectItem value="application">Application Assistance</SelectItem>
                        <SelectItem value="visa">Visa Support</SelectItem>
                        <SelectItem value="travel">Travel Services</SelectItem>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us how we can help you..."
                      rows={4}
                      className="min-h-[100px] sm:min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-11 sm:h-12" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            {/* Office Information */}
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Get in Touch</CardTitle>
                <CardDescription className="text-sm sm:text-base">Multiple ways to reach our expert team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 pt-0">
                {settingsLoading ? (
                  <div className="flex items-center justify-center py-6 sm:py-8">
                    <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                    <span className="ml-2 text-sm sm:text-base">Loading contact information...</span>
                  </div>
                ) : (
                  <>
                    {/* Main Office - only show if address is available */}
                    {settings?.mainOffice?.address && (
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold mb-1 text-sm sm:text-base">Main Office</h3>
                          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            {settings.mainOffice.address}
                            <br />
                            {settings.mainOffice.suite && (
                              <>
                                {settings.mainOffice.suite}
                                <br />
                              </>
                            )}
                            {settings.mainOffice.city && settings.mainOffice.state && (
                              <>
                                {settings.mainOffice.city}, {settings.mainOffice.state}
                                {settings.mainOffice.postalCode && ` ${settings.mainOffice.postalCode}`}
                                <br />
                              </>
                            )}
                            {settings.mainOffice.country && settings.mainOffice.country}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Phone Numbers - only show if phone numbers are available */}
                    {settings?.contact?.phoneNumbers && settings.contact.phoneNumbers.length > 0 && (
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold mb-1 text-sm sm:text-base">Phone Numbers</h3>
                          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            {settings.contact.phoneNumbers.map((phone, index) => (
                              <span key={phone.id}>
                                {index > 0 && <br />}
                                <span className="block sm:inline">{phone.title}: </span>
                                {phone.title.toLowerCase().includes('whatsapp') ? (
                                  <a href={`https://wa.me/${phone.number.replace(/[^\d]/g, '')}`} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                                    {phone.number}
                                  </a>
                                ) : phone.title.toLowerCase().includes('fax') ? (
                                  <span>{phone.number}</span>
                                ) : (
                                  <a href={`tel:${phone.number}`} className="text-primary hover:underline">
                                    {phone.number}
                                  </a>
                                )}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Email Addresses - only show if general email is available */}
                    {settings?.emails?.general && (
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold mb-1 text-sm sm:text-base">Email Addresses</h3>
                          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed break-all sm:break-normal">
                            <span className="block sm:inline">General: </span>
                            <a href={`mailto:${settings.emails.general}`} className="text-primary hover:underline">
                              {settings.emails.general}
                            </a>
                            {settings.emails.admissions && (
                              <>
                                <br />
                                <span className="block sm:inline">Admissions: </span>
                                <a href={`mailto:${settings.emails.admissions}`} className="text-primary hover:underline">
                                  {settings.emails.admissions}
                                </a>
                              </>
                            )}
                            {settings.emails.support && (
                              <>
                                <br />
                                <span className="block sm:inline">Support: </span>
                                <a href={`mailto:${settings.emails.support}`} className="text-primary hover:underline">
                                  {settings.emails.support}
                                </a>
                              </>
                            )}
                            {settings.emails.sales && (
                              <>
                                <br />
                                <span className="block sm:inline">Sales: </span>
                                <a href={`mailto:${settings.emails.sales}`} className="text-primary hover:underline">
                                  {settings.emails.sales}
                                </a>
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Office Hours - only show if business hours are available */}
                    {settings?.businessHours?.weekdays?.open && settings?.businessHours?.weekdays?.close && (
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold mb-1 text-sm sm:text-base">Office Hours</h3>
                          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                            <span className="font-medium">Monday - Friday:</span> {settings.businessHours.weekdays.open} - {settings.businessHours.weekdays.close}
                            {settings.businessHours.weekdays.timezone && ` ${settings.businessHours.weekdays.timezone}`}
                            {settings.businessHours.saturday?.open && settings.businessHours.saturday?.close && (
                              <>
                                <br />
                                <span className="font-medium">Saturday:</span> {settings.businessHours.saturday.open} - {settings.businessHours.saturday.close}
                                {settings.businessHours.saturday.timezone && ` ${settings.businessHours.saturday.timezone}`}
                              </>
                            )}
                            {settings.businessHours.sunday && (
                              <>
                                <br />
                                <span className="font-medium">Sunday:</span> {settings.businessHours.sunday.closed ? 'Closed' :
                                  settings.businessHours.sunday.open && settings.businessHours.sunday.close ?
                                    `${settings.businessHours.sunday.open} - ${settings.businessHours.sunday.close}${settings.businessHours.sunday.timezone ? ` ${settings.businessHours.sunday.timezone}` : ''}` :
                                    'Closed'}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Regional Offices */}
            {!settingsLoading && settings?.regionalOffices && settings.regionalOffices.length > 0 && (
              <Card>
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">{settings.regionalOffices.length === 1 ? 'Regional Office' : 'Regional Offices'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {settings.regionalOffices.map((office) => (
                    <div key={office.id} className="border-l-4 border-primary pl-3 sm:pl-4">
                      <h4 className="font-semibold text-sm sm:text-base mb-1">{office.name}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {office.address}, {office.city}, {office.state} {office.postalCode}
                        <br />
                        {office.country}
                        {office.phone && (
                          <>
                            <br />
                            Phone: <a href={`tel:${office.phone}`} className="text-primary hover:underline">{office.phone}</a>
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Map Section - only show if main office address is available */}
        {!settingsLoading && settings?.mainOffice?.address && (
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Find Our Main Office</CardTitle>
                <CardDescription className="text-sm sm:text-base">Visit us at our headquarters{settings.mainOffice.city ? ` in ${settings.mainOffice.city}` : ''}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28986.030690146366!2d90.38098360959506!3d24.752484524430354!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37564f03bd0ef039%3A0x47c8dbe41c589e6e!2sHUAWEI%20Customer%20Service%20Center%2C%20Mymensingh%2C%20Rekha%20Complex.!5e0!3m2!1sen!2smy!4v1754160660442!5m2!1sen!2smy"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
