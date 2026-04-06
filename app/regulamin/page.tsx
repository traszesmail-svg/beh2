import type { Metadata } from 'next'
import { LegalPageLayout, type LegalSection, type LegalSummaryItem } from '@/components/LegalPageLayout'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Regulamin',
  '/regulamin',
  'Zasady rezerwacji, płatności, konsultacji audio, zwrotów, reklamacji i kontaktu dla szybkiej konsultacji 15 min w marce Regulski | Terapia behawioralna.',
)

const summaryItems: LegalSummaryItem[] = [
  {
    label: 'Forma',
    value: '15 minut rozmowy głosowej online jako pierwszy sensowny krok dla psa albo kota.',
  },
  {
    label: 'Płatność',
    value: 'Termin blokuje się na czas wpłaty ręcznej. Potwierdzenie następuje po skutecznym zgłoszeniu wpłaty.',
  },
  {
    label: 'Zmiana lub rezygnacja',
    value: 'Po opłaceniu masz 24 godziny na bezpłatną rezygnację albo wiadomość o zmianie terminu.',
  },
]

const sections: LegalSection[] = [
  {
    title: 'Forma usługi',
    body: 'Szybka konsultacja 15 min to 15-minutowa konsultacja głosowa online. To pierwszy krok w szerszym systemie pracy, a nie konsultacja wideo ani pełna terapia behawioralna.',
  },
  {
    title: 'Rezerwacja i płatność',
    body: 'Termin jest blokowany na czas wpłaty. Jeśli płatność nie zostanie dokończona, slot wraca do puli. Publicznie dostępna metoda płatności to wpłata BLIK lub przelewem potwierdzana do 60 minut.',
  },
  {
    title: 'Zmiana terminu i anulacja',
    body: 'Przy wpłacie ręcznej można skorzystać z samodzielnej rezygnacji na ekranie potwierdzenia. Zmiana terminu lub rezygnacja odbywa się przez wiadomość w tym samym 24-godzinnym oknie.',
  },
  {
    title: 'No-show i nieopłacone rezerwacje',
    body: 'Nieopłacona rezerwacja wygasa i termin wraca do kalendarza. Jeśli klient nie stawi się na opłaconą rozmowę bez wcześniejszego kontaktu, konsultacja może zostać uznana za zrealizowaną.',
  },
  {
    title: 'Zwrot i reklamacja',
    body: 'Po upływie 24 godzin nadal możesz zgłosić reklamację albo wniosek o zwrot, jeśli konsultacja nie spełniła swojej roli jako pierwszy krok. Każda sprawa jest rozpatrywana indywidualnie.',
  },
  {
    title: 'Materiały przed rozmową',
    body: 'MP4, linki i notatki są opcjonalne. Pomagają lepiej przygotować rozmowę, ale nie są wymagane do przejścia przez rezerwację.',
  },
  {
    title: 'Jak działa konsultacja',
    body: 'Rozmowa pomaga szybko uporządkować sytuację i ustalić pierwszy kolejny ruch. W zależności od problemu może prowadzić do dalszej konsultacji, wizyty albo konsultacji weterynaryjnej.',
  },
]

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Regulamin"
      title="Zasady rezerwacji szybkiej konsultacji 15 min"
      intro="Najważniejsze zasady rezerwacji, płatności, rozmowy i zmian terminu dla szybkiej konsultacji 15 min."
      contactSubject="Pytanie o regulamin - Regulski | Terapia behawioralna"
      summaryItems={summaryItems}
      sections={sections}
      supportText="Kontakt w sprawach rezerwacji, płatności, reklamacji i zmian terminu prowadzę mailowo. Rozmowa telefoniczna odbywa się wyłącznie w ramach umówionej konsultacji."
      supportNoteTitle="Najkrótsza ścieżka"
      supportNoteText="Jeśli nie wiesz, czy lepsza będzie wiadomość, 15 minut czy dłuższa praca, napisz krótko o sytuacji. Wskażę najprostszy kolejny ruch."
      ctaTitle="Napisz w sprawie rezerwacji albo płatności"
      ctaText="W wiadomości wystarczy krótko opisać, czy pytanie dotyczy terminu, płatności, rezygnacji, zwrotu albo przebiegu rozmowy."
      secondaryCtaHref="/book"
      secondaryCtaLabel="Umów 15 min"
      footerCtaHref="/book"
      footerCtaLabel="Umów 15 min"
    />
  )
}
