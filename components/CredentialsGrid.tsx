// handoff/components/CredentialsGrid.tsx
// Siatka 4 kart kwalifikacji — strona /o-mnie
// USUWA stary "COAPE seal" — używa tylko Award icon w karcie

import { Icon, type IconName } from '@/components/icons-config';

interface Credential {
  icon: IconName;
  title: string;
  sub: string;
}

const credentials: Credential[] = [
  { icon: 'award', title: 'Behawiorysta i trener zwierząt towarzyszących COAPE', sub: 'Analiza zachowania i praktyczny trening prowadzone w jednym, spójnym planie.' },
  { icon: 'utensils', title: 'Modyfikacja diety', sub: 'Niezbędne wsparcie terapii behawioralnej.' },
  { icon: 'stethoscope', title: 'Technik weterynarii', sub: 'Kontekst zdrowia, bezpieczeństwa i sytuacji wymagających lekarza.' },
  { icon: 'hand-heart', title: 'Bez kar i przymusu', sub: 'Praca oparta na zaufaniu, dobrostanie i jasnej komunikacji.' },
];

export function CredentialsGrid() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {credentials.map((c) => (
        <article key={c.title} className="bg-white border border-neutral-200 rounded-2xl p-6 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center">
            <Icon name={c.icon} size={24} />
          </div>
          <h4 className="font-semibold text-sm">{c.title}</h4>
          <p className="text-xs text-neutral-500 leading-relaxed">{c.sub}</p>
        </article>
      ))}
    </section>
  );
}
