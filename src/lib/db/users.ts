/**
 * Database utilities for User operations
 * 
 * Dette er "data access layer" - alle database-operasjoner for users samlet på ett sted.
 * Fordeler:
 * - Gjenbrukbar kode
 * - Type-safety med TypeScript
 * - Enkelt å teste
 * - Enkelt å endre database-implementasjon senere
 */

// Firebase Client SDK - brukes på klient-siden (nettleser)
import { db } from '@/lib/firebase'

// Firebase Admin SDK - brukes på server-siden (API routes, serverkomponenter)
// Admin SDK har full tilgang uten å sjekke security rules
import { adminDb } from '@/lib/firebase-admin'

// Firestore funksjoner for å jobbe med dokumenter
import { collection, doc, getDoc, setDoc, updateDoc, DocumentData } from 'firebase/firestore'

/**
 * User interface - definerer strukturen på en bruker
 * 
 * TypeScript interface gir oss type-safety:
 * - IDE auto-complete
 * - Compile-time feilsjekking
 * - Dokumentasjon av datastrukturen
 */
export interface User {
  id: string
  email: string
  displayName?: string // ? betyr optional (kan være undefined)
  createdAt: Date
  updatedAt: Date
}

/**
 * Opprett en ny bruker i Firestore
 * 
 * @param userId - Firebase Auth UID (genereres automatisk av Firebase Auth)
 * @param data - Brukerdata (email, displayName, etc.)
 * 
 * Merk: Partial<User> betyr at vi kan sende inn bare noen av User-feltene
 */
export async function createUser(userId: string, data: Partial<User>) {
  // doc() oppretter en referanse til et spesifikt dokument
  // 'users' er collection-navnet, userId er dokument-ID
  const userRef = doc(db, 'users', userId)
  
  // setDoc() oppretter eller overskriver dokumentet
  await setDoc(userRef, {
    ...data, // Spread operator: kopierer alle felter fra data-objektet
    createdAt: new Date(), // Legger til timestamp for når brukeren ble opprettet
    updatedAt: new Date(),
  })
}

/**
 * Hent en bruker fra Firestore basert på ID
 * 
 * @param userId - Brukerens ID
 * @returns User-objektet eller null hvis ikke funnet
 * 
 * Promise<User | null> betyr at funksjonen returnerer et promise
 * som eventuelt blir til enten User eller null
 */
export async function getUser(userId: string): Promise<User | null> {
  // Hent referanse til bruker-dokumentet
  const userRef = doc(db, 'users', userId)
  
  // getDoc() henter dokumentet fra databasen (async operasjon)
  const userSnap = await getDoc(userRef)
  
  // Sjekk om dokumentet eksisterer
  if (!userSnap.exists()) {
    return null
  }
  
  // Kombiner ID med dokument-data og cast til User type
  // Spread operator kombinerer id og alle data-feltene til ett objekt
  return { id: userSnap.id, ...userSnap.data() } as User
}

/**
 * Oppdater brukerdata
 * 
 * @param userId - Brukerens ID
 * @param data - Feltene som skal oppdateres (bare de du sender inn oppdateres)
 */
export async function updateUser(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId)
  
  // updateDoc() oppdaterer kun de feltene som sendes inn
  // (i motsetning til setDoc som overskriver hele dokumentet)
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date(), // Oppdater timestamp
  })
}

/**
 * Hent bruker med Admin SDK (server-side)
 * 
 * Brukes i API routes hvor vi har admin-tilgang.
 * Admin SDK bruker en annen syntax enn Client SDK (collection().doc() vs doc())
 * 
 * @param userId - Brukerens ID
 * @returns User-objektet eller null
 */
export async function getUserAdmin(userId: string) {
  // Admin SDK syntax: collection().doc().get()
  const userDoc = await adminDb.collection('users').doc(userId).get()
  
  if (!userDoc.exists) {
    return null
  }
  
  return { id: userDoc.id, ...userDoc.data() }
}
