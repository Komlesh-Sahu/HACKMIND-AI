# HACKMIND AI — Frontend

Premium dark-SaaS frontend for the HACKMIND AI hackathon concierge platform.
The FastAPI backend and its four endpoints are untouched:

```
POST /concierge/ask
POST /auditor/audit
POST /matcher/match
POST /agent/analyze
```

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`).
Make sure your FastAPI backend is running at `http://127.0.0.1:8000`.

## What changed vs. the original single-file version

- **Structure**: split into `components/`, `pages/`, and `services/api.js`, matching
  the layout you specified. All four fetch calls live in one place with the exact
  same endpoints, methods and payload shapes as before.
- **Role-based navigation**: a landing screen lets people choose Participant or
  Organizer mode; the sidebar swaps its nav items and highlights the active page
  instead of a single long scrolling page.
- **AI Concierge**: became a real chat thread (bubbles, source badges, typing
  indicator, suggested questions) instead of a single question/answer box.
- **Submission Auditor**: adds a checklist (GitHub / Demo / README / Problem
  Statement), a readiness progress bar, and a priority badge, while still calling
  `/auditor/audit` and auto-triggering `/agent/analyze` exactly like before.
- **Team Matcher**: split profile form / results layout with match-score badges
  and complementary-skill tags.
- **Agent Core**: visualizes the OBSERVE → UNDERSTAND → REASON → DECIDE → ACT →
  MONITOR pipeline (pulses while a request is in flight) and shows a live
  reasoning trace built from the alerts your backend returns.
- **Organizer extras**: a Team Risks board (alerts grouped by priority), an
  Activity Feed timeline, and dashboard stat cards.
- **UX polish**: loading states, empty states, disabled buttons, inline field
  validation, and toast notifications everywhere `alert()` might otherwise have
  been used.

No backend logic, routes, or request/response shapes were changed.
