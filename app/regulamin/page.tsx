import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { FACEBOOK_PROFILE_URL, SPECIALIST_CREDENTIALS, SPECIALIST_NAME, getContactDetails } from '@/lib/site'

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
              <strong>Cena i źródło prawdy dla kwoty</strong>
              <span>
                Cena widoczna w chwili rezerwacji staje się historyczną kwotą danego bookingu. Późniejsze zmiany ceny dotyczą tylko nowych rezerwacji i nie wpływają na już opłacone konsultacje.
              </span>
            </div>

            <div className="list-card">
              <strong>Zwrot i reklamacja</strong>
              <span>
                Jeśli konsultacja nie spełni swojej roli jako pierwszy krok do uporządkowania problemu, możesz zgłosić reklamację lub wniosek o zwrot. Sprawy te rozpatrywane są indywidualnie, zgodnie z informacjami przekazanymi w kontakcie posprzedażowym i niniejszym regulaminie.
              </span>
            </div>

            <div className="list-card">
              <strong>Materiały przed rozmową</strong>
              <span>
                MP4, linki i notatki są opcjonalne. Służą wyłącznie lepszemu przygotowaniu konsultacji i nie są wymagane do przejścia przez flow rezerwacji.
              </span>
            </div>

            <div className="list-card">
              <strong>Zakres konsultacji</strong>
              <span>
                Konsultacja ma pomóc szybko uporządkować sytuację i ustalić pierwszy sensowny krok. W zależności od problemu może prowadzić do dalszej pracy behawioralnej, konsultacji weterynaryjnej albo szerszego planu działania.
              </span>
            </div>

            <div className="list-card">
              <strong>Kontakt</strong>
              <span>
                {contact.email ? `E-mail: ${contact.email}. ` : 'Publiczny adres e-mail do kontaktu nie został jeszcze ustawiony. '}
                {contact.phone ? `Telefon: ${contact.phone}. ` : ''}
                W sprawach rezerwacji, płatności, reklamacji i przełożenia terminu możesz też skorzystać z publicznego profilu Facebook: {FACEBOOK_PROFILE_URL}.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
