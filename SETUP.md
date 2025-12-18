# Oppsettguide for FitnessHub

## Firebase-oppsett

### Steg 1: Opprett Firebase-prosjekt

1. Gå til [Firebase Console](https://console.firebase.google.com/)
2. Klikk "Add project" eller "Legg til prosjekt"
3. Gi prosjektet et navn (f.eks. "FitnessHub")
4. Følg guiden og vent til prosjektet er opprettet

### Steg 2: Aktiver Authentication

1. I Firebase Console, gå til "Authentication" i venstre meny
2. Klikk "Get started"
3. Velg "Email/Password" under "Sign-in method"
4. Aktiver "Email/Password" og klikk "Save"

### Steg 3: Opprett Firestore Database

1. Gå til "Firestore Database" i venstre meny
2. Klikk "Create database"
3. Velg "Start in test mode" (for utvikling)
4. Velg en region (f.eks. "europe-west1")
5. Klikk "Enable"

### Steg 4: Hent Firebase-konfigurasjon

1. Gå til "Project settings" (tannhjulet i venstre meny)
2. Scroll ned til "Your apps"
3. Klikk på web-ikonet `</>`
4. Gi appen et navn og klikk "Register app"
5. Kopier konfigurasjonen (firebaseConfig-objektet)

### Steg 5: Opprett Service Account (for Admin SDK)

1. I "Project settings", gå til "Service accounts"
2. Klikk "Generate new private key"
3. Lagre JSON-filen sikkert
4. Kopier verdiene fra JSON-filen til `.env`

### Steg 6: Konfigurer miljøvariabler

Opprett `.env` basert på `.env.example`:

```env
# Fra Firebase web config
NEXT_PUBLIC_FIREBASE_API_KEY=din_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ditt-prosjekt.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ditt-prosjekt-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ditt-prosjekt.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=din_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=din_app_id

# Fra Service Account JSON
FIREBASE_ADMIN_PROJECT_ID=ditt-prosjekt-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ditt-prosjekt.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ndin_private_key\n-----END PRIVATE KEY-----\n"
```

**OBS:** Pass på at private key beholder `\n` for linjeskift!

## Firestore Security Rules

For produksjon, oppdater Firestore Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Workouts collection
    match /workouts/{workoutId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Group classes (read-only for all authenticated users)
    match /classes/{classId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins via backend
    }
  }
}
```

## Kjøring av prosjektet

### Utviklingsmodus

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000)

### Produksjonsbygg

```bash
npm run build
npm start
```

### Docker

```bash
# Bygg og kjør
docker-compose up --build

# Kjør i bakgrunnen
docker-compose up -d

# Stopp
docker-compose down
```

## Testing

### Opprett testbruker

1. Gå til [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
2. Registrer en ny bruker
3. Logg inn og utforsk dashboardet

### Manuell testing i Firebase Console

Du kan også opprette brukere direkte i Firebase Console:
1. Gå til "Authentication" → "Users"
2. Klikk "Add user"
3. Legg til e-post og passord

## Feilsøking

### "Firebase: Error (auth/configuration-not-found)"
- Sjekk at `.env`-filen eksisterer
- Verifiser at alle miljøvariabler er satt riktig
- Restart dev-serveren

### "Cannot find module 'firebase'"
- Kjør `npm install`
- Sjekk at node_modules finnes

### "Permission denied" i Firestore
- Oppdater Security Rules i Firebase Console
- I test-modus, bruk permissive rules (kun for utvikling!)

### Docker-problemer
- Sjekk at Docker er installert: `docker --version`
- Sjekk at Docker kjører
- Prøv å rebuilde: `docker-compose up --build --force-recreate`

## Neste steg

1. Implementer booking-funksjonalitet
2. Lag treningslogg-komponenter
3. Integrer betalinger (Stripe/Vipps)
4. Legg til admin-panel
5. Implementer e-post notifikasjoner

## Ressurser

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
