from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    user_id: str = "default"


class ScoreRequest(BaseModel):
    item_id: str
    selected: str
    user_id: str = "default"
    response_time_ms: Optional[int] = None


class ScoreResponse(BaseModel):
    correct: bool
    explanation: Optional[str] = None
    misconception_tag: Optional[str] = None
    new_mastery: float


class Item(BaseModel):
    id: str
    stem: str
    options: list[str]
    correct_answer: str
    explanation: Optional[str] = None
    objective: str
    difficulty: float = 0.5
    misconceptions: Optional[dict[str, str]] = None


class ItemCreate(BaseModel):
    stem: str
    options: list[str]
    correct_answer: str
    explanation: Optional[str] = None
    objective: str
    difficulty: float = 0.5
    misconceptions: Optional[dict[str, str]] = None


class LearnerState(BaseModel):
    user_id: str
    objective: str
    mastery: float = 0.0
    attempts: int = 0
    last_attempt: Optional[datetime] = None


class LearnerProfile(BaseModel):
    user_id: str
    objectives: list[LearnerState]
