'use client'

import type { HeroSlug } from '@/components/pageHeroes.config'
import { pageHeroes } from '@/components/pageHeroes.config'

interface HeroIllustrationProps {
  slug: HeroSlug
  emojiPlaceholder?: string
  className?: string
}

export function HeroIllustration({ slug, emojiPlaceholder = '🎨', className = '' }: HeroIllustrationProps) {
  const config = pageHeroes[slug]

  if (!config) return null

  const gradientClass = config.bgGradient ?? 'from-accent-light to-emerald-50'

  return (
    <div className={`relative bg-gradient-to-br ${gradientClass} flex items-center justify-center overflow-hidden ${className}`}>
      <div className="relative z-10 p-10 max-w-md w-full flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-accent-dark text-center" style={{ minHeight: '300px' }}>
          <div className="text-7xl mb-4 opacity-60">{emojiPlaceholder}</div>
          <div className="text-xs font-mono opacity-50 mt-2">{config.alt}</div>
        </div>
      </div>
    </div>
  )
}
