import Link from 'next/link'
import Image from '@/components/BlankImage'
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
  sideVisualVariant?: NotatnikSideVisualVariant
  pageClassName?: string
  children: React.ReactNode
}

export type NotatnikSideVisualVariant = 'mixed' | 'dog' | 'cat' | 'materials' | 'blog' | 'about' | 'pricing' | 'contact'

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
        <Link
          href={ctaHref}
          prefetch={false}
          className={getCtaClassName(ctaVariant)}
          data-analytics-event="cta_click"
          data-analytics-location="topbar"
          data-analytics-cta-label={ctaLabel}
        >
          <span>{ctaLabel}</span>
          <NotatnikButtonArrow />
        </Link>
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
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href={ctaHref}
            prefetch={false}
            className={getCtaClassName(ctaVariant)}
            data-analytics-event="cta_click"
            data-analytics-location="mobile-menu"
            data-analytics-cta-label={ctaLabel}
          >
            <span>{ctaLabel}</span>
            <NotatnikButtonArrow />
          </Link>
        </div>
      </details>
    </header>
  )
}

const SIDE_VISUALS: Record<NotatnikSideVisualVariant, { left: string; right: string }> = {
  mixed: {
    left: '/branding/side-visuals/general-dog-walk.jpg',
    right: '/branding/side-visuals/general-cat-owner.jpg',
  },
  dog: {
    left: '/branding/side-visuals/dog-forest-walk.jpg',
    right: '/branding/side-visuals/dog-training-forest.jpg',
  },
  cat: {
    left: '/branding/side-visuals/cat-owner-home.jpg',
    right: '/branding/side-visuals/cat-litter-home.jpg',
  },
  materials: {
    left: '/branding/side-visuals/materials-notebook-desk.jpg',
    right: '/branding/side-visuals/materials-laptop-notebook.jpg',
  },
  blog: {
    left: '/branding/side-visuals/blog-notebook-desk.jpg',
    right: '/branding/side-visuals/blog-laptop-notes.jpg',
  },
  about: {
    left: '/branding/side-visuals/about-professional-desk.jpg',
    right: '/branding/specialist-krzysztof-social.jpg',
  },
  pricing: {
    left: '/branding/side-visuals/pricing-calculator-docs.jpg',
    right: '/branding/side-visuals/pricing-calendar-desk.jpg',
  },
  contact: {
    left: '/branding/side-visuals/contact-notebook-laptop.jpg',
    right: '/branding/side-visuals/contact-writing-notebook.jpg',
  },
}

export function NotatnikSideVisuals({ variant = 'mixed' }: { variant?: NotatnikSideVisualVariant }) {
  const visuals = SIDE_VISUALS[variant]

  return (
    <>
      <div className="notatnik-side-visual notatnik-side-visual-left" aria-hidden="true">
        <Image src={visuals.left} alt="" fill sizes="(max-width: 1600px) 180px, 280px" quality={72} />
      </div>
      <div className="notatnik-side-visual notatnik-side-visual-right" aria-hidden="true">
        <Image src={visuals.right} alt="" fill sizes="(max-width: 1600px) 180px, 280px" quality={72} />
      </div>
    </>
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
          <div>
            <Link href={secondaryHref} prefetch={false} className="notatnik-inline-link">
              {secondaryLabel}
            </Link>
          </div>
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
