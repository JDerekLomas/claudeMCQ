import os
import json
from typing import AsyncGenerator
from anthropic import Anthropic
from dotenv import load_dotenv

import db
from models import Item

load_dotenv()

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

TOOLS = [
    {
        "name": "get_assessment_item",
        "description": "Get an MCQ to check learner understanding. Use BEFORE explaining new concepts to assess what the learner already knows.",
        "input_schema": {
            "type": "object",
            "properties": {
                "objective": {
                    "type": "string",
                    "description": "The learning objective to assess (e.g., 'recursion-base-case', 'python-lists')"
                },
                "difficulty": {
                    "type": "number",
                    "description": "Target difficulty from 0.0 (easy) to 1.0 (hard). Optional."
                }
            },
            "required": ["objective"]
        }
    },
    {
        "name": "get_learner_profile",
        "description": "Get the learner's current mastery levels across all objectives they've been assessed on.",
        "input_schema": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "The learner's user ID"
                }
            },
            "required": ["user_id"]
        }
    }
]

SYSTEM_PROMPT_LEARNING = """You are an adaptive learning assistant that uses assessment-first pedagogy. Your approach:

1. ASSESS BEFORE TEACHING: When a learner asks about a topic, first use get_assessment_item to check their current understanding. This helps you tailor your explanation to their level.

2. After presenting an MCQ, wait for the learner to answer before explaining.

3. Format MCQs using this exact markdown format:
?mcq id="<item_id>" objective="<objective>"
<stem question>
- (a) <option a>
- (b) <option b>
- (c) <option c>
- (d) <option d>
?correct <correct_letter>
?explanation <explanation text>
?misconception:<letter> "<misconception description>"

4. After seeing their response (correct or incorrect), provide targeted feedback and explanation.

5. Use get_learner_profile to understand what the learner has already mastered.

6. Be encouraging but honest. Acknowledge mistakes as learning opportunities.

7. Keep explanations concise but thorough. Use examples and analogies."""

SYSTEM_PROMPT_NORMAL = """You are Claude, an AI assistant made by Anthropic. You are helpful, harmless, and honest. Keep your responses clear and concise."""


def format_mcq_block(item: Item) -> str:
    """Format an item as an MCQ markdown block."""
    options_text = "\n".join([f"- ({chr(97+i)}) {opt}" for i, opt in enumerate(item.options)])

    block = f"""?mcq id="{item.id}" objective="{item.objective}"
{item.stem}
{options_text}
?correct {item.correct_answer}"""

    if item.explanation:
        block += f"\n?explanation {item.explanation}"

    if item.misconceptions:
        for letter, description in item.misconceptions.items():
            block += f'\n?misconception:{letter} "{description}"'

    return block


def process_tool_call(tool_name: str, tool_input: dict, user_id: str) -> str:
    """Process a tool call and return the result."""
    if tool_name == "get_assessment_item":
        objective = tool_input.get("objective", "")
        difficulty = tool_input.get("difficulty")

        item = db.get_assessment_item(objective, difficulty, user_id)
        if item:
            return json.dumps({
                "found": True,
                "item": item.model_dump(),
                "mcq_block": format_mcq_block(item)
            })
        else:
            return json.dumps({
                "found": False,
                "message": f"No assessment items found for objective: {objective}"
            })

    elif tool_name == "get_learner_profile":
        target_user = tool_input.get("user_id", user_id)
        profile = db.get_learner_profile(target_user)
        return json.dumps({
            "user_id": target_user,
            "objectives": [
                {
                    "objective": s.objective,
                    "mastery": s.mastery,
                    "attempts": s.attempts
                }
                for s in profile
            ]
        })

    return json.dumps({"error": f"Unknown tool: {tool_name}"})


async def chat_stream(messages: list[dict], user_id: str, learning_mode: bool = True) -> AsyncGenerator[str, None]:
    """Stream a chat response, handling tool calls."""
    # Convert messages to Claude format
    claude_messages = [
        {"role": m["role"], "content": m["content"]}
        for m in messages
    ]

    system_prompt = SYSTEM_PROMPT_LEARNING if learning_mode else SYSTEM_PROMPT_NORMAL
    tools = TOOLS if learning_mode else None

    while True:
        # Create streaming response
        stream_kwargs = {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 4096,
            "system": system_prompt,
            "messages": claude_messages
        }
        if tools:
            stream_kwargs["tools"] = tools

        with client.messages.stream(**stream_kwargs) as stream:
            full_response = ""
            tool_use_block = None
            current_tool_input = ""

            for event in stream:
                if event.type == "content_block_start":
                    if hasattr(event.content_block, "type"):
                        if event.content_block.type == "tool_use":
                            tool_use_block = {
                                "id": event.content_block.id,
                                "name": event.content_block.name,
                                "input": ""
                            }
                            current_tool_input = ""

                elif event.type == "content_block_delta":
                    if hasattr(event.delta, "text"):
                        text = event.delta.text
                        full_response += text
                        yield f"data: {json.dumps({'type': 'text', 'content': text})}\n\n"
                    elif hasattr(event.delta, "partial_json"):
                        current_tool_input += event.delta.partial_json

                elif event.type == "content_block_stop":
                    if tool_use_block:
                        tool_use_block["input"] = current_tool_input

            # Get the final message
            final_message = stream.get_final_message()

            # Check if we need to handle tool use
            if final_message.stop_reason == "tool_use":
                # Find the tool use block in the response
                tool_use = None
                for block in final_message.content:
                    if block.type == "tool_use":
                        tool_use = block
                        break

                if tool_use:
                    # Process the tool call
                    tool_result = process_tool_call(
                        tool_use.name,
                        tool_use.input,
                        user_id
                    )

                    # Parse result and send MCQ if present
                    result_data = json.loads(tool_result)
                    if result_data.get("found") and result_data.get("mcq_block"):
                        # Send the MCQ block
                        yield f"data: {json.dumps({'type': 'text', 'content': result_data['mcq_block']})}\n\n"

                    # Add assistant message and tool result to conversation
                    claude_messages.append({
                        "role": "assistant",
                        "content": final_message.content
                    })
                    claude_messages.append({
                        "role": "user",
                        "content": [{
                            "type": "tool_result",
                            "tool_use_id": tool_use.id,
                            "content": tool_result
                        }]
                    })

                    # Continue the loop to get Claude's response to the tool result
                    continue

            # No more tool calls, we're done
            break

    yield f"data: {json.dumps({'type': 'done'})}\n\n"
