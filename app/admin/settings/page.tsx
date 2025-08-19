"use client"

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Building2,
  Phone,
  Mail,
  Clock,
  Globe,
  MapPin,
  Save,
  Loader2,
  CheckCircle,
  Plus,
  Trash2,
  Send,
  Bot,
  AlertCircle,
  Image
} from 'lucide-react'
import {
  getCompanySettings,
  saveCompanySettings,
  getDefaultSettings,
  addRegionalOffice,
  removeRegionalOffice,
  SettingsFormData,
  CompanySettings,
  getImgBBSettings,
  saveImgBBSettings,
  ImgBBSettings
} from '@/lib/services/settings-service'
import { toast } from '@/hooks/use-toast'
import {
  getTelegramSettings,
  saveTelegramSettings,
  testTelegramConnection,
  TelegramSettings
} from '@/lib/services/telegram-service'

// Validation schema
const settingsSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  tagline: z.string().optional(),
  description: z.string().optional(),

  // Main Office
  mainOfficeAddress: z.string().min(1, "Address is required"),
  mainOfficeSuite: z.string().optional(),
  mainOfficeCity: z.string().min(1, "City is required"),
  mainOfficeState: z.string().min(1, "State is required"),
  mainOfficePostalCode: z.string().min(1, "Postal code is required"),
  mainOfficeCountry: z.string().min(1, "Country is required"),

  // Contact Information
  phoneNumbers: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    number: z.string().min(1, "Phone number is required")
  })).min(1, "At least one phone number is required"),

  // Email Addresses
  generalEmail: z.string().email("Invalid email address"),
  admissionsEmail: z.string().email("Invalid email address"),
  supportEmail: z.string().email("Invalid email address"),
  salesEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  careersEmail: z.string().email("Invalid email address").optional().or(z.literal("")),

  // Business Hours
  weekdayOpen: z.string().min(1, "Opening time is required"),
  weekdayClose: z.string().min(1, "Closing time is required"),
  saturdayOpen: z.string().min(1, "Opening time is required"),
  saturdayClose: z.string().min(1, "Closing time is required"),
  sundayOpen: z.string().min(1, "Opening time is required"),
  sundayClose: z.string().min(1, "Closing time is required"),
  sundayClosed: z.boolean(),
  timezone: z.string().min(1, "Timezone is required"),

  // Social Media
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtube: z.string().url("Invalid URL").optional().or(z.literal("")),
})

function AdminSettingsPageContent() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [newOffice, setNewOffice] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  })


  // Telegram state
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettings | null>(null)
  const [telegramLoading, setTelegramLoading] = useState(true)
  const [telegramSaving, setTelegramSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [telegramForm, setTelegramForm] = useState({
    botToken: '',
    chatId: '',
    enabled: false
  })

  // ImgBB state
  const [imgBBSettings, setImgBBSettings] = useState<ImgBBSettings | null>(null)
  const [imgBBLoading, setImgBBLoading] = useState(true)
  const [imgBBSaving, setImgBBSaving] = useState(false)
  const [imgBBTesting, setImgBBTesting] = useState(false)
  const [imgBBForm, setImgBBForm] = useState({
    apiKey: '',
    enabled: false
  })

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: getDefaultSettings()
  })

  useEffect(() => {
    loadSettings()
    loadTelegramSettings()
    loadImgBBSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await getCompanySettings()

      if (data) {
        setSettings(data)
        // Convert settings to form data
        const formData: SettingsFormData = {
          companyName: data.companyName,
          tagline: data.tagline,
          description: data.description,

          // Main Office
          mainOfficeAddress: data.mainOffice.address,
          mainOfficeSuite: data.mainOffice.suite,
          mainOfficeCity: data.mainOffice.city,
          mainOfficeState: data.mainOffice.state,
          mainOfficePostalCode: data.mainOffice.postalCode,
          mainOfficeCountry: data.mainOffice.country,

          // Contact Information
          phoneNumbers: data.contact.phoneNumbers || [],

          // Email Addresses
          generalEmail: data.emails.general,
          admissionsEmail: data.emails.admissions,
          supportEmail: data.emails.support,
          salesEmail: data.emails.sales,
          careersEmail: data.emails.careers,

          // Business Hours
          weekdayOpen: data.businessHours.weekdays.open,
          weekdayClose: data.businessHours.weekdays.close,
          saturdayOpen: data.businessHours.saturday.open,
          saturdayClose: data.businessHours.saturday.close,
          sundayOpen: data.businessHours.sunday.open,
          sundayClose: data.businessHours.sunday.close,
          sundayClosed: data.businessHours.sunday.closed || false,
          timezone: data.businessHours.weekdays.timezone,

          // Social Media
          website: data.socialMedia.website,
          facebook: data.socialMedia.facebook,
          twitter: data.socialMedia.twitter,
          linkedin: data.socialMedia.linkedin,
          instagram: data.socialMedia.instagram,
          youtube: data.socialMedia.youtube,
        }

        form.reset(formData)
      } else {
        // Use default settings if none exist
        form.reset(getDefaultSettings())
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings. Using defaults.",
        variant: "destructive",
      })
      form.reset(getDefaultSettings())
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: SettingsFormData) => {
    setSaving(true)

    try {
      // Validate that at least one phone number is required
      if (!data.phoneNumbers || data.phoneNumbers.length === 0) {
        toast({
          title: "Error",
          description: "At least one phone number is required.",
          variant: "destructive",
        })
        setSaving(false)
        return
      }



      await saveCompanySettings(data)

      toast({
        title: "Success",
        description: "Settings saved successfully!",
      })

      // Reload settings to get updated data
      await loadSettings()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddRegionalOffice = async () => {
    if (!newOffice.name || !newOffice.address || !newOffice.city) {
      toast({
        title: "Error",
        description: "Please fill in required fields (name, address, city).",
        variant: "destructive",
      })
      return
    }

    try {
      await addRegionalOffice(newOffice)
      setNewOffice({
        name: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        phone: ''
      })
      await loadSettings() // Reload to show new office
      toast({
        title: "Success",
        description: "Regional office added successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add regional office.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveRegionalOffice = async (officeId: string) => {
    try {
      await removeRegionalOffice(officeId)
      await loadSettings() // Reload to show updated list
      toast({
        title: "Success",
        description: "Regional office removed successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove regional office.",
        variant: "destructive",
      })
    }
  }


  // Telegram functions
  const loadTelegramSettings = async () => {
    try {
      setTelegramLoading(true)
      const data = await getTelegramSettings()

      if (data) {
        setTelegramSettings(data)
        setTelegramForm({
          botToken: data.botToken || '',
          chatId: data.chatId || '',
          enabled: data.enabled
        })
      } else {
        // Default settings
        setTelegramForm({
          botToken: '',
          chatId: '',
          enabled: false
        })
      }
    } catch (error) {
    } finally {
      setTelegramLoading(false)
    }
  }

  const handleTelegramSave = async () => {
    setTelegramSaving(true)

    try {
      await saveTelegramSettings({
        botToken: telegramForm.botToken,
        chatId: telegramForm.chatId,
        enabled: telegramForm.enabled
      })

      toast({
        title: "Success",
        description: "Telegram settings saved successfully!",
      })

      await loadTelegramSettings()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Telegram settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setTelegramSaving(false)
    }
  }

  const handleTestConnection = async () => {
    if (!telegramForm.botToken || !telegramForm.chatId) {
      toast({
        title: "Error",
        description: "Bot Token and Chat ID are required for testing.",
        variant: "destructive",
      })
      return
    }

    setTesting(true)

    try {
      // First save the current settings temporarily for the test
      await saveTelegramSettings({
        botToken: telegramForm.botToken,
        chatId: telegramForm.chatId,
        enabled: telegramForm.enabled
      })

      // Test the connection using the API route
      const response = await fetch('/api/telegram/send', {
        method: 'GET', // GET method for test endpoint
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Test Failed",
          description: result.error || "Failed to send test message",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test connection. Please check your settings.",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  // ImgBB functions
  const loadImgBBSettings = async () => {
    try {
      setImgBBLoading(true)
      const data = await getImgBBSettings()

      if (data) {
        setImgBBSettings(data)
        setImgBBForm({
          apiKey: data.apiKey || '',
          enabled: data.enabled
        })
      } else {
        // Default settings
        setImgBBForm({
          apiKey: '',
          enabled: false
        })
      }
    } catch (error) {
    } finally {
      setImgBBLoading(false)
    }
  }

  const handleImgBBSave = async () => {
    setImgBBSaving(true)

    try {
      await saveImgBBSettings({
        apiKey: imgBBForm.apiKey,
        enabled: imgBBForm.enabled
      })

      toast({
        title: "Success",
        description: "ImgBB settings saved successfully!",
      })

      await loadImgBBSettings()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save ImgBB settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setImgBBSaving(false)
    }
  }

  const handleImgBBTestConnection = async () => {
    if (!imgBBForm.apiKey) {
      toast({
        title: "Error",
        description: "API Key is required for testing.",
        variant: "destructive",
      })
      return
    }

    setImgBBTesting(true)

    try {
      // First save the current settings temporarily for the test
      await saveImgBBSettings({
        apiKey: imgBBForm.apiKey,
        enabled: imgBBForm.enabled
      })

      // Test the connection using the API route
      const response = await fetch('/api/upload/image', {
        method: 'GET', // GET method for test endpoint
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          title: "Test Failed",
          description: result.error || "Failed to test ImgBB connection",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to test connection. Please check your settings.",
        variant: "destructive",
      })
    } finally {
      setImgBBTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage company information and contact details</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <Tabs defaultValue="company" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-7 h-auto">
              <TabsTrigger value="company" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Company</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="location" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Location</span>
              </TabsTrigger>
              <TabsTrigger value="hours" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Hours</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="telegram" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Telegram</span>
              </TabsTrigger>
              <TabsTrigger value="imgbb" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
                <Image className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">ImgBB</span>
              </TabsTrigger>
            </TabsList>

            {/* Company Information */}
            <TabsContent value="company">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Company Information</CardTitle>
                  <CardDescription className="text-sm">Basic information about your company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="NextGen EduMigrate" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Gateway to Global Education" {...field} />
                        </FormControl>
                        <FormDescription>A brief tagline or slogan</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Empowering students to achieve their international education dreams..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>A brief description of your company</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Information */}
            <TabsContent value="contact">
              <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Phone Numbers</CardTitle>
                    <CardDescription className="text-sm">Company phone contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                    {(!form.watch('phoneNumbers') || form.watch('phoneNumbers')?.length === 0) && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No phone numbers added yet</p>
                        <p className="text-sm">Click "Add Phone Number" to get started</p>
                      </div>
                    )}
                    {form.watch('phoneNumbers')?.map((phone, index) => (
                      <div key={phone.id} className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Phone {index + 1}</h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const currentPhones = form.getValues('phoneNumbers') || []
                              const updatedPhones = currentPhones.filter((_, i) => i !== index)
                              form.setValue('phoneNumbers', updatedPhones)
                            }}
                            disabled={form.watch('phoneNumbers')?.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          <FormField
                            control={form.control}
                            name={`phoneNumbers.${index}.title`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Main Phone, WhatsApp, Fax" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`phoneNumbers.${index}.number`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 (555) 123-4567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />


                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const currentPhones = form.getValues('phoneNumbers') || []
                        const newPhone = {
                          id: Date.now().toString(),
                          title: '',
                          number: ''
                        }
                        form.setValue('phoneNumbers', [...currentPhones, newPhone])
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Phone Number
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Email Addresses</CardTitle>
                    <CardDescription className="text-sm">Company email contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                    <FormField
                      control={form.control}
                      name="generalEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>General Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="admissionsEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admissions Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="admissions@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supportEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Support Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="support@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salesEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sales Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="sales@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="careersEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Careers Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="careers@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Location Information */}
            <TabsContent value="location">
              <div className="space-y-4 sm:space-y-6">
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Main Office</CardTitle>
                    <CardDescription className="text-sm">Primary business location</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                    <FormField
                      control={form.control}
                      name="mainOfficeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Education Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mainOfficeSuite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suite/Unit</FormLabel>
                          <FormControl>
                            <Input placeholder="Suite 456" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="mainOfficeCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mainOfficeState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province *</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="mainOfficePostalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code *</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mainOfficeCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country *</FormLabel>
                            <FormControl>
                              <Input placeholder="United States" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Regional Offices */}
                <Card>
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Regional Offices</CardTitle>
                    <CardDescription className="text-sm">Additional office locations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                    {settings?.regionalOffices?.map((office) => (
                      <div key={office.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{office.name}</h4>
                          <p className="text-sm text-muted-foreground break-words">
                            {office.address}, {office.city}, {office.state} {office.postalCode}
                          </p>
                          {office.phone && (
                            <p className="text-sm text-muted-foreground">Phone: {office.phone}</p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveRegionalOffice(office.id)}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4 sm:mr-2" />
                          <span className="sm:inline hidden">Remove</span>
                        </Button>
                      </div>
                    ))}

                    <div className="grid gap-4 p-4 border rounded-lg bg-muted/50">
                      <h4 className="font-semibold">Add New Regional Office</h4>
                      <div className="grid gap-4">
                        <Input
                          placeholder="Office Name"
                          value={newOffice.name}
                          onChange={(e) => setNewOffice({ ...newOffice, name: e.target.value })}
                        />
                        <Input
                          placeholder="Address"
                          value={newOffice.address}
                          onChange={(e) => setNewOffice({ ...newOffice, address: e.target.value })}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            placeholder="City"
                            value={newOffice.city}
                            onChange={(e) => setNewOffice({ ...newOffice, city: e.target.value })}
                          />
                          <Input
                            placeholder="State"
                            value={newOffice.state}
                            onChange={(e) => setNewOffice({ ...newOffice, state: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            placeholder="Postal Code"
                            value={newOffice.postalCode}
                            onChange={(e) => setNewOffice({ ...newOffice, postalCode: e.target.value })}
                          />
                          <Input
                            placeholder="Country"
                            value={newOffice.country}
                            onChange={(e) => setNewOffice({ ...newOffice, country: e.target.value })}
                          />
                        </div>
                        <Input
                          placeholder="Phone (optional)"
                          value={newOffice.phone}
                          onChange={(e) => setNewOffice({ ...newOffice, phone: e.target.value })}
                        />
                        <Button type="button" onClick={handleAddRegionalOffice}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Office
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Business Hours */}
            <TabsContent value="hours">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Business Hours</CardTitle>
                  <CardDescription className="text-sm">Set your operating hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone *</FormLabel>
                        <FormControl>
                          <Input placeholder="EST" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h4 className="font-semibold">Monday - Friday</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="weekdayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opening Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weekdayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Closing Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Saturday</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="saturdayOpen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opening Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="saturdayClose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Closing Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Sunday</h4>
                    <FormField
                      control={form.control}
                      name="sundayClosed"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Closed on Sunday</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {!form.watch('sundayClosed') && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="sundayOpen"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Opening Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="sundayClose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Closing Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Social Media */}
            <TabsContent value="social">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Social Media & Web</CardTitle>
                  <CardDescription className="text-sm">Online presence and social media links</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://facebook.com/company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input placeholder="https://twitter.com/company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/company/company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/company" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/@company" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Telegram */}
            <TabsContent value="telegram">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Telegram Notifications</CardTitle>
                  <CardDescription className="text-sm">Configure Telegram bot to receive form submission notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  {telegramLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading Telegram settings...</span>
                    </div>
                  ) : (
                    <>
                      {/* Enable/Disable Toggle */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label className="font-semibold">Enable Telegram Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive instant notifications when someone submits a form
                          </p>
                        </div>
                        <Checkbox
                          checked={telegramForm.enabled}
                          onCheckedChange={(checked) =>
                            setTelegramForm({ ...telegramForm, enabled: checked as boolean })
                          }
                        />
                      </div>

                      {/* Bot Configuration */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="botToken">Bot Token *</Label>
                          <Input
                            id="botToken"
                            type="password"
                            placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                            value={telegramForm.botToken}
                            onChange={(e) =>
                              setTelegramForm({ ...telegramForm, botToken: e.target.value })
                            }
                            disabled={!telegramForm.enabled}
                          />
                          <p className="text-sm text-muted-foreground">
                            Get this from @BotFather on Telegram
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="chatId">Chat ID *</Label>
                          <Input
                            id="chatId"
                            placeholder="-1001234567890 or 123456789"
                            value={telegramForm.chatId}
                            onChange={(e) =>
                              setTelegramForm({ ...telegramForm, chatId: e.target.value })
                            }
                            disabled={!telegramForm.enabled}
                          />
                          <p className="text-sm text-muted-foreground">
                            Your chat/group ID where notifications will be sent
                          </p>
                        </div>
                      </div>

                      {/* Setup Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h4>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                          <li>Create a bot by messaging @BotFather on Telegram</li>
                          <li>Send /newbot and follow the instructions</li>
                          <li>Copy the bot token and paste it above</li>
                          <li>Add the bot to your chat/group</li>
                          <li>Get your chat ID using tools like @userinfobot</li>
                          <li>Test the connection using the button below</li>
                        </ol>
                      </div>

                      {/* Current Status */}
                      {telegramSettings && (
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Current Status</h4>
                          <div className="flex items-center space-x-2">
                            {telegramSettings.enabled ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600">Telegram notifications are enabled</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                <span className="text-sm text-orange-600">Telegram notifications are disabled</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                          type="button"
                          onClick={handleTelegramSave}
                          disabled={telegramSaving}
                          className="flex-1"
                        >
                          {telegramSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Telegram Settings
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleTestConnection}
                          disabled={testing || !telegramForm.botToken || !telegramForm.chatId}
                          className="flex-1 sm:flex-none"
                        >
                          {testing ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Test Connection
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ImgBB */}
            <TabsContent value="imgbb">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">ImgBB Integration</CardTitle>
                  <CardDescription className="text-sm">Configure ImgBB for image hosting and embedding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                  {imgBBLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading ImgBB settings...</span>
                    </div>
                  ) : (
                    <>
                      {/* Enable/Disable Toggle */}
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label className="font-semibold">Enable ImgBB Integration</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable or disable ImgBB image hosting and embedding.
                          </p>
                        </div>
                        <Checkbox
                          checked={imgBBForm.enabled}
                          onCheckedChange={(checked) =>
                            setImgBBForm({ ...imgBBForm, enabled: checked as boolean })
                          }
                        />
                      </div>

                      {/* API Key Configuration */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key *</Label>
                          <Input
                            id="apiKey"
                            type="password"
                            placeholder="Your ImgBB API Key"
                            value={imgBBForm.apiKey}
                            onChange={(e) =>
                              setImgBBForm({ ...imgBBForm, apiKey: e.target.value })
                            }
                            disabled={!imgBBForm.enabled}
                          />
                          <p className="text-sm text-muted-foreground">
                            Get your API key from your ImgBB account settings.
                          </p>
                        </div>
                      </div>

                      {/* Setup Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Setup Instructions:</h4>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                          <li>Sign up for an account at <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline">ImgBB</a></li>
                          <li>Get your API key from your account dashboard.</li>
                          <li>Copy the API key and paste it above.</li>
                          <li>Test the connection using the button below.</li>
                        </ol>
                      </div>

                      {/* Current Status */}
                      {imgBBSettings && (
                        <div className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Current Status</h4>
                          <div className="flex items-center space-x-2">
                            {imgBBSettings.enabled ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600">ImgBB integration is enabled</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                <span className="text-sm text-orange-600">ImgBB integration is disabled</span>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                          type="button"
                          onClick={handleImgBBSave}
                          disabled={imgBBSaving}
                          className="flex-1"
                        >
                          {imgBBSaving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save ImgBB Settings
                            </>
                          )}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleImgBBTestConnection}
                          disabled={imgBBTesting || !imgBBForm.apiKey}
                          className="flex-1 sm:flex-none"
                        >
                          {imgBBTesting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Testing...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Test Connection
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <Card>
            <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
              <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="min-w-[120px] w-full sm:w-auto">
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  )
}

// Wrap with dynamic import to prevent hydration issues
const AdminSettingsPage = dynamic(() => Promise.resolve(AdminSettingsPageContent), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    </div>
  )
})

export default AdminSettingsPage
