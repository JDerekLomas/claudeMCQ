'use client';

import { UserMessage } from './user-message';
import { ClaudeMessage } from './claude-message';
import { ChatMessage } from '@/types';

interface MessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
  userId?: string;
}

export function Message({ message, isStreaming = false, userId = 'default' }: MessageProps) {
  if (message.role === 'user') {
    return <UserMessage content={message.content} />;
  }

  return (
    <ClaudeMessage
      content={message.content}
      isStreaming={isStreaming}
      userId={userId}
    />
  );
}
