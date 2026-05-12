// handoff-2/components/HeroLayout.tsx
// Layout split — content po lewej, ilustracja po prawej
// Responsywny: na mobile ilustracja pod contentem (lub ukryta)

import { HeroIllustration } from '@/components/HeroIllustration';
import type { HeroSlug } from '@/components/pageHeroes.config';

interface HeroLayoutProps {
  slug: HeroSlug;
  children: React.ReactNode;
  emoji?: string;  // emoji fallback gdy brak SVG
  imagePosition?: 'right' | 'left';
  hideOnMobile?: boolean;
}

export function HeroLayout({
  slug,
  children,
  emoji,
  imagePosition = 'right',
  hideOnMobile = true,
}: HeroLayoutProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_400px] min-h-[560px]">
      {imagePosition === 'left' && (
        <HeroIllustration
          slug={slug}
          emojiPlaceholder={emoji}
          className={`order-2 lg:order-1 ${hideOnMobile ? 'hidden lg:flex' : ''}`}
        />
      )}

      <div className={`flex flex-col justify-center gap-6 p-10 lg:p-16 ${imagePosition === 'left' ? 'order-1 lg:order-2' : ''}`}>
        {children}
      </div>

      {imagePosition === 'right' && (
        <HeroIllustration
          slug={slug}
          emojiPlaceholder={emoji}
          className={hideOnMobile ? 'hidden lg:flex' : ''}
        />
      )}
    </section>
  );
}

/*
Przykład użycia:

import { HeroLayout } from '@/components/HeroLayout';
import { TrustBar } from '@/components/CredBadge';

export default function HomePage() {
  return (
    <HeroLayout slug="home" emoji="🐕">
      <TrustBar />
      <h1 className="font-serif text-5xl">
        Chcesz uporządkować zachowanie swojego psa lub kota?
      </h1>
      <p className="text-lg text-neutral-600">
        Pomóż mi dobrać rozmowę dopasowaną do sytuacji.
      </p>
      <CTAButtons />
      <KwadransNaJuzBadge />
    </HeroLayout>
  );
}
*/
