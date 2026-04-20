import type { Metadata } from 'next'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { LegalPageLayout, type LegalSection, type LegalSummaryItem } from '@/components/LegalPageLayout'
import { FUNNEL_SERVICE_CONFIG } from '@/lib/funnel'
import { OFFERS } from '@/lib/offers'
import { formatPricePln } from '@/lib/pricing'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Regulamin',
  '/regulamin',
  'Regulamin świadczenia usług, rezerwacji, płatności, zmian terminu i reklamacji w serwisie Regulski | Terapia behawioralna.',
)

const quickStartService = FUNNEL_SERVICE_CONFIG['szybka-konsultacja-15-min']
const fullConsultationService = FUNNEL_SERVICE_CONFIG['konsultacja-behawioralna-online']
const toolkitOffer = OFFERS.find((offer) => offer.slug === 'poradniki-pdf')

if (!toolkitOffer) {
  throw new Error('Missing offer config for poradniki-pdf')
}

const summaryItems: LegalSummaryItem[] = [
  {
    label: 'Usługi objęte regulaminem',
    value: `${quickStartService.title} (${formatPricePln(quickStartService.priceAmount)}) oraz ${fullConsultationService.title} (${formatPricePln(fullConsultationService.priceAmount)}).`,
  },
  {
    label: 'Model płatności',
    value: 'Płatność odbywa się ręcznie przez BLIK na telefon lub PayPal.me, z potwierdzeniem wpłaty do 60 minut.',
  },
  {
    label: 'Kontakt w sprawach dokumentu',
    value: 'Kontakt prowadzony jest przez formularz kontaktowy oraz e-mail.',
  },
]

const sections: LegalSection[] = [
  {
    title: '1. Postanowienia ogólne',
    body: (
      <>
        <p>
          Regulamin określa zasady korzystania z serwisu, składania rezerwacji oraz realizacji usług świadczonych na
          odległość przez Krzysztofa Regulskiego w ramach marki Regulski | Terapia behawioralna.
        </p>
        <p>
          Regulamin dotyczy usług publicznie udostępnionych w serwisie oraz materiałów pomocniczych dostępnych w
          {` ${toolkitOffer.title}.`}
        </p>
      </>
    ),
  },
  {
    title: '2. Zakres usług',
    body: (
      <>
        <ul className="premium-bullet-list">
          <li>{quickStartService.title} jest krótką konsultacją zdalną prowadzoną w formie audio.</li>
          <li>{fullConsultationService.title} jest pełną konsultacją prowadzoną online.</li>
          <li>{toolkitOffer.title} zawiera materiały pomocnicze i nie zastępuje rezerwacji konsultacji.</li>
        </ul>
        <p>
          Usługi mają charakter konsultacji behawioralnych świadczonych na odległość. W uzasadnionych przypadkach
          klient może zostać poproszony o wcześniejsze wykluczenie tła zdrowotnego lub konsultację weterynaryjną.
        </p>
      </>
    ),
  },
  {
    title: '3. Wymagania techniczne',
    body: (
      <>
        <p>
          Do korzystania z serwisu i realizacji usług niezbędne są: urządzenie z dostępem do internetu, aktualna
          przeglądarka internetowa, aktywny adres e-mail oraz możliwość odebrania połączenia audio albo dołączenia do
          konsultacji online.
        </p>
        <p>
          W przypadku konsultacji online klient powinien zapewnić warunki umożliwiające spokojny udział w rozmowie oraz
          samodzielny dostęp do linku przekazanego po potwierdzeniu rezerwacji.
        </p>
      </>
    ),
  },
  {
    title: '4. Rezerwacja',
    body: (
      <>
        <p>
          Rezerwacja następuje po wyborze usługi, gatunku, tematu i terminu oraz po podaniu danych wymaganych przez
          formularz rezerwacyjny.
        </p>
        <p>
          Wiadomość wysłana przez formularz kontaktowy ma charakter wstępny i nie zastępuje rezerwacji usługi.
        </p>
      </>
    ),
  },
  {
    title: '5. Płatność i potwierdzenie',
    body: (
      <>
        <p>
          Aktualnie dostępny model płatności obejmuje ręczną płatność przez BLIK na telefon lub PayPal.me. Po zgłoszeniu
          wpłaty rezerwacja otrzymuje status oczekiwania na ręczne potwierdzenie.
        </p>
        <p>
          Termin zostaje ostatecznie zablokowany dopiero po potwierdzeniu wpłaty. Czas potwierdzenia wynosi co do zasady
          do 60 minut.
        </p>
        <p>
          Nieopłacona lub niepotwierdzona rezerwacja może wygasnąć, a termin może wrócić do puli dostępnych terminów.
        </p>
      </>
    ),
  },
  {
    title: '6. Realizacja usługi',
    body: (
      <>
        <p>
          Po potwierdzeniu wpłaty klient otrzymuje dostęp do strony potwierdzenia, na której widoczne są co najmniej:
          termin, status rezerwacji oraz dalsza instrukcja.
        </p>
        <p>
          W zależności od konfiguracji serwisu i dostępnych danych kontaktowych potwierdzenie może zostać dodatkowo
          przekazane pocztą elektroniczną lub wiadomością SMS.
        </p>
        <p>
          Przed rozmową klient może dobrowolnie dodać materiały przygotowawcze, w szczególności krótki opis sprawy,
          linki lub nagrania. Materiały te mają charakter pomocniczy.
        </p>
      </>
    ),
  },
  {
    title: '7. Zmiana terminu i rezygnacja',
    body: (
      <>
        <p>
          Po potwierdzeniu wpłaty klient ma 24 godziny na zgłoszenie rezygnacji albo wniosku o zmianę terminu.
        </p>
        <p>
          Przy obecnym modelu ręcznej płatności ewentualny zwrot środków wymaga kontaktu i jest rozpatrywany
          indywidualnie, z uwzględnieniem etapu realizacji usługi oraz przebiegu rezerwacji.
        </p>
        <p>
          Po upływie wskazanego terminu zmiana lub odwołanie rezerwacji może nie być możliwe bez poniesienia kosztu
          usługi.
        </p>
      </>
    ),
  },
  {
    title: '8. Nieobecność i wygaśnięcie rezerwacji',
    body: (
      <>
        <p>
          Jeżeli klient nie opłaci rezerwacji albo wpłata nie zostanie potwierdzona, rezerwacja może zostać zamknięta
          jako nieaktywna.
        </p>
        <p>
          Jeżeli klient nie stawi się na opłaconą usługę bez wcześniejszego kontaktu, rezerwacja może zostać uznana za
          zrealizowaną.
        </p>
      </>
    ),
  },
  {
    title: '9. Reklamacje',
    body: (
      <>
        <p>
          Reklamacje dotyczące działania serwisu, procesu rezerwacji albo realizacji usługi można zgłaszać przez formularz
          kontaktowy lub e-mail.
        </p>
        <p>
          Zgłoszenie powinno zawierać dane pozwalające zidentyfikować sprawę oraz krótki opis zastrzeżeń. Reklamacje są
          rozpatrywane bez zbędnej zwłoki.
        </p>
      </>
    ),
  },
  {
    title: '10. Dane osobowe',
    body: (
      <>
        <p>
          Zasady przetwarzania danych osobowych związanych z serwisem, kontaktem, rezerwacją i realizacją usług określa
          odrębna Polityka prywatności.
        </p>
      </>
    ),
  },
  {
    title: '11. Postanowienia końcowe',
    body: (
      <>
        <p>
          Regulamin obowiązuje od dnia jego opublikowania w serwisie i ma zastosowanie do rezerwacji składanych po tej
          dacie.
        </p>
        <p>
          W sprawach nieuregulowanych w regulaminie zastosowanie mają odpowiednie przepisy prawa polskiego.
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Regulamin"
      title="Regulamin świadczenia usług"
      intro="Dokument określa zasady korzystania z serwisu, rezerwacji usług, dokonywania płatności, potwierdzeń, zmian terminu oraz trybu składania reklamacji."
      contactSubject="Pytanie o regulamin - Regulski | Terapia behawioralna"
      summaryItems={summaryItems}
      sections={sections}
      supportTitle="Kontakt w sprawach regulaminu"
      supportText="W sprawach dotyczących rezerwacji, płatności, zmian terminu, rezygnacji i reklamacji kontakt prowadzony jest przez formularz kontaktowy oraz e-mail."
      supportNoteTitle="Wniosek o zmianę terminu, rezygnację lub reklamację"
      supportNoteText="W wiadomości należy podać dane pozwalające zidentyfikować rezerwację oraz krótki opis sprawy. Telefon nie jest publicznym kanałem kontaktu serwisu."
      structuredData={[
        getBreadcrumbJsonLd([
          { name: 'Strona główna', path: '/' },
          { name: 'Regulamin', path: '/regulamin' },
        ]),
      ]}
    />
  )
}
