'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types';
import { MCQBlock } from './mcq-block';
import { parseMCQBlock, hasMCQBlock } from '@/lib/parse-mcq';
import { cn } from '@/lib/utils';
import { User, Bot } from 'lucide-react';

interface ChatMessagesProps {
  messages: ChatMessage[];
  userId?: string;
  isLoading?: boolean;
}

function MessageContent({
  content,
  role,
  userId,
}: {
  content: string;
  role: 'user' | 'assistant';
  userId: string;
}) {
  if (role === 'user' || !hasMCQBlock(content)) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  // Parse and render MCQ blocks
  const { beforeMCQ, mcq, afterMCQ } = parseMCQBlock(content);

  return (
    <div>
      {beforeMCQ && <div className="whitespace-pre-wrap">{beforeMCQ}</div>}
      {mcq && <MCQBlock mcq={mcq} userId={userId} />}
      {afterMCQ && <div className="whitespace-pre-wrap">{afterMCQ}</div>}
    </div>
  );
}

export function ChatMessages({
  messages,
  userId = 'default',
  isLoading = false,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Bot className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <h3 className="text-lg font-medium">Welcome to MCQ Learning Chat</h3>
          <p className="mt-1 text-sm">
            Ask about a topic to start learning. I&apos;ll assess your knowledge first!
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['recursion', 'Python lists', 'JavaScript promises'].map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
              >
                Try: &quot;{topic}&quot;
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[85%] rounded-lg px-4 py-2',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <MessageContent
                content={message.content}
                role={message.role}
                userId={userId}
              />
            </div>
            {message.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-lg bg-muted px-4 py-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
