'use client';

import { MessageSquare, Trash2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatListProps {
  chats: Chat[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function groupChatsByDate(chats: Chat[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups: { label: string; chats: Chat[] }[] = [
    { label: 'Today', chats: [] },
    { label: 'Yesterday', chats: [] },
    { label: 'Previous 7 days', chats: [] },
    { label: 'Older', chats: [] },
  ];

  chats.forEach((chat) => {
    const chatDate = new Date(chat.timestamp);
    if (chatDate >= today) {
      groups[0].chats.push(chat);
    } else if (chatDate >= yesterday) {
      groups[1].chats.push(chat);
    } else if (chatDate >= lastWeek) {
      groups[2].chats.push(chat);
    } else {
      groups[3].chats.push(chat);
    }
  });

  return groups.filter((g) => g.chats.length > 0);
}

export function ChatList({ chats, activeId, onSelect, onDelete }: ChatListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const groups = groupChatsByDate(chats);

  if (chats.length === 0) {
    return (
      <div className="px-3 py-6 text-center text-sm text-white/50">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto dark-scrollbar">
      {groups.map((group) => (
        <div key={group.label} className="mb-4">
          <div className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-white/40">
            {group.label}
          </div>
          {group.chats.map((chat) => (
            <div
              key={chat.id}
              onMouseEnter={() => setHoveredId(chat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative"
            >
              <button
                onClick={() => onSelect(chat.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeId === chat.id
                    ? 'border-l-2 border-white bg-white/10 text-white'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <MessageSquare size={16} className="shrink-0 opacity-60" />
                <span className="truncate-text flex-1">{chat.title}</span>
              </button>
              {hoveredId === chat.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-white/40 hover:bg-white/10 hover:text-white/80"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
