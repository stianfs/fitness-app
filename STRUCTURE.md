# Prosjektstruktur

Dette dokumentet beskriver den forbedrede strukturen for fitness-appen.

## 📁 Mappestruktur

```
src/
├── app/                    # Next.js App Router (Frontend pages + Backend API)
│   ├── (auth)/            # Route group: Auth pages
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/         # Dashboard side
│   ├── workouts/          # Workouts side
│   ├── classes/           # Classes side
│   ├── bookings/          # Bookings side
│   ├── profile/           # Profile side
│   ├── api/               # Backend API endpoints
│   │   ├── auth/
│   │   │   └── signup/    # POST /api/auth/signup
│   │   └── workouts/
│   │       ├── route.ts   # GET/POST /api/workouts
│   │       └── [id]/      # GET/PUT/DELETE /api/workouts/:id
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Hjemmeside
│
├── components/            # React komponenter (Frontend)
│   ├── ui/               # Generiske UI komponenter
│   ├── auth/             # Auth-relaterte komponenter
│   ├── dashboard/        # Dashboard widgets
│   ├── workouts/         # Workout komponenter
│   ├── classes/          # Class komponenter
│   └── bookings/         # Booking komponenter
│
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   └── index.ts          # Hook exports
│
├── lib/                  # Backend utilities og services
│   ├── firebase.ts       # Firebase Client SDK
│   ├── firebase-admin.ts # Firebase Admin SDK (server-side)
│   ├── auth.ts           # Auth utilities
│   ├── utils.ts          # Generelle utilities
│   └── db/               # Database utilities
│       ├── users.ts      # User database operations
│       ├── workouts.ts   # Workout database operations
│       └── index.ts      # DB exports
│
├── utils/                # Frontend utilities
│   ├── api.ts            # API client functions
│   ├── helpers.ts        # Helper functions (formattering, etc.)
│   └── index.ts          # Utils exports
│
├── types/                # TypeScript type definitions
│   └── index.ts          # Shared types
│
└── styles/               # CSS og styling
    └── globals.css       # Global styles
```

## 🎯 Arkitektur

### Frontend (Client-side)
- **Pages**: `src/app/*/page.tsx` - React komponenter som kjører i nettleseren
- **Components**: `src/components/` - Gjenbrukbare UI komponenter
- **Hooks**: `src/hooks/` - Custom React hooks for state management
- **Utils**: `src/utils/` - Frontend utilities og helpers

### Backend (Server-side)
- **API Routes**: `src/app/api/` - REST endpoints som kjører på serveren
- **Database**: `src/lib/db/` - Database operations og queries
- **Auth**: `src/lib/auth.ts` - Server-side authentication
- **Firebase Admin**: `src/lib/firebase-admin.ts` - Admin SDK for sikre operasjoner

### Delt
- **Types**: `src/types/` - TypeScript types brukt av både frontend og backend

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Registrer ny bruker

### Workouts
- `GET /api/workouts` - Hent alle workouts for innlogget bruker
- `POST /api/workouts` - Opprett ny workout
- `GET /api/workouts/:id` - Hent spesifikk workout
- `PUT /api/workouts/:id` - Oppdater workout
- `DELETE /api/workouts/:id` - Slett workout

Alle API endpoints krever autentisering via `Authorization: Bearer <token>` header.

## 📝 Best Practices

### Hooks
Bruk custom hooks for gjenbrukbar state-logikk:
```typescript
import { useAuth } from '@/hooks'

const { user, loading } = useAuth()
```

### Database Operations
Bruk database utilities fra `lib/db`:
```typescript
import { createWorkout, getUserWorkouts } from '@/lib/db'

const workouts = await getUserWorkouts(userId)
```

### API Calls
Bruk API utilities fra `utils/api`:
```typescript
import { createWorkout, getWorkouts } from '@/utils'

const workouts = await getWorkouts()
```

### Type Safety
Importer types fra centralisert types fil:
```typescript
import { User, Workout } from '@/types'
```

## 🚀 Neste Steg

1. Implementer flere API endpoints for classes, bookings, etc.
2. Legg til flere custom hooks (`useWorkouts`, `useClasses`)
3. Utvid database utilities med flere collections
4. Implementer middleware for autentisering
5. Legg til validering med Zod schemas
