from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
from contextlib import asynccontextmanager

import db
from models import (
    ChatRequest,
    ScoreRequest,
    ScoreResponse,
    ItemCreate,
    Item,
    LearnerProfile,
)
from claude_client import chat_stream


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database on startup
    db.init_db()
    yield


app = FastAPI(title="MCQ Learning Chat API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/chat")
async def chat(request: ChatRequest):
    """Stream chat response with Claude, handling MCQ tool calls."""
    messages = [{"role": m.role, "content": m.content} for m in request.messages]

    return EventSourceResponse(
        chat_stream(messages, request.user_id),
        media_type="text/event-stream"
    )


@app.post("/score", response_model=ScoreResponse)
async def score(request: ScoreRequest):
    """Score a learner's response to an MCQ."""
    try:
        result = db.score_response(
            item_id=request.item_id,
            selected=request.selected,
            user_id=request.user_id,
            response_time_ms=request.response_time_ms
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/profile/{user_id}", response_model=LearnerProfile)
async def get_profile(user_id: str):
    """Get learner profile with mastery levels for all objectives."""
    objectives = db.get_learner_profile(user_id)
    return LearnerProfile(user_id=user_id, objectives=objectives)


@app.post("/items", response_model=Item)
async def create_item(item: ItemCreate):
    """Create a new assessment item."""
    return db.create_item(
        stem=item.stem,
        options=item.options,
        correct_answer=item.correct_answer,
        objective=item.objective,
        explanation=item.explanation,
        difficulty=item.difficulty,
        misconceptions=item.misconceptions
    )


@app.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: str):
    """Get an assessment item by ID."""
    item = db.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.get("/objectives")
async def get_objectives():
    """Get all available objectives."""
    return {"objectives": db.get_all_objectives()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
