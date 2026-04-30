'use client';

import { useEffect, useState } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  delayMs?: number;
  timerFallbackMs?: number;
  storageKey?: string;
  hideForDays?: number;
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const {
    enabled = true,
    delayMs = 3000,
    timerFallbackMs = 10000,
    storageKey = 'exit-intent-dismissed',
    hideForDays = 7,
  } = options;

  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    try {
      const dismissed = localStorage.getItem(storageKey);
      if (dismissed) {
        const daysSince = (Date.now() - parseInt(dismissed, 10)) / 86400000;
        if (daysSince < hideForDays) return;
      }
    } catch {}

    let triggered = false;
    const startedAt = Date.now();

    const trigger = () => {
      if (triggered) return;
      if (Date.now() - startedAt < delayMs) return;
      triggered = true;
      setShouldShow(true);
    };

    // Desktop: mysz wyjeżdża poza górę ekranu
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5) trigger();
    };

    // Fallback: pokaż po timerFallbackMs niezależnie od akcji
    const timer = setTimeout(trigger, timerFallbackMs);

    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      clearTimeout(timer);
    };
  }, [enabled, delayMs, timerFallbackMs, storageKey, hideForDays]);

  const dismiss = () => {
    setShouldShow(false);
    try {
      localStorage.setItem(storageKey, String(Date.now()));
    } catch {}
  };

  return { shouldShow, dismiss };
}
