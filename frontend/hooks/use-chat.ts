'use client';

import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types';
import { streamChat } from '@/lib/api';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export function useChat(userId: string = 'default') {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const createNewChat = useCallback(() => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: 'New conversation',
      timestamp: new Date(),
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setMessages([]);
  }, []);

  const selectChat = useCallback((chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    if (chat) {
      setActiveChatId(chatId);
      setMessages(chat.messages);
    }
  }, [chats]);

  const deleteChat = useCallback((chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setMessages([]);
    }
  }, [activeChatId]);

  const sendMessage = useCallback(async (content: string, learningMode: boolean = true) => {
    // Create new chat if none exists
    let currentChatId = activeChatId;
    if (!currentChatId) {
      const newChat: Chat = {
        id: crypto.randomUUID(),
        title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
        timestamp: new Date(),
        messages: [],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      currentChatId = newChat.id;
    }

    const userMessage: ChatMessage = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      let assistantContent = '';

      for await (const chunk of streamChat(newMessages, userId, learningMode)) {
        assistantContent += chunk;
        setMessages([
          ...newMessages,
          { role: 'assistant', content: assistantContent },
        ]);
      }

      // Update chat with final messages
      const finalMessages: ChatMessage[] = [
        ...newMessages,
        { role: 'assistant', content: assistantContent },
      ];
      setMessages(finalMessages);

      // Update chat in list
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: finalMessages,
                title: c.messages.length === 0
                  ? content.slice(0, 30) + (content.length > 30 ? '...' : '')
                  : c.title,
              }
            : c
        )
      );
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
  }, [messages, activeChatId, userId]);

  return {
    chats,
    activeChatId,
    messages,
    isLoading,
    createNewChat,
    selectChat,
    deleteChat,
    sendMessage,
  };
}
