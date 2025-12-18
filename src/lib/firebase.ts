/**
 * Firebase Client SDK Konfigurasjon
 * 
 * Dette er Firebase-oppsettet for KLIENT-SIDEN (nettleseren).
 * Brukes til:
 * - Autentisering (sign in/sign out)
 * - Firestore database queries fra nettleseren
 * - File upload til Storage
 * 
 * VIKTIG: Client SDK respekterer Firestore Security Rules.
 * Brukere kan bare lese/skrive data de har tilgang til.
 */

// Firebase SDK imports
// Hver import er et separat Firebase-produkt
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

/**
 * Firebase konfigurasjon fra environment variables
 * 
 * NEXT_PUBLIC_ prefix betyr at variabelen er synlig i nettleseren.
 * Disse verdiene kommer fra .env filen (som IKKE er committed til git).
 * 
 * process.env gir oss tilgang til environment variables i Next.js.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

/**
 * Firebase instanser
 * 
 * Vi bruker 'let' i stedet for 'const' fordi vi må initialisere dem
 * betinget (sjekke om Firebase allerede er initialisert).
 * 
 * TypeScript types sikrer at vi bruker riktig type når vi kaller Firebase funksjoner.
 */
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

/**
 * Singleton pattern: Initialiser Firebase bare én gang
 * 
 * getApps() returnerer en liste over allerede initialiserte Firebase apps.
 * Hvis listen er tom, må vi initialisere. Hvis ikke, bruk eksisterende app.
 * 
 * Hvorfor? I Next.js development mode kan moduler lastes flere ganger (hot reload).
 * Vi vil unngå å initialisere Firebase flere ganger, som vil gi error.
 */
if (!getApps().length) {
  // Første gang - initialiser Firebase
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)           // Auth service
  db = getFirestore(app)         // Firestore database
  storage = getStorage(app)      // Cloud Storage
} else {
  // Firebase allerede initialisert - gjenbruk eksisterende app
  app = getApps()[0]
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
}

/**
 * Eksporter Firebase instanser
 * 
 * Andre filer kan nå importere disse:
 *   import { auth, db } from '@/lib/firebase'
 * 
 * Alle bruker samme Firebase-instans (singleton).
 */
export { app, auth, db, storage }
