import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SPECIALIST_CREDENTIALS, SPECIALIST_NAME, getContactDetails } from '@/lib/site'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Regulamin',
  '/regulamin',
  'Zasady rezerwacji, płatności, konsultacji audio, zwrotów, reklamacji i kontaktu dla produktu Behawior 15.',
)

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
                Behawior 15 to 15-minutowa konsultacja głosowa online prowadzona przez {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. To nie jest konsultacja wideo ani pełna terapia behawioralna.
              </span>
            </div>

            <div className="list-card">
              <strong>Rezerwacja i płatność</strong>
              <span>
                Termin jest blokowany na czas płatności. Ostateczne potwierdzenie rezerwacji następuje po skutecznym opłaceniu konsultacji. Jeśli płatność nie zostanie dokończona, slot wraca do puli dostępnych terminów.
              </span>
            </div>

            <div className="list-card">
              <strong>Przełożenie terminu i anulacja</strong>
              <span>
                Po skutecznym opłaceniu rezerwacji klient ma 1 minutę na samodzielne anulowanie zakupu przyciskiem dostępnym na ekranie potwierdzenia. W tym czasie termin wraca do kalendarza, a płatność jest cofana zgodnie z aktywnym trybem płatności. Jeśli wiesz wcześniej, że nie możesz pojawić się na rozmowie po upływie tej minuty, skontaktuj się przed rozpoczęciem terminu. Zmiana terminu zależy od dostępności innych slotów.
              </span>
            </div>

            <div className="list-card">
              <strong>No-show i nieopłacone rezerwacje</strong>
              <span>
                Jeśli płatność nie zostanie ukończona, rezerwacja wygasa i termin wraca do kalendarza. Jeśli klient nie stawi się na opłaconą rozmowę bez wcześniejszego kontaktu, konsultacja może zostać uznana za zrealizowaną.
              </span>
            </div>

            <div className="list-card">
              <strong>Zwrot i reklamacja</strong>
              <span>
                Po upływie pierwszej minuty od zakupu nadal możesz złożyć reklamację albo wniosek o zwrot, jeśli konsultacja nie spełni swojej roli jako pierwszy krok do uporządkowania problemu. Każda sprawa jest rozpatrywana indywidualnie na podstawie przebiegu usługi i zgłoszenia przesłanego przez kanał kontaktowy.
              </span>
            </div>

            <div className="list-card">
              <strong>Materiały przed rozmową</strong>
              <span>
                MP4, linki i notatki są opcjonalne. Służą wyłącznie lepszemu przygotowaniu konsultacji i nie są wymagane do przejścia przez flow rezerwacji.
              </span>
            </div>

            <div className="list-card">
              <strong>Zakres konsultacji i ograniczenia</strong>
              <span>
                Konsultacja pomaga szybko uporządkować sytuację i ustalić pierwszy sensowny krok. W zależności od problemu może prowadzić do dalszej pracy behawioralnej, konsultacji weterynaryjnej albo szerszego planu działania. Usługa nie zastępuje badania lekarskiego ani pełnej diagnostyki.
              </span>
            </div>

            <div className="list-card">
              <strong>Kontakt</strong>
              <span>
                {contact.email ? `E-mail: ${contact.email}. ` : ''}
                {contact.phoneDisplay ? `Telefon: ${contact.phoneDisplay}. ` : ''}
                W sprawach rezerwacji, płatności, reklamacji i przełożenia terminu możesz też skorzystać z publicznego profilu Facebook podanego w stopce.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
