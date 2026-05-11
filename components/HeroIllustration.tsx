'use client';
// Komponent ilustracji z eleganckim fallbackiem
// Jeśli SVG jeszcze nie wgrane — pokazuje kolorowy gradient z emoji placeholder

import Image from 'next/image';
import { useState } from 'react';
import { pageHeroes, type HeroSlug } from '@/components/pageHeroes.config';

interface HeroIllustrationProps {
  slug: HeroSlug;
  emojiPlaceholder?: string;
  className?: string;
}

export function HeroIllustration({ slug, emojiPlaceholder = '🎨', className = '' }: HeroIllustrationProps) {
  const config = pageHeroes[slug];
  const [failed, setFailed] = useState(false);

  if (!config) return null;

  const gradientClass = config.bgGradient ?? 'from-accent-light to-emerald-50';

  return (
    <div className={`relative bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden ${className}`}>
      <div className="relative z-10 p-10 max-w-md w-full flex flex-col items-center justify-center">
        {!failed ? (
          <Image
            src={config.illustration}
            alt={config.alt}
            width={400}
            height={400}
            className="w-full h-auto"
            style={{ width: '100%', height: 'auto' }}
            unoptimized
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-accent-dark text-center" style={{ minHeight: '300px' }}>
            <div className="text-7xl mb-4 opacity-60">{emojiPlaceholder}</div>
            <div className="text-xs font-mono opacity-50 mt-2">{config.alt}</div>
          </div>
        )}
      </div>
    </div>
  );
}
