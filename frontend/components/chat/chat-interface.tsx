'use client';

import { useRef, useEffect } from 'react';
import { Message } from './message';
import { ChatInput } from './chat-input';
import { ModelSelector } from './model-selector';
import { ChatMessage } from '@/types';
import { ClaudeIcon } from './claude-icon';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  selectedModel: string;
  userId: string;
  onSendMessage: (content: string) => void;
  onSelectModel: (modelId: string) => void;
}

export function ChatInterface({
  messages,
  isLoading,
  selectedModel,
  userId,
  onSendMessage,
  onSelectModel,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col bg-bg-main">
      {/* Header */}
      <header className="flex h-[52px] items-center justify-center border-b border-border-light bg-bg-main">
        <ModelSelector selectedModel={selectedModel} onSelectModel={onSelectModel} />
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex h-full flex-col items-center justify-center px-4">
            <ClaudeIcon size={40} className="mb-4 opacity-60" />
            <h2 className="mb-2 text-xl font-medium text-text-primary">How can I help you today?</h2>
            <p className="max-w-md text-center text-sm text-text-secondary">
              Ask me anything, or tell me what you&apos;d like to learn about. With Learning Mode enabled,
              I&apos;ll check your understanding before diving into explanations.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {['Explain recursion', 'How do promises work?', 'Python list methods'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSendMessage(prompt)}
                  className="rounded-full border border-border-light bg-white px-4 py-2 text-sm text-text-primary transition-colors hover:bg-gray-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-chat space-y-6 px-4 py-6">
            {messages.map((message, index) => (
              <Message
                key={index}
                message={message}
                isStreaming={isLoading && index === messages.length - 1 && message.role === 'assistant'}
                userId={userId}
              />
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-3">
                <ClaudeIcon size={20} className="mt-1" />
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-text-secondary [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-text-secondary [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-text-secondary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-border-light bg-bg-main py-4">
        <ChatInput onSend={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
