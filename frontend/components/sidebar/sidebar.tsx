'use client';

import { Plus, PanelLeftClose, PanelLeft } from 'lucide-react';
import { ClaudeLogo } from './claude-logo';
import { ChatList } from './chat-list';
import { LearningModeToggle } from './learning-mode-toggle';
import { UserMenu } from './user-menu';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  learningMode: boolean;
  isCollapsed: boolean;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onToggleLearningMode: () => void;
  onToggleCollapse: () => void;
}

export function Sidebar({
  chats,
  activeChatId,
  learningMode,
  isCollapsed,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onToggleLearningMode,
  onToggleCollapse,
}: SidebarProps) {
  if (isCollapsed) {
    return (
      <div className="flex h-full w-14 flex-col border-r border-border-dark bg-bg-sidebar">
        <button
          onClick={onToggleCollapse}
          className="flex h-14 items-center justify-center text-white/60 hover:text-white"
        >
          <PanelLeft size={20} />
        </button>
        <button
          onClick={onNewChat}
          className="flex h-10 items-center justify-center text-white/60 hover:text-white"
        >
          <Plus size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-sidebar flex-col bg-bg-sidebar">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <ClaudeLogo size={24} />
          <span className="text-lg font-semibold text-white">Claude</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="rounded p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-2 pb-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-lg border border-border-dark px-3 py-2.5 text-sm text-white transition-colors hover:bg-white/5"
        >
          <Plus size={18} />
          <span>New chat</span>
        </button>
      </div>

      {/* Chat List */}
      <ChatList
        chats={chats}
        activeId={activeChatId}
        onSelect={onSelectChat}
        onDelete={onDeleteChat}
      />

      {/* Bottom Section */}
      <div className="border-t border-border-dark p-2">
        <LearningModeToggle
          enabled={learningMode}
          onToggle={onToggleLearningMode}
        />
        <div className="mt-2">
          <UserMenu userName="Derek" />
        </div>
      </div>
    </div>
  );
}
