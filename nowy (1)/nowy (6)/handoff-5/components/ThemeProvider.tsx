// handoff-5/components/ThemeProvider.tsx
// Wrapper next-themes — wstaw na samym wierzchu drzewa w app/layout.tsx
// Zapewnia SSR-safe theme switching z zerową utratą wydajności

'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Po mount dodaj klasę .theme-ready żeby włączyć transitions
  // (bez tego pierwszy render miałby flash przejścia)
  useEffect(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('theme-ready');
    });
  }, []);

  return (
    <NextThemeProvider
      attribute="class"          // używa <html class="dark"> — pasuje do Tailwind
      defaultTheme="system"      // domyślnie respektuj OS
      enableSystem               // pozwól na 'system' jako opcję
      disableTransitionOnChange  // bez flash przy przełączaniu
      storageKey="regulski-theme"
    >
      {children}
    </NextThemeProvider>
  );
}

/* UŻYCIE w app/layout.tsx:

import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeScript } from '@/components/ThemeScript';

export default function RootLayout({ children }) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
*/
