#!/usr/bin/env node

// Migration script to add slug field to existing universities
// Run this script to update all universities in the database with SEO-friendly slugs

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { createUniversitySlug } from '../lib/utils.js'

// Firebase configuration (same as your main config)
const firebaseConfig = {
  // Add your firebase config here or import it
  // This should match your lib/firebase.ts configuration
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function migrateUniversitySlugs() {
  try {
    console.log('Starting university slug migration...')
    
    // Get all universities
    const universitiesRef = collection(db, 'universities')
    const snapshot = await getDocs(universitiesRef)
    
    if (snapshot.empty) {
      console.log('No universities found in database.')
      return
    }
    
    console.log(`Found ${snapshot.docs.length} universities to update.`)
    
    let successCount = 0
    let errorCount = 0
    
    // Update each university with slug
    for (const docSnapshot of snapshot.docs) {
      try {
        const data = docSnapshot.data()
        const universityName = data.name
        
        if (!universityName) {
          console.log(`Skipping university ${docSnapshot.id} - no name found`)
          errorCount++
          continue
        }
        
        // Generate SEO-friendly slug
        const slug = createUniversitySlug(universityName)
        
        // Update the document
        await updateDoc(doc(db, 'universities', docSnapshot.id), {
          slug: slug,
          updatedAt: new Date()
        })
        
        console.log(`✅ Updated: ${universityName} -> ${slug}`)
        successCount++
        
      } catch (error) {
        console.error(`❌ Error updating university ${docSnapshot.id}:`, error)
        errorCount++
      }
    }
    
    console.log('\n📊 Migration Summary:')
    console.log(`✅ Successfully updated: ${successCount} universities`)
    console.log(`❌ Errors: ${errorCount} universities`)
    console.log('🎉 Migration completed!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
migrateUniversitySlugs()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration script failed:', error)
    process.exit(1)
  })
