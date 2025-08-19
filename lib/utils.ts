import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate SEO-friendly slug from university name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim() // Remove leading/trailing whitespace
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Create SEO-friendly slug with additional descriptive terms
export function createUniversitySlug(name: string): string {
  // Create SEO-friendly slug from university name exactly as provided
  // Example: "University of Malaya" -> "university-of-malaya"
  
  return name
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    // Remove multiple consecutive hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
}

// Extract university ID from slug (format: university-name-id) - Legacy support
export function extractIdFromSlug(slug: string): string | null {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  
  // Check if the last part looks like a Firestore document ID (alphanumeric, 20+ chars)
  if (lastPart && lastPart.length >= 15 && /^[a-zA-Z0-9]+$/.test(lastPart)) {
    return lastPart
  }
  
  return null
}
