import { ChatMessage, ScoreResponse, LearnerProfile } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function* streamChat(
  messages: ChatMessage[],
  userId: string = 'default'
): AsyncGenerator<string> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, user_id: userId }),
  });

  if (!response.ok) {
    throw new Error(`Chat request failed: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'text') {
            yield parsed.content;
          } else if (parsed.type === 'done') {
            return;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }
}

export async function scoreResponse(
  itemId: string,
  selected: string,
  userId: string = 'default',
  responseTimeMs?: number
): Promise<ScoreResponse> {
  const response = await fetch(`${API_URL}/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item_id: itemId,
      selected,
      user_id: userId,
      response_time_ms: responseTimeMs,
    }),
  });

  if (!response.ok) {
    throw new Error(`Score request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getLearnerProfile(userId: string): Promise<LearnerProfile> {
  const response = await fetch(`${API_URL}/profile/${userId}`);

  if (!response.ok) {
    throw new Error(`Profile request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getObjectives(): Promise<string[]> {
  const response = await fetch(`${API_URL}/objectives`);

  if (!response.ok) {
    throw new Error(`Objectives request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.objectives;
}
