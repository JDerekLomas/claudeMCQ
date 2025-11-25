# MCQ Learning Chat

A Claude.ai clone demonstrating a "Learning Mode" feature concept where Claude assesses understanding with interactive MCQs before teaching.

## Vision

**The Problem**: Traditional AI tutors explain first, then quiz. This misses the opportunity to tailor explanations to what the learner already knows.

**The Solution**: Assessment-first pedagogy. When Learning Mode is enabled, Claude:
1. Presents an MCQ to gauge current understanding
2. Analyzes the response (correct answer vs. specific misconception)
3. Tailors the explanation based on what the learner knows/doesn't know
4. Tracks mastery over time to adapt difficulty

**The Goal**: A reusable pattern for AI-powered adaptive learning that could be integrated into Claude.ai or education products.

## Live Demo

- **Frontend**: https://claude-mcq.vercel.app
- **Backend**: https://claudemcq-production.up.railway.app

## Current State

### Done
| Feature | Status |
|---------|--------|
| Claude.ai UI clone (pixel-perfect) | Complete |
| Dark sidebar with chat history | Complete |
| Learning Mode toggle | Complete |
| Streaming chat with Claude | Complete |
| MCQ rendering with radio buttons | Complete |
| Correct/incorrect feedback + animations | Complete |
| Explanation reveal with misconception tags | Complete |
| Backend API with Claude tool use | Complete |
| SQLite database for items & responses | Complete |
| Mobile responsive design | Complete |
| Vercel + Railway deployment | Complete |

### Remaining
| Feature | Priority |
|---------|----------|
| Seed database on Railway | **Blocking** |
| Persist chat history to DB | High |
| Learner profile modal | High |
| User authentication | Medium |
| Dark mode | Low |
| Content authoring UI | Low |
| Unit tests | Low |

## Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide icons
- **Backend**: FastAPI, Anthropic SDK, SQLite/Turso
- **AI**: Claude Sonnet 4 with tool use
- **Deploy**: Vercel (frontend), Railway (backend)

## How It Works

### Learning Mode Flow

```
User: "Teach me about recursion"
         ↓
Claude calls get_assessment_item tool
         ↓
Backend returns MCQ from database
         ↓
Claude formats as ?mcq block
         ↓
Frontend renders interactive MCQ
         ↓
User clicks answer → POST /score
         ↓
Immediate feedback shown
         ↓
Claude continues with tailored explanation
```

### MCQ Format

Claude outputs this markdown, frontend parses and renders:

```
?mcq id="abc123" objective="recursion-base-case"
What is a base case in recursion?
- (a) First function call
- (b) Condition that stops recursion
- (c) The recursive step
- (d) Error handling
?correct b
?explanation The base case prevents infinite recursion.
?misconception:a "Confusing invocation with termination"
```

## Quick Start

### Local Development

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Add ANTHROPIC_API_KEY
python seed.py
python main.py

# Frontend (new terminal)
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000

### Deploy to Railway

1. Connect GitHub repo
2. Set root directory: `backend`
3. Add env vars: `ANTHROPIC_API_KEY`, `TURSO_DATABASE_URL=file:local.db`
4. Deploy
5. Run `python seed.py` in Railway shell

### Deploy to Vercel

1. Import GitHub repo
2. Set root directory: `frontend`
3. Add env var: `NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app`
4. Deploy

## Project Structure

```
/backend
  main.py              # FastAPI endpoints
  claude_client.py     # Claude API + tools
  db.py                # SQLite operations
  models.py            # Pydantic models
  seed.py              # 10 sample MCQs

/frontend
  /app
    page.tsx           # Main app
    globals.css        # Claude.ai design tokens
  /components
    /sidebar           # Dark sidebar, chat list, toggle
    /chat              # Messages, input, model selector
    /mcq               # MCQ block, options, explanation
  /lib
    api.ts             # Backend client
    parse-mcq.ts       # ?mcq parser
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/chat` | POST | Stream chat (SSE) |
| `/score` | POST | Score MCQ response |
| `/profile/{user_id}` | GET | Learner mastery levels |
| `/items` | POST | Create MCQ item |
| `/objectives` | GET | List objectives |

## Seed Data

10 MCQs across 4 objectives:
- `recursion-base-case` (3)
- `recursion-call-stack` (3)
- `python-lists` (2)
- `javascript-promises` (2)

## Environment Variables

```bash
# Backend
ANTHROPIC_API_KEY=sk-ant-...
TURSO_DATABASE_URL=file:local.db

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Design

Colors match Claude.ai:
- Background: `#f5f5f4` (warm stone)
- Sidebar: `#1a1a1a` (near black)
- Accent: `#d97706` (Anthropic amber)
- Correct: `#16a34a` (green)
- Incorrect: `#dc2626` (red)

## License

MIT
