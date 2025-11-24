'use client';

import { useState, useRef } from 'react';
import { MCQData } from '@/types';
import { scoreResponse } from '@/lib/api';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';

interface MCQBlockProps {
  mcq: MCQData;
  userId?: string;
  onAnswer?: (selected: string, correct: boolean) => void;
}

export function MCQBlock({ mcq, userId = 'default', onAnswer }: MCQBlockProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [misconceptionTag, setMisconceptionTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number>(Date.now());

  const handleOptionClick = async (letter: string) => {
    if (selectedAnswer !== null || isLoading) return;

    setIsLoading(true);
    setSelectedAnswer(letter);

    const responseTimeMs = Date.now() - startTimeRef.current;

    try {
      const result = await scoreResponse(mcq.id, letter, userId, responseTimeMs);
      setIsCorrect(result.correct);
      setShowExplanation(true);
      if (result.misconception_tag) {
        setMisconceptionTag(result.misconception_tag);
      }
      onAnswer?.(letter, result.correct);
    } catch (error) {
      console.error('Failed to score response:', error);
      // Fallback to local checking
      const correct = letter.toLowerCase() === mcq.correctAnswer.toLowerCase();
      setIsCorrect(correct);
      setShowExplanation(true);
      if (!correct && mcq.misconceptions?.[letter]) {
        setMisconceptionTag(mcq.misconceptions[letter]);
      }
      onAnswer?.(letter, correct);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="mb-1 text-xs text-muted-foreground">
        {mcq.objective}
      </div>
      <h3 className="mb-4 text-lg font-medium">{mcq.stem}</h3>

      <div className="space-y-2">
        {mcq.options.map((option) => {
          const isSelected = selectedAnswer === option.letter;
          const isCorrectOption = option.letter.toLowerCase() === mcq.correctAnswer.toLowerCase();
          const showResult = selectedAnswer !== null;

          return (
            <button
              key={option.letter}
              onClick={() => handleOptionClick(option.letter)}
              disabled={selectedAnswer !== null || isLoading}
              className={cn(
                'flex w-full items-center gap-3 rounded-md border p-3 text-left transition-all',
                'hover:border-primary hover:bg-accent',
                'disabled:cursor-not-allowed',
                showResult && isCorrectOption && 'border-green-500 bg-green-50',
                showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-50',
                !showResult && 'border-border'
              )}
            >
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full border text-sm font-medium',
                  showResult && isCorrectOption && 'border-green-500 bg-green-500 text-white',
                  showResult && isSelected && !isCorrectOption && 'border-red-500 bg-red-500 text-white',
                  !showResult && 'border-muted-foreground'
                )}
              >
                {option.letter.toUpperCase()}
              </span>
              <span className="flex-1">{option.text}</span>
              {showResult && isCorrectOption && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {showResult && isSelected && !isCorrectOption && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className="mt-4 space-y-2">
          <div
            className={cn(
              'rounded-md p-3',
              isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            )}
          >
            <p className="font-medium">
              {isCorrect ? 'Correct!' : 'Not quite right'}
            </p>
            {mcq.explanation && (
              <p className="mt-1 text-sm">{mcq.explanation}</p>
            )}
          </div>

          {misconceptionTag && (
            <div className="rounded-md bg-amber-50 p-3 text-amber-800">
              <p className="text-sm">
                <span className="font-medium">Common misconception: </span>
                {misconceptionTag}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
