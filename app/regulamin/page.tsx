import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getContactDetails, SPECIALIST_CREDENTIALS, SPECIALIST_NAME } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default function TermsPage() {
  const contact = getContactDetails()

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel legal-panel">
          <div className="section-eyebrow">Regulamin</div>
          <h1>Zasady rezerwacji konsultacji Behawior 15</h1>
          <div className="stack-gap top-gap">
            <div className="list-card">
              <strong>Forma usługi</strong>
              <span>
                Behawior 15 to 15-minutowa konsultacja głosowa online prowadzona przez {SPECIALIST_NAME},{' '}
                {SPECIALIST_CREDENTIALS}. To nie jest konsultacja wideo.
              </span>
            </div>
            <div className="list-card">
              <strong>Rezerwacja i płatność</strong>
              <span>
                Termin zostaje chwilowo zablokowany na czas płatności. Pełne potwierdzenie rezerwacji następuje po
                skutecznym opłaceniu konsultacji.
              </span>
            </div>
            <div className="list-card">
              <strong>Cena</strong>
              <span>
                Cena widoczna w chwili rezerwacji staje się historyczną kwotą danego bookingu. Zmiany ceny dotyczą
                tylko nowych rezerwacji.
              </span>
            </div>
            <div className="list-card">
              <strong>Materiały przed rozmową</strong>
              <span>
                Materiały dodawane przed rozmową są opcjonalne i służą wyłącznie lepszemu przygotowaniu specjalisty do
                konsultacji.
              </span>
            </div>
            <div className="list-card">
              <strong>Kontakt</strong>
              <span>
                {contact.email ? `E-mail: ${contact.email}. ` : ''}
                {contact.phone ? `Telefon: ${contact.phone}. ` : ''}
                W razie problemu z rezerwacją lub płatnością skontaktuj się bezpośrednio przed terminem rozmowy.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
