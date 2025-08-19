import { Timestamp } from 'firebase/firestore';

/**
 * Success Story interface matching the Firestore document structure
 * This mirrors the hard-coded success stories data to ensure zero front-end refactoring
 */
export interface SuccessStory {
  /** Firestore document ID (optional for new documents) */
  id?: string;
  
  /** Student's full name */
  name: string;
  
  /** Destination study country */
  country: string;
  
  /** University name */
  university: string;
  
  /** Study program/field */
  program: string;
  
  /** Success story text (max 500 characters) */
  story: string;
  
  /** URL to student's profile image */
  image: string;
  
  /** Star rating (1-5, typically 5) */
  rating: number;
  
  /** Country flag emoji or country code */
  flag: string;
  
  /** Tailwind CSS gradient class name for visual theming */
  color: string;
  
  /** Document creation timestamp */
  createdAt: Date | Timestamp;
  
  /** Last update timestamp */
  updatedAt: Date | Timestamp;
}

/**
 * Success Story data for Firestore operations (with Timestamp objects)
 */
export interface SuccessStoryFirestore {
  name: string;
  country: string;
  university: string;
  program: string;
  story: string;
  image: string;
  rating: number;
  flag: string;
  color: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Success Story creation data (without timestamps and ID)
 */
export interface CreateSuccessStoryData {
  name: string;
  country: string;
  university: string;
  program: string;
  story: string;
  image: string;
  rating: number;
  flag: string;
  color: string;
}

/**
 * Success Story update data (partial fields, without timestamps)
 */
export interface UpdateSuccessStoryData {
  name?: string;
  country?: string;
  university?: string;
  program?: string;
  story?: string;
  image?: string;
  rating?: number;
  flag?: string;
  color?: string;
}

/**
 * Supported countries for success stories
 */
export const SUPPORTED_COUNTRIES = [
  'Canada',
  'Australia', 
  'UK',
  'USA',
  'Germany',
  'Netherlands',
  'France',
  'Ireland',
  'New Zealand',
  'Sweden',
  'Denmark',
  'Norway',
  'Finland',
] as const;

export type SupportedCountry = typeof SUPPORTED_COUNTRIES[number];

/**
 * Available Tailwind gradient color combinations
 */
export const GRADIENT_COLORS = [
  'from-violet-500 to-violet-600',
  'from-emerald-500 to-emerald-600',
  'from-electric-500 to-electric-600',
  'from-sunset-500 to-sunset-600',
  'from-violet-500 to-electric-500',
  'from-emerald-500 to-sunset-500',
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
] as const;

export type GradientColor = typeof GRADIENT_COLORS[number];
