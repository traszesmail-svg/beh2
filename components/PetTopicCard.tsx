// handoff/components/PetTopicCard.tsx
// Karty tematyczne Pies / Kot — strona główna /
// Każdy link ma ikonę po lewej + arrow po prawej

import Link from 'next/link';
import { Icon, type IconName } from '@/components/icons-config';

interface TopicLink {
  href: string;
  icon: IconName;
  bold: string;
  desc: string;
}

interface PetTopicCardProps {
  emoji: string;
  heading: string;
  intro: string;
  links: TopicLink[];
}

export function PetTopicCard({ emoji, heading, intro, links }: PetTopicCardProps) {
  return (
    <article className="bg-white border border-neutral-200 rounded-3xl p-9 flex flex-col gap-4">
      <header className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-accent-light flex items-center justify-center text-3xl">
          {emoji}
        </div>
        <h3 className="font-serif text-xl">{heading}</h3>
      </header>
      <p className="text-neutral-600">{intro}</p>
      <div className="flex flex-col mt-3">
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2.5 py-3 text-sm font-medium text-neutral-900 hover:text-accent hover:pl-1 transition-all ${
              i < links.length - 1 ? 'border-b border-neutral-200' : ''
            }`}
          >
            <Icon name={l.icon} size={16} className="text-accent shrink-0" />
            <span><strong>{l.bold}</strong> — {l.desc}</span>
            <Icon name="arrow-right" size={16} className="text-accent ml-auto shrink-0" />
          </Link>
        ))}
      </div>
    </article>
  );
}

// Gotowe instancje — wklej bezpośrednio w stronę główną
export function PetTopicsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PetTopicCard
        emoji="🐕"
        heading="Masz psa i nie wiesz, od czego zacząć?"
        intro="Pomogę Ci uporządkować spacer, pobudzenie, separację lub rytm dnia młodego psa."
        links={[
          { href: '/psy/reaktywnosc-na-smyczy', icon: 'zap', bold: 'Reaktywność', desc: 'krok po kroku, jak wprowadzić spokój' },
          { href: '/psy/lek-separacyjny', icon: 'home', bold: 'Separacja', desc: 'jak pomóc psu zostawać samemu' },
          { href: '/oferta/poradniki-pdf/szczeniak-pierwsze-30-dni', icon: 'calendar-days', bold: 'Szczeniak', desc: 'pierwsze 30 dni i rytm dnia' },
        ]}
      />
      <PetTopicCard
        emoji="🐈"
        heading="Masz kota i chcesz wprowadzić spokój w domu?"
        intro="Przejrzymy kuwetę, stres, zmiany w domu i relacje między kotami."
        links={[
          { href: '/koty/zalatwianie-poza-kuweta', icon: 'droplets', bold: 'Kuweta', desc: 'jak zorganizować środowisko' },
          { href: '/oferta/poradniki-pdf/kot-stres-srodowisko-i-bledy-opiekuna', icon: 'leaf', bold: 'Stres', desc: 'strategie redukcji napięcia' },
          { href: '/koty/konflikt-miedzy-kotami', icon: 'users', bold: 'Konflikt', desc: 'relacje między kotami' },
        ]}
      />
    </section>
  );
}
