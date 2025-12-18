# FitnessHub - Digital Treningsplattform

En moderne, fullstack fitness-applikasjon bygget med **Next.js**, **TypeScript**, **Firebase**, og **TailwindCSS**.

## 🏋️ Funksjoner

### ✅ Implementert
- **Autentisering** - Firebase Authentication med e-post/passord
- **Brukerportaler** - Personlige dashboards med oversikt
- **Modern UI** - Responsiv design med darkmode-støtte
- **TypeScript** - Full typesikkerhet
- **Komponentbibliotek** - Gjenbrukbare shadcn/ui komponenter

### 🚧 Planlagt funksjonalitet
- **Booking-system** - Book PT-timer og gruppeklasser
- **Treningslogg** - Registrer økter, sett, og repetisjoner
- **Medlemsportal** - Administrer medlemskap og betalinger
- **Gruppetimer** - Oversikt og påmelding til klasser
- **Treningsstatistikk** - Grafer og fremgangsanalyse

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework med App Router
- **TypeScript** - Typesikkerhet og bedre utvikleropplevelse
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Moderne UI-komponenter
- **Lucide Icons** - Moderne ikoner

### Backend
- **Firebase Authentication** - Brukeradministrasjon
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - Fillagring
- **Next.js API Routes** - Serverløse endpoints

### DevOps
- **Docker** - Containerisering
- **Docker Compose** - Multi-container setup

## 🚀 Kom i gang

### Forutsetninger
- Node.js 20+ 
- npm eller yarn
- Firebase-prosjekt (valgfritt)

### Installasjon

1. **Klon prosjektet**
   ```bash
   git clone <repository-url>
   cd fitness-app
   ```

2. **Installer dependencies**
   ```bash
   npm install
   ```

3. **Sett opp miljøvariabler**
   ```bash
   cp .env.example .env
   ```
   
   Rediger `.env` og legg til dine Firebase-credentials:
   - Opprett et Firebase-prosjekt på [firebase.google.com](https://firebase.google.com)
   - Aktiver Authentication (Email/Password)
   - Opprett en Firestore database
   - Kopier konfigurasjon til `.env`

4. **Start utviklingsserver**
   ```bash
   npm run dev
   ```
   
   Åpne [http://localhost:3000](http://localhost:3000)

### Docker

Kjør applikasjonen i Docker:

```bash
# Build og start
docker-compose up --build

# Stopp
docker-compose down
```

## 📁 Prosjektstruktur

```
fitness-app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Autentiseringssider
│   │   ├── dashboard/         # Dashboard og hovedfunksjoner
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landingsside
│   ├── components/            # React-komponenter
│   │   └── ui/               # Gjenbrukbare UI-komponenter
│   ├── lib/                   # Utilities og helpers
│   │   ├── firebase.ts       # Firebase konfigurasjon
│   │   ├── auth.ts           # Auth-funksjoner
│   │   └── utils.ts          # Hjelpefunksjoner
│   ├── types/                 # TypeScript types
│   └── styles/               # Globale styles
├── public/                    # Statiske filer
├── Dockerfile                 # Docker konfigurasjon
├── docker-compose.yml         # Docker Compose setup
└── package.json              # Dependencies og scripts
```

## 🎨 Design

Applikasjonen følger moderne design-prinsipper:
- **Responsivt design** - Fungerer på desktop, tablet og mobil
- **Darkmode** - Automatisk eller manuelt valg
- **Tilgjengelig** - WCAG-retningslinjer
- **Konsistent UI** - Gjenbrukbare komponenter

## 🧪 Testing

```bash
# Type-sjekk
npm run type-check

# Linting
npm run lint
```

## 📦 Bygg for produksjon

```bash
# Bygg applikasjonen
npm run build

# Start produksjonsserver
npm start
```

## 🔐 Sikkerhet

- Passord hashet med Firebase Authentication
- Environment variables for sensitive data
- Firestore Security Rules (konfigurasjon nødvendig)
- HTTPS i produksjon (anbefalt)

## 🌟 Fremtidige forbedringer

- [ ] GraphQL API-lag
- [ ] REST API endpoints
- [ ] React Native mobilapp
- [ ] Betalingsintegrasjon (Stripe/Vipps)
- [ ] E-post notifikasjoner
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] Analytics og rapportering
- [ ] Integrasjon med treningsutstyr (API)
- [ ] Sosiale funksjoner

## 📝 Lisens

Dette prosjektet er laget som et hobbyprosjekt og er åpent for bruk og modifikasjon.
