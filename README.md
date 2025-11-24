# MCQ Learning Chat - Claude.ai Clone

A pixel-perfect Claude.ai clone demonstrating a "Learning Mode" feature concept. When enabled, Claude assesses understanding with interactive MCQs before teaching new concepts.

## Current State

### Completed
- **Claude.ai UI Clone**: Dark sidebar, warm stone chat area, styled messages
- **Sidebar**: Logo, chat history (grouped by date), Learning Mode toggle, user menu
- **Chat Interface**: Model selector, streaming messages, typing indicator
- **MCQ Components**: Radio button options, correct/incorrect states, explanation reveal
- **Backend API**: FastAPI with Claude tool use, SSE streaming, SQLite/Turso database
- **Learning Mode Toggle**: Switches between assessment-first and normal Claude behavior
- **Mobile Responsive**: Collapsible sidebar with hamburger menu

### What Remains
- [ ] Persist chat history to database (currently in-memory only)
- [ ] User authentication
- [ ] Learner profile modal (view mastery across objectives)
- [ ] Dark mode support
- [ ] More seed data / content authoring UI
- [ ] Production deployment configuration
- [ ] Unit and integration tests

## Stack

- **Frontend**: Next.js 14, App Router, Tailwind CSS, Lucide icons
- **Backend**: FastAPI (Python)
- **Database**: Turso (libsql) / SQLite for local development
- **AI**: Claude claude-sonnet-4-20250514 via Anthropic SDK with tool use
- **Deploy**: Vercel (frontend), Railway (backend)

## Features

- **Assessment-first pedagogy**: Claude checks understanding before explaining
- **Interactive MCQ blocks**: Rendered inline with immediate feedback
- **Misconception tagging**: Shows common errors when learner answers incorrectly
- **Learner progress tracking**: Mastery levels stored per objective
- **Streaming responses**: Real-time character-by-character display
- **Learning Mode toggle**: Switch between teaching and normal chat modes

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Anthropic API key

### Local Development

1. **Setup backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
python seed.py
uvicorn main:app --reload
```

2. **Setup frontend (new terminal):**

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

3. **Open http://localhost:3000**

### Using Docker

```bash
export ANTHROPIC_API_KEY=your-key-here
docker-compose up
docker-compose exec backend python seed.py  # First time only
```

## Project Structure

```
/frontend (Next.js)
  /app
    page.tsx              # Main app with sidebar + chat
    layout.tsx            # Root layout
    globals.css           # Claude.ai design system
  /components
    /sidebar
      sidebar.tsx         # Main sidebar container
      claude-logo.tsx     # Sparkle logo icon
      chat-list.tsx       # Chat history grouped by date
      learning-mode-toggle.tsx
      user-menu.tsx       # Profile dropdown
    /chat
      chat-interface.tsx  # Main chat area
      chat-input.tsx      # Message input with send button
      message.tsx         # Message wrapper
      user-message.tsx    # Right-aligned dark bubble
      claude-message.tsx  # Left-aligned with icon
      claude-icon.tsx     # Amber sparkle SVG
      model-selector.tsx  # Dropdown for model selection
    /mcq
      mcq-block.tsx       # MCQ container with state machine
      mcq-option.tsx      # Radio button options
      mcq-explanation.tsx # Explanation with lightbulb icon
  /lib
    parse-mcq.ts          # Parse ?mcq blocks from responses
    api.ts                # Backend API client with streaming
    utils.ts              # cn() classname utility
  /hooks
    use-chat.ts           # Chat state management
  /types
    index.ts              # TypeScript interfaces

/backend (FastAPI)
  main.py                 # API endpoints
  db.py                   # Database operations (Turso/SQLite)
  models.py               # Pydantic models
  claude_client.py        # Claude API with tools
  seed.py                 # Seed 10 MCQ items
  requirements.txt
```

## API Endpoints

### POST /chat
Stream chat response with Claude. Supports learning mode toggle.

```json
{
  "messages": [{"role": "user", "content": "Explain recursion"}],
  "user_id": "default",
  "learning_mode": true
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

### GET /objectives
List all available learning objectives.

## Design System

```css
/* Colors */
--bg-main: #f5f5f4;          /* Warm stone background */
--bg-sidebar: #1a1a1a;        /* Dark sidebar */
--bg-user-msg: #1a1a1a;       /* User message bubble */
--accent-primary: #d97706;    /* Anthropic amber */
--mcq-correct: #16a34a;       /* Green for correct */
--mcq-incorrect: #dc2626;     /* Red for incorrect */

/* Typography */
Font: Styrene A (fallback to system)
Base size: 15px
Line height: 1.6
```

## MCQ Block Format

Claude outputs MCQs in this format when Learning Mode is enabled:

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

## Seed Data

10 MCQ items across 4 learning objectives:
- `recursion-base-case` (3 items)
- `recursion-call-stack` (3 items)
- `python-lists` (2 items)
- `javascript-promises` (2 items)

## Environment Variables

### Backend (.env)
```
ANTHROPIC_API_KEY=sk-ant-...
TURSO_DATABASE_URL=file:local.db
TURSO_AUTH_TOKEN=
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Demo Flow

1. Open app - sidebar shows Learning Mode toggle ON
2. Type "Teach me about recursion"
3. Claude presents an MCQ first (assesses understanding)
4. Click an answer
5. See immediate green/red feedback + explanation
6. Claude continues teaching based on your response

## License

MIT
