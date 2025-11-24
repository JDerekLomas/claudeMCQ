'use client';

import { Check, X } from 'lucide-react';

type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'reveal-correct';

interface MCQOptionProps {
  letter: string;
  text: string;
  state: OptionState;
  disabled: boolean;
  onClick: () => void;
}

export function MCQOption({ letter, text, state, disabled, onClick }: MCQOptionProps) {
  const getStyles = () => {
    switch (state) {
      case 'selected':
        return {
          container: 'border-accent-primary bg-white',
          radio: 'border-accent-primary bg-accent-primary',
          radioInner: 'bg-white',
        };
      case 'correct':
        return {
          container: 'border-mcq-correct bg-mcq-correct-bg animate-correct-pulse',
          radio: 'border-mcq-correct bg-mcq-correct',
          radioInner: 'bg-white',
          icon: <Check size={12} className="text-white" />,
        };
      case 'incorrect':
        return {
          container: 'border-mcq-incorrect bg-mcq-incorrect-bg',
          radio: 'border-mcq-incorrect bg-mcq-incorrect',
          radioInner: 'bg-white',
          icon: <X size={12} className="text-white" />,
        };
      case 'reveal-correct':
        return {
          container: 'border-mcq-correct bg-white',
          radio: 'border-mcq-correct bg-transparent',
          radioInner: 'bg-transparent',
        };
      default:
        return {
          container: 'border-mcq-option-border bg-mcq-option-bg hover:bg-mcq-option-hover hover:border-gray-300',
          radio: 'border-gray-300 bg-transparent',
          radioInner: 'bg-transparent',
        };
    }
  };

  const styles = getStyles();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${styles.container} ${
        disabled ? 'cursor-default' : 'cursor-pointer'
      }`}
    >
      <div
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-all ${styles.radio}`}
      >
        {'icon' in styles ? (
          styles.icon
        ) : (
          <div className={`h-2 w-2 rounded-full ${styles.radioInner}`} />
        )}
      </div>
      <span
        className={`flex-1 text-[15px] ${
          state === 'correct'
            ? 'text-mcq-correct font-medium'
            : state === 'incorrect'
            ? 'text-mcq-incorrect'
            : state === 'reveal-correct'
            ? 'text-mcq-correct'
            : 'text-text-primary'
        }`}
      >
        {text}
      </span>
    </button>
  );
}
