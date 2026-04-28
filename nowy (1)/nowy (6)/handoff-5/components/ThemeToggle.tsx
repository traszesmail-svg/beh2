// handoff-5/components/ThemeToggle.tsx
// Przełącznik trybu — 3 warianty UI do wyboru
// Wstaw w nawigacji obok linku Kontakt

'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'segmented' | 'dropdown';
}

export function ThemeToggle({ variant = 'icon' }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <div className="w-10 h-10" aria-hidden />;
  }

  // Wariant 1: Pojedyncza ikona — toggluje light↔dark
  if (variant === 'icon') {
    const isDark = resolvedTheme === 'dark';
    return (
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="relative w-10 h-10 rounded-full border border-border bg-surface hover:bg-surface-2 transition-colors flex items-center justify-center"
        aria-label={isDark ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}
      >
        <Sun
          className={`absolute transition-all ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'} text-ink`}
          size={18}
        />
        <Moon
          className={`absolute transition-all ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'} text-ink`}
          size={18}
        />
      </button>
    );
  }

  // Wariant 2: Segmented control — 3 opcje (light/dark/system)
  if (variant === 'segmented') {
    const options = [
      { value: 'light', icon: Sun, label: 'Jasny' },
      { value: 'system', icon: Monitor, label: 'System' },
      { value: 'dark', icon: Moon, label: 'Ciemny' },
    ] as const;

    return (
      <div className="inline-flex items-center bg-surface-2 rounded-full p-1 border border-border" role="radiogroup">
        {options.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              theme === value
                ? 'bg-surface text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
            role="radio"
            aria-checked={theme === value}
            aria-label={`Motyw: ${label}`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  // Wariant 3: Dropdown — dla bardziej dyskretnego placementu
  return (
    <div className="relative group">
      <button
        className="w-10 h-10 rounded-full border border-border bg-surface hover:bg-surface-2 flex items-center justify-center transition-colors"
        aria-label="Wybierz motyw"
        aria-haspopup="menu"
      >
        {theme === 'dark' ? <Moon size={18} /> : theme === 'light' ? <Sun size={18} /> : <Monitor size={18} />}
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-1.5 z-50" role="menu">
        {([
          { value: 'light', icon: Sun, label: 'Jasny' },
          { value: 'dark', icon: Moon, label: 'Ciemny' },
          { value: 'system', icon: Monitor, label: 'System' },
        ] as const).map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-surface-2 transition-colors ${
              theme === value ? 'text-accent font-semibold' : 'text-ink'
            }`}
            role="menuitem"
          >
            <Icon size={16} />
            {label}
            {theme === value && <span className="ml-auto text-accent">●</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
