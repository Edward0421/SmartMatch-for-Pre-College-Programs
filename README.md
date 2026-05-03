# Vantion SmartMatch — Pre-College Program Discovery

Demo: https://youtu.be/Ci_dQvXn_T8?si=20z1yaAUOJdG0sxF

> An AI-assisted decision support feature that helps high school students discover and understand pre-college programs — like having an AI counselor in your corner.

## Current Highlights

- Student profile intake for interests, GPA, grade level, budget, format, and duration
- Rule-based program matching across 5 weighted dimensions
- Personalized AI counselor explanations powered by **Google Gemini 2.5 Flash**
- Saveable recommendation cards with a one-click gold star interaction
- Warm, modern Vantion-style interface with top-right `Cart / Log In / Sign Up` navigation

## Quick Start

You'll need two terminals.

### 1. Start the Backend

```bash
cd backend
npm install
npm start
# → Running at http://localhost:3001
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# → Running at http://localhost:5173
```

Then open **http://localhost:5173** in your browser.

---

## Project Structure

```
SmartMatch-for-Pre-College-Programs/
├── backend/
│   ├── data/
│   │   └── programs.json          # 12 mock pre-college programs
│   ├── routes/
│   │   └── programs.js            # API route handlers
│   ├── services/
│   │   └── explanationService.js  # Gemini-powered explanation generator
│   ├── utils/
│   │   └── scoring.js             # Rule-based matching engine
│   ├── server.js                  # Express entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── UserForm.jsx        # Student profile input
    │   │   ├── ProgramCard.jsx     # Program card w/ score ring + save star
    │   │   ├── ProgramList.jsx     # Ranked results list
    │   │   ├── ProgramDetail.jsx   # Full detail modal
    │   │   └── utils.js            # Shared helpers
    │   ├── App.jsx                 # Root component, API wiring, saved state
    │   ├── index.css               # Warm Vantion-inspired design system
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Frontend Features

- **Smart profile form** collects the student's academic and personal preferences
- **Top-match ranking cards** surface the best-fit programs with score rings and fit summaries
- **Save star interaction** lets users bookmark programs directly from the card view
- **Saved state persistence** stores saved cards in `localStorage`, so they remain after refresh
- **Detailed modal view** shows deeper program information plus AI-generated explanation

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/programs` | Returns all 12 mock programs |
| `POST` | `/api/match-programs` | Scores & ranks programs for a student profile |
| `POST` | `/api/explain-match` | Generates personalized AI explanation |

### POST `/api/match-programs`

**Request body:**
```json
{
  "interests": ["computer science", "mathematics"],
  "gpa": 3.8,
  "gradeLevel": "11",
  "budget": 5000,
  "format": "in-person",
  "durationMin": "2",
  "durationMax": "8"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "p001",
      "name": "MIT Research Science Institute (RSI)",
      "matchScore": 91,
      "breakdown": {
        "interestMatch": 100,
        "gpaEligibility": 100,
        "budgetFit": 100,
        "formatMatch": 100,
        "durationFit": 75
      }
    }
  ]
}
```

---

## AI Explanation Flow

When a user opens a program's detailed view, the frontend sends the selected `profile` and `program` to `/api/explain-match`. The backend then:

1. Checks whether a valid `GEMINI_API_KEY` is configured
2. Calls **Google Gemini 2.5 Flash** for a short counselor-style explanation
3. Falls back to a local template response if the model call fails or no API key is available

This gives the project a reliable demo path while still supporting real AI-generated guidance.

---

## Matching Algorithm

Programs are scored across 5 weighted dimensions:

| Dimension | Weight | Logic |
|-----------|--------|-------|
| Interest Match | 35% | Keyword overlap between student interests and program subject areas |
| GPA Eligibility | 20% | Full points if GPA ≥ minimum; partial credit for near misses |
| Budget Fit | 20% | Scales with how far over budget; free programs always score 100 |
| Format Match | 15% | Exact match = 100; no preference = 75; mismatch = 20 |
| Duration Fit | 10% | Score based on how well program length fits preferred range |

Top 5 eligible programs (filtered by grade level) are returned sorted by match score.

---

## Design Philosophy

This is built as a **feature extension** of an AI college counseling platform, not a standalone search tool. The UX deliberately avoids filter-heavy interfaces and instead focuses on:

- **AI counselor tone** — "Based on your profile…" language throughout
- **Guidance over data** — match scores contextualized with explanations
- **Decision support** — helping students understand *why* a program fits them
- **Lightweight saving flow** — students can quickly star programs they want to revisit

Built with a warm, modern Vantion-inspired design system that feels approachable, polished, and student-friendly.
