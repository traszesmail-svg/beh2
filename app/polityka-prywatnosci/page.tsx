import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getContactDetails, SPECIALIST_CREDENTIALS, SPECIALIST_NAME } from '@/lib/site'

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
                {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}.
              </span>
            </div>
            <div className="list-card">
              <strong>Zakres danych</strong>
              <span>
                W formularzu rezerwacji przetwarzane są dane potrzebne do obsługi konsultacji: imię opiekuna, dane
                kontaktowe, opis problemu, termin, status płatności oraz opcjonalne materiały przed rozmową.
              </span>
            </div>
            <div className="list-card">
              <strong>Cel przetwarzania</strong>
              <span>
                Dane są wykorzystywane do umówienia konsultacji, obsługi płatności, wysyłki potwierdzeń i przypomnień
                oraz przygotowania specjalisty do rozmowy.
              </span>
            </div>
            <div className="list-card">
              <strong>Operatorzy techniczni</strong>
              <span>
                Aplikacja korzysta z Supabase do przechowywania danych, Stripe do obsługi płatności oraz Resend do
                wysyłki wiadomości e-mail.
              </span>
            </div>
            <div className="list-card">
              <strong>Kontakt w sprawie danych</strong>
              <span>
                {contact.email ? `E-mail: ${contact.email}. ` : ''}
                {contact.phone ? `Telefon: ${contact.phone}. ` : ''}
                Możesz poprosić o wgląd, korektę lub usunięcie danych, o ile nie koliduje to z obowiązkami rozliczeniowymi.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
