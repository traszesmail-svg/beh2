import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { FACEBOOK_PROFILE_URL, SPECIALIST_CREDENTIALS, SPECIALIST_NAME, getContactDetails } from '@/lib/site'

export const dynamic = 'force-dynamic'

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
              <strong>Zakres przetwarzanych danych</strong>
              <span>
                Przetwarzane są dane niezbędne do obsługi konsultacji: imię opiekuna, dane kontaktowe, opis problemu, wybrany termin, status płatności oraz opcjonalne materiały dodane przed rozmową.
              </span>
            </div>

            <div className="list-card">
              <strong>Cele i podstawy przetwarzania</strong>
              <span>
                Dane są przetwarzane w celu przyjęcia rezerwacji, przeprowadzenia konsultacji, obsługi płatności, wysłania potwierdzeń i przypomnień, przygotowania specjalisty do rozmowy oraz obsługi ewentualnych reklamacji i zwrotów.
              </span>
            </div>

            <div className="list-card">
              <strong>Odbiorcy danych</strong>
              <span>
                Do działania produktu wykorzystywane są usługi Supabase, Stripe oraz Resend. Dane są przekazywane tylko w zakresie potrzebnym do obsługi rezerwacji, płatności i komunikacji e-mail.
              </span>
            </div>

            <div className="list-card">
              <strong>Jak długo przechowujemy dane</strong>
              <span>
                Dane rezerwacyjne i rozliczeniowe przechowujemy tak długo, jak jest to potrzebne do obsługi konsultacji, rozliczeń, kontaktu posprzedażowego oraz spełnienia obowiązków prawnych.
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
                {contact.email ? `E-mail: ${contact.email}. ` : 'Publiczny adres e-mail do kontaktu nie został jeszcze ustawiony. '}
                {contact.phone ? `Telefon: ${contact.phone}. ` : ''}
                Możesz też skorzystać z publicznego profilu Facebook: {FACEBOOK_PROFILE_URL}.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
