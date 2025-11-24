'use client';

interface ClaudeIconProps {
  size?: number;
  className?: string;
}

export function ClaudeIcon({ size = 20, className = '' }: ClaudeIconProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L14.5 8.5H21L16 13L18 20L12 16L6 20L8 13L3 8.5H9.5L12 2Z"
          fill="#d97706"
        />
      </svg>
    </div>
  );
}
