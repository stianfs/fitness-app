/**
 * Firebase Admin SDK Konfigurasjon
 * 
 * Dette er Firebase-oppsettet for SERVER-SIDEN (API routes, serverkomponenter).
 * 
 * VIKTIG FORSKJELL fra Client SDK:
 * - Admin SDK har FULL tilgang til databasen (bypasser Security Rules)
 * - Brukes kun på serveren (aldri i nettleseren)
 * - Krever service account credentials (private key)
 * 
 * Brukes til:
 * - Server-side autentisering (verifisere JWT tokens)
 * - Database operasjoner med admin-rettigheter
 * - Opprette brukere programmatisk
 */

import * as admin from 'firebase-admin'

/**
 * Singleton pattern: Initialiser Firebase Admin bare én gang
 * 
 * admin.apps.length sjekker om Firebase Admin allerede er initialisert.
 * I Next.js kan API routes re-initialisere på hver request i development,
 * så vi må sikre at vi bare initialiserer én gang.
 */
if (!admin.apps.length) {
  admin.initializeApp({
    // Service Account credentials fra environment variables
    // Disse er HEMMELIGE og må ALDRI committes til git eller eksponeres i nettleseren
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Private key kommer fra .env med escaped newlines (\n)
      // .replace() konverterer \\n til faktiske newlines
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

/**
 * Eksporter Admin services
 * 
 * adminAuth - Autentisering (verifiser tokens, opprette brukere)
 * adminDb - Firestore database med full admin-tilgang
 * 
 * SIKKERHET: Disse må KUN brukes på server-side!
 * Aldri importer disse i filer med 'use client' directive.
 */
export const adminAuth = admin.auth()
export const adminDb = admin.firestore()

// Default export for full admin SDK tilgang
export default admin
