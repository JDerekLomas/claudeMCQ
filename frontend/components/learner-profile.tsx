'use client';

import { useState, useEffect } from 'react';
import { getLearnerProfile } from '@/lib/api';
import { LearnerProfile as LearnerProfileType } from '@/types';
import { cn } from '@/lib/utils';
import { X, TrendingUp, Target } from 'lucide-react';

interface LearnerProfileProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function LearnerProfile({ userId, isOpen, onClose }: LearnerProfileProps) {
  const [profile, setProfile] = useState<LearnerProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      getLearnerProfile(userId)
        .then(setProfile)
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Learning Progress</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>Failed to load profile: {error}</p>
          </div>
        )}

        {profile && !isLoading && (
          <div className="space-y-4">
            {profile.objectives.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Target className="mx-auto mb-2 h-8 w-8 opacity-50" />
                <p>No assessments completed yet.</p>
                <p className="mt-1 text-sm">Start chatting to begin learning!</p>
              </div>
            ) : (
              profile.objectives.map((obj) => (
                <div key={obj.objective} className="rounded-md border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{obj.objective}</span>
                    <span className="text-sm text-muted-foreground">
                      {obj.attempts} attempts
                    </span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        'absolute left-0 top-0 h-full rounded-full transition-all',
                        obj.mastery >= 0.8
                          ? 'bg-green-500'
                          : obj.mastery >= 0.5
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      )}
                      style={{ width: `${obj.mastery * 100}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{Math.round(obj.mastery * 100)}% mastery</span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {obj.mastery >= 0.8
                        ? 'Mastered'
                        : obj.mastery >= 0.5
                        ? 'Learning'
                        : 'Needs practice'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
