# TravelMate

TravelMate is an AI-powered travel companion for exploring Sri Lanka. Describe what you are looking for—beaches, temples, wildlife, adventure—and get personalized destination recommendations powered by review data and natural-language matching. Browse locations by city and type, read top traveler reviews, and discover places across the island.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, React Router, Vite |
| **Backend API** | Python, FastAPI, Uvicorn |
| **Recommendations** | scikit-learn (TF-IDF + cosine similarity), vectors stored in PostgreSQL |
| **Database** | PostgreSQL (`psycopg2` in Python, `pg` in Node) |
| **Data import** | Node.js (`csv-parser`) — seeds DB from `Reviews.csv`; `build_vectors.py` persists TF-IDF |
| **Deployment** | [Render](render.yaml) (API + static site), [Vercel](vercel.json) (frontend) |

## Prerequisites

- **Node.js** 18+ (for frontend and data import script)
- **Python** 3.12+
- **PostgreSQL** (local instance or a hosted provider such as Neon)

## Local Setup

### 1. Clone and configure environment

From the project root, create a `.env` file:

```env
# PostgreSQL (used by the Python API locally)
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=travelmate
DB_PORT=5432

# Frontend → API URL (Vite reads env from project root)
VITE_API_BASE_URL=http://localhost:8000
```

For the data import script (`npm run import`), set the same connection details under `NEON_DB_*` (the script expects these variable names):

```env
NEON_DB_HOST=localhost
NEON_DB_USER=postgres
NEON_DB_PASSWORD=your_password
NEON_DB_NAME=travelmate
NEON_DB_PORT=5432
```

### 2. Create the database and tables

```bash
createdb travelmate
psql -d travelmate -c "
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  city VARCHAR(255),
  type VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  location_id INTEGER REFERENCES locations(id),
  user_id VARCHAR(255),
  rating INTEGER,
  title TEXT,
  text TEXT,
  published_date TIMESTAMP
);

-- TF-IDF model (vocabulary + IDF weights) used to vectorize user preferences
CREATE TABLE IF NOT EXISTS tfidf_model (
  id SERIAL PRIMARY KEY,
  vocabulary JSONB NOT NULL,
  idf JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- One sparse TF-IDF vector per location (locations 1 — 1 place_vectors)
CREATE TABLE IF NOT EXISTS place_vectors (
  location_id INTEGER PRIMARY KEY REFERENCES locations(id) ON DELETE CASCADE,
  vector JSONB NOT NULL
);

-- App users (email/password + OAuth)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255),
  password_hash TEXT,
  provider VARCHAR(50) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (provider, provider_id)
);
"
```

**Relationships:** `locations` 1→many `reviews`; `locations` 1→1 `place_vectors`; `tfidf_model` holds the shared vocabulary/IDF for transforming preference text. Recommendations read vectors from Postgres (not from an in-memory CSV fit). `users` stores registered accounts (`local` email/password or OAuth providers).

### 3. Backend

```bash
cd backend
pip install -r requirements.txt
npm install
npm run import              # loads Reviews.csv into PostgreSQL (run once)
npm run build-vectors       # or: python3 build_vectors.py — fit TF-IDF from DB and store vectors
python3 app.py              # API at http://localhost:8000
```

The API serves:

- `GET /` — health check  
- `GET /locations` — destinations grouped by city  
- `GET /location-types` — destinations grouped by type  
- `GET /reviews?location_name=...` — top reviews for a place  
- `POST /recommend` — AI recommendations from natural-language preferences (loads TF-IDF data from Postgres)  
- `POST /auth/register` — create local account (username + email + password)  
- `POST /auth/login` — email/password login (404 → not registered)  
- `GET /auth/google` / `GET /auth/github` / `GET /auth/facebook` — OAuth (`mode=login|register`)  
- `GET /auth/me` — current user (session cookie)  
- `POST /auth/logout` — clear session cookie  

### OAuth setup (Google + GitHub)

Add these to the root `.env` (see `.env.example`):

```env
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
JWT_SECRET=change-me-to-a-long-random-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
```

Provider redirect URIs:

- Google: `http://localhost:8000/auth/google/callback`
- GitHub: `http://localhost:8000/auth/github/callback`
- Facebook: `http://localhost:8000/auth/facebook/callback`

Auth flows:

- **Register:** username required, then email/password **or** OAuth provider. Saved in `users`.
- **Login:** email/password checked in DB; if missing → redirect to `/register` with “User not registered…”. OAuth login only succeeds if that provider account already exists; otherwise same register redirect.
- Session is an **httpOnly** `travelmate_session` cookie. Frontend uses `credentials: "include"`.

For local dev keep `COOKIE_SAMESITE=lax` and `COOKIE_SECURE=false`. If the frontend and API are on different sites in production, use `COOKIE_SAMESITE=none` and `COOKIE_SECURE=true`, and set `CORS_ORIGINS` to your frontend origin.

Interactive docs: `http://localhost:8000/docs`

### 4. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app opens in your browser (default Vite dev server). It talks to the API via `VITE_API_BASE_URL`.

## Project Structure

```
TravelMate/
├── backend/          # FastAPI app, ML recommender, DB access, CSV import
│   ├── app.py
│   ├── recommender.py      # loads TF-IDF vectors from Postgres
│   ├── build_vectors.py    # fit TF-IDF from DB reviews and store vectors
│   ├── details.py
│   └── Reviews.csv
├── frontend/         # React + Vite SPA
│   └── src/
├── render.yaml       # Render deployment config
└── vercel.json       # Vercel frontend config
```

## Features

- **Discover** — preference-based AI recommendations (TF-IDF over review text, served from Postgres)
- **Places** — browse Sri Lankan destinations by city and category
- **Reviews** — top-rated traveler reviews per location
- **Sign in** — Google and GitHub OAuth (httpOnly session cookie)
- **About & Contact** — project info and contact form

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
