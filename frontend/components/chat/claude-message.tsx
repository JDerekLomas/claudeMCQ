'use client';

import { ClaudeIcon } from './claude-icon';
import { MCQBlock } from '../mcq/mcq-block';
import { parseMCQBlock, hasMCQBlock } from '@/lib/parse-mcq';

interface ClaudeMessageProps {
  content: string;
  isStreaming?: boolean;
  userId?: string;
}

export function ClaudeMessage({ content, isStreaming = false, userId = 'default' }: ClaudeMessageProps) {
  // Parse MCQ blocks from content
  const renderContent = () => {
    if (!hasMCQBlock(content)) {
      return (
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-text-primary">
          {content}
          {isStreaming && <span className="ml-0.5 inline-block h-4 w-0.5 bg-text-primary animate-blink" />}
        </p>
      );
    }

    const { beforeMCQ, mcq, afterMCQ } = parseMCQBlock(content);

    return (
      <>
        {beforeMCQ && (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-text-primary mb-4">
            {beforeMCQ}
          </p>
        )}
        {mcq && <MCQBlock mcq={mcq} userId={userId} />}
        {afterMCQ && (
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-text-primary mt-4">
            {afterMCQ}
            {isStreaming && <span className="ml-0.5 inline-block h-4 w-0.5 bg-text-primary animate-blink" />}
          </p>
        )}
        {isStreaming && !afterMCQ && (
          <span className="ml-0.5 inline-block h-4 w-0.5 bg-text-primary animate-blink" />
        )}
      </>
    );
  };

  return (
    <div className="flex gap-3 animate-message-in">
      <ClaudeIcon size={20} className="mt-1" />
      <div className="flex-1 max-w-chat">
        {renderContent()}
      </div>
    </div>
  );
}
