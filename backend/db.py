import os
import json
import uuid
from datetime import datetime
from typing import Optional
import libsql_experimental as libsql
from dotenv import load_dotenv

from models import Item, LearnerState, ScoreResponse

load_dotenv()

DATABASE_URL = os.getenv("TURSO_DATABASE_URL", "file:local.db")
AUTH_TOKEN = os.getenv("TURSO_AUTH_TOKEN", "")


def get_connection():
    """Get a database connection."""
    if DATABASE_URL.startswith("file:"):
        return libsql.connect(DATABASE_URL.replace("file:", ""))
    return libsql.connect(DATABASE_URL, auth_token=AUTH_TOKEN)


def init_db():
    """Initialize the database schema."""
    conn = get_connection()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id TEXT PRIMARY KEY,
            stem TEXT NOT NULL,
            options TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT,
            objective TEXT NOT NULL,
            difficulty REAL DEFAULT 0.5,
            misconceptions TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT DEFAULT 'default',
            item_id TEXT REFERENCES items(id),
            selected TEXT,
            correct INTEGER,
            response_time_ms INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.execute("""
        CREATE TABLE IF NOT EXISTS learner_state (
            user_id TEXT,
            objective TEXT,
            mastery REAL DEFAULT 0,
            attempts INTEGER DEFAULT 0,
            last_attempt DATETIME,
            PRIMARY KEY (user_id, objective)
        )
    """)

    conn.commit()


def get_item(item_id: str) -> Optional[Item]:
    """Get an item by ID."""
    conn = get_connection()
    result = conn.execute(
        "SELECT id, stem, options, correct_answer, explanation, objective, difficulty, misconceptions FROM items WHERE id = ?",
        [item_id]
    ).fetchone()

    if not result:
        return None

    return Item(
        id=result[0],
        stem=result[1],
        options=json.loads(result[2]),
        correct_answer=result[3],
        explanation=result[4],
        objective=result[5],
        difficulty=result[6] or 0.5,
        misconceptions=json.loads(result[7]) if result[7] else None
    )


def get_assessment_item(objective: str, difficulty: Optional[float] = None, user_id: str = "default") -> Optional[Item]:
    """Get an assessment item for an objective, preferring items not recently answered."""
    conn = get_connection()

    # Get items for this objective, ordered by least recently answered
    query = """
        SELECT i.id, i.stem, i.options, i.correct_answer, i.explanation, i.objective, i.difficulty, i.misconceptions
        FROM items i
        LEFT JOIN (
            SELECT item_id, MAX(created_at) as last_answered
            FROM responses
            WHERE user_id = ?
            GROUP BY item_id
        ) r ON i.id = r.item_id
        WHERE i.objective LIKE ?
    """
    params = [user_id, f"%{objective}%"]

    if difficulty is not None:
        query += " AND ABS(i.difficulty - ?) < 0.3"
        params.append(difficulty)

    query += " ORDER BY r.last_answered IS NULL DESC, r.last_answered ASC LIMIT 1"

    result = conn.execute(query, params).fetchone()

    if not result:
        return None

    return Item(
        id=result[0],
        stem=result[1],
        options=json.loads(result[2]),
        correct_answer=result[3],
        explanation=result[4],
        objective=result[5],
        difficulty=result[6] or 0.5,
        misconceptions=json.loads(result[7]) if result[7] else None
    )


def create_item(
    stem: str,
    options: list[str],
    correct_answer: str,
    objective: str,
    explanation: Optional[str] = None,
    difficulty: float = 0.5,
    misconceptions: Optional[dict[str, str]] = None
) -> Item:
    """Create a new assessment item."""
    conn = get_connection()
    item_id = str(uuid.uuid4())[:8]

    conn.execute(
        """INSERT INTO items (id, stem, options, correct_answer, explanation, objective, difficulty, misconceptions)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
        [
            item_id,
            stem,
            json.dumps(options),
            correct_answer,
            explanation,
            objective,
            difficulty,
            json.dumps(misconceptions) if misconceptions else None
        ]
    )
    conn.commit()

    return Item(
        id=item_id,
        stem=stem,
        options=options,
        correct_answer=correct_answer,
        explanation=explanation,
        objective=objective,
        difficulty=difficulty,
        misconceptions=misconceptions
    )


def score_response(
    item_id: str,
    selected: str,
    user_id: str = "default",
    response_time_ms: Optional[int] = None
) -> ScoreResponse:
    """Score a response and update learner state."""
    conn = get_connection()

    # Get the item
    item = get_item(item_id)
    if not item:
        raise ValueError(f"Item {item_id} not found")

    correct = selected.lower() == item.correct_answer.lower()

    # Record the response
    conn.execute(
        """INSERT INTO responses (user_id, item_id, selected, correct, response_time_ms)
           VALUES (?, ?, ?, ?, ?)""",
        [user_id, item_id, selected, 1 if correct else 0, response_time_ms]
    )

    # Update learner state
    # First, get or create learner state
    state = conn.execute(
        "SELECT mastery, attempts FROM learner_state WHERE user_id = ? AND objective = ?",
        [user_id, item.objective]
    ).fetchone()

    if state:
        old_mastery, old_attempts = state
        new_attempts = old_attempts + 1
        # Calculate new mastery as running average
        correct_count = round(old_mastery * old_attempts) + (1 if correct else 0)
        new_mastery = correct_count / new_attempts

        conn.execute(
            """UPDATE learner_state
               SET mastery = ?, attempts = ?, last_attempt = CURRENT_TIMESTAMP
               WHERE user_id = ? AND objective = ?""",
            [new_mastery, new_attempts, user_id, item.objective]
        )
    else:
        new_mastery = 1.0 if correct else 0.0
        conn.execute(
            """INSERT INTO learner_state (user_id, objective, mastery, attempts, last_attempt)
               VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)""",
            [user_id, item.objective, new_mastery]
        )

    conn.commit()

    # Get misconception tag if wrong
    misconception_tag = None
    if not correct and item.misconceptions:
        misconception_tag = item.misconceptions.get(selected.lower())

    return ScoreResponse(
        correct=correct,
        explanation=item.explanation,
        misconception_tag=misconception_tag,
        new_mastery=new_mastery
    )


def get_learner_profile(user_id: str) -> list[LearnerState]:
    """Get all learner states for a user."""
    conn = get_connection()
    results = conn.execute(
        "SELECT user_id, objective, mastery, attempts, last_attempt FROM learner_state WHERE user_id = ?",
        [user_id]
    ).fetchall()

    return [
        LearnerState(
            user_id=row[0],
            objective=row[1],
            mastery=row[2] or 0.0,
            attempts=row[3] or 0,
            last_attempt=datetime.fromisoformat(row[4]) if row[4] else None
        )
        for row in results
    ]


def get_all_objectives() -> list[str]:
    """Get all unique objectives."""
    conn = get_connection()
    results = conn.execute("SELECT DISTINCT objective FROM items").fetchall()
    return [row[0] for row in results]
