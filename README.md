# MCQ Learning Chat

An interactive chat interface with Claude that renders multiple-choice assessments as interactive buttons. Claude assesses understanding before teaching new concepts.

## Stack

- **Frontend**: Next.js 14, App Router, Tailwind CSS, shadcn/ui components
- **Backend**: FastAPI (Python)
- **Database**: Turso (libsql) / SQLite for local development
- **AI**: Claude claude-sonnet-4-20250514 via Anthropic SDK with tool use
- **Deploy**: Vercel (frontend), Railway (backend)

## Features

- Assessment-first pedagogy: Claude checks understanding before explaining
- Interactive MCQ blocks rendered inline in chat
- Immediate feedback with explanations and misconception tagging
- Learner progress tracking across objectives
- Streaming responses for real-time interaction

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Anthropic API key

### Local Development

1. **Clone and setup backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure environment:**

```bash
# backend/.env
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

3. **Seed the database:**

```bash
python seed.py
```

4. **Run backend:**

```bash
uvicorn main:app --reload
```

5. **Setup frontend (new terminal):**

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

6. **Open http://localhost:3000**

### Using Docker

```bash
# Set your Anthropic API key
export ANTHROPIC_API_KEY=your-key-here

# Start services
docker-compose up

# Seed database (first time only)
docker-compose exec backend python seed.py
```

## Project Structure

```
/frontend (Next.js)
  /app
    page.tsx          # Main chat page
    layout.tsx        # Root layout
    globals.css       # Global styles
  /components
    chat-interface.tsx   # Main chat container
    chat-messages.tsx    # Message list with auto-scroll
    chat-input.tsx       # Text input with send button
    mcq-block.tsx        # Interactive MCQ rendering
    learner-profile.tsx  # Progress modal
  /lib
    parse-mcq.ts      # MCQ markdown parser
    api.ts            # API client functions
    utils.ts          # Utility functions
  /types
    index.ts          # TypeScript types

/backend (FastAPI)
  main.py             # FastAPI endpoints
  db.py               # Database operations
  models.py           # Pydantic models
  claude_client.py    # Claude API with tools
  seed.py             # Database seeding
  requirements.txt    # Python dependencies
```

## API Endpoints

### POST /chat
Stream chat response with Claude, handling MCQ tool calls.

```json
{
  "messages": [{"role": "user", "content": "Explain recursion"}],
  "user_id": "default"
}
```

### POST /score
Score a learner's MCQ response.

```json
{
  "item_id": "abc123",
  "selected": "b",
  "user_id": "default",
  "response_time_ms": 5000
}
```

### GET /profile/{user_id}
Get learner's mastery levels across objectives.

### POST /items
Create a new assessment item.

## MCQ Block Format

Claude outputs MCQs in this markdown format, which the frontend parses:

```
?mcq id="abc123" objective="recursion"
What is a base case?
- (a) First function call
- (b) Condition that stops recursion
- (c) The recursive step
- (d) Error handling
?correct b
?explanation The base case prevents infinite recursion.
?misconception:a "Confusing invocation with termination"
```

## Database Schema

```sql
-- Assessment items
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  stem TEXT NOT NULL,
  options TEXT NOT NULL,  -- JSON array
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  objective TEXT NOT NULL,
  difficulty REAL DEFAULT 0.5,
  misconceptions TEXT,    -- JSON object
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Learner responses
CREATE TABLE responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT DEFAULT 'default',
  item_id TEXT REFERENCES items(id),
  selected TEXT,
  correct INTEGER,
  response_time_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Learner progress
CREATE TABLE learner_state (
  user_id TEXT,
  objective TEXT,
  mastery REAL DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  last_attempt DATETIME,
  PRIMARY KEY (user_id, objective)
);
```

## Environment Variables

### Backend (.env)
```
ANTHROPIC_API_KEY=sk-ant-...
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Deployment

### Backend (Railway)
1. Connect your repository
2. Set environment variables
3. Deploy from `/backend` directory

### Frontend (Vercel)
1. Import project
2. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
3. Deploy from `/frontend` directory

## License

MIT
