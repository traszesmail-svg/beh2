'use client';

import { useEffect } from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  useEffect(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('theme-ready');
    });
  }, []);

  return <>{children}</>;
}
