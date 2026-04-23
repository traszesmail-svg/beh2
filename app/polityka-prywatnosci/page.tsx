import type { Metadata } from 'next'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { LegalPageLayout, type LegalSection, type LegalSummaryItem } from '@/components/LegalPageLayout'
import { buildLegalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildLegalMetadata(
  'Polityka prywatnosci',
  '/polityka-prywatnosci',
  'Polityka prywatnosci serwisu Regulski: zakres danych, cele przetwarzania i prawa uzytkownika.',
)

const summaryItems: LegalSummaryItem[] = [
  {
    label: 'Punkty styku danych',
    value: 'Formularz kontaktowy, rezerwacja, platnosc, potwierdzenie, materialy przygotowawcze, materialy bezplatne oraz newsletter.',
  },
  {
    label: 'Podstawowe narzedzia',
    value: 'Supabase, Resend, Jitsi oraz narzedzia analityczne uruchamiane wylacznie po wyrazeniu zgody.',
  },
  {
    label: 'Publiczny kontakt',
    value: 'Publiczny kontakt odbywa sie przez formularz i e-mail. Telefon nie jest publikowany na stronie.',
  },
]

const sections: LegalSection[] = [
  {
    title: '1. Administrator danych',
    body: (
      <>
        <p>
          Administratorem danych osobowych przetwarzanych w zwiazku z dzialaniem serwisu, kontaktem, rezerwacja i
          realizacja uslug jest Krzysztof Regulski prowadzacy dzialalnosc pod marka Regulski | Terapia behawioralna.
        </p>
      </>
    ),
  },
  {
    title: '2. Zakres danych',
    body: (
      <>
        <ul className="premium-bullet-list">
          <li>W formularzu kontaktowym: imie, e-mail lub numer telefonu, gatunek, temat i tresc wiadomosci.</li>
          <li>Przy rezerwacji: dane identyfikacyjne i kontaktowe, temat, termin, status rezerwacji oraz status platnosci.</li>
          <li>Przy realizacji uslugi: dane potrzebne do potwierdzenia rezerwacji, wysylki wiadomosci oraz dostepu do pokoju rozmowy.</li>
          <li>W materialach przygotowawczych: notatki, linki i pliki dodane dobrowolnie przez klienta.</li>
          <li>W formularzach materialow bezplatnych i newslettera: adres e-mail, segment tematyczny oraz identyfikator materialu lub zrodla zapisu.</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Cele przetwarzania danych',
    body: (
      <>
        <p>Dane sa przetwarzane w celu:</p>
        <ul className="premium-bullet-list">
          <li>udzielenia odpowiedzi na wiadomosc przeslana przez formularz kontaktowy,</li>
          <li>przyjecia i obslugi rezerwacji uslugi,</li>
          <li>potwierdzenia platnosci i obslugi strony potwierdzenia,</li>
          <li>realizacji konsultacji oraz przygotowania sie do rozmowy na podstawie przekazanych materialow,</li>
          <li>obslugi formularzy materialow bezplatnych i newslettera,</li>
          <li>zapewnienia bezpieczenstwa serwisu, rozliczen oraz dochodzenia lub obrony roszczen.</li>
        </ul>
      </>
    ),
  },
  {
    title: '4. Podstawa przetwarzania',
    body: (
      <>
        <p>
          Dane sa przetwarzane w zakresie niezbednym do zawarcia i wykonania umowy, udzielenia odpowiedzi na zgloszenie,
          wypelnienia obowiazkow prawnych zwiazanych z rozliczeniami oraz na podstawie prawnie uzasadnionego interesu
          administratora polegajacego na zapewnieniu bezpieczenstwa serwisu i obslugi zgloszen.
        </p>
        <p>
          W zakresie analityki oraz w tych przypadkach, w ktorych wymaga tego charakter formularza, przetwarzanie moze
          odbywac sie takze na podstawie zgody uzytkownika.
        </p>
      </>
    ),
  },
  {
    title: '5. Odbiorcy danych',
    body: (
      <>
        <p>
          Dane moga byc przekazywane wylacznie w zakresie niezbednym do dzialania serwisu i realizacji uslug, w
          szczegolnosci dostawcom obslugujacym baze danych, wysylke wiadomosci e-mail, pokoj rozmowy online oraz
          narzedzia analityczne.
        </p>
        <p>
          W aktualnym modelu technicznym serwis korzysta z uslug Supabase, Resend i Jitsi. Jezeli dla danej rezerwacji
          aktywna jest obsluga SMS lub inna funkcja powiadomien, dane moga zostac przekazane takze operatorowi tej
          wiadomosci.
        </p>
      </>
    ),
  },
  {
    title: '6. Numer telefonu i kontakt publiczny',
    body: (
      <>
        <p>
          Telefon nie jest publikowany jako publiczny kanal kontaktu serwisu. Publiczny kontakt odbywa sie przez formularz
          i e-mail.
        </p>
        <p>
          Numer telefonu moze byc jednak przetwarzany przy rezerwacji uslugi, jezeli jest wymagany przez formularz lub
          potrzebny do obslugi rezerwacji, potwierdzenia platnosci albo wyslania wiadomosci SMS.
        </p>
      </>
    ),
  },
  {
    title: '7. Materialy bezplatne, newsletter i analityka',
    body: (
      <>
        <p>
          Formularze materialow bezplatnych i newslettera sluza do przyjecia zgloszenia, przypisania go do wlasciwej
          strony, materialu lub segmentu tematycznego oraz obslugi dalszego kroku wynikajacego z danego formularza.
        </p>
        <p>
          Serwis zapisuje decyzje dotyczaca analityki w pamieci przegladarki i pliku cookie. Narzedzia analityczne nie sa
          uruchamiane przed wyrazeniem zgody.
        </p>
      </>
    ),
  },
  {
    title: '8. Okres przechowywania danych',
    body: (
      <>
        <p>
          Dane sa przechowywane przez okres niezbedny do obslugi kontaktu, rezerwacji, realizacji uslugi, rozliczen oraz
          wykonania obowiazkow prawnych, a takze przez okres potrzebny do dochodzenia lub obrony roszczen.
        </p>
        <p>
          Dane przetwarzane na podstawie zgody sa przechowywane do czasu jej cofniecia albo utraty celu, dla ktorego byly
          przetwarzane.
        </p>
      </>
    ),
  },
  {
    title: '9. Prawa osoby, ktorej dane dotycza',
    body: (
      <>
        <p>
          Osobie, ktorej dane dotycza, przysluguje prawo dostepu do danych, ich sprostowania, usuniecia, ograniczenia
          przetwarzania, przenoszenia danych, wniesienia sprzeciwu oraz cofniecia zgody, jezeli przetwarzanie odbywa sie
          na jej podstawie.
        </p>
        <p>
          Osobie, ktorej dane dotycza, przysluguje rowniez prawo wniesienia skargi do Prezesa Urzedu Ochrony Danych
          Osobowych.
        </p>
      </>
    ),
  },
  {
    title: '10. Postanowienia koncowe',
    body: (
      <>
        <p>
          Polityka prywatnosci obowiazuje od dnia jej opublikowania w serwisie. Zmiany polityki sa publikowane w tej samej
          zakladce.
        </p>
      </>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Polityka prywatnosci"
      title="Polityka prywatnosci"
      intro="Dokument opisuje zasady przetwarzania danych osobowych w zwiazku z korzystaniem z serwisu, formularza kontaktowego, rezerwacji uslug, potwierdzen, materialow przygotowawczych oraz formularzy materialow bezplatnych i newslettera."
      contactSubject="Prywatnosc i dane - Regulski | Terapia behawioralna"
      summaryItems={summaryItems}
      sections={sections}
      supportTitle="Kontakt w sprawach danych osobowych"
      supportText="W sprawach dotyczacych danych osobowych, zakresu przetwarzania lub realizacji praw osoby, ktorej dane dotycza, kontakt prowadzony jest przez formularz kontaktowy oraz e-mail."
      supportNoteTitle="Zadanie dotyczace danych"
      supportNoteText="W wiadomosci warto wskazac, czego dotyczy zadanie oraz podac dane pozwalajace zidentyfikowac zgloszenie, rezerwacje lub formularz."
      structuredData={[
        getBreadcrumbJsonLd([
          { name: 'Strona glowna', path: '/' },
          { name: 'Polityka prywatnosci', path: '/polityka-prywatnosci' },
        ]),
      ]}
    />
  )
}
