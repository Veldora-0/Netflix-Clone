import { AddressInfo } from 'net';
import { createApp } from '../src/app';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function assert(name: string, fn: () => Promise<void> | void) {
  try {
    await fn();
    results.push({ name, passed: true });
    console.log(`  ✅ PASS: ${name}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    results.push({ name, passed: false, error: message });
    console.error(`  ❌ FAIL: ${name} -> ${message}`);
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 Starting NEONFLIX Backend Automated Verification Suite');
  console.log('======================================================\n');

  process.env.NODE_ENV = 'test';
  const app = createApp();

  const server = app.listen(0);
  const port = (server.address() as AddressInfo).port;
  const baseUrl = `http://localhost:${port}/api/v1`;

  let authToken = '';
  let registeredEmail = `test_${Date.now()}@neonflix.com`;

  try {
    // 1. Health endpoint
    await assert('Health Check (GET /health)', async () => {
      const res = await fetch(`${baseUrl}/health`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success) throw new Error('Expected success to be true');
      if (body.data.status !== 'healthy') throw new Error('Expected status to be healthy');
      if (body.data.catalogueSize < 15) throw new Error('Expected catalogueSize >= 15');
    });

    // 2. Movie listing
    await assert('Movie Listing (GET /movies)', async () => {
      const res = await fetch(`${baseUrl}/movies`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || !Array.isArray(body.data.movies)) throw new Error('Invalid movie list payload');
      if (body.data.movies.length < 15) throw new Error('Expected at least 15 movies');
    });

    // 3. Movie filtering by genre
    await assert('Movie Filtering by Genre (GET /movies?genre=Sci-Fi)', async () => {
      const res = await fetch(`${baseUrl}/movies?genre=Sci-Fi`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.movies.length === 0) throw new Error('Expected Sci-Fi movies returned');
      const allMatch = body.data.movies.every((m: { genres: string[] }) =>
        m.genres.some((g: string) => g.toLowerCase() === 'sci-fi')
      );
      if (!allMatch) throw new Error('Returned movie does not match filter genre');
    });

    // 4. Movie search (exact/partial match)
    await assert('Movie Search Match (GET /movies/search?q=cyberpunk or title)', async () => {
      const res = await fetch(`${baseUrl}/movies/search?q=neon`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.count < 1) throw new Error('Expected search to find matching title');
      if (!body.data.movies[0].title.toLowerCase().includes('neon')) throw new Error('Title does not contain query');
    });

    // 5. Movie search (empty / no match)
    await assert('Movie Search No Match (GET /movies/search?q=nonexistent123xyz)', async () => {
      const res = await fetch(`${baseUrl}/movies/search?q=nonexistent123xyz`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.count !== 0 || body.data.movies.length !== 0) {
        throw new Error('Expected empty array for unmatched search');
      }
    });

    // 6. Movie details by ID (Valid)
    await assert('Movie Details Valid (GET /movies/movie-1)', async () => {
      const res = await fetch(`${baseUrl}/movies/movie-1`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.movie.id !== 'movie-1') throw new Error('Invalid movie details payload');
    });

    // 7. Movie details by ID (Not Found - 404)
    await assert('Movie Details 404 (GET /movies/nonexistent-id-999)', async () => {
      const res = await fetch(`${baseUrl}/movies/nonexistent-id-999`);
      if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
      const body = await res.json();
      if (body.success !== false) throw new Error('Expected success false for 404');
    });

    // 8. Auth: Pre-seeded Demo Login
    await assert('Auth: Pre-seeded Demo User Login (POST /auth/login)', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'demo@neonflix.com',
          password: 'DemoPassword123!',
        }),
      });
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || !body.data.token || !body.data.user) throw new Error('Invalid login response');
      if (body.data.user.passwordHash) throw new Error('Security flaw: passwordHash returned!');
    });

    // 9. Auth: Register New User
    await assert('Auth: Register New User (POST /auth/register)', async () => {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Verification Bot',
          email: registeredEmail,
          password: 'SuperPassword123!',
        }),
      });
      if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
      const body = await res.json();
      if (!body.success || !body.data.token || !body.data.user) throw new Error('Invalid register response');
      authToken = body.data.token;
      if (body.data.user.passwordHash) throw new Error('Security flaw: passwordHash returned on register!');
    });

    // 10. Auth: Duplicate Email Registration (409 Conflict)
    await assert('Auth: Duplicate Email Rejection (POST /auth/register)', async () => {
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate Bot',
          email: registeredEmail,
          password: 'SuperPassword123!',
        }),
      });
      if (res.status !== 409) throw new Error(`Expected status 409, got ${res.status}`);
      const body = await res.json();
      if (body.success !== false) throw new Error('Expected success: false on duplicate email');
    });

    // 11. Auth: Invalid Login Credentials (401 Unauthorized)
    await assert('Auth: Invalid Password (POST /auth/login)', async () => {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registeredEmail,
          password: 'WrongPassword!',
        }),
      });
      if (res.status !== 401) throw new Error(`Expected status 401, got ${res.status}`);
      const body = await res.json();
      if (body.success !== false) throw new Error('Expected success: false on invalid login');
    });

    // 12. Security: Protected Endpoint Without Token (401 Unauthorized)
    await assert('Security: Missing Token on Watchlist (GET /watchlist)', async () => {
      const res = await fetch(`${baseUrl}/watchlist`);
      if (res.status !== 401) throw new Error(`Expected status 401, got ${res.status}`);
      const body = await res.json();
      if (body.success !== false) throw new Error('Expected success false when token missing');
    });

    // 13. Security: Protected Endpoint With Malformed Token (401 Unauthorized)
    await assert('Security: Invalid/Malformed Token (GET /watchlist)', async () => {
      const res = await fetch(`${baseUrl}/watchlist`, {
        headers: { Authorization: 'Bearer this.is.a.garbage.token' },
      });
      if (res.status !== 401) throw new Error(`Expected status 401, got ${res.status}`);
    });

    // 14. Watchlist: Add Movie
    await assert('Watchlist: Add Movie (POST /watchlist)', async () => {
      const res = await fetch(`${baseUrl}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ movieId: 'movie-3' }),
      });
      if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.item.movieId !== 'movie-3') throw new Error('Invalid add watchlist payload');
    });

    // 15. Watchlist: Duplicate Add Rejection (409 Conflict)
    await assert('Watchlist: Prevent Duplicate Movie (POST /watchlist)', async () => {
      const res = await fetch(`${baseUrl}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ movieId: 'movie-3' }),
      });
      if (res.status !== 409) throw new Error(`Expected status 409, got ${res.status}`);
    });

    // 16. Watchlist: Retrieve User Watchlist
    await assert('Watchlist: Get Items (GET /watchlist)', async () => {
      const res = await fetch(`${baseUrl}/watchlist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.count < 1) throw new Error('Expected watchlist items');
      if (body.data.watchlist[0].movieId !== 'movie-3') throw new Error('Expected movie-3 in watchlist');
      if (!body.data.watchlist[0].movie) throw new Error('Expected hydrated movie details in watchlist');
    });

    // 17. Watchlist: Remove Movie
    await assert('Watchlist: Remove Item (DELETE /watchlist/:id)', async () => {
      const res = await fetch(`${baseUrl}/watchlist/movie-3`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success) throw new Error('Expected success true on removal');

      // Verify removal
      const checkRes = await fetch(`${baseUrl}/watchlist`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const checkBody = await checkRes.json();
      if (checkBody.data.watchlist.some((item: { movieId: string }) => item.movieId === 'movie-3')) {
        throw new Error('Movie was not removed from watchlist');
      }
    });

    // 18. History: Record Playback Progress
    await assert('History: Add/Update Progress (POST /history)', async () => {
      const res = await fetch(`${baseUrl}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ movieId: 'movie-5', progress: 55 }),
      });
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.item.progress !== 55) throw new Error('Invalid history upsert response');
    });

    // 19. History: Retrieve Watch History
    await assert('History: Get User History (GET /history)', async () => {
      const res = await fetch(`${baseUrl}/history`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.count < 1) throw new Error('Expected history items');
      if (body.data.history[0].movieId !== 'movie-5') throw new Error('Expected movie-5 in history');
      if (!body.data.history[0].movie) throw new Error('Expected hydrated movie object in history');
    });

    // 20. Special Feature 1: Mood-Based Recommendations (All 5 Moods)
    const moods = ['happy', 'sad', 'romantic', 'thriller', 'relaxed'] as const;
    for (const mood of moods) {
      await assert(`Mood Recommendations: "${mood}" (POST /recommendations/mood)`, async () => {
        const res = await fetch(`${baseUrl}/recommendations/mood`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mood }),
        });
        if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
        const body = await res.json();
        if (!body.success || body.data.mood !== mood || body.data.recommendations.length === 0) {
          throw new Error(`Failed recommendations for mood: ${mood}`);
        }
        if (!body.data.recommendations[0].reason) {
          throw new Error('Expected recommendation reason explanation string');
        }
      });
    }

    // 21. Mood Recommendations: Invalid Mood (400 Bad Request)
    await assert('Mood Recommendations: Invalid Mood 400 (POST /recommendations/mood)', async () => {
      const res = await fetch(`${baseUrl}/recommendations/mood`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: 'super-angry' }),
      });
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      const body = await res.json();
      if (body.success !== false) throw new Error('Expected error envelope');
    });

    // 22. Special Feature 2: Quiz Questions Masking (GET /quiz/questions)
    await assert('Quiz Questions: Retrieval & Answer Masking (GET /quiz/questions)', async () => {
      const res = await fetch(`${baseUrl}/quiz/questions`);
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success || body.data.count < 10) throw new Error('Expected at least 10 quiz questions');

      // CRITICAL SECURITY / ANTI-CHEAT CHECK:
      for (const q of body.data.questions) {
        if ('correctOptionId' in q || 'explanation' in q) {
          throw new Error('SECURITY VIOLATION: Answer keys or explanations exposed in public questions response!');
        }
      }
    });

    // 23. Special Feature 2: Quiz Submission & Server-Side Scoring (POST /quiz/submit)
    await assert('Quiz Submission: Scoring & Feedback (POST /quiz/submit)', async () => {
      const res = await fetch(`${baseUrl}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: [
            { questionId: 'q-1', optionId: 'opt-b' }, // Correct (spinning top)
            { questionId: 'q-2', optionId: 'opt-a' }, // Incorrect (1917 instead of Parasite)
          ],
        }),
      });
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      const body = await res.json();
      if (!body.success) throw new Error('Expected success true on quiz submission');
      if (body.data.totalQuestions !== 2) throw new Error('Expected totalQuestions = 2');
      if (body.data.correctAnswers !== 1) throw new Error('Expected correctAnswers = 1');
      if (body.data.incorrectAnswers !== 1) throw new Error('Expected incorrectAnswers = 1');
      if (body.data.score !== 50) throw new Error('Expected score = 50.0%');
      if (body.data.results.length !== 2) throw new Error('Expected 2 result items');
      if (!body.data.results[0].explanation) throw new Error('Expected explanation in post-submission feedback');
    });

    // 24. Quiz Submission: Invalid Payload (400 Bad Request)
    await assert('Quiz Submission: Empty / Invalid Payload (POST /quiz/submit)', async () => {
      const res = await fetch(`${baseUrl}/quiz/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: [] }),
      });
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
    });

    // 25. 404 Route Handler for Unknown Paths
    await assert('Route Not Found 404 Handler (GET /api/v1/unknown-endpoint)', async () => {
      const res = await fetch(`${baseUrl}/unknown-endpoint`);
      if (res.status !== 404) throw new Error(`Expected status 404, got ${res.status}`);
      const body = await res.json();
      if (body.success !== false) throw new Error('Expected success: false for 404');
    });

  } finally {
    server.close();
  }

  // Summary
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  console.log('\n======================================================');
  console.log(`📊 Test Results: ${passedCount} Passed, ${failedCount} Failed`);
  console.log('======================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
