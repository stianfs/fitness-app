# 🚀 Hurtigstart

## Komme i gang på 5 minutter

### 1. Installer dependencies
```bash
cd /home/stian/fitness-app
npm install
```

### 2. Konfigurer Firebase (valgfritt for lokal utvikling)
```bash
# Kopier environment template
cp .env.example .env

# Rediger .env og legg til Firebase credentials
# Se SETUP.md for detaljert guide
```

### 3. Start utviklingsserver
```bash
npm run dev
```

### 4. Åpne i browser
Gå til [http://localhost:3000](http://localhost:3000)

## Tilgjengelige kommandoer

```bash
# Utvikling
npm run dev          # Start dev server på port 3000
npm run build        # Bygg for produksjon
npm start            # Kjør produksjonsbygg
npm run lint         # Kjør ESLint
npm run type-check   # TypeScript type-sjekk

# Docker
docker-compose up --build    # Bygg og start i Docker
docker-compose down          # Stopp Docker containers
```

## Mappestruktur (rask oversikt)

```
fitness-app/
├── src/
│   ├── app/              # Next.js sider
│   ├── components/       # React komponenter
│   ├── lib/              # Firebase, auth, utils
│   ├── types/            # TypeScript types
│   └── styles/           # CSS
├── public/               # Statiske filer
├── .env                  # Miljøvariabler (lag denne!)
└── package.json          # Dependencies
```

## Neste steg

1. **Utforsk kodebasen** - Start i `src/app/page.tsx`
2. **Les SETUP.md** - For Firebase-konfigurasjon
3. **Sjekk README.md** - For fullstendig dokumentasjon
4. **Se CONTRIBUTING.md** - Hvis du vil bidra

## Trenger hjelp?

- 📖 Les [SETUP.md](./SETUP.md) for detaljert oppsett
- 🐛 Sjekk "Feilsøking"-seksjonen i SETUP.md
- 💡 Se kodeeksempler i CONTRIBUTING.md

## Demo-bruker (når Firebase er satt opp)

1. Gå til `/auth/signup`
2. Registrer en testbruker
3. Logg inn og utforsk dashboardet!

---

**Happy coding! 💪🏋️**
