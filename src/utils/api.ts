/**
 * Frontend API Client Utilities
 * 
 * Disse funksjonene brukes på klient-siden (nettleser) for å kommunisere med backend API.
 * Håndterer automatisk autentisering via JWT tokens.
 */

/**
 * Fetch med automatisk autentisering
 * 
 * Dette er en wrapper rundt native fetch() som automatisk:
 * 1. Henter JWT token fra innlogget bruker
 * 2. Legger token i Authorization header
 * 3. Håndterer errors
 * 
 * @param url - API endpoint (f.eks. '/api/workouts')
 * @param options - Standard fetch options (method, body, etc.)
 * @returns Parsed JSON response
 * @throws Error hvis ikke autentisert eller request feiler
 * 
 * Eksempel:
 *   const data = await fetchWithAuth('/api/workouts', {
 *     method: 'POST',
 *     body: JSON.stringify({ name: 'Løpetur' })
 *   })
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Dynamic import: Laster Firebase Auth bare når funksjonen kalles
  // Dette reduserer initial bundle size (code splitting)
  const auth = await import('firebase/auth')
  const { auth: firebaseAuth } = await import('@/lib/firebase')
  
  // Hent nåværende innlogget bruker fra Firebase Auth
  // currentUser er null hvis ikke innlogget
  const user = auth.getAuth().currentUser
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  // getIdToken() henter JWT token fra Firebase
  // Dette er token'et vi sender til backend for å bevise hvem vi er
  const token = await user.getIdToken()

  // Kombiner headers: eksisterende headers + auth + content-type
  const headers = {
    ...options.headers, // Spread: behold eksisterende headers
    'Authorization': `Bearer ${token}`, // JWT token i standard format
    'Content-Type': 'application/json',
  }

  // Utfør HTTP request med native fetch()
  const response = await fetch(url, {
    ...options, // Spread: method, body, etc.
    headers, // Overstyr headers med våre autentiserte headers
  })

  // Sjekk om request var vellykket (status 200-299)
  if (!response.ok) {
    // Parse error message fra backend
    const error = await response.json()
    throw new Error(error.message || 'Request failed')
  }

  // Parse og returner JSON response
  return response.json()
}

/**
 * Opprett en ny workout
 * 
 * Dette er et "convenience function" - en hjelpefunksjon som gjør API-kall enklere.
 * I stedet for å skrive fetch() + headers + JSON.stringify hver gang,
 * kan vi bare kalle createWorkout() med data.
 * 
 * @param data - Workout data (name, type, duration, etc.)
 * @returns Promise med response fra backend
 * 
 * Eksempel:
 *   await createWorkout({
 *     name: 'Morgenløp',
 *     type: 'Cardio',
 *     duration: 30
 *   })
 */
export async function createWorkout(data: {
  name: string
  type: string
  duration: number
  calories?: number
  notes?: string
}) {
  // POST request til /api/workouts
  // fetchWithAuth håndterer auth automatisk
  return fetchWithAuth('/api/workouts', {
    method: 'POST',
    body: JSON.stringify(data), // Konverter JS-objekt til JSON string
  })
}

/**
 * Hent alle workouts for innlogget bruker
 * 
 * GET request uten body - henter data fra backend.
 * Backend filtrerer automatisk på innlogget bruker (via JWT token).
 * 
 * @returns Promise med liste av workouts
 */
export async function getWorkouts() {
  // GET er default method, så vi trenger ikke spesifisere det
  return fetchWithAuth('/api/workouts')
}

/**
 * Oppdater en eksisterende workout
 * 
 * PUT request - erstatter workout-data med ny data.
 * 
 * @param id - Workout ID
 * @param data - Oppdatert workout data
 * @returns Promise med response fra backend
 */
export async function updateWorkout(id: string, data: any) {
  // Template literal: `${id}` setter inn ID i URL
  return fetchWithAuth(`/api/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/**
 * Slett en workout
 * 
 * DELETE request - fjerner workout fra database.
 * 
 * @param id - Workout ID
 * @returns Promise med response fra backend
 */
export async function deleteWorkout(id: string) {
  return fetchWithAuth(`/api/workouts/${id}`, {
    method: 'DELETE',
  })
}
