import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { ThemeToggle } from '@/components/ThemeToggle'
import { INSTAGRAM_PROFILE_URL } from '@/lib/site'

export type NotatnikNavItem = {
  href: string
  label: string
}

export const PUBLIC_SITE_NAV_ITEMS: readonly NotatnikNavItem[] = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/blog', label: 'Blog' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
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
  kicker: string
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
}

type NotatnikPageShellProps = {
  tag: string
  navItems: readonly NotatnikNavItem[]
  ctaHref: string
  ctaLabel: string
  footerPrimaryHref: string
  footerPrimaryLabel: string
  children: React.ReactNode
}

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

export function NotatnikTopbar({ tag, navItems, ctaHref, ctaLabel, ctaVariant = 'solid' }: NotatnikTopbarProps) {
  return (
    <header className="notatnik-topbar">
      <Link href="/" prefetch={false} className="notatnik-brand" aria-label="Wroc na strone glowna Regulski">
        <div className="notatnik-brand-mark">Regulski.</div>
        <div className="notatnik-brand-tag">{tag}</div>
      </Link>

      <nav className="notatnik-nav" aria-label="Glowne sekcje">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} prefetch={false}>
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
        <Link href={ctaHref} prefetch={false} className={getCtaClassName(ctaVariant)}>
          <span>{ctaLabel}</span>
          <NotatnikButtonArrow />
        </Link>
      </div>
    </header>
  )
}

export function NotatnikSectionHead({ index, kicker, title }: NotatnikSectionHeadProps) {
  return (
    <div className="notatnik-section-head">
      <div className="notatnik-section-index">{index}</div>
      <div className="notatnik-section-head-copy">
        <div className="notatnik-mono">{kicker}</div>
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

export function NotatnikFooter(_: NotatnikFooterProps) {
  return <Footer variant="full" />
}

export function NotatnikPageShell({
  tag,
  navItems,
  ctaHref,
  ctaLabel,
  footerPrimaryHref,
  footerPrimaryLabel,
  children,
}: NotatnikPageShellProps) {
  return (
    <main className="notatnik-page">
      <div className="notatnik-shell">
        <NotatnikTopbar tag={tag} navItems={navItems} ctaHref={ctaHref} ctaLabel={ctaLabel} />
        {children}
        <NotatnikFooter primaryHref={footerPrimaryHref} primaryLabel={footerPrimaryLabel} />
      </div>
    </main>
  )
}
