// handoff-7/components/LeadMagnetPopup.tsx
// Exit-intent popup z formularzem
// Wstaw raz w app/layout.tsx — auto-detektuje exit intent

'use client';

import { useEffect, useState } from 'react';
import { X, BookOpen } from 'lucide-react';
import { useExitIntent } from '@/lib/exit-intent';
import { LEAD_MAGNETS, POPUP_CONFIG, pickLeadMagnet } from '@/lib/lead-magnet.config';
import { LeadMagnetForm } from './LeadMagnetForm';

interface LeadMagnetPopupProps {
  magnetId?: string;          // jeśli pominięte — pickLeadMagnet wybiera po pathname
  pathname?: string;
}

export function LeadMagnetPopup({ magnetId, pathname = '/' }: LeadMagnetPopupProps) {
  const magnet = magnetId
    ? LEAD_MAGNETS.find(m => m.id === magnetId) ?? pickLeadMagnet(pathname)
    : pickLeadMagnet(pathname);

  // Sprawdź czy już zapisany
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  useEffect(() => {
    try {
      const v = localStorage.getItem(POPUP_CONFIG.submittedKey);
      if (v) setAlreadySubmitted(true);
    } catch {}
  }, []);

  const { shouldShow, dismiss } = useExitIntent({
    enabled: !alreadySubmitted,
    delayMs: POPUP_CONFIG.exitIntentDelayMs,
    scrollFallbackPercent: POPUP_CONFIG.scrollFallbackPercent,
    scrollFallbackTimeMs: POPUP_CONFIG.scrollFallbackTimeMs,
    storageKey: POPUP_CONFIG.storageKey,
    hideForDays: POPUP_CONFIG.hideForDays,
  });

  // Block scroll gdy popup otwarty
  useEffect(() => {
    if (shouldShow) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [shouldShow]);

  // Esc to close
  useEffect(() => {
    if (!shouldShow) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shouldShow, dismiss]);

  if (!shouldShow || alreadySubmitted) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lm-popup-title"
    >
      <div className="bg-surface rounded-3xl shadow-lg max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-300 grid md:grid-cols-[1fr_1.4fr]">

        {/* Lewa kolumna — wizual + opis */}
        <div className="relative bg-gradient-to-br from-accent-light to-accent/20 p-8 md:p-10 hidden md:flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-accent-fg text-xs font-bold tracking-wide uppercase mb-4">
              <BookOpen size={12} />
              Darmowy PDF
            </div>
            <p className="text-3xl font-serif font-bold text-ink leading-tight tracking-tight">
              {magnet.title}
            </p>
            <p className="text-sm text-muted mt-3">{magnet.subtitle}</p>
          </div>

          {/* Mock cover PDF */}
          <div className="mt-6 relative">
            <div className="aspect-[3/4] bg-surface rounded-xl shadow-lg border border-border flex items-center justify-center transform rotate-[-3deg] -ml-2">
              <div className="text-center px-4">
                <BookOpen className="mx-auto text-accent mb-2" size={32} />
                <p className="text-xs font-mono text-muted">{magnet.pages} stron PDF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prawa kolumna — formularz */}
        <div className="p-8 md:p-10 relative">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface-2 hover:bg-border flex items-center justify-center transition-colors text-muted hover:text-ink"
            aria-label="Zamknij"
          >
            <X size={18} />
          </button>

          <h2 id="lm-popup-title" className="text-2xl font-serif font-bold text-ink leading-tight tracking-tight pr-10">
            Zanim pójdziesz — weź to ze sobą
          </h2>
          <p className="text-sm text-muted mt-2 mb-5">
            {magnet.description}
          </p>

          <ul className="space-y-1.5 mb-5">
            {magnet.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink">
                <span className="text-accent shrink-0">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <LeadMagnetForm magnetId={magnet.id} source="popup" onSuccess={() => setTimeout(dismiss, 3000)} />
        </div>
      </div>
    </div>
  );
}
