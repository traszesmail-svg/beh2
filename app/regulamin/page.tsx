import React from 'react'
import type { Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SPECIALIST_CREDENTIALS, SPECIALIST_NAME, buildMailtoHref, getPublicContactDetails } from '@/lib/site'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Regulamin',
  '/regulamin',
  'Zasady rezerwacji, płatności, konsultacji audio, zwrotów, reklamacji i kontaktu dla szybkiej konsultacji 15 min w marce Regulski | Terapia behawioralna.',
)

export default function TermsPage() {
  const contact = getPublicContactDetails()
  const contactMailtoHref = contact.email
    ? buildMailtoHref(contact.email, 'Rezerwacja i regulamin - Regulski | Terapia behawioralna')
    : null

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel legal-panel">
          <div className="section-eyebrow">Regulamin</div>
          <h1>Zasady rezerwacji szybkiej konsultacji 15 min</h1>
          <div className="stack-gap top-gap">
            <div className="list-card">
              <strong>Forma usługi</strong>
              <span>
                Szybka konsultacja 15 min to 15-minutowa konsultacja głosowa online prowadzona przez {SPECIALIST_NAME}, {SPECIALIST_CREDENTIALS}. To pierwszy krok w szerszym systemie pracy, a nie konsultacja wideo ani pełna terapia behawioralna.
              </span>
            </div>

            <div className="list-card">
              <strong>Rezerwacja i płatność</strong>
              <span>
                Termin jest blokowany na czas płatności. Ostateczne potwierdzenie rezerwacji następuje po skutecznym opłaceniu konsultacji. Jeśli płatność nie zostanie dokończona, slot wraca do puli dostępnych terminów. Publicznie dostępne metody płatności to wpłata BLIK/przelewem potwierdzana do 60 minut oraz PayU.
              </span>
            </div>

            <div className="list-card">
              <strong>Przełożenie terminu i anulacja</strong>
              <span>
                Po skutecznym opłaceniu rezerwacji klient ma 24 godziny na bezpłatną rezygnację. Przy płatności online można zrobić to samodzielnie z ekranu potwierdzenia, a przy wpłacie manualnej zmiana terminu lub rezygnacja odbywa się przez kontakt. Jeśli chcesz przełożyć konsultację, napisz w tym samym 24-godzinnym oknie. Zmiana terminu zależy od dostępności innych slotów.
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
                Po upływie 24 godzin od zakupu nadal możesz złożyć reklamację albo wniosek o zwrot, jeśli konsultacja nie spełni swojej roli jako pierwszy krok do uporządkowania problemu. Każda sprawa jest rozpatrywana indywidualnie na podstawie przebiegu usługi i zgłoszenia przesłanego przez kanał kontaktowy.
              </span>
            </div>

            <div className="list-card">
              <strong>Materiały przed rozmową</strong>
              <span>
                MP4, linki i notatki są opcjonalne. Służą wyłącznie lepszemu przygotowaniu konsultacji i nie są wymagane do przejścia przez rezerwację.
              </span>
            </div>

            <div className="list-card">
              <strong>Jak działa konsultacja</strong>
              <span>
                Konsultacja pomaga szybko uporządkować sytuację i ustalić pierwszy sensowny krok. W zależności od problemu może prowadzić do kolejnej rozmowy, konsultacji weterynaryjnej albo wizyty. Usługa nie zastępuje badania lekarskiego ani pełnej diagnostyki.
              </span>
            </div>

            <div className="list-card">
              <strong>Kontakt</strong>
              <span>
                {contact.email && contactMailtoHref ? (
                  <>
                    E-mail: <a href={contactMailtoHref}>{contact.email}</a>.{' '}
                  </>
                ) : null}
                W sprawach rezerwacji, płatności, reklamacji i przełożenia terminu kontakt odbywa się mailowo przez ten adres. Rozmowa telefoniczna odbywa się wyłącznie w ramach umówionej konsultacji. Publiczny profil specjalisty w CAPBT podany w stopce służy wyłącznie do sprawdzenia profilu zawodowego.
              </span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
