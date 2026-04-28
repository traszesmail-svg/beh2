// handoff-2/components/HeroIllustration.tsx
// Komponent ilustracji z eleganckim fallbackiem
// Jeśli SVG jeszcze nie wgrane — pokazuje kolorowy gradient z emoji placeholder

import Image from 'next/image';
import { pageHeroes, type HeroSlug } from './pageHeroes.config';

interface HeroIllustrationProps {
  slug: HeroSlug;
  emojiPlaceholder?: string;  // emoji do pokazania gdy brak SVG, np. '🐕'
  className?: string;
}

export function HeroIllustration({ slug, emojiPlaceholder = '🎨', className = '' }: HeroIllustrationProps) {
  const config = pageHeroes[slug];
  if (!config) return null;

  const gradientClass = config.bgGradient ?? 'from-accent-light to-emerald-50';

  return (
    <div className={`relative bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden ${className}`}>
      {/* Pattern decoracyjny */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 60px, rgba(255,255,255,0.4) 60px, rgba(255,255,255,0.4) 120px)`,
        }}
      />

      {/* Ilustracja albo placeholder */}
      <div className="relative z-10 p-10 max-w-md w-full">
        <Image
          src={config.illustration}
          alt={config.alt}
          width={400}
          height={400}
          className="w-full h-auto"
          onError={(e) => {
            // Fallback gdy SVG nie istnieje — pokaż placeholder
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const fallback = img.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        {/* Fallback (ukryty domyślnie, pokazuje się przy onError) */}
        <div
          className="hidden flex-col items-center justify-center text-accent-dark text-center"
          style={{ minHeight: '300px' }}
        >
          <div className="text-6xl mb-4 opacity-70">{emojiPlaceholder}</div>
          <div className="text-xs font-mono opacity-60">
            {config.alt}<br />
            <span className="text-[10px] opacity-50 mt-2 inline-block">/illustrations/{slug}.svg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
