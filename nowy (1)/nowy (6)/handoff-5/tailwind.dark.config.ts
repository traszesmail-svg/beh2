// handoff-5/tailwind.dark.config.ts
// Rozszerzenie tailwind.config — DODAJ do istniejącego config-u, nie zastępuj!
// Włącza darkMode: 'class' i mapuje kolory na CSS custom properties

import type { Config } from 'tailwindcss';

export const darkModeConfig: Partial<Config> = {
  darkMode: 'class',  // KLUCZOWE — strategia class-based (next-themes używa klasy .dark)

  theme: {
    extend: {
      colors: {
        // Mapowanie na CSS variables — automatycznie reagują na .dark
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
    },
  },
};

/* JAK SCALIĆ Z ISTNIEJĄCYM tailwind.config.ts:

import { darkModeConfig } from './tailwind.dark.config';

export default {
  content: [...],
  darkMode: darkModeConfig.darkMode,
  theme: {
    extend: {
      ...darkModeConfig.theme?.extend,
      // twoje pozostałe rozszerzenia
      fontFamily: { ... },
    },
  },
  plugins: [...],
} satisfies Config;
*/
