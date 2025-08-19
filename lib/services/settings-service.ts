import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface CompanySettings {
  id?: string
  // Company Information
  companyName: string
  tagline?: string
  description?: string

  // Main Office
  mainOffice: {
    address: string
    suite?: string
    city: string
    state: string
    postalCode: string
    country: string
  }

  // Regional Offices
  regionalOffices: Array<{
    id: string
    name: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    phone?: string
  }>

  // Contact Information
  contact: {
    phoneNumbers: Array<{
      id: string
      title: string
      number: string
    }>
  }

  // Email Addresses
  emails: {
    general: string
    admissions: string
    support: string
    sales?: string
    careers?: string
  }

  // Business Hours
  businessHours: {
    weekdays: {
      open: string
      close: string
      timezone: string
    }
    saturday: {
      open: string
      close: string
      timezone: string
    }
    sunday: {
      open: string
      close: string
      timezone: string
      closed?: boolean
    }
  }

  // Social Media
  socialMedia: {
    website?: string
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    youtube?: string
  }

  // System Settings
  lastUpdated: Timestamp | Date
  updatedBy?: string
}

export interface SettingsFormData {
  companyName: string
  tagline?: string
  description?: string

  // Main Office
  mainOfficeAddress: string
  mainOfficeSuite?: string
  mainOfficeCity: string
  mainOfficeState: string
  mainOfficePostalCode: string
  mainOfficeCountry: string

  // Contact Information
  phoneNumbers: Array<{
    id: string
    title: string
    number: string
  }>

  // Email Addresses
  generalEmail: string
  admissionsEmail: string
  supportEmail: string
  salesEmail?: string
  careersEmail?: string

  // Business Hours
  weekdayOpen: string
  weekdayClose: string
  saturdayOpen: string
  saturdayClose: string
  sundayOpen: string
  sundayClose: string
  sundayClosed: boolean
  timezone: string

  // Social Media
  website?: string
  facebook?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  youtube?: string
}

// ImgBB Settings
export interface ImgBBSettings {
  apiKey: string;
  enabled: boolean;
  lastUpdated?: Timestamp | Date;
}

const COLLECTION_NAME = 'settings'
const SETTINGS_DOC_ID = 'company-settings'

// Get company settings
export const getCompanySettings = async (): Promise<CompanySettings | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        ...data,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      } as CompanySettings
    }

    return null
  } catch (error) {
    throw new Error('Failed to fetch company settings')
  }
}

// Save company settings
export const saveCompanySettings = async (data: SettingsFormData): Promise<void> => {
  try {
    const settingsData: Omit<CompanySettings, 'id'> = {
      companyName: data.companyName,
      tagline: data.tagline,
      description: data.description,

      mainOffice: {
        address: data.mainOfficeAddress,
        suite: data.mainOfficeSuite,
        city: data.mainOfficeCity,
        state: data.mainOfficeState,
        postalCode: data.mainOfficePostalCode,
        country: data.mainOfficeCountry,
      },

      regionalOffices: [], // Will be managed separately

      contact: {
        phoneNumbers: data.phoneNumbers,
      },

      emails: {
        general: data.generalEmail,
        admissions: data.admissionsEmail,
        support: data.supportEmail,
        sales: data.salesEmail,
        careers: data.careersEmail,
      },

      businessHours: {
        weekdays: {
          open: data.weekdayOpen,
          close: data.weekdayClose,
          timezone: data.timezone,
        },
        saturday: {
          open: data.saturdayOpen,
          close: data.saturdayClose,
          timezone: data.timezone,
        },
        sunday: {
          open: data.sundayOpen,
          close: data.sundayClose,
          timezone: data.timezone,
          closed: data.sundayClosed,
        },
      },

      socialMedia: {
        website: data.website,
        facebook: data.facebook,
        twitter: data.twitter,
        linkedin: data.linkedin,
        instagram: data.instagram,
        youtube: data.youtube,
      },

      lastUpdated: Timestamp.now(),
    }

    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID)
    await setDoc(docRef, settingsData, { merge: true })
  } catch (error) {
    throw new Error('Failed to save company settings')
  }
}

// Get default settings for new installations
export const getDefaultSettings = (): SettingsFormData => {
  return {
    companyName: 'Global Study Hub',
    tagline: 'Your Path to International Education',
    description: 'Empowering students to achieve their international education goals with professional guidance and comprehensive support services.',

    // Main Office
    mainOfficeAddress: '123 Education Avenue',
    mainOfficeSuite: 'Suite 500, Study Center',
    mainOfficeCity: 'Metropolitan City',
    mainOfficeState: 'MC',
    mainOfficePostalCode: '10001',
    mainOfficeCountry: 'Global',

    // Contact Information
    phoneNumbers: [
      {
        id: '1',
        title: 'Main Phone',
        number: '+1 (555) 123-4567'
      },
      {
        id: '2',
        title: 'Student Support',
        number: '+1 (555) 987-6543'
      },
      {
        id: '3',
        title: 'WhatsApp Support',
        number: '+1 (555) 456-7890'
      },
      {
        id: '4',
        title: 'Emergency Line',
        number: '+1 (555) 555-0123'
      }
    ],

    // Email Addresses
    generalEmail: 'info@globalstudyhub.com',
    admissionsEmail: 'admissions@globalstudyhub.com',
    supportEmail: 'support@globalstudyhub.com',
    salesEmail: 'sales@globalstudyhub.com',
    careersEmail: 'careers@globalstudyhub.com',

    // Business Hours
    weekdayOpen: '09:00',
    weekdayClose: '18:00',
    saturdayOpen: '10:00',
    saturdayClose: '16:00',
    sundayOpen: '10:00',
    sundayClose: '14:00',
    sundayClosed: true,
    timezone: 'EST',

    // Social Media
    website: 'https://globalstudyhub.com',
    facebook: 'https://facebook.com/globalstudyhub',
    twitter: 'https://twitter.com/globalstudyhub',
    linkedin: 'https://linkedin.com/company/globalstudyhub',
    instagram: 'https://instagram.com/globalstudyhub',
    youtube: 'https://youtube.com/@globalstudyhub',
  }
}

// Add regional office
export const addRegionalOffice = async (office: Omit<CompanySettings['regionalOffices'][0], 'id'>): Promise<void> => {
  try {
    const settings = await getCompanySettings()
    if (!settings) throw new Error('Settings not found')

    const newOffice = {
      ...office,
      id: Date.now().toString(), // Simple ID generation
    }

    const updatedOffices = [...(settings.regionalOffices || []), newOffice]

    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID)
    await updateDoc(docRef, {
      regionalOffices: updatedOffices,
      lastUpdated: Timestamp.now(),
    })
  } catch (error) {
    throw new Error('Failed to add regional office')
  }
}

// Remove regional office
export const removeRegionalOffice = async (officeId: string): Promise<void> => {
  try {
    const settings = await getCompanySettings()
    if (!settings) throw new Error('Settings not found')

    const updatedOffices = settings.regionalOffices.filter(office => office.id !== officeId)

    const docRef = doc(db, COLLECTION_NAME, SETTINGS_DOC_ID)
    await updateDoc(docRef, {
      regionalOffices: updatedOffices,
      lastUpdated: Timestamp.now(),
    })
  } catch (error) {
    throw new Error('Failed to remove regional office')
  }
}

// Initialize default settings (call this on first setup)
export const initializeDefaultSettings = async (): Promise<void> => {
  try {
    const existingSettings = await getCompanySettings()
    if (existingSettings) {
      return // Settings already exist
    }

    const defaultData = getDefaultSettings()
    await saveCompanySettings(defaultData)
  } catch (error) {
    throw new Error('Failed to initialize default settings')
  }
}

// ImgBB Settings
export const getImgBBSettings = async (): Promise<ImgBBSettings | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, 'imgbb');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        apiKey: data.apiKey || '',
        enabled: data.enabled ?? false,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const saveImgBBSettings = async (settings: ImgBBSettings): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, 'imgbb');
    await setDoc(docRef, {
      ...settings,
      lastUpdated: Timestamp.now(),
    }, { merge: true });
  } catch (error) {
    throw new Error('Failed to save ImgBB settings');
  }
};
