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
              <strong>Forma uslugi</strong>
              <span>
                Behawior 15 to 15-minutowa konsultacja glosowa online prowadzona przez {SPECIALIST_NAME},{' '}
                {SPECIALIST_CREDENTIALS}. To nie jest konsultacja wideo.
              </span>
            </div>
            <div className="list-card">
              <strong>Rezerwacja i platnosc</strong>
              <span>
                Termin zostaje chwilowo zablokowany na czas platnosci. Pelne potwierdzenie rezerwacji nastepuje po
                skutecznym oplaceniu konsultacji.
              </span>
            </div>
            <div className="list-card">
              <strong>Cena</strong>
              <span>
                Cena widoczna w chwili rezerwacji staje sie historyczna kwota danego bookingu. Zmiany ceny dotycza
                tylko nowych rezerwacji.
              </span>
            </div>
            <div className="list-card">
              <strong>Materialy przed rozmowa</strong>
              <span>
                Materialy dodawane przed rozmowa sa opcjonalne i sluza wylacznie lepszemu przygotowaniu specjalisty do
                konsultacji.
              </span>
            </div>
            <div className="list-card">
              <strong>Kontakt</strong>
              <span>
                {contact.email ? `E-mail: ${contact.email}. ` : ''}
                {contact.phone ? `Telefon: ${contact.phone}. ` : ''}
                W razie problemu z rezerwacja lub platnoscia skontaktuj sie bezposrednio przed terminem rozmowy.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
