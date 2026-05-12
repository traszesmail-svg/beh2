# Audyt i domkniecie poprawek - 2026-05-12

Zakres: strony wskazane w liscie uzytkownika oraz niedomkniete punkty z poprzedniego raportu. Raport zostal zaktualizowany po dodatkowej korekcie: emblemat na blogu, przywrocenie zdjecia kontaktu, opis "od ponad 10 lat" tylko na `/o-mnie`, ostre zdjecie na stronie glownej.

## Zweryfikowane strony w tej serii

- `/`
- `/regulamin-pelna-konsultacja`
- `/regulamin`
- `/polityka-prywatnosci`
- `/kontakt`
- `/materialy`
- `/faq`
- `/niezbednik`
- `/blog`
- `/cennik`
- `/cennik/pelny`
- `/o-mnie`
- `/opinie`
- `/opinie/dodaj`
- `/checkout`
- `/payment`
- `/termin`

Weryfikacja po zmianach: `npm.cmd run build` przeszedl bez bledow. Lokalny smoke test Puppeteer na `next start` zwrocil 200 i brak bledow konsoli dla: `/`, `/kontakt`, `/blog`, `/niezbednik`, `/cennik`, `/cennik/pelny`, `/faq`, `/checkout`, `/payment`, `/termin`.

Po produkcyjnym deployu domena `https://regulskibehawiorysta.pl` zwrocila 200 i brak overlayow Next.js dla: `/`, `/kontakt`, `/o-mnie`, `/blog`, `/niezbednik`, `/cennik`, `/cennik/pelny`, `/faq`, `/checkout`, `/payment`, `/termin`. Nie bylo bledow `console.error` w smoke tescie.

Dodatkowo po deployu sprawdzone zostaly `/opinie` i `/opinie/dodaj`: oba zwrocily 200, bez overlayow, bez znakow `�` i bez widocznego mojibake. `/opinie/dodaj` ma logo Regulski, pole dodania zdjecia oraz opis limitu 25 MB. Endpoint `/api/testimonials/submit` zwrocil 200 w bezpiecznym tescie honeypotowym, bez generowania prawdziwej opinii ani maila.

Potwierdzenie obrazow po zmianach:

- `/` renderuje `/_next/image?url=%2Fimages%2Fhero-main.jpg...`.
- `/kontakt` renderuje `/_next/image?url=%2Fbranding%2Fomnie3.png...`.
- `/blog` ma pseudo-element `Regulski` na miniaturze z `top: 14px` i `right: 16px`.

## Wykonane

- Strona glowna ma naglowek `A Tobie jak moge pomoc?`.
- Na stronie glownej stare haslo `Z czym potrzebujesz` nie wystepuje.
- Strona glowna uzywa ostrego zdjecia `/images/hero-main.jpg`, bez rozmytej twarzy z wersji PNG.
- Ze strony glownej usuniety jest kafel `Nie wiem, od czego zaczac` prowadzacy do `/quiz`.
- Gorny pasek na stronie glownej, blogu, niezbedniku, kontakcie i stronach referencyjnych korzysta ze wspolnego wariantu `NotatnikTopbar`.
- Link `Szybki start` prowadzi do `/wybor`.
- Na legalnych stronach przycisk powrotu prowadzi do strony glownej, nie do cennika.
- Usuniete sa bloki/teksty typu `Kontakt w sprawie Pelnej konsultacji`, `Kontakt i obsluga dokumentu`, `Kontakt bez formularza`, `Masz pytanie do dokumentu`.
- Usuniety jest problematyczny tekst stopki `Konsultacja odbywa sie po rezerwacji i oplaceniu terminu...`.
- Formularz kontaktowy nie ma pola `Temat`.
- Formularz kontaktowy nie ma opcji `Nie wiem`; zostaly wybory `Pies` i `Kot`.
- Na `/kontakt` przywrocone jest poprzednie zdjecie `/branding/omnie3.png`.
- Opis zaczynajacy sie od `Od ponad 10 lat...` zostaje na `/o-mnie`, nie na `/kontakt`.
- Komunikat sukcesu formularza ma tresc `Dziekuje za wiadomosc...`.
- FAQ nie ma wyszukiwarki.
- FAQ ma liczby kategorii liczone z realnej listy pytan.
- FAQ ma realne zdjecie przy komputerze zamiast starej grafiki SVG.
- `/niezbednik` ma sciezki tematyczne wysoko na stronie i widoczne okladki PDF.
- Z `/niezbednik` usuniety jest blok `Nie wiesz, co wybrac?` z przyciskami.
- `/materialy` zostaje jako strona z okladkami i prowadzi linkami do `/niezbednik`.
- `/blog` nie ma juz wyszukiwarki artykulow.
- Z `/blog` usuniety jest CTA-blok `Nie wiesz, od czego zaczac?`.
- Emblemat `Regulski` na miniaturach bloga jest w prawym gornym rogu zdjecia.
- `/cennik` i `/cennik/pelny` nie maja juz dwoch gornych przyciskow `Umow pierwszy krok` i `Wyslij krotka wiadomosc`.
- Klikniecia w formaty z cennika prowadza do `/wybor`.
- Cennik ma dopisany atut diagnozy: dla krotkich formatow diagnoza na podstawie rozmowy, a dla pelnej konsultacji diagnoza, prawdopodobna etiologia i przebieg problemu.
- Na stronie glownej dopisany jest atut diagnozy w procesie i rekomendacjach wyboru.
- `/payment` i `/checkout` nie sa puste: maja ekrany bledu/braku zamowienia albo wyboru platnosci zalezne od parametrow.
- W layoucie platnosci gorny przycisk prowadzi do `/wybor` jako `Szybki start`, a nie do starego `/book`.
- W platnosci usuniety jest tekst `Rozmowa odbywa sie po rezerwacji i oplaceniu uslugi`.
- Na `/termin` link `Nie wiem - quiz` zostal zastapiony linkiem `Zmien wybor` do `/wybor`.

## Czesciowo wykonane albo wymagajace ostroznego testu

- Formularz kontaktowy nie zostal wyslany jako prawdziwa wiadomosc na live, zeby nie generowac realnego maila. Do testu bez wysylki mozna uzyc honeypota API albo lokalnego srodowiska testowego.
- `/checkout` i `/payment` sa polaczone kodowo, ale pelny scenariusz od rezerwacji przez zamowienie do potwierdzenia wymaga danych testowej rezerwacji albo prawdziwego zamowienia.
- `/platnosc/blik/[orderNumber]` wymaga realnego lub testowego numeru zamowienia, wiec bez takiego numeru da sie potwierdzic tylko istnienie routingu, nie pelny przeplyw.
- `/quiz` nadal istnieje jako osobna strona, ale nie jest juz podpinany z kafla `Nie wiem` na stronie glownej ani z `/termin`.

## Strony z projektu nadal nieobjete pelna recenzja tresciowa

- `/bezplatne-materialy/dziekuje`
- `/book`
- `/call/[id]`
- `/confirm`
- `/confirmation`
- `/dostep`
- `/form`
- `/materialy/pobranie`
- `/metodyka`
- `/newsletter`
- `/oczekiwanie/[orderNumber]`
- `/platnosc/blik/[orderNumber]`
- `/pokoj`
- `/problem`
- `/przybornik`
- `/quiz`
- `/slot`
- `/wybor`
- `/zamow-pdf`

## Status repo i deployu

Kod zostal zbudowany, przetestowany, wypchniety do repo i wdrozony produkcyjnie przez Vercel. Alias produkcyjny: `https://regulskibehawiorysta.pl`.

Nastepny osobny etap to recenzja tresciowa stron z sekcji `nadal nieobjete pelna recenzja tresciowa`.
