import type { Metadata } from 'next'
import { LegalPageLayout, type LegalSection, type LegalSummaryItem } from '@/components/LegalPageLayout'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Polityka prywatności',
  '/polityka-prywatnosci',
  'Informacje o przetwarzaniu danych, kontakcie, operatorach technicznych i zasadach prywatności w marce Regulski | Terapia behawioralna.',
)

const summaryItems: LegalSummaryItem[] = [
  {
    label: 'Zakres danych',
    value: 'Przetwarzane są tylko dane potrzebne do rezerwacji, płatności, kontaktu i przygotowania rozmowy.',
  },
  {
    label: 'Operatorzy',
    value: 'Supabase, Resend, Jitsi oraz Google Analytics po wyrażeniu zgody.',
  },
  {
    label: 'Kontakt',
    value: 'W sprawie danych kontakt prowadzony jest przez formularz lub mailowo, bez publicznej ścieżki telefonicznej.',
  },
]

const sections: LegalSection[] = [
  {
    title: 'Administrator danych',
    body: 'Administratorem danych związanych z serwisem, kontaktem i rezerwacją konsultacji jest Krzysztof Regulski, behawiorysta COAPE / CAPBT, technik weterynarii, dogoterapeuta, dietetyk.',
  },
  {
    title: 'Jakie dane przetwarzamy',
    body: 'Przetwarzamy imię opiekuna, dane kontaktowe, opis problemu, wybrany termin, status płatności oraz opcjonalne materiały dodane przed rozmową.',
  },
  {
    title: 'Cele i podstawy przetwarzania',
    body: 'Dane służą przyjęciu rezerwacji, przeprowadzeniu konsultacji, obsłudze płatności, wysyłce potwierdzeń i przypomnień, przygotowaniu specjalisty do rozmowy oraz obsłudze reklamacji, zwrotów i kontaktu posprzedażowego.',
  },
  {
    title: 'Operatorzy i odbiorcy danych',
    body: 'Do działania serwisu wykorzystywane są usługi Supabase, Resend oraz Jitsi, a po wyrażeniu zgody także Google Analytics. Jeśli włączona jest wysyłka SMS po płatności, dane kontaktowe są przekazywane również do operatora SMS.',
  },
  {
    title: 'Jak długo przechowujemy dane',
    body: 'Dane rezerwacyjne i rozliczeniowe są przechowywane tak długo, jak jest to potrzebne do realizacji usługi, rozliczeń, kontaktu posprzedażowego oraz spełnienia obowiązków prawnych i podatkowych.',
  },
  {
    title: 'Twoje prawa',
    body: 'Możesz poprosić o dostęp do danych, ich sprostowanie, ograniczenie przetwarzania lub usunięcie, o ile nie koliduje to z obowiązkami rozliczeniowymi albo bezpieczeństwem obsługi rezerwacji.',
  },
  {
    title: 'Bezpieczeństwo kontaktu',
    body: 'Dane są przekazywane wyłącznie w zakresie potrzebnym do obsługi rezerwacji, płatności, wiadomości, pokoju rozmowy i bezpieczeństwa działania serwisu.',
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Polityka prywatności"
      title="Jak przetwarzane są dane w marce Regulski | Terapia behawioralna"
      intro="Tu jest skrót tego, jakie dane są potrzebne do rezerwacji i kto pomaga obsługiwać płatność, wiadomości oraz pokój rozmowy."
      contactSubject="Prywatność i dane - Regulski | Terapia behawioralna"
      summaryItems={summaryItems}
      sections={sections}
      supportText="Dane służą obsłudze rezerwacji, płatności, formularza kontaktowego, kontaktu z opiekunem psa albo kota oraz bezpiecznemu przygotowaniu konsultacji."
      supportNoteTitle="Pytanie o dane"
      supportNoteText="Jeśli chcesz poprawić dane, dopytać o zakres przetwarzania albo zgłosić żądanie, napisz przez formularz kontaktowy albo mailowo. To jest główna ścieżka kontaktu także w sprawach prywatności."
      ctaTitle="Napisz w sprawie danych albo prywatności"
      ctaText="W wiadomości wystarczy krótko wskazać, czy pytanie dotyczy danych kontaktowych, operatorów technicznych, zgody analitycznej albo obsługi rezerwacji."
      secondaryCtaHref="/kontakt"
      secondaryCtaLabel="Przejdź do kontaktu"
    />
  )
}
