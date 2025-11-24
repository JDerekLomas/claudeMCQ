'use client';

import { useState, useRef } from 'react';
import { MCQOption } from './mcq-option';
import { MCQExplanation } from './mcq-explanation';
import { MCQData } from '@/types';
import { scoreResponse } from '@/lib/api';

type McqState =
  | { status: 'unanswered' }
  | { status: 'selected'; optionLetter: string }
  | { status: 'answered'; optionLetter: string; correct: boolean };

interface MCQBlockProps {
  mcq: MCQData;
  userId?: string;
  onAnswer?: (selected: string, correct: boolean) => void;
}

export function MCQBlock({ mcq, userId = 'default', onAnswer }: MCQBlockProps) {
  const [state, setState] = useState<McqState>({ status: 'unanswered' });
  const [misconceptionTag, setMisconceptionTag] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const handleOptionClick = async (letter: string) => {
    if (state.status === 'answered' || isSubmitting) return;

    // Select the option
    setState({ status: 'selected', optionLetter: letter });

    // Submit immediately after selection
    setIsSubmitting(true);
    const responseTimeMs = Date.now() - startTimeRef.current;

    try {
      const result = await scoreResponse(mcq.id, letter, userId, responseTimeMs);
      setState({ status: 'answered', optionLetter: letter, correct: result.correct });
      if (result.misconception_tag) {
        setMisconceptionTag(result.misconception_tag);
      }
      onAnswer?.(letter, result.correct);
    } catch (error) {
      console.error('Failed to score response:', error);
      // Fallback to local checking
      const correct = letter.toLowerCase() === mcq.correctAnswer.toLowerCase();
      setState({ status: 'answered', optionLetter: letter, correct });
      if (!correct && mcq.misconceptions?.[letter]) {
        setMisconceptionTag(mcq.misconceptions[letter]);
      }
      onAnswer?.(letter, correct);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionState = (letter: string) => {
    if (state.status === 'unanswered') return 'default';

    if (state.status === 'selected') {
      return letter === state.optionLetter ? 'selected' : 'default';
    }

    // Answered state
    const isSelected = letter === state.optionLetter;
    const isCorrectAnswer = letter.toLowerCase() === mcq.correctAnswer.toLowerCase();

    if (isSelected && state.correct) return 'correct';
    if (isSelected && !state.correct) return 'incorrect';
    if (!isSelected && isCorrectAnswer && !state.correct) return 'reveal-correct';
    return 'default';
  };

  return (
    <div className="my-4 rounded-xl border border-border-light bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[15px] font-medium text-text-primary">
        {mcq.stem}
      </h3>

      <div className="space-y-2">
        {mcq.options.map((option) => (
          <MCQOption
            key={option.letter}
            letter={option.letter}
            text={option.text}
            state={getOptionState(option.letter)}
            disabled={state.status === 'answered' || isSubmitting}
            onClick={() => handleOptionClick(option.letter)}
          />
        ))}
      </div>

      {state.status === 'answered' && mcq.explanation && (
        <MCQExplanation
          explanation={mcq.explanation}
          misconception={!state.correct ? misconceptionTag || undefined : undefined}
        />
      )}
    </div>
  );
}
