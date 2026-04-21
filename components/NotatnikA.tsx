import Link from 'next/link'

export type NotatnikNavItem = {
  href: string
  label: string
}

type NotatnikTopbarProps = {
  tag: string
  navItems: NotatnikNavItem[]
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
  primaryHref: string
  primaryLabel: string
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

export function NotatnikTopbar({ tag, navItems, ctaHref, ctaLabel, ctaVariant = 'solid' }: NotatnikTopbarProps) {
  return (
    <header className="notatnik-topbar">
      <div className="notatnik-brand">
        <div className="notatnik-brand-mark">Regulski.</div>
        <div className="notatnik-brand-tag">{tag}</div>
      </div>

      <nav className="notatnik-nav" aria-label="Glowne sekcje">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} prefetch={false}>
            {item.label}
          </Link>
        ))}
      </nav>

      <Link href={ctaHref} prefetch={false} className={getCtaClassName(ctaVariant)}>
        <span>{ctaLabel}</span>
        <NotatnikButtonArrow />
      </Link>
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

export function NotatnikFooter({ primaryHref, primaryLabel }: NotatnikFooterProps) {
  return (
    <footer className="notatnik-foot">
      <div>
        <div className="notatnik-foot-mark">Regulski.</div>
        <p>Spokojna pomoc w zrozumieniu problemow zachowania psow i kotow. Terapia behawioralna online dla opiekunow z calej Polski.</p>
      </div>
      <div>
        <h5>Nawigacja</h5>
        <ul>
          <li>
            <Link href="/psy" prefetch={false}>
              Pies
            </Link>
          </li>
          <li>
            <Link href="/koty" prefetch={false}>
              Kot
            </Link>
          </li>
          <li>
            <Link href="/niezbednik" prefetch={false}>
              Niezbednik
            </Link>
          </li>
          <li>
            <Link href="/kontakt#formularz" prefetch={false}>
              Kontakt
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h5>Start</h5>
        <ul>
          <li>
            <Link href={primaryHref} prefetch={false}>
              {primaryLabel}
            </Link>
          </li>
          <li>
            <Link href="/book?service=konsultacja-30-min" prefetch={false}>
              Dwa kwadranse
            </Link>
          </li>
          <li>
            <Link href="/book?service=konsultacja-behawioralna-online" prefetch={false}>
              Pelna konsultacja
            </Link>
          </li>
          <li>
            <Link href="/o-mnie" prefetch={false}>
              O mnie
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h5>Materialy</h5>
        <ul>
          <li>
            <Link href="/bezplatne-materialy/pies-reaktywnosc-5-krokow" prefetch={false}>
              Reaktywny pies
            </Link>
          </li>
          <li>
            <Link href="/bezplatne-materialy/kot-kuweta-checklista" prefetch={false}>
              Checklista kuweta
            </Link>
          </li>
          <li>
            <Link href="/bezplatne-materialy/przygotowanie-do-konsultacji-online" prefetch={false}>
              Przygotowanie do konsultacji
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
