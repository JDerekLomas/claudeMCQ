'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mx-auto w-full max-w-chat px-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end rounded-2xl border border-border-light bg-bg-input shadow-sm focus-within:border-text-secondary">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Claude..."
            disabled={disabled}
            rows={1}
            className="max-h-[200px] min-h-[52px] flex-1 resize-none bg-transparent px-4 py-3.5 text-[15px] text-text-primary placeholder-text-secondary outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="p-2">
            <button
              type="submit"
              disabled={disabled || !input.trim()}
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                input.trim() && !disabled
                  ? 'bg-text-primary text-text-inverse hover:bg-text-secondary'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </form>
      <p className="mt-2 text-center text-xs text-text-secondary">
        Claude can make mistakes. Please double-check responses.
      </p>
    </div>
  );
}
