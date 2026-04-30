'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useExitIntent } from '@/lib/exit-intent';
import { LEAD_MAGNETS, POPUP_CONFIG, pickLeadMagnet } from '@/lib/lead-magnet.config';
import { LeadMagnetForm } from './LeadMagnetForm';

interface LeadMagnetPopupProps {
  magnetId?: string;
  pathname?: string;
}

export function LeadMagnetPopup({ magnetId, pathname = '/' }: LeadMagnetPopupProps) {
  const magnet = magnetId
    ? LEAD_MAGNETS.find(m => m.id === magnetId) ?? pickLeadMagnet(pathname)
    : pickLeadMagnet(pathname);

  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(POPUP_CONFIG.submittedKey)) setAlreadySubmitted(true);
    } catch {}
  }, []);

  const { shouldShow, dismiss } = useExitIntent({
    enabled: !alreadySubmitted,
    delayMs: POPUP_CONFIG.exitIntentDelayMs,
    timerFallbackMs: POPUP_CONFIG.timerFallbackMs,
    storageKey: POPUP_CONFIG.storageKey,
    hideForDays: POPUP_CONFIG.hideForDays,
  });

  useEffect(() => {
    if (!shouldShow) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [shouldShow, dismiss]);

  // Zamknij po 2s od potwierdzenia
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => dismiss(), 2000);
    return () => clearTimeout(t);
  }, [submitted, dismiss]);

  if (!shouldShow || alreadySubmitted) return null;

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px', backgroundColor: 'rgba(0,0,0,0.6)',
  };
  const card: React.CSSProperties = {
    backgroundColor: '#fff', borderRadius: '20px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
    width: '100%', maxWidth: '480px', overflow: 'hidden',
    fontFamily: 'inherit',
  };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}>
      <div style={card}>

        {/* Nagłówek */}
        <div style={{ background: 'linear-gradient(135deg, #d4ede6, #a8d9c8)', padding: '28px 28px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2f7667', background: '#fff', padding: '3px 10px', borderRadius: '99px' }}>
                Darmowy PDF
              </span>
              <p style={{ margin: '12px 0 4px', fontSize: '20px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>
                {magnet.title}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>{magnet.subtitle}</p>
            </div>
            <button
              onClick={dismiss}
              style={{ marginLeft: '12px', flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}
              aria-label="Zamknij"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Treść */}
        <div style={{ padding: '24px 28px 28px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📬</div>
              <p style={{ fontSize: '17px', fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>Sprawdź skrzynkę!</p>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>PDF już leci na Twój email. Zamykam za chwilę…</p>
            </div>
          ) : (
            <>
              <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {magnet.bullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#333' }}>
                    <span style={{ color: '#2f7667', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <LeadMagnetForm
                magnetId={magnet.id}
                source="popup"
                onSuccess={() => setSubmitted(true)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
