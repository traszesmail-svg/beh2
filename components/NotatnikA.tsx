import Link from 'next/link'
import Image from 'next/image'
import { Cat, Dog } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { ThemeToggle } from '@/components/ThemeToggle'
import { INSTAGRAM_PROFILE_URL } from '@/lib/site'

export type NotatnikNavItem = {
  href: string
  label: string
  icon?: 'dog' | 'cat'
}

export const PUBLIC_SITE_NAV_ITEMS: readonly NotatnikNavItem[] = [
  { href: '/psy', label: 'Pies', icon: 'dog' },
  { href: '/koty', label: 'Kot', icon: 'cat' },
]

export const PUBLIC_BOOKING_FLOW_NAV_ITEMS: readonly NotatnikNavItem[] = [
  { href: '/cennik', label: 'Cennik' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

type NotatnikTopbarProps = {
  tag: string
  navItems: readonly NotatnikNavItem[]
  ctaHref: string
  ctaLabel: string
  ctaVariant?: 'solid' | 'ghost' | 'accent'
}

type NotatnikSectionHeadProps = {
  index: string
  kicker?: string
  title: string
}

type NotatnikFinalCtaProps = {
  title: string
  copy?: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
}

type NotatnikFooterProps = {
  primaryHref?: string
  primaryLabel?: string
  showReviews?: boolean
}

type NotatnikPageShellProps = {
  tag: string
  navItems: readonly NotatnikNavItem[]
  ctaHref: string
  ctaLabel: string
  footerPrimaryHref: string
  footerPrimaryLabel: string
  sideVisualVariant?: NotatnikSideVisualVariant
  pageClassName?: string
  children: React.ReactNode
}

export type NotatnikSideVisualVariant = 'home' | 'mixed' | 'dog' | 'cat' | 'materials' | 'blog' | 'about' | 'pricing' | 'contact'

const HOME_SIDE_VISUAL = '/branding/side-visuals/home-forest-sun-rays.jpg'

function getCtaClassName(variant: NotatnikTopbarProps['ctaVariant']) {
  if (variant === 'ghost') {
    return 'notatnik-btn notatnik-btn-ghost'
  }

  if (variant === 'accent') {
    return 'notatnik-btn notatnik-btn-accent'
  }

  return 'notatnik-btn'
}

function NotatnikButtonArrow() {
  return (
    <span className="notatnik-btn-arrow" aria-hidden="true">
      &rarr;
    </span>
  )
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" />
    </svg>
  )
}

function NotatnikBrandLockup() {
  return (
    <Link href="/" prefetch={false} className="notatnik-brand" aria-label="Wroc na strone glowna Regulski">
      <span className="notatnik-brand-credential" aria-hidden="true">
        <Image src="/branding/credentials/coapemale.png" alt="" width={132} height={62} priority />
      </span>
      <span className="notatnik-brand-copy">
        <span className="notatnik-brand-mark">Regulski</span>
        <span className="notatnik-brand-tag">Terapia behawioralna</span>
      </span>
    </Link>
  )
}

function NotatnikNavIcon({ icon }: { icon?: NotatnikNavItem['icon'] }) {
  if (icon === 'dog') return <Dog size={16} strokeWidth={1.9} aria-hidden="true" />
  if (icon === 'cat') return <Cat size={16} strokeWidth={1.9} aria-hidden="true" />
  return null
}

export function NotatnikTopbar({ tag, navItems, ctaHref, ctaLabel, ctaVariant = 'solid' }: NotatnikTopbarProps) {
  return (
    <header className="notatnik-topbar">
      <NotatnikBrandLockup />

      <nav className="notatnik-nav" aria-label="Glowne sekcje">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} prefetch={false}>
            <NotatnikNavIcon icon={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="notatnik-topbar-actions">
        <ThemeToggle />
        <a
          href={INSTAGRAM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="notatnik-social-link"
          aria-label="Otworz Instagram"
        >
          <InstagramGlyph />
        </a>
      </div>

      <details className="notatnik-mobile-menu">
        <summary aria-label="Otworz menu">
          <span className="notatnik-mobile-menu-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </summary>
        <div className="notatnik-mobile-menu-panel">
          <nav aria-label="Menu mobilne">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false}>
                <NotatnikNavIcon icon={item.icon} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </details>
    </header>
  )
}

const SIDE_VISUALS: Record<NotatnikSideVisualVariant, { left: string; right: string }> = {
  home: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
  mixed: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
  dog: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
  cat: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
  materials: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
  blog: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
  about: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
  pricing: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
  contact: {
    left: HOME_SIDE_VISUAL,
    right: HOME_SIDE_VISUAL,
  },
}

export function NotatnikSideVisuals({ variant = 'mixed' }: { variant?: NotatnikSideVisualVariant }) {
  const visuals = SIDE_VISUALS[variant]
  const isHome = variant === 'home'

  return (
    <>
      <div
        className="notatnik-side-visual notatnik-side-visual-left notatnik-side-visual-forest-left"
        aria-hidden="true"
      >
        <img className="notatnik-side-visual-image" src={visuals.left} alt="" aria-hidden="true" loading="eager" decoding="async" />
      </div>
      <div
        className="notatnik-side-visual notatnik-side-visual-right notatnik-side-visual-forest-right"
        aria-hidden="true"
      >
        <img className="notatnik-side-visual-image" src={visuals.right} alt="" aria-hidden="true" loading="eager" decoding="async" />
      </div>
    </>
  )
}

export function NotatnikSectionHead({ index, kicker, title }: NotatnikSectionHeadProps) {
  return (
    <div className="notatnik-section-head">
      <div className="notatnik-section-index">{index}</div>
      <div className="notatnik-section-head-copy">
        {kicker ? <div className="notatnik-mono">{kicker}</div> : null}
        <h2>{title}</h2>
      </div>
    </div>
  )
}

export function NotatnikFinalCta({
  title,
  copy,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: NotatnikFinalCtaProps) {
  return (
    <section className="notatnik-final">
      <h2 dangerouslySetInnerHTML={{ __html: title }} />
      {copy ? <p>{copy}</p> : null}
      <div className="notatnik-final-actions">
        <Link href={primaryHref} prefetch={false} className="notatnik-btn">
          <span>{primaryLabel}</span>
          <NotatnikButtonArrow />
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link href={secondaryHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
            <span>{secondaryLabel}</span>
          </Link>
        ) : null}
      </div>
    </section>
  )
}

export function NotatnikFooter({ showReviews = true }: NotatnikFooterProps) {
  return <Footer variant="full" showReviews={showReviews} />
}

export function NotatnikPageShell({
  tag,
  navItems,
  ctaHref,
  ctaLabel,
  footerPrimaryHref,
  footerPrimaryLabel,
  sideVisualVariant = 'mixed',
  pageClassName,
  children,
}: NotatnikPageShellProps) {
  return (
    <main className={pageClassName ? `notatnik-page ${pageClassName}` : 'notatnik-page'}>
      <NotatnikSideVisuals variant={sideVisualVariant} />
      <div className="notatnik-shell">
        <NotatnikTopbar tag={tag} navItems={navItems} ctaHref={ctaHref} ctaLabel={ctaLabel} />
        {children}
        <NotatnikFooter primaryHref={footerPrimaryHref} primaryLabel={footerPrimaryLabel} />
      </div>
    </main>
  )
}
