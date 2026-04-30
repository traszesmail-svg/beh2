'use client'

import type { HeroSlug } from '@/components/pageHeroes.config'

interface HeroIllustrationProps {
  slug: HeroSlug
  emojiPlaceholder?: string
  className?: string
}

export function HeroIllustration({ className = '' }: HeroIllustrationProps) {
  return (
    <div
      className={`relative flex min-h-[320px] items-center justify-center overflow-hidden border border-dashed border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(250,247,240,0.94),rgba(243,238,229,0.88))] ${className}`}
      aria-hidden="true"
    />
  )
}
