'use client';

export function ClaudeLogo({ size = 24 }: { size?: number }) {
  return (
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
  );
}

export function ClaudeIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width="20"
        height="20"
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
