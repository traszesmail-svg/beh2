import React from 'react'
import Link from 'next/link'
import { getFunnelEntryEventForHref, getServiceAnalyticsParams } from '@/lib/analytics-schema'
import { getBuildMarkerSnapshot } from '@/lib/build-marker'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import {
  buildMailtoHref,
  getPublicContactEmailNote,
  getPublicContactDetails,
  PUBLIC_SOCIAL_LINKS,
  SITE_SHORT_NAME,
  SPECIALIST_NAME,
} from '@/lib/site'

type FooterProps = {
  variant?: 'landing' | 'lean' | 'full' | 'home' | 'legal'
  ctaHref?: string
  ctaLabel?: string
  headline?: string
  description?: string
  secondaryHref?: string
  secondaryLabel?: string
  sectionBasePath?: '/' | '/blog' | '/psy' | '/koty' | '/opinie' | '/o-mnie' | '/faq' | '/kontakt' | '/materialy' | '/niezbednik'
}

type FooterSectionBasePath = '/' | '/blog' | '/psy' | '/koty' | '/opinie' | '/o-mnie' | '/faq' | '/kontakt' | '/materialy' | '/niezbednik'

type FooterNavItem = {
  href: string
  label: string
}

function buildSectionHref(sectionBasePath: FooterSectionBasePath, sectionId: string) {
  return sectionBasePath === '/' ? `/#${sectionId}` : `${sectionBasePath}#${sectionId}`
}

function getFooterNavItems(sectionBasePath: FooterSectionBasePath): FooterNavItem[] {
  if (sectionBasePath === '/') {
    return [
      { href: buildSectionHref(sectionBasePath, 'jak-pomagam'), label: 'Jak pomagam' },
      { href: buildSectionHref(sectionBasePath, 'final-cta'), label: 'Najprostszy start' },
      { href: buildSectionHref(sectionBasePath, 'opinie'), label: 'Opinie' },
      { href: buildSectionHref(sectionBasePath, 'faq'), label: 'FAQ' },
      { href: '/kontakt', label: 'Kontakt' },
    ]
  }

  if (sectionBasePath === '/blog') {
    return [
      { href: '/blog', label: 'Blog' },
      { href: '/psy', label: 'Psy' },
      { href: '/koty', label: 'Koty' },
      { href: '/niezbednik', label: 'Niezbędnik' },
      { href: '/kontakt', label: 'Kontakt' },
    ]
  }

  if (sectionBasePath === '/opinie') {
    return [
      { href: buildSectionHref(sectionBasePath, 'opinie'), label: 'Opinie' },
      { href: buildSectionHref(sectionBasePath, 'przypadki'), label: 'Przypadki' },
      { href: buildSectionHref(sectionBasePath, 'faq'), label: 'FAQ' },
      { href: buildSectionHref(sectionBasePath, 'kontakt'), label: 'Kontakt' },
    ]
  }

  if (sectionBasePath === '/o-mnie') {
    return [
      { href: buildSectionHref(sectionBasePath, 'kim-jestem'), label: 'Kim jestem' },
      { href: buildSectionHref(sectionBasePath, 'metodyka'), label: 'Metodyka' },
      { href: buildSectionHref(sectionBasePath, 'opinie'), label: 'Opinie' },
      { href: buildSectionHref(sectionBasePath, 'faq'), label: 'FAQ' },
      { href: '/kontakt', label: 'Kontakt' },
    ]
  }

  if (sectionBasePath === '/faq') {
    return [
      { href: '/konsultacja-behawioralna-online#faq', label: 'Konsultacja' },
      { href: '/psy#faq', label: 'Psy' },
      { href: '/koty#faq', label: 'Koty' },
      { href: buildSectionHref(sectionBasePath, 'kontakt'), label: 'Kontakt' },
    ]
  }

  if (sectionBasePath === '/kontakt') {
    return [
      { href: buildSectionHref(sectionBasePath, 'kontakt'), label: 'Kontakt' },
      { href: buildSectionHref(sectionBasePath, 'jak-umowic-konsultacje'), label: 'Jak umówić konsultację' },
      { href: buildSectionHref(sectionBasePath, 'faq'), label: 'FAQ' },
      { href: buildSectionHref(sectionBasePath, 'rezerwacja'), label: 'Rezerwacja' },
    ]
  }

  if (sectionBasePath === '/materialy' || sectionBasePath === '/niezbednik') {
    const essentialsBasePath = sectionBasePath === '/materialy' ? '/niezbednik' : sectionBasePath

    return [
      { href: buildSectionHref(essentialsBasePath, 'polecane-starty'), label: 'Polecane starty' },
      { href: buildSectionHref(essentialsBasePath, 'ksiazki'), label: 'Książki' },
      { href: buildSectionHref(essentialsBasePath, 'przybory'), label: 'Narzędzia' },
      { href: '/kontakt', label: 'Kontakt' },
    ]
  }

  return [
    { href: buildSectionHref(sectionBasePath, 'jak-pomagam'), label: 'Jak pomagam' },
    { href: buildSectionHref(sectionBasePath, 'konsultacja'), label: 'Konsultacja' },
    { href: buildSectionHref(sectionBasePath, 'opinie'), label: 'Opinie' },
    { href: buildSectionHref(sectionBasePath, 'faq'), label: 'FAQ' },
    { href: '/kontakt', label: 'Kontakt' },
  ]
}

export function Footer(props: FooterProps) {
  const contact = getPublicContactDetails()
  const buildMarker = getBuildMarkerSnapshot()
  const isHomeVariant = props.variant === 'home'
  const isLegalVariant = props.variant === 'legal'
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const primaryHref = props.ctaHref ?? audioHref
  const primaryLabel = props.ctaLabel ?? FUNNEL_CTA_LABELS.primary
  const secondaryHref = props.secondaryHref ?? null
  const secondaryLabel = props.secondaryLabel ?? null
  const sectionBasePath = (props.sectionBasePath ?? '/') as FooterSectionBasePath
  const navItems = getFooterNavItems(sectionBasePath)
  const publicContactNote = getPublicContactEmailNote()
  const quickService = getServiceAnalyticsParams('szybka-konsultacja-15-min')
  const fullService = getServiceAnalyticsParams('konsultacja-behawioralna-online')
  const primaryService = primaryHref.includes('service=konsultacja-behawioralna-online') ? fullService : quickService
  const primaryServiceKey = primaryHref.includes('service=konsultacja-behawioralna-online')
    ? 'konsultacja-behawioralna-online'
    : 'szybka-konsultacja-15-min'

  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | Konsultacje',
        'Dzień dobry,\n\nkrótko opisuję swoją sytuację:\n\n- gatunek:\n- problem:\n- od kiedy trwa:\n- czego potrzebuję na start:\n',
      )
    : null

  return (
    <footer
      className={`site-footer${isHomeVariant ? ' site-footer-home' : ''}`}
      aria-label="Stopka"
      data-build-marker={buildMarker.value}
    >
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <div className="section-eyebrow">Regulski</div>
          <h3>{SITE_SHORT_NAME}</h3>
          <p>Spokojna pomoc w zrozumieniu problemów zachowania psów i kotów.</p>
          <div className="site-footer-brand-line" aria-label="Profil specjalisty">
            <span>Terapia behawioralna</span>
            <span>Psy i koty</span>
          </div>
        </div>

        <div className="site-footer-nav">
          <div className="section-eyebrow">Nawigacja</div>
          <div className="site-footer-links">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="site-footer-link">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="site-footer-contact">
          <div className="section-eyebrow">Kontakt</div>

          {isLegalVariant ? (
            <div className="site-footer-links">
              {contact.email ? (
                <a href={mailtoHref ?? `mailto:${contact.email}`} className="site-footer-link site-footer-link-primary">
                  {contact.email}
                </a>
              ) : null}
              <Link href="/kontakt#formularz" prefetch={false} className="site-footer-link">
                Formularz kontaktowy
              </Link>
              <span className="site-footer-note">{publicContactNote}</span>
              {PUBLIC_SOCIAL_LINKS.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="site-footer-link">
                  {link.label}
                </a>
              ))}
            </div>
          ) : isHomeVariant ? (
            <div className="site-footer-contact-rail">
              <div className="site-footer-links site-footer-cta-links">
                <Link
                  href={primaryHref}
                  prefetch={false}
                  className="site-footer-link site-footer-link-primary"
                  data-analytics-event={getFunnelEntryEventForHref(primaryHref)}
                  data-analytics-location="footer-primary"
                  data-analytics-cta-label={primaryLabel}
                  data-analytics-service={primaryServiceKey}
                  data-analytics-service-name={String(primaryService.service_name)}
                  data-analytics-service-duration={String(primaryService.service_duration)}
                  data-analytics-service-price={String(primaryService.service_price)}
                >
                  {primaryLabel}
                </Link>
                {secondaryHref && secondaryLabel ? (
                  <Link
                    href={secondaryHref}
                    prefetch={false}
                    className="site-footer-link"
                    data-analytics-event={getFunnelEntryEventForHref(secondaryHref)}
                    data-analytics-location="footer-secondary"
                    data-analytics-cta-label={secondaryLabel}
                  >
                    {secondaryLabel}
                  </Link>
                ) : null}
              </div>

              <div className="site-footer-links site-footer-direct-links">
                {contact.email ? (
                  <a href={mailtoHref ?? `mailto:${contact.email}`} className="site-footer-link">
                    {contact.email}
                  </a>
                ) : null}
                <span className="site-footer-note">{publicContactNote}</span>
              </div>

              <div className="site-footer-links site-footer-social-links" aria-label="Profile publiczne">
                {PUBLIC_SOCIAL_LINKS.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="site-footer-link">
                    {link.label}
                  </a>
                ))}
              </div>

            </div>
          ) : (
            <div className="site-footer-links">
              <Link
                href={primaryHref}
                prefetch={false}
                className="site-footer-link site-footer-link-primary"
                data-analytics-event={getFunnelEntryEventForHref(primaryHref)}
                data-analytics-location="footer-primary"
                data-analytics-cta-label={primaryLabel}
                data-analytics-service={primaryServiceKey}
                data-analytics-service-name={String(primaryService.service_name)}
                data-analytics-service-duration={String(primaryService.service_duration)}
                data-analytics-service-price={String(primaryService.service_price)}
              >
                {primaryLabel}
              </Link>
              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  prefetch={false}
                  className="site-footer-link"
                  data-analytics-event={getFunnelEntryEventForHref(secondaryHref)}
                  data-analytics-location="footer-secondary"
                  data-analytics-cta-label={secondaryLabel}
                >
                  {secondaryLabel}
                </Link>
              ) : null}
              {contact.email ? (
                <a href={mailtoHref ?? `mailto:${contact.email}`} className="site-footer-link">
                  {contact.email}
                </a>
              ) : null}
              <span className="site-footer-note">{publicContactNote}</span>
              {PUBLIC_SOCIAL_LINKS.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="site-footer-link">
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-legal">
          <Link href="/polityka-prywatnosci" prefetch={false}>
            Polityka prywatności
          </Link>
          <span>&bull;</span>
          <Link href="/regulamin" prefetch={false}>
            Regulamin
          </Link>
        </div>

        <div className="site-footer-credit">
          <span>&copy; {new Date().getFullYear()} {SITE_SHORT_NAME}</span>
          <span>{SPECIALIST_NAME}</span>
        </div>
      </div>
    </footer>
  )
}
