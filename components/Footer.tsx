import Link from 'next/link'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMailtoHref, getContactDetails, SITE_SHORT_NAME, SPECIALIST_NAME } from '@/lib/site'

type FooterProps = {
  variant?: 'landing' | 'lean' | 'full'
  ctaHref?: string
  ctaLabel?: string
  headline?: string
  description?: string
  secondaryHref?: string
  secondaryLabel?: string
  sectionBasePath?: '/' | '/psy'
}

function buildSectionHref(sectionBasePath: '/' | '/psy', sectionId: string) {
  return sectionBasePath === '/psy' ? `/psy#${sectionId}` : `/#${sectionId}`
}

export function Footer(props: FooterProps) {
  const contact = getContactDetails()
  const consultationHref = props.ctaHref ?? '/kontakt'
  const consultationLabel = props.ctaLabel ?? 'Umów konsultację'
  const secondaryHref = props.secondaryHref ?? null
  const secondaryLabel = props.secondaryLabel ?? null
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const sectionBasePath = props.sectionBasePath ?? '/'

  const mailtoHref = contact.email
    ? buildMailtoHref(
        contact.email,
        'Zapytanie - Regulski | Konsultacje',
        'Dzień dobry,\n\nkrótko opisuję swoją sytuację:\n\n- gatunek:\n- problem:\n- od kiedy trwa:\n- czego potrzebuję na start:\n',
      )
    : null

  return (
    <footer className="site-footer" aria-label="Stopka">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <div className="section-eyebrow">Regulski</div>
          <h3>{SITE_SHORT_NAME}</h3>
          <p>Spokojna pomoc w zrozumieniu problemów zachowania psów i kotów.</p>
          <div className="site-footer-brand-line">Behawiorysta COAPE | Koty i psy</div>
        </div>

        <div className="site-footer-nav">
          <div className="section-eyebrow">Nawigacja</div>
          <div className="site-footer-links">
            <Link href={buildSectionHref(sectionBasePath, 'jak-pomagam')} prefetch={false} className="site-footer-link">
              Jak pomagam
            </Link>
            <Link href={buildSectionHref(sectionBasePath, 'konsultacja')} prefetch={false} className="site-footer-link">
              Konsultacja
            </Link>
            <Link href={buildSectionHref(sectionBasePath, 'opinie')} prefetch={false} className="site-footer-link">
              Opinie
            </Link>
            <Link href={buildSectionHref(sectionBasePath, 'faq')} prefetch={false} className="site-footer-link">
              FAQ
            </Link>
            <Link href="/kontakt" prefetch={false} className="site-footer-link">
              Kontakt
            </Link>
          </div>
        </div>

        <div className="site-footer-contact">
          <div className="section-eyebrow">Kontakt</div>
          <div className="site-footer-links">
            <Link href={consultationHref} prefetch={false} className="site-footer-link site-footer-link-primary">
              {consultationLabel}
            </Link>
            {secondaryHref && secondaryLabel ? (
              <Link href={secondaryHref} prefetch={false} className="site-footer-link">
                {secondaryLabel}
              </Link>
            ) : null}
            {contact.email ? (
              <a href={mailtoHref ?? `mailto:${contact.email}`} className="site-footer-link">
                {contact.email}
              </a>
            ) : null}
            {contact.phoneDisplay && contact.phoneHref ? (
              <a href={`tel:${contact.phoneHref}`} className="site-footer-link">
                {contact.phoneDisplay}
              </a>
            ) : null}
            <Link href={audioHref} prefetch={false} className="site-footer-link">
              Krótka rozmowa wstępna 15 min audio
            </Link>
            <span className="site-footer-note">bez potrzeby przygotowania kamery</span>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-legal">
          <Link href="/polityka-prywatnosci" prefetch={false}>
            Polityka prywatności
          </Link>
          <span>•</span>
          <Link href="/regulamin" prefetch={false}>
            Regulamin
          </Link>
        </div>

        <div className="site-footer-credit">
          <span>© {new Date().getFullYear()} {SITE_SHORT_NAME}</span>
          <span>{SPECIALIST_NAME}</span>
        </div>
      </div>
    </footer>
  )
}
