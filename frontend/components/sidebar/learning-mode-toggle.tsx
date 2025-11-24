'use client';

import { BookOpen } from 'lucide-react';

interface LearningModeToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function LearningModeToggle({ enabled, onToggle }: LearningModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-white/90 transition-colors hover:bg-white/10"
    >
      <div className="flex items-center gap-2">
        <BookOpen size={18} className="text-accent-primary" />
        <span>Learning Mode</span>
      </div>
      <div
        className={`relative h-5 w-9 rounded-full transition-colors ${
          enabled ? 'bg-accent-primary' : 'bg-white/20'
        }`}
      >
        <div
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </div>
    </button>
  );
}
