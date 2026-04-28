// handoff/components/HowItWorksSteps.tsx
// Sekcja "Jak to działa" — 4 kroki z ikonami
// Krok 3 ma słuchawki + przekreśloną kamerę (overlay badge)

import { Icon, type IconName } from '@/components/icons-config';

interface Step {
  num: number;
  icon: IconName;
  title: string;
  desc: string;
  highlight?: boolean;
  withVideoOff?: boolean;  // krok 3 - słuchawki + przekreślona kamera
}

const steps: Step[] = [
  { num: 1, icon: 'layout-list', title: 'Wybierz format', desc: 'Kwadrans, Dwa kwadranse lub Pełna konsultacja — w zależności od wagi sprawy.' },
  { num: 2, icon: 'message-square-text', title: 'Opisz sytuację', desc: 'Krótko — co się dzieje w domu lub na spacerze, jak reaguje pupil.' },
  { num: 3, icon: 'headphones', title: 'Rozmowa audio', desc: 'Słuchawki w uszach, kamera wyłączona — komfortowo i bez stresu.', withVideoOff: true },
  { num: 4, icon: 'check', title: 'Wiesz co dalej', desc: 'Konkretny pierwszy krok, który możesz zacząć od zaraz.', highlight: true },
];

export function HowItWorksSteps() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {steps.map((s) => (
        <article key={s.num} className="bg-white border border-neutral-200 rounded-2xl p-7 transition hover:border-accent hover:-translate-y-0.5 hover:shadow-lg">
          <header className="flex items-center gap-3 mb-3">
            <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
              s.highlight ? 'bg-accent text-white' : 'bg-accent-light text-accent'
            }`}>
              <Icon name={s.icon} size={28} strokeWidth={2.25} />

              {/* Krok 3: przekreślona kamera w rogu */}
              {s.withVideoOff && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border-2 border-accent rounded-full flex items-center justify-center">
                  <Icon name="video-off" size={12} className="text-accent" strokeWidth={3} />
                </div>
              )}
            </div>
            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold">
              {s.num}
            </div>
          </header>
          <h3 className="font-serif text-lg mb-1.5">{s.title}</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
        </article>
      ))}
    </section>
  );
}
