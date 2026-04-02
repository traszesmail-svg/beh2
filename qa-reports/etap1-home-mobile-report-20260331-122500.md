1. STATUS

DONE

2. LIVE URL

https://beh2.vercel.app

3. CO ZMIENIŁEM

- Skróciłem homepage do 4 głównych bloków: hero, wybór pierwszego kroku, krótki blok pies/kot, krótki blok kontaktu.
- Przebudowałem hero na mobile do 1 nagłówka, 1 krótkiego podnagłówka i 2 głównych CTA.
- Dodałem szybki wybór wysoko na stronie: `Mam psa`, `Mam kota`, `Nie wiem, od czego zacząć`.
- Przebudowałem sekcję `Pierwszy krok` na 3 krótkie karty: `Dobierz pierwszy krok`, `Umów 15 min`, `Napisz wiadomość`.
- Ujednoliciłem główne CTA na home oraz w header/footer do docelowych nazw.
- Dodałem sticky CTA na mobile, które pojawia się dopiero po scrollu i nie zasłania hero na starcie.
- Uciąłem mobilny header na home do wersji kompaktowej, żeby pierwszy ekran był krótszy.
- Poprawiłem spacing, wielkości nagłówków i gęstość sekcji pod mobile 360/375/390/430.

4. CO USUNĄŁEM LUB SKRÓCIŁEM

- Usunąłem z home sekcje: `jak-moge-pomoc`, `formy-wspolpracy`, `pobyty`, `koty`, `jak-pracuje`, `zaufanie`, `faq`.
- Nie zostawiałem rozwlekłych sekcji jako zwiniętych bloków; dublujące elementy zostały wycięte zamiast akordeonowane.
- Skróciłem hero, top homepage na mobile, intro sekcji `Pierwszy krok`, blok kontaktowy i całą długość home do 4 sekcji.
- Ujednoliciłem CTA tak, żeby na home dominowały tylko: `Dobierz pierwszy krok`, `Umów 15 min`, `Napisz wiadomość`.

5. PRZEKLIKANIE RAPORT MANUALNY

- Otworzyłem home na mobile 390 px. Rezultat: pierwszy ekran ładuje się czytelnie; marka, H1, krótki opis, szybki wybór i 2 CTA są widoczne bez chaosu.
- Kliknąłem hero `Dobierz pierwszy krok`. Rezultat: przewinięcie do `#pierwszy-krok`; sekcja `Wybierz najprostszy start` trafiona poprawnie.
- Kliknąłem hero `Umów 15 min`. Rezultat: przejście do `/book`; ekran wyboru tematu ładuje się poprawnie.
- Z `/book` wróciłem na home przez logo. Rezultat: powrót działa poprawnie.
- Kliknąłem `Mam psa`. Rezultat: przejście do `/book`; flow jest czytelny.
- Kliknąłem `Mam kota`. Rezultat: przejście do `/slot?problem=kot`; od razu widać krok z terminami.
- Kliknąłem `Nie wiem, od czego zacząć`. Rezultat: przejście do `/kontakt`; H1 `Opisz sytuację i dobierz pierwszy krok`.
- W sekcji `Pierwszy krok` kliknąłem kolejno `Dobierz pierwszy krok`, `Umów 15 min`, `Napisz wiadomość`. Rezultat: przejścia odpowiednio do `/kontakt`, `/book`, `/kontakt`; każde zadziałało poprawnie.
- Z `/book`, `/slot` i `/kontakt` wróciłem na home przez logo. Rezultat: powrót działa poprawnie w każdym przypadku.
- Przewinąłem home niżej, poczekałem aż pojawi się sticky CTA i kliknąłem je. Rezultat: powrót do `#pierwszy-krok`; sticky działa poprawnie i nie zasłania hero na starcie.
- Zrobiłem desktop sanity check 1280 px. Rezultat: brak poziomego overflow, layout się nie rozsypał.
- Dodatkowo wykonałem `npm run live-clickthrough-report` na live po deployu. Rezultat: `17/17 PASS`, `0 runtime issues`.

6. MOBILE QA

- 360 px: hero mieści się sensownie, CTA są czytelne, sticky na starcie jest ukryty, żadna sekcja nie jest absurdalnie długa, brak rozjazdów layoutu.
- 375 px: hero i szybki wybór są czytelne, sticky nie przeszkadza na starcie, sekcje są krótkie, brak rozjazdów layoutu.
- 390 px: najlepszy balans gęstości; home dobrze się skanuje kciukiem, CTA są wyraźne, sticky działa poprawnie po scrollu, brak rozjazdów layoutu.
- 430 px: hero i karty mają więcej oddechu, sticky nie zasłania treści, brak absurdalnie długich bloków, brak rozjazdów layoutu.

7. COPY QA

- `zostawiłem, ale brzmi za projektowo`: `Na home zostawiam tylko trzy wejścia. Resztę dobierzemy później, jeśli będzie potrzebna.`
- `do dalszego skrócenia`: `Pomagam szybko uporządkować problem i wybrać pierwszy krok: 15 min, wiadomość albo dalszą konsultację.`
- `do przepisania w Planie 2`: `Odpowiem, czy najlepiej zacząć od 15 min, wiadomości czy szerszej konsultacji.`

8. RZECZY NIEROZWIĄZANE

- Brak blockerów funkcjonalnych po ETAPIE 1.
- Została lekka asymetria skrótu wejścia: `Mam psa` prowadzi do `/book`, a `Mam kota` od razu do `/slot?problem=kot`.

9. REKOMENDACJA NA ETAP 2

- Skrócić hero subheadline do jednej korzyści bez wyliczania formatów pomocy.
- Przepisać intro sekcji `Pierwszy krok`, żeby nie brzmiało jak komentarz o strukturze strony.
- Uprościć copy w bloku kontaktu i wyciąć frazę `szersza konsultacja`.
- Skrócić nagłówki i opisy w blokach `Najczęstsze tematy psie` i `Najczęstsze tematy kocie`.
- Przejrzeć globalne tagline i eyebrowy, żeby wyciąć język katalogowy.
- Spłaszczyć mikrocopy przy CTA, żeby wszędzie mówiło tym samym tonem.
- Wyciąć resztki ofertowego żargonu typu `forma pracy`, jeśli nie jest konieczny.
- Dopracować tekst po literce pod mobile scan bez dokładania nowych sekcji.
