/**
 * API Route: /api/workouts
 * 
 * Dette er en Next.js API route - backend endpoint som kjører på serveren.
 * I Next.js 14 App Router bruker vi route handlers med HTTP methods (GET, POST, PUT, DELETE).
 * 
 * Denne filen håndterer:
 * - GET /api/workouts - Hent alle workouts for innlogget bruker
 * - POST /api/workouts - Opprett ny workout
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

/**
 * Hjelpefunksjon: Hent bruker fra request via JWT token
 * 
 * Autentiseringsflyt:
 * 1. Klient sender JWT token i Authorization header
 * 2. Vi henter token fra header
 * 3. Firebase Admin SDK verifiserer token
 * 4. Hvis gyldig, får vi brukerinfo tilbake
 * 
 * @param request - Next.js request object
 * @returns Decoded token (med user info) eller null hvis ugyldig
 */
async function getUserFromRequest(request: NextRequest) {
  // Hent Authorization header (format: "Bearer <token>")
  const authHeader = request.headers.get('authorization')
  
  // Sjekk om header eksisterer og har riktig format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  // Splitt "Bearer <token>" og hent token-delen
  const token = authHeader.split('Bearer ')[1]
  
  try {
    // Firebase Admin SDK verifiserer token og dekoder brukerinfo
    // Hvis token er ugyldig/utløpt, kastes en error
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    // Token er ugyldig - returner null
    return null
  }
}

/**
 * GET /api/workouts
 * 
 * Henter alle workouts for innlogget bruker.
 * Dette er en "protected route" - krever autentisering.
 * 
 * HTTP Status codes:
 * - 200: Success - returnerer liste med workouts
 * - 401: Unauthorized - ikke innlogget eller ugyldig token
 * - 500: Server error - noe gikk galt på serveren
 */
export async function GET(request: NextRequest) {
  try {
    // Verifiser at brukeren er autentisert
    const user = await getUserFromRequest(request)
    
    // Hvis ikke autentisert, returner 401 Unauthorized
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Firestore query: Hent alle workouts hvor userId matcher innlogget bruker
    // .where() = filtrer på felt
    // .orderBy() = sorter resultatene (nyeste først)
    // .get() = kjør query og hent data
    const workoutsSnapshot = await adminDb
      .collection('workouts')
      .where('userId', '==', user.uid) // Kun brukerens egne workouts (sikkerhet!)
      .orderBy('createdAt', 'desc') // Sorter med nyeste først
      .get()

    // .map() transformerer hvert dokument til et objekt
    // Kombinerer dokument-ID med data
    const workouts = workoutsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(), // Spread: kopierer alle felter fra dokumentet
    }))

    // Returner JSON response med workouts
    // NextResponse.json() setter riktige headers automatisk
    return NextResponse.json({ workouts })
  } catch (error: any) {
    // Logg error til server console (for debugging)
    console.error('Get workouts error:', error)
    
    // Returner 500 Server Error til klient
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workouts' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/workouts
 * 
 * Oppretter en ny workout for innlogget bruker.
 * 
 * Request body (JSON):
 * {
 *   name: string,
 *   type: string,
 *   duration: number,
 *   calories?: number,
 *   notes?: string
 * }
 * 
 * HTTP Status codes:
 * - 200: Success - workout opprettet
 * - 400: Bad Request - manglende eller ugyldig data
 * - 401: Unauthorized - ikke autentisert
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Verifiser autentisering
    const user = await getUserFromRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse JSON body fra request
    // await request.json() leser request body og parser JSON
    const data = await request.json()
    
    // Destructuring: hent ut spesifikke felter fra data-objektet
    const { name, type, duration, calories, notes } = data

    // Validering: Sjekk at påkrevde felter er til stede
    // I produksjon ville vi brukt et validerings-library som Zod
    if (!name || !type || !duration) {
      return NextResponse.json(
        { error: 'Name, type, and duration are required' },
        { status: 400 } // 400 = Bad Request
      )
    }

    // Opprett nytt dokument i 'workouts' collection
    // .add() genererer automatisk en unik ID
    const workoutRef = await adminDb.collection('workouts').add({
      userId: user.uid, // Koble workout til brukeren (viktig for sikkerhet!)
      name,
      type,
      duration,
      calories: calories || null, // Fallback til null hvis ikke oppgitt
      notes: notes || '', // Fallback til tom string
      createdAt: new Date(), // Server timestamp
    })

    // Returner success med den nye workout-ID'en
    return NextResponse.json({
      success: true,
      workoutId: workoutRef.id,
    })
  } catch (error: any) {
    console.error('Create workout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create workout' },
      { status: 500 }
    )
  }
}
