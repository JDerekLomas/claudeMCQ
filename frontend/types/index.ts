export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MCQData {
  id: string;
  objective: string;
  stem: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  misconceptions?: Record<string, string>;
}

export interface ScoreResponse {
  correct: boolean;
  explanation?: string;
  misconception_tag?: string;
  new_mastery: number;
}

export interface LearnerState {
  user_id: string;
  objective: string;
  mastery: number;
  attempts: number;
  last_attempt?: string;
}

export interface LearnerProfile {
  user_id: string;
  objectives: LearnerState[];
}
