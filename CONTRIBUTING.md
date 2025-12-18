# Bidragsguide

## Utviklingsworkflow

### Oppsett

1. Fork repository
2. Clone din fork
3. Installer dependencies: `npm install`
4. Opprett `.env` basert på `.env.example`
5. Start dev-server: `npm run dev`

### Code Style

- **TypeScript**: Bruk eksplisitte typer hvor det er hensiktsmessig
- **Formattering**: Følg eksisterende kode-stil
- **Komponenter**: En komponent per fil
- **Naming**: 
  - Komponenter: PascalCase (`BookingCard.tsx`)
  - Utility functions: camelCase (`formatDate.ts`)
  - Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)

### Commit-meldinger

Følg Conventional Commits:

```
feat: legg til booking-funksjonalitet
fix: rett opp auth-feil ved utlogging
docs: oppdater README med setup-instruksjoner
style: formatér kode i dashboard-komponenter
refactor: forenkle auth-logikk
test: legg til tester for booking-service
```

### Pull Requests

1. Opprett en feature branch: `git checkout -b feature/booking-system`
2. Gjør endringer og commit
3. Push til din fork
4. Opprett PR med beskrivelse av endringene

### Testing

Før du sender inn PR:

```bash
# Type-sjekk
npm run type-check

# Linting
npm run lint

# Build-test
npm run build
```

## Prosjektstruktur

```
src/
├── app/              # Next.js pages (App Router)
├── components/       # React komponenter
│   ├── ui/          # Basis UI-komponenter
│   ├── auth/        # Auth-relaterte komponenter
│   ├── dashboard/   # Dashboard-komponenter
│   └── ...
├── lib/             # Utilities og hjelpefunksjoner
├── types/           # TypeScript type definitions
└── styles/          # Globale styles
```

## Nye funksjoner

### Legg til ny side

1. Opprett fil i `src/app/[side-navn]/page.tsx`
2. Bruk eksisterende layout eller opprett ny
3. Legg til navigasjon i relevante komponenter

### Legg til ny UI-komponent

1. Opprett komponent i `src/components/ui/`
2. Følg mønsteret fra eksisterende komponenter
3. Eksporter fra komponenten

### Legg til database-modell

1. Definer TypeScript interface i `src/types/index.ts`
2. Opprett Firestore collection
3. Implementer CRUD-funksjoner i `src/lib/`

## Kodeeksempler

### Ny side med autentisering

```typescript
'use client'

import { useEffect, useState } from 'react'
import { onAuthChange } from '@/lib/auth'
import { User } from 'firebase/auth'

export default function MinSide() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthChange(setUser)
    return () => unsubscribe()
  }, [])

  if (!user) return <div>Loading...</div>

  return <div>Innhold...</div>
}
```

### Firestore data-henting

```typescript
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function getBookings(userId: string) {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
```

## Spørsmål?

Åpne et issue hvis du har spørsmål eller forslag!
