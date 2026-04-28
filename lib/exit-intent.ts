// handoff-7/lib/exit-intent.ts
// Hook detekcji exit-intent (mysz w stronę paska adresu)
// Z fallbackiem dla mobile (scroll + czas)

'use client';

import { useEffect, useState } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  delayMs?: number;            // minimum czas na stronie zanim trigger
  scrollFallbackPercent?: number;
  scrollFallbackTimeMs?: number;
  storageKey?: string;
  hideForDays?: number;
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const {
    enabled = true,
    delayMs = 3000,
    scrollFallbackPercent = 60,
    scrollFallbackTimeMs = 30000,
    storageKey = 'exit-intent-dismissed',
    hideForDays = 7,
  } = options;

  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // Sprawdź czy użytkownik niedawno odrzucił
    try {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed) {
        const dismissedAt = parseInt(dismissed, 10);
        const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
        if (daysSince < hideForDays) return;
      }
    } catch {}

    let triggered = false;
    const startedAt = Date.now();

    const trigger = () => {
      if (triggered) return;
      const elapsed = Date.now() - startedAt;
      if (elapsed < delayMs) return;
      triggered = true;
      setShouldShow(true);
    };

    // Desktop: mouseleave w stronę paska adresu (top of viewport)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) trigger();
    };

    // Mobile fallback: scroll + czas
    const checkScrollFallback = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      const elapsed = Date.now() - startedAt;
      if (scrollPercent >= scrollFallbackPercent && elapsed >= scrollFallbackTimeMs) {
        trigger();
      }
    };

    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', checkScrollFallback, { passive: true });
    const interval = setInterval(checkScrollFallback, 5000);

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', checkScrollFallback);
      clearInterval(interval);
    };
  }, [enabled, delayMs, scrollFallbackPercent, scrollFallbackTimeMs, storageKey, hideForDays]);

  const dismiss = () => {
    setShouldShow(false);
    try {
      localStorage.setItem(storageKey, String(Date.now()));
    } catch {}
  };

  return { shouldShow, dismiss };
}
