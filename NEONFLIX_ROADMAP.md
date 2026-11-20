# NEONFLIX --- One-Hour MVP Roadmap

## Frontend, Backend, Integration, and Deployment

**Project name:** NEONFLIX\
**Target:** A working, publicly accessible streaming-platform demo\
**Timebox:** 60 minutes\
**Delivery approach:** Frontend and backend developed in parallel

> **Scope note:** This is an aggressively time-boxed MVP plan. Sixty
> minutes is a target, not a guarantee. It assumes the developers,
> GitHub repositories, hosting accounts, and required credentials are
> ready before the timer starts. The goal is a demonstrable application,
> not a production-ready streaming service.

------------------------------------------------------------------------

## 1. Finalized decisions

  -----------------------------------------------------------------------
  Area                                Decision
  ----------------------------------- -----------------------------------
  Project name                        NEONFLIX

  Database                            Demo data using local JSON files
                                      and/or in-memory data

  Development model                   Frontend and backend developed in
                                      parallel

  Frontend framework                  React + Vite + TypeScript

  Styling                             Tailwind CSS

  Backend                             Node.js + Express + TypeScript

  API style                           REST

  Validation                          Zod

  Authentication                      Basic registration/login with
                                      password hashing and JWT

  Frontend hosting                    Vercel

  Backend hosting                     Render

  API prefix                          `/api/v1`
  -----------------------------------------------------------------------

### Demo data limitation

The MVP will use sample JSON/in-memory data rather than a persistent
database. In-memory data may reset when the server restarts or
redeploys. This is acceptable for the time-boxed demonstration, but it
is not suitable for real user accounts or long-term storage.

------------------------------------------------------------------------

## 2. Product scope and features

### 2.1 Core streaming-platform experience

1.  **Home page**
    -   NEONFLIX branding and navigation.
    -   Featured/hero movie section.
    -   Movie rows or categories.
    -   Responsive layout for desktop and mobile.
2.  **Movie catalogue**
    -   Browse sample movies.
    -   Display poster, title, genre, year, and rating.
    -   Movie detail view with synopsis and metadata.
3.  **Search**
    -   Search by movie title.
    -   Show an empty state when there are no matches.
4.  **Authentication**
    -   Registration and login screens.
    -   Password hashing on the backend.
    -   JWT-based authenticated requests.
    -   Clear error messages for invalid credentials.
5.  **Watchlist**
    -   View saved movies.
    -   Add a movie.
    -   Remove a movie.
6.  **Watch history / Continue Watching**
    -   Record a movie as watched or recently viewed.
    -   Show recent items in the interface.
    -   For the demo, progress can be represented by simple sample
        values if full playback is not implemented.

### 2.2 Special feature 1 --- Smart Mood-Based Movie Finder

Users select a mood and receive movie recommendations.

**Moods for the MVP** - Happy - Sad - Romantic - Thriller - Relaxed

**Expected behaviour** - Frontend sends the selected mood to the
backend. - Backend maps the mood to suitable genres/tags in the sample
catalogue. - Backend returns matching movies and a short explanation. -
Frontend displays the recommendations as movie cards.

This is a deterministic, rule-based demo feature. It does not require an
external AI provider.

### 2.3 Special feature 2 --- Movie Quiz & Challenge

Users answer multiple-choice movie questions and receive a score.

**Expected behaviour** - Fetch quiz questions from the backend. -
Display one question and its answer options at a time, or show a short
question set. - Submit answers to the backend. - Backend calculates the
score and returns the result. - Frontend displays score,
correct/incorrect feedback, and a final result screen.

For a basic demo, use a small fixed question bank. Do not expose correct
answers in the public question response; keep answer keys on the server.

### 2.4 Explicitly out of scope for this one-hour MVP

-   Actual Netflix-scale video streaming or transcoding.
-   Production HLS/DASH streaming infrastructure.
-   Real-time Watch Party / Socket.IO.
-   External AI-powered recommendations.
-   Full PostgreSQL + Prisma integration.
-   Multi-profile accounts.
-   Admin content management dashboard.
-   Subscription billing and payments.
-   Production-grade refresh-token rotation and security operations.
-   Advanced analytics, monitoring, and automated deployment pipelines.

------------------------------------------------------------------------

## 3. Technology stack

  Layer                 Choice                   Use
  --------------------- ------------------------ ----------------------------------
  Frontend              React                    User interface
  Build tool            Vite                     Development and production build
  Language              TypeScript               Type safety
  Styling               Tailwind CSS             Responsive visual design
  Backend runtime       Node.js                  Server runtime
  Backend framework     Express                  REST API
  Validation            Zod                      Validate request payloads
  Authentication        JWT + password hashing   Demo authentication
  Demo data             JSON / in-memory         Movie and demo user data
  Frontend deployment   Vercel                   Public web application
  Backend deployment    Render                   Public API

Use compatible, currently supported package versions during setup. Avoid
spending the timebox upgrading or experimenting with libraries.

------------------------------------------------------------------------

## 4. Suggested repository structure

``` text
NEONFLIX/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── data/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── types/
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
└── README.md
```

Keep the implementation compact. If separate files create unnecessary
setup overhead, use a smaller structure while retaining clear separation
between routes, data, and UI components.

------------------------------------------------------------------------

## 5. Frontend page and component plan

### Pages

  Page                Main content
  ------------------- ---------------------------------------------
  Home                Hero banner, featured movies, category rows
  Movies              Movie catalogue and search
  Movie Details       Poster, synopsis, genre, year, rating
  My List             User watchlist
  Continue Watching   Recent viewing history
  Mood Finder         Mood selector and recommendations
  Movie Quiz          Questions, options, score, result
  Login               Login form
  Register            Registration form

### Shared components

-   `Navbar`
-   `HeroBanner`
-   `MovieCard`
-   `MovieRow`
-   `SearchBar`
-   `AuthForm`
-   `MoodSelector`
-   `QuizQuestion`
-   `QuizResult`
-   `LoadingState`
-   `ErrorState`
-   `EmptyState`

### Visual direction

-   Dark cinematic interface.
-   Near-black and charcoal backgrounds.
-   Distinctive neon accent colour and restrained glow effects.
-   Large, high-impact hero artwork.
-   Consistent movie-card sizing and spacing.
-   Clear hover/focus states.
-   Responsive navigation and layouts.
-   Readable typography and accessible contrast.

Use sample images and video assets that are licensed for reuse. Do not
copy Netflix branding, proprietary artwork, or copyrighted video files.

------------------------------------------------------------------------

## 6. Backend API contract

**Base path:** `/api/v1`

The frontend and backend developers should agree on these endpoint paths
and response shapes before implementing their respective sides.

  Method   Endpoint                  Purpose
  -------- ------------------------- ----------------------------------------
  GET      `/health`                 Check API status
  GET      `/movies`                 List movies
  GET      `/movies/:id`             Get movie details
  GET      `/movies/search?q=`       Search movies
  POST     `/auth/register`          Register demo user
  POST     `/auth/login`             Login demo user
  GET      `/watchlist`              Get current user's watchlist
  POST     `/watchlist`              Add a movie to watchlist
  DELETE   `/watchlist/:id`          Remove a movie from watchlist
  GET      `/history`                Get viewing history
  POST     `/history`                Add/update viewing history
  POST     `/recommendations/mood`   Get mood-based recommendations
  GET      `/quiz/questions`         Get quiz questions without answer keys
  POST     `/quiz/submit`            Submit answers and calculate score

### Suggested response conventions

Success:

``` json
{
  "success": true,
  "data": {}
}
```

Error:

``` json
{
  "success": false,
  "error": {
    "message": "A clear error message"
  }
}
```

Use the same response conventions consistently. The exact payload fields
should be agreed by both developers before parallel implementation.

### Example mood request

``` json
{
  "mood": "happy"
}
```

### Example mood response

``` json
{
  "success": true,
  "data": {
    "mood": "happy",
    "recommendations": [
      {
        "id": "movie-1",
        "title": "Sample Movie",
        "reason": "A light-hearted comedy matching your mood."
      }
    ]
  }
}
```

### Example quiz submission

``` json
{
  "answers": [
    {
      "questionId": "question-1",
      "optionId": "option-b"
    }
  ]
}
```

The backend should calculate the score using its private answer key and
return the result. The frontend must not be trusted to calculate or
submit its own authoritative score.

------------------------------------------------------------------------

## 7. Parallel development responsibilities

### Backend developer

-   Create the Express + TypeScript server.
-   Configure environment variables and CORS.
-   Create sample movie and quiz data.
-   Implement movie listing, details, and search.
-   Implement basic registration and login.
-   Implement watchlist and history.
-   Implement mood-based recommendations.
-   Implement quiz retrieval and server-side scoring.
-   Test endpoints and prepare the Render deployment.

### Frontend developer

-   Create the React + Vite + TypeScript application.
-   Build the NEONFLIX visual system and responsive layout.
-   Build the home page, movie catalogue, and movie detail view.
-   Build login and registration screens.
-   Build watchlist and Continue Watching screens.
-   Build Mood Finder and Quiz screens.
-   Implement API service functions using the agreed contract.
-   Configure the production API URL and deploy to Vercel.

### Shared responsibility

-   Agree on API paths, field names, and response formats at the start.
-   Share the local backend URL.
-   Test the integrated application together.
-   Coordinate fixes rather than independently changing the API
    contract.

------------------------------------------------------------------------

## 8. Exact 60-minute execution schedule

  ---------------------------------------------------------------------------
  Time              Backend              Frontend          Shared outcome
  ----------------- -------------------- ----------------- ------------------
  00--10            Server scaffold,     Vite scaffold,    Project setup and
                    config, health       design shell,     API contract
                    route, sample data   routing           

  10--22            Movies, auth,        Navigation, page  Core API and UI
                    watchlist/history,   skeletons,        foundations
                    mood, quiz APIs      reusable          
                                         cards/forms       

  22--32            Finish and test API  Home, catalogue,  Main browsing
                    responses            details, auth UI  experience

  32--42            Fix API issues and   Watchlist,        Feature-complete
                    prepare deployment   history, Mood     local demo
                                         Finder, Quiz, API 
                                         integration       

  42--50            Endpoint             UI integration    End-to-end local
                    verification and bug and responsive    testing
                    fixes                checks            

  50--60            Deploy API to Render Deploy frontend   Public deployment
                    and configure CORS   to Vercel and set and smoke test
                                         API URL           
  ---------------------------------------------------------------------------

**Critical scheduling rule:** Do not wait until the backend is
completely finished before the frontend developer starts. Use the agreed
API contract and temporary mock responses where needed, then connect to
the real API as soon as it is available.

------------------------------------------------------------------------

## 9. Environment configuration

### Backend `.env.example`

``` dotenv
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
JWT_ACCESS_SECRET=replace_with_a_long_random_secret
```

Create a real `.env` locally. Do not commit it to Git. Use a separate
strong random secret in the deployed environment. Never use the example
value as a production secret.

### Frontend `.env.example`

``` dotenv
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

For Vercel, set `VITE_API_BASE_URL` to the deployed Render API base URL,
for example:

``` dotenv
VITE_API_BASE_URL=https://your-backend-service.onrender.com/api/v1
```

The example hostname above is a placeholder; use the actual URL assigned
by Render.

------------------------------------------------------------------------

## 10. Local integration and testing checklist

### Backend checks

-   [ ] Server starts without errors.
-   [ ] `GET /api/v1/health` returns a success response.
-   [ ] Movie list and movie detail endpoints work.
-   [ ] Search returns matching movies.
-   [ ] Registration and login return expected responses.
-   [ ] Passwords are hashed, not stored as plain text.
-   [ ] Protected endpoints reject unauthenticated requests.
-   [ ] Watchlist add, list, and remove work.
-   [ ] History can be retrieved and updated.
-   [ ] Mood Finder returns matching recommendations.
-   [ ] Quiz response does not expose answer keys.
-   [ ] Quiz submission calculates the score on the server.

### Frontend checks

-   [ ] Home page renders correctly.
-   [ ] Movie cards display sample content.
-   [ ] Search works.
-   [ ] Movie detail view works.
-   [ ] Login and registration forms show errors clearly.
-   [ ] Watchlist updates after add/remove.
-   [ ] History/Continue Watching displays recent items.
-   [ ] Mood Finder displays recommendations.
-   [ ] Quiz questions and result screen work.
-   [ ] Loading, empty, and error states are handled.
-   [ ] Layout works on desktop and mobile.

### Integration checks

-   [ ] Frontend uses the correct local API base URL.
-   [ ] CORS allows the frontend origin.
-   [ ] Authentication token is sent on protected requests.
-   [ ] Frontend and backend agree on response field names.
-   [ ] No critical browser-console or server errors remain.

------------------------------------------------------------------------

## 11. Deployment plan

### 11.1 Backend deployment --- Render

1.  Push the backend folder/repository to GitHub.
2.  Create a new Web Service in Render.
3.  Connect the correct GitHub repository.
4.  Configure the build command to install dependencies and build
    TypeScript.
5.  Configure the start command to run the compiled server.
6.  Add environment variables:
    -   `NODE_ENV=production`
    -   `PORT` only if required by the hosting configuration; the server
        should use the platform-provided port.
    -   `CORS_ORIGIN` set to the deployed Vercel frontend origin.
    -   `JWT_ACCESS_SECRET` set to a strong, unique secret.
7.  Deploy the service.
8.  Test the deployed `/api/v1/health` endpoint.
9.  Copy the actual public Render service URL.

Render: https://render.com/

### 11.2 Frontend deployment --- Vercel

1.  Push the frontend folder/repository to GitHub.
2.  Create a Vercel project and import the frontend repository.
3.  Select the Vite framework preset if it is not detected
    automatically.
4.  Confirm the build command is `npm run build`.
5.  Confirm the output directory is `dist`.
6.  Set `VITE_API_BASE_URL` to the actual deployed Render API base URL.
7.  Deploy the frontend.
8.  Copy the actual public Vercel URL.

Vercel: https://vercel.com/

### 11.3 Production integration

1.  Update backend `CORS_ORIGIN` to the exact deployed frontend origin.
2.  Redeploy/restart the backend if the environment variable changed.
3.  Open the Vercel frontend.
4.  Verify it can call the Render API.
5.  Test login, movie browsing, Mood Finder, and Quiz on the live site.
6.  Check browser console and Render logs for errors.

**Deployment caveat:** Free hosting services may have build queues, cold
starts, or service limitations. If deployment takes longer than the
final ten minutes, preserve the working local demo and complete the
public deployment immediately afterward.

------------------------------------------------------------------------

## 12. Final delivery checklist

### Application

-   [ ] NEONFLIX branding and responsive frontend.
-   [ ] Working backend REST API.
-   [ ] Movie catalogue, details, and search.
-   [ ] Registration and login.
-   [ ] Watchlist and viewing history.
-   [ ] Smart Mood-Based Movie Finder.
-   [ ] Movie Quiz & Challenge.
-   [ ] Frontend connected to backend.

### Deployment

-   [ ] Backend deployed on Render.
-   [ ] Frontend deployed on Vercel.
-   [ ] Production API URL configured.
-   [ ] CORS configured for the deployed frontend.
-   [ ] Public health endpoint responds.
-   [ ] Live frontend can retrieve backend data.
-   [ ] Main features smoke-tested on the live site.

### Handover

-   [ ] Frontend URL recorded.
-   [ ] Backend API URL recorded.
-   [ ] GitHub repository URLs recorded.
-   [ ] Environment variable names documented (never publish secret
    values).
-   [ ] Known demo limitations documented.

------------------------------------------------------------------------

## 13. Post-MVP roadmap

Once the one-hour demo is working, improve it in this order:

1.  Add PostgreSQL and Prisma for persistent data.
2.  Improve authentication, token lifecycle, and authorization.
3.  Add proper user/profile ownership for watchlists and history.
4.  Add a richer movie catalogue and licensed playback assets.
5.  Add admin content management.
6.  Improve recommendations with ratings, watch history, and optional AI
    integration.
7.  Add Watch Party with Socket.IO.
8.  Add automated tests, API documentation, logging, and monitoring.
9.  Add production deployment hardening, backups, and security review.

------------------------------------------------------------------------

## 14. Definition of success

The one-hour MVP is considered successful when:

-   A user can open the public NEONFLIX frontend.
-   The frontend retrieves movie data from the deployed backend.
-   The user can register and log in in the demo environment.
-   Movie browsing and search work.
-   Watchlist and history work within the demo data limitations.
-   Mood Finder returns recommendations.
-   Movie Quiz calculates and displays a score.
-   Both frontend and backend public URLs are available.

**Final target:** A distinctive, connected, publicly deployed NEONFLIX
demo --- with a deliberately limited feature set and a clear path to
production improvements.
