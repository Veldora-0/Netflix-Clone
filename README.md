# NEONFLIX — Midnight Cinema Streaming Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?style=flat&logo=express)](https://expressjs.com/)

A modern, immersive entertainment discovery and streaming platform demo built with midnight-cinema aesthetics, smart mood-based recommendations, and interactive cinema trivia.

---

## 🎨 Visual Identity & Midnight-Cinema Design System

NEONFLIX rejects generic streaming clones in favor of a distinctive, dark cinematic visual experience:
- **Main Background:** `#080B12` (Midnight Black)
- **Secondary Background:** `#0E1420` (Deep Cinema Navy)
- **Card Surface:** `#151D2B` (Polished Charcoal)
- **Primary Text:** `#F5F7FA` (Crisp Ice White)
- **Secondary Text:** `#9AA7B8` (Slate Muted)
- **Main Accent:** `#56E6D1` (Neon Teal/Cyan Glow)
- **Secondary Accent:** `#A78BFA` (Midnight Violet)
- **Highlight:** `#FFB86B` (Warm Amber Star Rating)
- **Typography:** Space Grotesk (Display Headings) + Inter (Readable Body)

---

## 🚀 Key Platform Features

1. **Cinematic Hero Experience:**
   - Full-bleed backdrop artwork with dynamic multi-layer gradient overlays.
   - Featured titles carousel (`Neon Odyssey`, `Midnight in Montmartre`, `Velocity Rift`, `Cipher Protocol`).
   - Direct streaming launch, info modals, and one-click watchlist actions.

2. **Smart Mood-Based Movie Finder (Flagship Feature 1):**
   - Interactive mood selection (`Happy`, `Sad`, `Romantic`, `Thriller`, `Relaxed`).
   - Deterministic matching engine powered by `POST /api/v1/recommendations/mood`.
   - Returns curated titles with custom context rationales explaining why the film matches the mood.

3. **Movie Quiz Challenge (Flagship Feature 2):**
   - 10-round interactive cinema trivia game.
   - Anti-cheat question delivery (`GET /api/v1/quiz/questions` masks answers).
   - Authoritative server-side scoring and performance breakdown (`POST /api/v1/quiz/submit`).

4. **HTML5 Video Player & Multitasking Mini-Player:**
   - Custom video controls (Play/Pause, scrub bar, volume slider, fullscreen, 0.75x–2x playback speed, Picture-in-Picture).
   - Floating mini-player docks to bottom-right when navigating other pages, maintaining active playback state.
   - Synchronizes watch progress (0–100%) to `POST /api/v1/history` in real time.
   - Utilizes openly licensed demo films from the Blender Foundation (*Tears of Steel*, *Big Buck Bunny*, *Sintel*).

5. **Curated Browsing & Series Hub:**
   - **Movies:** Live search, genre filtering (Sci-Fi, Action, Comedy, Drama, Romance, Thriller, Animation, Documentary), and multi-criteria sorting.
   - **Series & Episodes:** Dedicated multi-season episodic player layout with episode synopses and chapters.
   - **Channels:** Curated hub broadcasts (*NEON Originals*, *NEON Action*, *NEON Comedy*, *NEON Drama*, *NEON Documentary*, *NEON Kids*).

6. **Authentication & Personal Watchlist:**
   - Hashed password authentication via bcrypt and JWT tokens.
   - Quick one-click autofill for demo account testing.
   - Persistent watchlist management (`GET/POST/DELETE /api/v1/watchlist`).

---

## 🛠 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/          # Zod environment validation
│   │   ├── controllers/     # REST controllers
│   │   ├── data/            # In-memory store, sample movies & quiz bank
│   │   ├── middleware/      # Auth (JWT), validation, errors, 404
│   │   ├── routes/          # REST route handlers under /api/v1
│   │   ├── services/        # Business logic & recommendation algorithms
│   │   ├── app.ts           # Express app setup with Helmet & CORS
│   │   └── server.ts        # Server entrypoint
│   ├── tests/               # 29-test automated verification suite
│   ├── API_DOCUMENTATION.md # Complete REST API spec
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Centralized typed API client
│   │   ├── components/      # Common, Layout, Modal, Player components
│   │   ├── context/         # Auth, Watchlist, Player, and Toast Contexts
│   │   ├── data/            # Series, Channels, and Open Demo video streams
│   │   ├── pages/           # Home, Movies, Series, Channels, Mood, Quiz, MyList, Search, Login, Register
│   │   ├── types/           # TypeScript domain definitions
│   │   ├── App.tsx          # Client-side router
│   │   └── main.tsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vercel.json          # SPA rewrite rules
│   └── package.json
└── package.json             # Root monorepo orchestration scripts
```

---

## 💻 Running Locally

### 1. Prerequisites
- Node.js 20+ LTS
- npm 10+

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/Veldora-0/Netflix-Clone.git
cd Netflix-Clone

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Start Backend API
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000/api/v1
```

### 4. Start Frontend
In a separate terminal:
```bash
cd frontend
npm run dev
# Application will launch on http://localhost:5173
```

---

## 🔑 Pre-Seeded Demo Credentials

To test authenticated features (Watchlist, Continue Watching history) without registering a new account:
- **Email:** `demo@neonflix.com`
- **Password:** `DemoPassword123!`
*(A "Quick Fill Demo Account" button is also provided directly on the Login screen).*

---

## 🧪 Testing & Verification

Run the comprehensive 29-test verification suite from the backend directory:
```bash
cd backend
npm test
```
Build the frontend for production:
```bash
cd frontend
npm run build
```

---

## 🚢 Deployment Guide

### Deploying Frontend to Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variable:
   - `VITE_API_BASE_URL` = `https://<your-render-backend>.onrender.com/api/v1`
5. Deploy. The included `vercel.json` ensures client-side routing rewrites work properly.

### Deploying Backend to Render
1. Create a **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `backend`.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `https://<your-vercel-domain>.vercel.app`
   - `JWT_ACCESS_SECRET` = `<a-random-32-char-secret>`
   - `JWT_EXPIRES_IN` = `24h`
