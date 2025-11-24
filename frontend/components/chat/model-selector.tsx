'use client';

import { ChevronDown, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const MODELS = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Most intelligent' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Powerful & thoughtful' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fast & efficient' },
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-text-primary transition-colors hover:bg-black/5"
      >
        <span>{selected.name}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-full mt-1 w-64 -translate-x-1/2 rounded-xl border border-border-light bg-white py-1 shadow-lg">
          {MODELS.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onSelectModel(model.id);
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-50"
            >
              <div>
                <div className="text-sm font-medium text-text-primary">{model.name}</div>
                <div className="text-xs text-text-secondary">{model.description}</div>
              </div>
              {selectedModel === model.id && (
                <Check size={16} className="text-accent-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
