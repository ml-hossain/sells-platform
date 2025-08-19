import { Timestamp } from 'firebase/firestore';

/**
 * Team Member interface matching the Firestore document structure
 */
export interface TeamMember {
  /** Firestore document ID (optional for new documents) */
  id?: string;
  
  /** Team member's full name */
  name: string;
  
  /** Job title/role */
  role: string;
  
  /** URL to member's profile image */
  image: string;
  
  /** Bio/description of the team member */
  bio: string;
  
  /** Display order (for sorting) */
  order: number;
  
  /** Document creation timestamp */
  createdAt: Date | Timestamp;
  
  /** Last update timestamp */
  updatedAt: Date | Timestamp;
}

/**
 * Team Member data for Firestore operations (with Timestamp objects)
 */
export interface TeamMemberFirestore {
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Team Member creation data (without timestamps and ID)
 */
export interface CreateTeamMemberData {
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
}

/**
 * Team Member update data (partial fields, without timestamps)
 */
export interface UpdateTeamMemberData {
  name?: string;
  role?: string;
  image?: string;
  bio?: string;
  order?: number;
}

/**
 * Team member form data for handling file uploads
 */
export interface TeamMemberFormData {
  name: string;
  role: string;
  image: string | File;
  bio: string;
  order: number;
}
