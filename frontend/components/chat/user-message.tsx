'use client';

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end animate-message-in">
      <div className="max-w-[85%] rounded-3xl bg-bg-user-msg px-4 py-3 text-text-inverse">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
