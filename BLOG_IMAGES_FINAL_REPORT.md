# BLOG_IMAGES_FINAL_REPORT

Data: 2026-05-06

## Podsumowanie

1. Sprawdzono artykułów: 24.
2. Obrazów zostawiono bez zmian: 0.
3. Obrazów wymieniono: 24/24 coverów artykułów + hero listy `/blog`.
4. Lista artykułów z nowymi obrazami: wszystkie 24 wpisy w tabeli poniżej.
5. Lista artykułów bez zmian: brak.
6. Duplikaty obrazów: nie wykryto.
7. Zgodność z gatunkiem: tak, wpisy psie mają psa, wpisy kocie mają kota, wpisy ogólne mają kontekst konsultacyjny lub pies/kot.
8. Zgodność z tematem: tak, każdy obraz dobrano do problemu artykułu, nie tylko do gatunku.
9. Prywatne zdjęcia z dysku: nie użyto. Źródła to Pexels i Wikimedia Commons; nie użyto Desktop/Downloads/Pictures/Documents/OneDrive, PDF-ów ani screenshotów.
10. Screenshoty kontrolne: tak. Lista bloga: `blog-image-review/blog-photo-final-local-full.png`; hero artykułów w katalogu: 24.
11. Build: PASS (`npm.cmd run build`).
12. Lint: PASS (`npm.cmd run lint`).

## Zmienione pliki i assety

- `lib/blog.tsx`: nowe ścieżki coverów i realistyczne alt texty.
- `app/blog/page.tsx`: hero listy bloga podmieniony z rysunkowego komponentu na zdjęcie.
- `public/blog-covers/blog-[slug]-photo.webp`: nowe unikalne zdjęcia artykułów.
- `public/blog-covers/blog-index-hero-photo.webp`: nowe zdjęcie hero listy bloga.
- `blog-image-review/`: manifest źródeł i screenshoty kontrolne.

## Artykuły

| Tytuł | Stary obraz | Nowy obraz | Realistyczne zdjęcie | Nie ikona / ilustracja | Gatunek się zgadza | Temat się zgadza | Źródło obrazu | Nie z prywatnego dysku |
|---|---|---|---|---|---|---|---|---|
| Pierwsza noc ze szczeniakiem - jak ustawic spokojny start | `/branding/niezbednik/pdf-puppy.jpg` | `/blog-covers/blog-szczeniak-pierwsza-noc-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/puppy-sleeping-15628462/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Dlaczego mój pies szczeka na inne psy? | `/images/cutover/dog-spacer-reactivity.png` | `/blog-covers/blog-dlaczego-moj-pies-szczeka-na-inne-psy-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/photo-of-dogs-on-leash-8842160/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Pies wyje, kiedy zostaje sam | `/images/cutover/dog-separation.png` | `/blog-covers/blog-pies-wyje-kiedy-zostaje-sam-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/light-city-sunset-people-7899233/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Kot załatwia się poza kuwetą | `/images/cutover/cat-kuweta.png` | `/blog-covers/blog-kot-zalatwia-sie-poza-kuweta-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/white-and-orange-cat-walking-out-of-a-litter-box-13705497/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Jak wygląda konsultacja behawioralna online? | `/blog-covers/consultation.jpg` | `/blog-covers/blog-jak-wyglada-konsultacja-behawioralna-online-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/man-sitting-with-laptop-and-dog-5483376/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Pies ciągnie na smyczy - kiedy to nawyk, a kiedy problem | `/images/cutover/dog-spacer-reactivity.png` | `/blog-covers/blog-pies-ciagnie-na-smyczy-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/a-dog-walking-with-a-leash-5482860/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Kot drapie meble - dlaczego to robi i jak to zmienić | `/branding/niezbednik/product-cat-scratcher.jpg` | `/blog-covers/blog-kot-drapie-meble-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/a-cat-scratching-a-cat-tree-14011147/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Nowy pies w domu - co zrobić przez pierwsze 72 godziny | `/branding/topic-cards/dog-resting-home.jpg` | `/blog-covers/blog-nowy-pies-pierwsze-72-godziny-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/dog-resting-on-the-sofa-5942622/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Kiedy behawiorysta, a kiedy trener psa? | `/blog-covers/specialist.jpg` | `/blog-covers/blog-kiedy-behawiorysta-kiedy-trener-psa-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/a-man-training-a-dog-by-the-river-5483372/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Behawiorysta, zoopsycholog czy trener - do kogo się zgłosić? | `/blog-covers/specialist.jpg` | `/blog-covers/blog-behawiorysta-zoopsycholog-trener-do-kogo-sie-zglosic-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/dog-and-cat-on-the-floor-4214919/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Ile kosztuje konsultacja behawioralna i co dostajesz w cenie | `/blog-covers/money.jpg` | `/blog-covers/blog-ile-kosztuje-konsultacja-behawioralna-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/photo-of-person-using-calculator-6801683/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Czym jest COAPE i co oznacza behawiorysta po tej szkole | `/blog-covers/specialist.jpg` | `/blog-covers/blog-czym-jest-coape-behawiorysta-po-tej-szkole-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/award-winning-dog-with-trophy-and-certificate-34203966/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Jak przygotować się do konsultacji behawioralnej online | `/blog-covers/consultation.jpg` | `/blog-covers/blog-jak-przygotowac-sie-do-konsultacji-behawioralnej-online-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/person-lying-on-sofa-with-cat-909620/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Luźna smycz z reaktywnym psem - jak to ćwiczyć | `/images/cutover/dog-spacer-reactivity.png` | `/blog-covers/blog-reaktywnosc-na-smyczy-cwiczenie-luznej-smyczy-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/photo-of-dogs-with-leash-3006009/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Jak nagrać psa zostawionego samemu i co z nagrania odczytać | `/images/cutover/dog-separation.png` | `/blog-covers/blog-jak-nagrac-psa-zostawionego-samemu-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/dog-on-the-bed-8488983/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Rutyna wyjścia - jak oswajać psa z samotnością krok po kroku | `/branding/topic-cards/dog-window-alone.jpg` | `/blog-covers/blog-rutyna-wyjscia-oswajanie-psa-z-samotnoscia-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/dog-on-pet-bed-2248516/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Jak wybrać kuwetę i żwirek dla kota | `/images/cutover/cat-kuweta.png` | `/blog-covers/blog-jak-wybrac-kuwete-i-zwirek-dla-kota-photo.webp` | tak | tak | tak | tak | [Wikimedia Commons, CC BY 2.0](https://commons.wikimedia.org/wiki/File:Cat_house.jpg); licencja: [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | tak |
| Stres kota a zachowania toaletowe - co środowisko ma z tym wspólnego | `/images/cutover/cat-stress.png` | `/blog-covers/blog-stres-kota-a-zachowania-toaletowe-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/photo-of-a-cat-in-a-room-11274114/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Jak wprowadzić nowego kota do domu, w którym jest już jeden | `/images/cutover/cat-conflict.png` | `/blog-covers/blog-jak-wprowadzic-nowego-kota-do-domu-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/focus-photography-of-two-cats-1761401/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Agresja przekierowana u kota - co to jest i jak reagować | `/branding/topic-cards/cats/cat-touch-defensive.jpg` | `/blog-covers/blog-agresja-przekierowana-u-kota-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/close-up-photography-of-two-cats-1003993/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Pies ciągnie na smyczy - od czego zacząć | `/images/cutover/dog-spacer-reactivity.png` | `/blog-covers/blog-pies-ciagnie-na-smyczy-od-czego-zaczac-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/dog-on-leash-3068920/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Jak nauczyć psa zostawania samemu | `/images/cutover/dog-separation.png` | `/blog-covers/blog-jak-nauczyc-psa-zostawania-samemu-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/5801444/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Jak ustawić kuwetę dla kota | `/images/cutover/cat-kuweta.png` | `/blog-covers/blog-jak-ustawic-kuwete-dla-kota-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/relaxed-tortoiseshell-cat-in-modern-bathroom-35260596/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |
| Jak zapoznać dwa koty | `/images/cutover/cat-conflict.png` | `/blog-covers/blog-jak-zapoznac-dwa-koty-photo.webp` | tak | tak | tak | tak | [Pexels, Pexels License](https://www.pexels.com/photo/photo-of-cats-in-front-of-window-34726871/); licencja: [Pexels License](https://www.pexels.com/license/) | tak |

## Źródło hero listy bloga

- Nowy obraz: `/blog-covers/blog-index-hero-photo.webp`.
- Źródło: [Pexels, Pexels License](https://www.pexels.com/photo/smiling-woman-with-dog-and-cat-16466168/); licencja: [Pexels License](https://www.pexels.com/license/).
- Potwierdzenie: obraz nie pochodzi z prywatnego dysku, nie jest ikoną, nie jest ilustracją i nie jest screenshotem PDF.

## Kontrola techniczna

- Aktualne cover pliki artykułów: 24/24 ma sufiks `-photo.webp`.
- Wymiary coverów: 24/24 ma 640x400 WebP.
- Hash duplikatów: brak duplikatów.
- Lokalne `/blog`: HTTP 200; HTML zawiera nowe ścieżki `*-photo.webp`, nie zawiera poprzednich `blog-[slug].webp` ani hero `choice-dog-clean` / `choice-cat-clean`.
- Konsola przeglądarki: brak błędów; widoczne były tylko informacyjne wpisy React DevTools.
