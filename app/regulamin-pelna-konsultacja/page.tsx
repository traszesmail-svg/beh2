import type { Metadata } from 'next'
import { LegalPageLayout, type LegalSection, type LegalSummaryItem } from '@/components/LegalPageLayout'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildLegalMetadata } from '@/lib/seo'

export const metadata: Metadata = buildLegalMetadata(
  'Regulamin Pelnej konsultacji',
  '/regulamin-pelna-konsultacja',
  'Zasady rezerwacji, platnosci, realizacji i reklamacji pelnej konsultacji behawioralnej online.',
)

const summaryItems: LegalSummaryItem[] = [
  {
    label: 'Produkt objety dokumentem',
    value: 'Pelna konsultacja behawioralna online: 60 min rozmowy, 470 zl, diagnoza i 7 dni konsultacji tekstowych przez WhatsApp.',
  },
  {
    label: 'Platnosc',
    value: 'BLIK na telefon po potwierdzeniu terminu. Potwierdzenie rezerwacji do 15 minut w godzinach 9-21.',
  },
]

const sections: LegalSection[] = [
  {
    title: '1. Postanowienia ogolne',
    body: (
      <>
        <p>
          Regulamin okresla zasady rezerwacji, platnosci, realizacji i reklamacji uslugi Pelna konsultacja behawioralna
          online.
        </p>
        <p>
          Uslugodawca: Krzysztof Regulski, e-mail: kontakt@regulskibehawiorysta.pl.
        </p>
        <p>Konsultacja jest usluga cyfrowa swiadczona przez internet. Nie ma charakteru porady weterynaryjnej ani diagnozy medycznej.</p>
      </>
    ),
  },
  {
    title: '2. Przedmiot i zakres uslugi',
    body: (
      <>
        <ul className="premium-bullet-list">
          <li>Konsultacja trwa 60 minut i odbywa sie online w formie rozmowy audio lub audio/video.</li>
          <li>W ramach konsultacji uslugodawca analizuje opisana sytuacje psa lub kota, porzadkuje priorytety i przekazuje diagnoze behawioralna sytuacji.</li>
          <li>Po konsultacji klient otrzymuje diagnoze behawioralna sytuacji i indywidualny plan poprawy.</li>
          <li>Przez 7 dni od konsultacji klient moze przez WhatsApp zadawac pytania, wysylac wiadomosci tekstowe i filmy oraz konsultowac wdrazanie planu.</li>
          <li>Jesli po 7 dniach brak postepu albo nie ma poczucia, ze to skuteczna droga do rozwiazania, uslugodawca moze wskazac zasadnosc wizyty domowej i terapii ustalanej indywidualnie.</li>
          <li>Konsultacja nie obejmuje diagnostyki weterynaryjnej, zalece farmakologicznych ani interwencji w stanach naglych.</li>
        </ul>
        <p>
          Jezeli opisana sytuacja wymaga interwencji weterynarza lub innego specjalisty, uslugodawca informuje o tym
          klienta i moze odmowic dalszej realizacji konsultacji, zwracajac 100% wplaty.
        </p>
      </>
    ),
  },
  {
    title: '3. Cena i platnosc',
    body: (
      <>
        <p>Cena konsultacji: 470 zl brutto.</p>
        <p>Metody platnosci: BLIK na telefon albo PayPal.me. Dane do wplaty klient otrzymuje emailem po zaakceptowaniu wstepnego terminu.</p>
        <p>Platnosc przyjmowana jest w godzinach 9:00-21:00, poza dniami ustawowo wolnymi od pracy.</p>
        <p>Potwierdzenie wplyniecia BLIK-a i ostateczne potwierdzenie rezerwacji nastepuje do 15 minut od zaksiogowania wplaty w oknie obslugi.</p>
        <p>Rezerwacja bez dokonanej platnosci nie jest wiazaca. Termin wraca do puli po 24 godzinach od wyslania numeru BLIK.</p>
      </>
    ),
  },
  {
    title: '4. Rezerwacja terminu',
    body: (
      <>
          <p>Klient inicjuje rezerwacje przez formularz na stronie /book, wskazujac preferowane terminy oraz opis sytuacji.</p>
          <p>Uslugodawca odpowiada w ciagu kilku godzin, potwierdza jeden z zaproponowanych terminow albo proponuje inny, wraz z numerem telefonu do BLIK-a.</p>
          <p>Konsultacja jest zarezerwowana dopiero po potwierdzeniu wplaty przez uslugodawce.</p>
          <p>Na 24 godziny przed konsultacja klient otrzymuje e-mail z linkiem do rozmowy i lista materialow do przygotowania, jezeli sa potrzebne.</p>
          <p>Po zakonczeniu konsultacji dalszy 7-dniowy kontakt tekstowy odbywa sie przez WhatsApp, chyba ze strony ustala inny kanal pisemny.</p>
        </>
      ),
  },
  {
    title: '5. Zmiana terminu i anulacja',
    body: (
      <>
        <p>Do 48 godzin przed konsultacja klient moze bezplatnie zmienic termin albo zrezygnowac i otrzymac zwrot 100% wplaty.</p>
        <p>Pomiedzy 48 a 24 godzinami przed terminem mozliwa jest bezplatna zmiana terminu albo zwrot 50% wplaty.</p>
        <p>Krocej niz 24 godziny przed terminem wplata nie podlega zwrotowi, chyba ze przyczyna jest sila wyzsza lub niedostepnosc uslugodawcy.</p>
      </>
    ),
  },
  {
    title: '6. No-show i odwolanie przez uslugodawce',
    body: (
      <>
        <p>Jesli klient nie dolaczy do rozmowy w ciagu 15 minut od planowanego poczatku i nie skontaktuje sie z uslugodawca, konsultacja uznawana jest za zrealizowana bez prawa do zwrotu.</p>
        <p>W przypadku problemow technicznych udokumentowanych przez klienta uslugodawca proponuje nowy termin bez doplaty.</p>
        <p>W sytuacjach wyjatkowych uslugodawca moze odwolac konsultacje. W takim przypadku klient otrzymuje wybor: nowy termin w ciagu 30 dni albo pelny zwrot wplaty.</p>
      </>
    ),
  },
  {
    title: '7. Prawo odstapienia od umowy',
    body: (
      <>
        <p>Konsument ma prawo odstapic od umowy zawartej na odleglosc w terminie 14 dni bez podania przyczyny, z zastrzezeniem przepisow szczegolnych o uslugach wykonanych za zgoda klienta.</p>
        <p>Akceptujac regulamin przy rezerwacji, klient wyraza zgode na rozpoczecie swiadczenia uslugi przed uplywem 14-dniowego terminu i przyjmuje do wiadomosci, ze po zakonczonej konsultacji traci prawo odstapienia od umowy.</p>
        <p>Do momentu rozpoczecia konsultacji klient zachowuje prawo odstapienia na zasadach ogolnych. Zgloszenie e-mailem jest wystarczajace.</p>
      </>
    ),
  },
  {
    title: '8. Reklamacje',
    body: (
      <>
        <p>Klient moze zlozyc reklamacje e-mailem na kontakt@regulskibehawiorysta.pl w ciagu 14 dni od konsultacji.</p>
        <p>Reklamacja powinna zawierac imie i nazwisko, date konsultacji oraz opis nieprawidlowosci.</p>
        <p>Uslugodawca rozpatruje reklamacje w ciagu 14 dni roboczych. Jezeli reklamacja jest zasadna, klient otrzymuje zwrot czesci lub calosci wplaty albo darmowa konsultacje uzupelniajaca.</p>
      </>
    ),
  },
  {
    title: '9. Ochrona danych osobowych i poufnosc',
    body: (
      <>
        <p>Administratorem danych osobowych klienta jest uslugodawca wskazany w naglowku dokumentu.</p>
        <p>Dane sa przetwarzane w celu realizacji konsultacji, wystawienia dokumentu sprzedazowego i kontaktu zwrotnego. Szczegoly znajduja sie w Polityce prywatnosci.</p>
        <p>Uslugodawca zachowuje poufnosc informacji przekazanych przez klienta podczas konsultacji. Konsultacja nie jest nagrywana bez wyraznej zgody klienta.</p>
      </>
    ),
  },
  {
    title: '10. Postanowienia koncowe',
    body: (
      <>
        <p>W sprawach nieuregulowanych regulaminem zastosowanie maja przepisy prawa polskiego, w szczegolnosci Kodeksu cywilnego i ustawy o prawach konsumenta.</p>
        <p>Uslugodawca zastrzega prawo do zmiany regulaminu. Rezerwacje oplacone przed zmiana regulaminu sa realizowane na zasadach obowiazujacych w momencie rezerwacji.</p>
        <p>Regulamin wchodzi w zycie z dniem opublikowania na stronie /regulamin-pelna-konsultacja.</p>
      </>
    ),
  },
]

export default function FullConsultationTermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Regulamin / pelna konsultacja"
      title="Regulamin Pelnej konsultacji behawioralnej online"
      intro="Dokument opisuje zasady rezerwacji, platnosci, zmian terminu, realizacji, 7 dni wsparcia tekstowego i reklamacji dla Pelnej konsultacji online."
      contactSubject="Pytanie o regulamin Pelnej konsultacji"
      summaryItems={summaryItems}
      sections={sections}
      supportTitle="Kontakt w sprawach Pelnej konsultacji"
      supportText="Dokument obejmuje warunki rezerwacji, diagnozy, planu poprawy i 7 dni wsparcia tekstowego po Pelnej konsultacji."
      supportNoteTitle="Kontakt i obsluga dokumentu"
      supportNoteText="W sprawach dotyczacych regulaminu, reklamacji lub realizacji Pelnej konsultacji kontakt prowadzony jest przez formularz i e-mail."
      structuredData={[
        getBreadcrumbJsonLd([
          { name: 'Strona glowna', path: '/' },
          { name: 'Regulamin Pelnej konsultacji', path: '/regulamin-pelna-konsultacja' },
        ]),
      ]}
    />
  )
}
