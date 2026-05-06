import Image from 'next/image'
import { REGULSKI_WEB_HERO, type RegulskiWebHeroVariant } from '@/lib/regulski-web-assets'

type RegulskiWebHeroProps = {
  variant: RegulskiWebHeroVariant
  priority?: boolean
  className?: string
}

export function RegulskiWebHero({ variant, priority = false, className }: RegulskiWebHeroProps) {
  const rootClassName = className ? `regulski-web-hero-visual ${className}` : 'regulski-web-hero-visual'

  return (
    <figure className={rootClassName} aria-hidden="true">
      <Image
        src={REGULSKI_WEB_HERO[variant]}
        alt=""
        fill
        sizes="(max-width: 760px) 100vw, (max-width: 1200px) 44vw, 560px"
        priority={priority}
        className="regulski-web-hero-image"
      />
    </figure>
  )
}
