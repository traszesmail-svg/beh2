import Link from 'next/link'
import Image from 'next/image'
import { Footer } from '@/components/Footer'
import { ThemeToggle } from '@/components/ThemeToggle'
import { INSTAGRAM_PROFILE_URL } from '@/lib/site'
import { REGULSKI_WEB_LOGO } from '@/lib/regulski-web-assets'

export type NotatnikNavItem = {
  href: string
  label: string
}

export const PUBLIC_SITE_NAV_ITEMS: readonly NotatnikNavItem[] = [
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/niezbednik', label: 'Niezbędnik' },
  { href: '/blog', label: 'Blog' },
  { href: '/kontakt', label: 'Kontakt' },
]

export const PUBLIC_BOOKING_FLOW_NAV_ITEMS: readonly NotatnikNavItem[] = [
  { href: '/cennik', label: 'Cennik' },
  { href: '/niezbednik', label: 'Niezbędnik' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

type NotatnikTopbarProps = {
  tag: string
  navItems: readonly NotatnikNavItem[]
  ctaHref?: string
  ctaLabel?: string
  ctaVariant?: 'solid' | 'ghost' | 'accent'
  showUtilityLinks?: boolean
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

export type NotatnikSideVisualVariant = 'home' | 'mixed' | 'dog' | 'cat' | 'materials' | 'blog' | 'about' | 'pricing' | 'contact' | 'booking'

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
    <Link href="/" prefetch={false} className="notatnik-brand" aria-label="Wróć na stronę główną Regulski">
      <span className="notatnik-brand-credential" aria-hidden="true">
        <Image src={REGULSKI_WEB_LOGO} alt="" width={512} height={512} priority />
      </span>
      <span className="notatnik-brand-copy">
        <span className="notatnik-brand-mark">Regulski</span>
        <span className="notatnik-brand-tag">Terapia behawioralna</span>
      </span>
    </Link>
  )
}

export function NotatnikTopbar({ navItems, showUtilityLinks = true }: NotatnikTopbarProps) {
  const hasNavItems = navItems.length > 0

  return (
    <header className="notatnik-topbar">
      <NotatnikBrandLockup />

      {hasNavItems ? (
        <nav className="notatnik-nav" aria-label="Główne sekcje">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="notatnik-topbar-actions">
        {showUtilityLinks ? <ThemeToggle /> : null}
        {showUtilityLinks ? (
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="notatnik-social-link"
            aria-label="Otwórz Instagram"
          >
            <InstagramGlyph />
          </a>
        ) : null}
      </div>

      {hasNavItems ? (
        <details className="notatnik-mobile-menu">
          <summary aria-label="Otwórz menu">
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
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </details>
      ) : null}
    </header>
  )
}

const SIDE_VISUALS: Record<NotatnikSideVisualVariant, { left: string; right: string }> = {
  home: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  mixed: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  dog: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  cat: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  materials: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  blog: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  about: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  pricing: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  contact: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
  booking: {
    left: '/images/homepage/home-bg-dog-1to1.png',
    right: '/images/homepage/home-bg-cat-1to1.png',
  },
}

export function NotatnikSideVisuals({ variant = 'mixed' }: { variant?: NotatnikSideVisualVariant }) {
  const visuals = SIDE_VISUALS[variant]

  return (
    <>
      <div
        className="notatnik-side-visual notatnik-side-visual-left"
        aria-hidden="true"
      >
        <Image
          className="notatnik-side-visual-image"
          src={visuals.left}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(max-width: 980px) 0px, (max-width: 1280px) 210px, 320px"
        />
      </div>
      <div
        className="notatnik-side-visual notatnik-side-visual-right"
        aria-hidden="true"
      >
        <Image
          className="notatnik-side-visual-image"
          src={visuals.right}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="(max-width: 980px) 0px, (max-width: 1280px) 220px, 340px"
        />
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
