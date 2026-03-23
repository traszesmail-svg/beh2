import Link from 'next/link'
import {
  FACEBOOK_PROFILE_URL,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  getContactDetails,
} from '@/lib/site'

export function Footer() {
  const contact = getContactDetails()

  return (
    <footer className="site-footer" id="kontakt">
      <div className="site-footer-grid">
        <div className="footer-card">
          <div className="section-eyebrow">Behawior 15</div>
          <h2 className="footer-title">Spokojny pierwszy krok przy problemie behawioralnym.</h2>
          <p className="muted footer-copy">
            {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. Konsultacja audio online dla opiekunów psów i kotów.
          </p>
        </div>

        <div className="footer-card">
          <div className="footer-label">Kontakt i wsparcie</div>
          <div className="footer-links">
            {contact.email ? (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : (
              <span>Publiczny adres e-mail pojawi się po finalnej konfiguracji kontaktu. Na teraz możesz skorzystać z telefonu lub Facebooka.</span>
            )}
            {contact.phone ? <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a> : null}
            <a href={FACEBOOK_PROFILE_URL} target="_blank" rel="noopener noreferrer">
              Facebook Krzysztofa Regulskiego
            </a>
          </div>
        </div>

        <div className="footer-card">
          <div className="footer-label">Ważne linki</div>
          <div className="footer-links">
            <Link href="/book" data-analytics-event="reserve_click" data-analytics-location="footer">
              Zarezerwuj 15 minut i odzyskaj spokój w domu
            </Link>
            <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
            <Link href="/regulamin">Regulamin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
