import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-2': 'var(--color-surface-2)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        'muted-2': 'var(--color-muted-2)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
          light: 'var(--color-accent-light)',
          fg: 'var(--color-accent-fg)',
        },
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        warning: {
          DEFAULT: 'var(--color-warning)',
          bg: 'var(--color-warning-bg)',
        },
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      fontFamily: {
        serif: ['var(--font-display)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
