// Migration API endpoint to add slug field to existing universities
// Access this endpoint in admin to run the migration: /api/admin/migrate-slugs

import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { createUniversitySlug } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting university slug migration...')
    
    // Get all universities
    const universitiesRef = collection(db, 'universities')
    const snapshot = await getDocs(universitiesRef)
    
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: 'No universities found in database.',
        updated: 0,
        errors: 0
      })
    }
    
    console.log(`Found ${snapshot.docs.length} universities to update.`)
    
    let successCount = 0
    let errorCount = 0
    const results: Array<{id: string, name: string, slug: string, status: 'success' | 'error', error?: string}> = []
    
    // Update each university with slug
    for (const docSnapshot of snapshot.docs) {
      try {
        const data = docSnapshot.data()
        const universityName = data.name
        
        if (!universityName) {
          const error = `Skipping university ${docSnapshot.id} - no name found`
          console.log(error)
          results.push({
            id: docSnapshot.id,
            name: 'Unknown',
            slug: '',
            status: 'error',
            error
          })
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
        results.push({
          id: docSnapshot.id,
          name: universityName,
          slug,
          status: 'success'
        })
        successCount++
        
      } catch (error) {
        const data = docSnapshot.data()
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error(`❌ Error updating university ${docSnapshot.id}:`, error)
        results.push({
          id: docSnapshot.id,
          name: data?.name || 'Unknown',
          slug: '',
          status: 'error',
          error: errorMessage
        })
        errorCount++
      }
    }
    
    console.log('\n📊 Migration Summary:')
    console.log(`✅ Successfully updated: ${successCount} universities`)
    console.log(`❌ Errors: ${errorCount} universities`)
    console.log('🎉 Migration completed!')
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully',
      updated: successCount,
      errors: errorCount,
      results
    })
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    return NextResponse.json({
      success: false,
      message: 'Migration failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json({
    error: 'Method not allowed. Use POST to run migration.'
  }, { status: 405 })
}
