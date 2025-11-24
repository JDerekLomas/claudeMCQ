'use client';

import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types';
import { streamChat } from '@/lib/api';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { LearnerProfile } from './learner-profile';
import { BarChart3 } from 'lucide-react';

interface ChatInterfaceProps {
  userId?: string;
}

export function ChatInterface({ userId = 'default' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleSend = useCallback(async (content: string) => {
    const userMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let assistantContent = '';

      for await (const chunk of streamChat(newMessages, userId)) {
        assistantContent += chunk;
        setMessages([
          ...newMessages,
          { role: 'assistant', content: assistantContent },
        ]);
      }

      // Ensure final message is set
      if (assistantContent) {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: assistantContent },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, userId]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-4 py-3">
        <h1 className="text-lg font-semibold">MCQ Learning Chat</h1>
        <button
          onClick={() => setShowProfile(true)}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-muted"
        >
          <BarChart3 className="h-4 w-4" />
          Progress
        </button>
      </header>

      {/* Messages */}
      <ChatMessages
        messages={messages}
        userId={userId}
        isLoading={isLoading}
      />

      {/* Input */}
      <div className="border-t p-4">
        <div className="mx-auto max-w-3xl">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>

      {/* Profile Modal */}
      <LearnerProfile
        userId={userId}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}
