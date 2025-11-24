'use client';

import { ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface UserMenuProps {
  userName: string;
}

export function UserMenu({ userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-white transition-colors hover:bg-white/10"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-primary text-xs font-medium text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span>{userName}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-1 w-full rounded-lg border border-border-dark bg-bg-sidebar py-1 shadow-lg">
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            <User size={16} />
            <span>Profile</span>
          </button>
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <div className="my-1 border-t border-border-dark" />
          <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/80 hover:bg-white/10">
            <LogOut size={16} />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
