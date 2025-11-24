import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': 'var(--bg-main)',
        'bg-sidebar': 'var(--bg-sidebar)',
        'bg-input': 'var(--bg-input)',
        'bg-user-msg': 'var(--bg-user-msg)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-inverse': 'var(--text-inverse)',
        'accent-primary': 'var(--accent-primary)',
        'accent-hover': 'var(--accent-hover)',
        'accent-subtle': 'var(--accent-subtle)',
        'border-light': 'var(--border-light)',
        'border-dark': 'var(--border-dark)',
        'mcq-correct': 'var(--mcq-correct)',
        'mcq-correct-bg': 'var(--mcq-correct-bg)',
        'mcq-incorrect': 'var(--mcq-incorrect)',
        'mcq-incorrect-bg': 'var(--mcq-incorrect-bg)',
        'mcq-option-bg': 'var(--mcq-option-bg)',
        'mcq-option-border': 'var(--mcq-option-border)',
        'mcq-option-hover': 'var(--mcq-option-hover)',
      },
      spacing: {
        'sidebar': '260px',
      },
      maxWidth: {
        'chat': '768px',
      },
      fontFamily: {
        sans: ['Styrene A', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Söhne Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
export default config
