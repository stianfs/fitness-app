// 'use client' directive betyr at denne filen kun kjører på klienten (i nettleseren)
// Dette er nødvendig fordi vi bruker React hooks som useState og useEffect
'use client'

import { useState, useEffect } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { onAuthChange } from '@/lib/auth'

/**
 * Custom React Hook for autentisering
 * 
 * Dette er et "custom hook" - en gjenbrukbar funksjon som bruker React hooks.
 * Den håndterer all auth-logikk slik at vi ikke trenger å duplisere kode i hver komponent.
 * 
 * @returns {object} - { user, loading }
 *   - user: Firebase bruker-objekt (null hvis ikke innlogget)
 *   - loading: boolean som indikerer om vi venter på auth-status
 * 
 * Eksempel bruk:
 *   const { user, loading } = useAuth()
 *   if (loading) return <Spinner />
 *   if (!user) return <Login />
 */
export function useAuth() {
  // useState: Holder tilstand som overlever re-renders
  // user starter som null, oppdateres når Firebase svarer
  const [user, setUser] = useState<FirebaseUser | null>(null)
  
  // loading starter som true, settes til false når vi vet om brukeren er innlogget
  const [loading, setLoading] = useState(true)

  // useEffect: Kjører side-effects (kode som påvirker noe utenfor komponenten)
  // Her: Setter opp en "listener" som lytter på auth-endringer
  useEffect(() => {
    // onAuthChange er en Firebase listener som varsler oss når auth-status endres
    // Den returnerer en "unsubscribe" funksjon vi kan kalle for å stoppe lyttingen
    const unsubscribe = onAuthChange((user) => {
      setUser(user) // Oppdater user state
      setLoading(false) // Vi har fått svar, ikke lenger loading
    })

    // Cleanup function: Kjøres når komponenten unmountes (fjernes fra DOM)
    // Viktig for å unngå memory leaks - stopper lyttingen når komponenten ikke lenger er i bruk
    return () => unsubscribe()
  }, []) // Tom dependency array [] = kjør kun én gang når komponenten mountes

  // Returnerer et objekt med user og loading
  // Dette lar komponenter enkelt få tilgang til auth-status
  return { user, loading }
}
