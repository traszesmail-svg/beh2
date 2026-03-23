import Link from 'next/link'
import { getContactDetails, SPECIALIST_CREDENTIALS, SPECIALIST_NAME } from '@/lib/site'

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
          <div className="footer-label">Kontakt</div>
          <div className="footer-links">
            {contact.email ? (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            ) : (
              <span>Kontakt mailowy uzupełnimy przed publikacją danych na produkcji.</span>
            )}
            {contact.phone ? <a href={`tel:${contact.phone.replace(/\s+/g, '')}`}>{contact.phone}</a> : null}
          </div>
        </div>

        <div className="footer-card">
          <div className="footer-label">Ważne linki</div>
          <div className="footer-links">
            <Link href="/book">Zarezerwuj 15 minut i odzyskaj spokój w domu</Link>
            <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
            <Link href="/regulamin">Regulamin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
