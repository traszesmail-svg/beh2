import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SPECIALIST_CREDENTIALS, SPECIALIST_NAME, getContactDetails } from '@/lib/site'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Polityka prywatności',
  '/polityka-prywatnosci',
  'Informacje o przetwarzaniu danych, kontakcie, operatorach technicznych i zasadach prywatności w Behawior 15.',
)

export default function PrivacyPolicyPage() {
  const contact = getContactDetails()

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel legal-panel">
          <div className="section-eyebrow">Polityka prywatności</div>
          <h1>Jak przetwarzane są dane w Behawior 15</h1>
          <div className="stack-gap top-gap">
            <div className="list-card">
              <strong>Administrator danych</strong>
              <span>
                Administratorem danych związanych z rezerwacją konsultacji Behawior 15 jest {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}.
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
                Do działania produktu wykorzystujemy usługi Supabase, Stripe oraz Resend. Dane są przekazywane wyłącznie w zakresie potrzebnym do obsługi rezerwacji, płatności, wysyłki wiadomości i bezpieczeństwa działania serwisu.
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
                {contact.email ? `E-mail: ${contact.email}. ` : ''}
                {contact.phoneDisplay ? `Telefon: ${contact.phoneDisplay}. ` : ''}
                Jeśli wygodniej, możesz też skorzystać z publicznego profilu Facebook widocznego w stopce serwisu.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
