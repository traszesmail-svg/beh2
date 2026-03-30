import React from 'react'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SPECIALIST_CREDENTIALS, SPECIALIST_NAME, buildMailtoHref, getContactDetails } from '@/lib/site'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Polityka prywatności',
  '/polityka-prywatnosci',
  'Informacje o przetwarzaniu danych, kontakcie, operatorach technicznych i zasadach prywatności w marce Regulski | Terapia behawioralna.',
)

export default function PrivacyPolicyPage() {
  const contact = getContactDetails()
  const contactMailtoHref = contact.email
    ? buildMailtoHref(contact.email, 'Prywatność i dane - Regulski | Terapia behawioralna')
    : null

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel legal-panel">
          <div className="section-eyebrow">Polityka prywatności</div>
          <h1>Jak przetwarzane są dane w marce Regulski | Terapia behawioralna</h1>
          <div className="stack-gap top-gap">
            <div className="list-card">
              <strong>Administrator danych</strong>
              <span>
                Administratorem danych związanych z serwisem, kontaktem i rezerwacją konsultacji jest {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}.
              </span>
            </div>

            <div className="list-card">
              <strong>Jakie dane przetwarzamy</strong>
              <span>
                Przetwarzamy dane niezbędne do obsługi konsultacji: imię opiekuna, dane kontaktowe, opis problemu, wybrany termin, status płatności oraz opcjonalne materiały dodane przed rozmową.
              </span>
            </div>

            <div className="list-card">
              <strong>Cele i podstawy przetwarzania</strong>
              <span>
                Dane przetwarzamy w celu przyjęcia rezerwacji, przeprowadzenia konsultacji, obsługi płatności, wysłania potwierdzeń i przypomnień, przygotowania specjalisty do rozmowy oraz obsługi reklamacji, zwrotów i kontaktu posprzedażowego.
              </span>
            </div>

            <div className="list-card">
              <strong>Operatorzy zewnętrzni i odbiorcy danych</strong>
              <span>
                Do działania serwisu wykorzystujemy usługi Supabase, PayU, Resend oraz Jitsi, a po wyrażeniu zgody także Google Analytics. Jeśli włączona jest wysyłka SMS po płatności, dane kontaktowe są przekazywane również do operatora SMS. Dane są przekazywane wyłącznie w zakresie potrzebnym do obsługi rezerwacji, płatności, wiadomości, pokoju rozmowy i bezpieczeństwa działania serwisu.
              </span>
            </div>

            <div className="list-card">
              <strong>Jak długo przechowujemy dane</strong>
              <span>
                Dane rezerwacyjne i rozliczeniowe przechowujemy tak długo, jak jest to potrzebne do realizacji usługi, rozliczeń, kontaktu posprzedażowego oraz spełnienia obowiązków prawnych i podatkowych.
              </span>
            </div>

            <div className="list-card">
              <strong>Twoje prawa</strong>
              <span>
                Możesz poprosić o dostęp do danych, ich sprostowanie, ograniczenie przetwarzania lub usunięcie, o ile nie koliduje to z obowiązkami rozliczeniowymi albo bezpieczeństwem obsługi rezerwacji.
              </span>
            </div>

            <div className="list-card">
              <strong>Kontakt w sprawie danych</strong>
              <span>
                {contact.email && contactMailtoHref ? (
                  <>
                    E-mail: <a href={contactMailtoHref}>{contact.email}</a>.{' '}
                  </>
                ) : null}
                {contact.phoneDisplay && contact.phoneHref ? (
                  <>
                    Telefon: <a href={`tel:${contact.phoneHref}`}>{contact.phoneDisplay}</a>.{' '}
                  </>
                ) : null}
                Kontakt w sprawie danych prowadzony jest przez te dane kontaktowe. Publiczny profil specjalisty w CAPBT, widoczny w stopce serwisu, służy wyłącznie weryfikacji kwalifikacji.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
