import type { Metadata } from 'next'
import { LegalPageLayout, type LegalSection, type LegalSummaryItem } from '@/components/LegalPageLayout'
import { PUBLIC_OFFER_PAYMENT_METHODS } from '@/lib/public-offer-copy'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Regulamin',
  '/regulamin',
  'Regulamin serwisu, rezerwacji, platnosci, zmian terminu i reklamacji w serwisie Regulski.',
)

const summaryItems: LegalSummaryItem[] = [
  {
    label: 'Uslugi objete dokumentem',
    value: 'Kwadrans z behawiorysta, Dwa kwadranse oraz podstawowe zasady korzystania z serwisu.',
  },
  {
    label: 'Model platnosci',
    value: `${PUBLIC_OFFER_PAYMENT_METHODS}. Szczegoly platnosci dostajesz emailem po rezerwacji i potwierdzeniu terminu.`,
  },
  {
    label: 'Kontakt w sprawach dokumentu',
    value: 'Kontakt prowadzony jest przez formularz kontaktowy oraz e-mail.',
  },
]

const sections: LegalSection[] = [
  {
    title: '1. Postanowienia ogolne',
    body: (
      <>
        <p>
          Regulamin okresla zasady korzystania z serwisu, skladania rezerwacji oraz realizacji uslug swiadczonych na
          odleglosc przez Krzysztofa Regulskiego w ramach marki Regulski | Terapia behawioralna.
        </p>
        <p>
          Dokument dotyczy uslug publicznie dostepnych w serwisie oraz procesow kontaktu, rezerwacji, potwierdzenia
          terminu i reklamacji.
        </p>
      </>
    ),
  },
  {
    title: '2. Zakres uslug',
    body: (
      <>
        <ul className="premium-bullet-list">
          <li>Kwadrans z behawiorysta jest krotka konsultacja zdalna prowadzona w formie audio.</li>
          <li>Dwa kwadranse sa rozszerzonym formatem audio dla tematow szerszych niz sam Kwadrans.</li>
          <li>Pelna konsultacja ma osobny regulamin i osobna strone warunkow.</li>
        </ul>
        <p>
          Uslugi maja charakter konsultacji behawioralnych swiadczonych na odleglosc. W uzasadnionych przypadkach klient
          moze zostac poproszony o wczesniejsze wykluczenie tla zdrowotnego lub konsultacje weterynaryjna.
        </p>
      </>
    ),
  },
  {
    title: '3. Wymagania techniczne',
    body: (
      <>
        <p>
          Do korzystania z serwisu i realizacji uslug niezbedne sa: urzadzenie z dostepem do internetu, aktualna
          przegladarka internetowa, aktywny adres e-mail oraz mozliwosc odebrania polaczenia audio albo dolaczenia do
          konsultacji online.
        </p>
        <p>
          Klient powinien zapewnic warunki umozliwiajace spokojny udzial w rozmowie oraz samodzielny dostep do linku
          przekazanego po potwierdzeniu rezerwacji.
        </p>
      </>
    ),
  },
  {
    title: '4. Rezerwacja',
    body: (
      <>
        <p>
          Rezerwacja nastepuje po wyborze uslugi, podaniu podstawowych danych kontaktowych oraz wskazaniu preferowanych
          terminow przez formularz rezerwacyjny albo inna sciezke udostepniona w serwisie.
        </p>
        <p>Wiadomosc wyslana przez formularz kontaktowy ma charakter wstepny i nie zastepuje rezerwacji uslugi.</p>
      </>
    ),
  },
  {
    title: '5. Platnosc i potwierdzenie',
    body: (
      <>
        <p>
          Publicznie komunikowany model platnosci to {PUBLIC_OFFER_PAYMENT_METHODS}. Szczegoly platnosci klient otrzymuje emailem po rezerwacji i
          wstepnym potwierdzeniu terminu.
        </p>
        <p>
          Potwierdzenie rezerwacji nastepuje do 15 minut od wplaty w godzinach 9-21, poza dniami ustawowo wolnymi od
          pracy. Termin zostaje ostatecznie zablokowany dopiero po potwierdzeniu wplaty.
        </p>
        <p>Nieoplacona lub niepotwierdzona rezerwacja moze wygasnac, a termin moze wrocic do puli dostepnych terminow.</p>
      </>
    ),
  },
  {
    title: '6. Realizacja uslugi',
    body: (
      <>
        <p>
          Po potwierdzeniu wplaty klient otrzymuje dalsza instrukcje, a jezeli usluga tego wymaga, takze link do rozmowy
          albo informacje o kolejnym kroku.
        </p>
        <p>
          Przed rozmowa klient moze dobrowolnie dodac materialy przygotowawcze, w szczegolnosci krotki opis sprawy, linki
          lub nagrania. Materialy te maja charakter pomocniczy.
        </p>
      </>
    ),
  },
  {
    title: '7. Zmiana terminu i rezygnacja',
    body: (
      <>
        <p>Po potwierdzeniu wplaty klient ma 24 godziny na zgloszenie rezygnacji albo wniosku o zmiane terminu.</p>
        <p>
          Ewentualny zwrot srodkow wymaga kontaktu i jest rozpatrywany indywidualnie z uwzglednieniem etapu realizacji
          uslugi oraz przebiegu rezerwacji.
        </p>
        <p>Po uplywie wskazanego terminu zmiana lub odwolanie rezerwacji moze nie byc mozliwe bez poniesienia kosztu uslugi.</p>
      </>
    ),
  },
  {
    title: '8. Nieobecnosc i wygasniecie rezerwacji',
    body: (
      <>
        <p>Jezeli klient nie oplaci rezerwacji albo wplata nie zostanie potwierdzona, rezerwacja moze zostac zamknieta jako nieaktywna.</p>
        <p>Jezeli klient nie stawi sie na oplacona usluge bez wczesniejszego kontaktu, rezerwacja moze zostac uznana za zrealizowana.</p>
      </>
    ),
  },
  {
    title: '9. Ograniczenie odpowiedzialnosci i sila wyzsza',
    body: (
      <>
        <p>
          Usluga ma charakter konsultacji behawioralnej i nie stanowi porady weterynaryjnej ani diagnozy medycznej. Uslugodawca nie ponosi
          odpowiedzialnosci za brak konkretnych efektow terapeutycznych, jezeli klient nie wdrozyl uzgodnionych zalecen lub zachowanie zwierzecia
          wynika z przyczyn zdrowotnych wymagajacych interwencji weterynaryjnej.
        </p>
        <p>
          W przypadku sily wyzszej (awaria lacznosci po stronie uslugodawcy, zdarzenia losowe, niedostepnosc platformy technicznej niezalezna od
          uslugodawcy) realizacja uslugi zostanie przelozna na najblizszy mozliwy termin albo klient otrzyma pelny zwrot wplaty.
        </p>
      </>
    ),
  },
  {
    title: '10. Reklamacje',
    body: (
      <>
        <p>Reklamacje dotyczace dzialania serwisu, procesu rezerwacji albo realizacji uslugi mozna zglaszac przez formularz kontaktowy lub e-mail.</p>
        <p>Zgloszenie powinno zawierac dane pozwalajace zidentyfikowac sprawe oraz krotki opis zastrzezen. Reklamacje sa rozpatrywane bez zbednej zwloki.</p>
      </>
    ),
  },
  {
    title: '11. Dane osobowe',
    body: (
      <>
        <p>Zasady przetwarzania danych osobowych zwiazanych z serwisem, kontaktem, rezerwacja i realizacja uslug okresla odrebna Polityka prywatnosci.</p>
      </>
    ),
  },
  {
    title: '12. Postanowienia koncowe',
    body: (
      <>
        <p>Regulamin obowiazuje od dnia jego opublikowania w serwisie i ma zastosowanie do rezerwacji skladanych po tej dacie.</p>
        <p>W sprawach nieuregulowanych w regulaminie zastosowanie maja odpowiednie przepisy prawa polskiego.</p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Regulamin"
      title="Regulamin swiadczenia uslug"
      intro="Dokument okresla zasady korzystania z serwisu, rezerwacji uslug, dokonywania platnosci, potwierdzen, zmian terminu oraz trybu skladania reklamacji."
      contactSubject="Pytanie o regulamin - Regulski | Terapia behawioralna"
      summaryItems={summaryItems}
      sections={sections}
      supportTitle="Kontakt w sprawach regulaminu"
      supportText="W sprawach dotyczacych rezerwacji, platnosci, zmian terminu, rezygnacji i reklamacji kontakt prowadzony jest przez formularz kontaktowy oraz e-mail."
      supportNoteTitle="Wniosek o zmiane terminu, rezygnacje lub reklamacje"
      supportNoteText="W wiadomosci nalezy podac dane pozwalajace zidentyfikowac rezerwacje oraz krotki opis sprawy. Telefon nie jest publicznym kanalem kontaktu serwisu."
      structuredData={[
        getBreadcrumbJsonLd([
          { name: 'Strona glowna', path: '/' },
          { name: 'Regulamin', path: '/regulamin' },
        ]),
      ]}
    />
  )
}
