'use client';

import { Lightbulb } from 'lucide-react';

interface MCQExplanationProps {
  explanation: string;
  misconception?: string;
}

export function MCQExplanation({ explanation, misconception }: MCQExplanationProps) {
  return (
    <div className="mt-4 space-y-3 animate-fade-in-up">
      <div className="flex items-start gap-2 rounded-lg border-l-[3px] border-accent-primary bg-accent-subtle p-3">
        <Lightbulb size={18} className="mt-0.5 shrink-0 text-accent-primary" />
        <p className="text-[14px] text-text-primary">{explanation}</p>
      </div>
      {misconception && (
        <div className="rounded-lg bg-mcq-incorrect-bg p-3">
          <p className="text-[14px] text-mcq-incorrect">
            <span className="font-medium">Common misconception: </span>
            {misconception}
          </p>
        </div>
      )}
    </div>
  );
}
