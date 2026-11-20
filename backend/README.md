# NEONFLIX REST API Backend

Production-ready, highly modular REST API backend for the **NEONFLIX** streaming platform MVP. Developed with **Node.js, Express, TypeScript, Zod, and JWT authentication**.

---

## Architecture & Features

- **Language & Runtime:** TypeScript 5.7+ running on Node.js 20+ LTS
- **Framework:** Express.js 4.x
- **Input Validation:** Zod schema validation on requests & environment
- **Security:** Helmet headers, CORS policies, bcrypt password hashing, JWT bearer auth, rate limiting
- **Data Layer:** High-speed in-memory repository with pre-seeded movies, quiz items, and demo user
- **Flagship Features:**
  - **Smart Mood-Based Movie Finder:** Deterministic recommendation engine matching user mood (`happy`, `sad`, `romantic`, `thriller`, `relaxed`) with curated catalogue titles and rationale.
  - **Movie Quiz & Challenge:** Server-side scored trivia engine ensuring client-side anti-cheat protection.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 20 or higher
- npm 10 or higher

### 1. Enter Directory & Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=neonflix_super_secure_jwt_dev_key_2026_x87y99z12!
JWT_EXPIRES_IN=24h
```

### 3. Run Development Server
```bash
npm run dev
```
The server will boot with hot-reload enabled at `http://localhost:5000/api/v1`.  
Health check endpoint: `http://localhost:5000/api/v1/health`

### 4. Build for Production
```bash
npm run build
```
Compiled JavaScript code will output to the `dist/` directory.

### 5. Run Production Server
```bash
npm start
```

### 6. Run Automated Smoke Test Suite
```bash
npm test
```

---

## Render Deployment Guide

Follow these steps to deploy the NEONFLIX backend to **Render (render.com)**:

1. **Push to GitHub**:
   Ensure the `backend/` directory is committed and pushed to your GitHub repository.
2. **Create New Web Service**:
   Log in to Render dashboard -> Click **New +** -> Select **Web Service**.
3. **Connect Repository**:
   Select your `NEONFLIX` GitHub repository.
4. **Configure Settings**:
   - **Name:** `neonflix-api` (or preferred name)
   - **Root Directory:** `backend` (if inside a monorepo) or empty if standalone repo
   - **Environment:** `Node`
   - **Region:** Choose region closest to your users (e.g., Oregon, Frankfurt, Singapore)
   - **Branch:** `main`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. **Add Environment Variables**:
   In the **Environment Variables** section on Render, add:
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = `https://<your-vercel-frontend-domain>.vercel.app`
   - `JWT_ACCESS_SECRET` = `<generate_a_random_32_character_secret>`
   - `JWT_EXPIRES_IN` = `24h`
   *(Note: Do not define `PORT` manually; Render automatically injects `process.env.PORT` which the server binds to dynamically).*
6. **Deploy**:
   Click **Create Web Service**. Wait for the build and deployment log to show `NEONFLIX API Server Running Successfully`.
7. **Verify Public URL**:
   Test the public endpoint in your browser or curl:
   ```bash
   curl https://<your-service-name>.onrender.com/api/v1/health
   ```
8. **Connect Frontend**:
   Update your frontend `.env` on Vercel with:
   ```env
   VITE_API_BASE_URL=https://<your-service-name>.onrender.com/api/v1
   ```

---

## Pre-Seeded Demo Account

For rapid frontend testing:
- **Email:** `demo@neonflix.com`
- **Password:** `DemoPassword123!`
