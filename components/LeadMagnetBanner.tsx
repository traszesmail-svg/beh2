// handoff-7/components/LeadMagnetBanner.tsx
// Sticky bottom banner — zachęta do pobrania PDF
// Pojawia się po 15s, można zamknąć

'use client';

import { useEffect, useState } from 'react';
import { X, BookOpen, ArrowRight } from 'lucide-react';
import { LEAD_MAGNETS, BANNER_CONFIG, POPUP_CONFIG, pickLeadMagnet } from '@/lib/lead-magnet.config';
import { LeadMagnetForm } from './LeadMagnetForm';

interface LeadMagnetBannerProps {
  magnetId?: string;
  pathname?: string;
}

export function LeadMagnetBanner({ magnetId, pathname = '/' }: LeadMagnetBannerProps) {
  const magnet = magnetId
    ? LEAD_MAGNETS.find(m => m.id === magnetId) ?? pickLeadMagnet(pathname)
    : pickLeadMagnet(pathname);

  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Sprawdź czy zapisany
    try {
      if (localStorage.getItem(POPUP_CONFIG.submittedKey)) return;
      const dismissed = localStorage.getItem(BANNER_CONFIG.storageKey);
      if (dismissed) {
        const days = (Date.now() - parseInt(dismissed, 10)) / (1000 * 60 * 60 * 24);
        if (days < BANNER_CONFIG.hideForDays) return;
      }
    } catch {}

    const t = setTimeout(() => setVisible(true), BANNER_CONFIG.showAfterMs);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(BANNER_CONFIG.storageKey, String(Date.now())); } catch {}
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-500"
      role="region"
      aria-label="Darmowy poradnik PDF"
    >
      <div className="bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">

        {!expanded ? (
          // Compact view
          <div className="flex items-center gap-3 p-4">
            <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
              <BookOpen className="text-accent" size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-ink truncate">{magnet.title}</p>
              <p className="text-xs text-muted">Darmowy PDF · {magnet.pages} stron</p>
            </div>
            <button
              onClick={() => setExpanded(true)}
              className="px-3 py-2 rounded-lg bg-accent text-accent-fg text-xs font-semibold hover:bg-accent-dark transition-colors flex items-center gap-1 shrink-0"
            >
              Pobierz
              <ArrowRight size={14} />
            </button>
            <button
              onClick={dismiss}
              className="w-7 h-7 rounded-full hover:bg-surface-2 flex items-center justify-center text-muted-2 hover:text-ink shrink-0"
              aria-label="Zamknij"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          // Expanded view
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-serif font-bold text-base text-ink leading-tight">{magnet.title}</p>
                <p className="text-xs text-muted mt-0.5">{magnet.subtitle}</p>
              </div>
              <button
                onClick={dismiss}
                className="w-7 h-7 rounded-full hover:bg-surface-2 flex items-center justify-center text-muted-2 hover:text-ink shrink-0"
                aria-label="Zamknij"
              >
                <X size={14} />
              </button>
            </div>
            <LeadMagnetForm magnetId={magnet.id} source="banner" layout="vertical" />
          </div>
        )}
      </div>
    </div>
  );
}
