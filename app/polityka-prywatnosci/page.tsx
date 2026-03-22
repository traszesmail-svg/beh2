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
          <div className="section-eyebrow">Polityka prywatnosci</div>
          <h1>Jak przetwarzane sa dane w Behawior 15</h1>
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
                W formularzu rezerwacji przetwarzane sa dane potrzebne do obslugi konsultacji: imie opiekuna, dane
                kontaktowe, opis problemu, termin, status platnosci oraz opcjonalne materialy przed rozmowa.
              </span>
            </div>
            <div className="list-card">
              <strong>Cel przetwarzania</strong>
              <span>
                Dane sa wykorzystywane do umowienia konsultacji, obslugi platnosci, wysylki potwierdzen i przypomnien
                oraz przygotowania specjalisty do rozmowy.
              </span>
            </div>
            <div className="list-card">
              <strong>Operatorzy techniczni</strong>
              <span>
                Aplikacja korzysta z Supabase do przechowywania danych, Stripe do obslugi platnosci oraz Resend do
                wysylki wiadomosci e-mail.
              </span>
            </div>
            <div className="list-card">
              <strong>Kontakt w sprawie danych</strong>
              <span>
                {contact.email ? `E-mail: ${contact.email}. ` : ''}
                {contact.phone ? `Telefon: ${contact.phone}. ` : ''}
                Mozesz poprosic o wglad, korekte lub usuniecie danych, o ile nie koliduje to z obowiazkami rozliczeniowymi.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
