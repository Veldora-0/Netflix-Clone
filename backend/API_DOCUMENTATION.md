# NEONFLIX REST API Documentation

**Base URL (Local):** `http://localhost:5000/api/v1`  
**Production Base URL:** `https://<your-render-service>.onrender.com/api/v1`  
**Protocol:** REST over HTTP  
**Content-Type:** `application/json`

---

## Standard Response Envelopes

### Success Envelope
All successful API responses return HTTP 200/201 and follow this structure:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Envelope
All error responses return standard HTTP error codes (400, 401, 403, 404, 409, 429, 500) and follow this structure:
```json
{
  "success": false,
  "error": {
    "message": "Clear error message describing the issue",
    "details": [] 
  }
}
```

---

## Authentication & Headers

Protected endpoints require a JSON Web Token (JWT) supplied in the `Authorization` HTTP header:

```http
Authorization: Bearer <your_jwt_token>
```

### Pre-Seeded Demo Account
For instant login during development and testing:
- **Email:** `demo@neonflix.com`
- **Password:** `DemoPassword123!`

---

## Endpoints Summary

| Method | Endpoint | Auth | Purpose |
| :--- | :--- | :---: | :--- |
| `GET` | `/health` | No | Service health and telemetry |
| `GET` | `/movies` | No | List all movies with optional filters |
| `GET` | `/movies/search?q=` | No | Search movies by title |
| `GET` | `/movies/:id` | No | Get movie details by ID |
| `POST` | `/auth/register` | No | Register new demo user |
| `POST` | `/auth/login` | No | Authenticate user and obtain JWT |
| `GET` | `/watchlist` | **Yes** | Retrieve user's saved movies |
| `POST` | `/watchlist` | **Yes** | Add a movie to watchlist |
| `DELETE` | `/watchlist/:id` | **Yes** | Remove movie from watchlist |
| `GET` | `/history` | **Yes** | Retrieve viewing history (recent first) |
| `POST` | `/history` | **Yes** | Add or update movie watch progress |
| `POST` | `/recommendations/mood` | No | Mood-based movie recommendations |
| `GET` | `/quiz/questions` | No | Get quiz questions (answers masked) |
| `POST` | `/quiz/submit` | No | Submit answers and calculate score |

---

## Detailed Endpoint Specifications

### 1. Health Check
`GET /health`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "NEONFLIX API",
    "version": "1.0.0-mvp",
    "environment": "development",
    "timestamp": "2026-11-20T06:20:00.000Z",
    "uptimeSeconds": 42,
    "dataSource": "in-memory-json",
    "catalogueSize": 20
  }
}
```

---

### 2. Movies

#### List Movies
`GET /movies`

**Query Parameters (Optional):**
- `genre` (string) — Filter by genre (e.g. `?genre=Sci-Fi` or `?genre=Comedy`)
- `featured` (boolean) — Filter featured titles (`?featured=true`)
- `trending` (boolean) — Filter trending titles (`?trending=true`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "count": 20,
    "movies": [
      {
        "id": "movie-1",
        "title": "Neon Odyssey",
        "description": "In a rain-drenched cyberpunk metropolis...",
        "genre": "Sci-Fi",
        "genres": ["Sci-Fi", "Action", "Cyberpunk"],
        "releaseYear": 2024,
        "rating": 8.8,
        "duration": "2h 14m",
        "posterUrl": "https://images.unsplash.com/...",
        "backdropUrl": "https://images.unsplash.com/...",
        "moodTags": ["thriller"],
        "featured": true,
        "trending": true
      }
    ]
  }
}
```

#### Search Movies
`GET /movies/search?q=neon`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "query": "neon",
    "count": 1,
    "movies": [ ... ]
  }
}
```

#### Get Movie Details
`GET /movies/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "movie": {
      "id": "movie-1",
      "title": "Neon Odyssey",
      "genre": "Sci-Fi",
      "rating": 8.8
    }
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "message": "Movie with ID 'invalid-id' was not found"
  }
}
```

---

### 3. Authentication

#### Register
`POST /auth/register`

**Request:**
```json
{
  "name": "Alex Carter",
  "email": "alex@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-1718000000000-abc12",
      "name": "Alex Carter",
      "email": "alex@example.com",
      "createdAt": "2026-11-20T06:20:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
`POST /auth/login`

**Request:**
```json
{
  "email": "demo@neonflix.com",
  "password": "DemoPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-demo-1",
      "name": "NEONFLIX Demo User",
      "email": "demo@neonflix.com",
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Watchlist (Protected)

#### Get Watchlist
`GET /watchlist`  
*Header: `Authorization: Bearer <token>`*

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "count": 2,
    "watchlist": [
      {
        "movieId": "movie-1",
        "addedAt": "2026-01-02T12:00:00.000Z",
        "movie": { "id": "movie-1", "title": "Neon Odyssey", ... }
      }
    ]
  }
}
```

#### Add to Watchlist
`POST /watchlist`  
*Header: `Authorization: Bearer <token>`*

**Request:**
```json
{
  "movieId": "movie-2"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "message": "Movie added to watchlist successfully",
    "item": {
      "movieId": "movie-2",
      "addedAt": "2026-11-20T06:20:00.000Z",
      "movie": { ... }
    }
  }
}
```

#### Remove from Watchlist
`DELETE /watchlist/:id`  
*Header: `Authorization: Bearer <token>`*

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Movie 'movie-2' removed from watchlist successfully",
    "movieId": "movie-2"
  }
}
```

---

### 5. Watch History / Continue Watching (Protected)

#### Get History
`GET /history`  
*Header: `Authorization: Bearer <token>`*

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "count": 2,
    "history": [
      {
        "movieId": "movie-1",
        "progress": 45,
        "watchedAt": "2026-01-05T20:10:00.000Z",
        "movie": { ... }
      }
    ]
  }
}
```

#### Record / Update Progress
`POST /history`  
*Header: `Authorization: Bearer <token>`*

**Request:**
```json
{
  "movieId": "movie-1",
  "progress": 68
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Watch history updated successfully",
    "item": {
      "movieId": "movie-1",
      "progress": 68,
      "watchedAt": "2026-11-20T06:22:00.000Z",
      "movie": { ... }
    }
  }
}
```

---

### 6. Special Feature 1: Smart Mood-Based Movie Finder
`POST /recommendations/mood`

**Supported Moods:**
- `happy`
- `sad`
- `romantic`
- `thriller`
- `relaxed`

**Request:**
```json
{
  "mood": "thriller"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "mood": "thriller",
    "count": 5,
    "recommendations": [
      {
        "id": "movie-1",
        "title": "Neon Odyssey",
        "posterUrl": "https://images.unsplash.com/...",
        "rating": 8.8,
        "genres": ["Sci-Fi", "Action", "Cyberpunk"],
        "reason": "A high-octane cyberpunk neo-noir packed with relentless twists and sensory brilliance."
      }
    ]
  }
}
```

---

### 7. Special Feature 2: Movie Quiz & Challenge

#### Get Quiz Questions
`GET /quiz/questions`  
*(Answers are masked for security and integrity)*

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "count": 10,
    "questions": [
      {
        "id": "q-1",
        "question": "In the movie \"Inception\", what spinning object serves as Cobb’s totem?",
        "options": [
          { "id": "opt-a", "text": "A loaded die" },
          { "id": "opt-b", "text": "A small pewter spinning top" },
          { "id": "opt-c", "text": "A poker chip" },
          { "id": "opt-d", "text": "A silver coin" }
        ]
      }
    ]
  }
}
```

#### Submit Quiz Answers
`POST /quiz/submit`

**Request:**
```json
{
  "answers": [
    {
      "questionId": "q-1",
      "optionId": "opt-b"
    },
    {
      "questionId": "q-2",
      "optionId": "opt-c"
    }
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalQuestions": 2,
    "correctAnswers": 2,
    "incorrectAnswers": 0,
    "score": 100.0,
    "results": [
      {
        "questionId": "q-1",
        "question": "In the movie \"Inception\", what spinning object serves as Cobb’s totem?",
        "submittedOptionId": "opt-b",
        "correctOptionId": "opt-b",
        "isCorrect": true,
        "explanation": "Cobb uses a small brass/pewter spinning top that belonged to his late wife Mal to test if he is in a dream."
      }
    ]
  }
}
```
