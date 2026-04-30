# Acceptance criteria — Kontakt / kierunek 1

## UX

- Formularz nadal jest najważniejszym elementem podstrony.
- Zdjęcie ociepla odbiór i buduje zaufanie, ale nie odciąga użytkownika od formularza.
- Na mobile użytkownik szybko widzi nagłówek i formularz, zdjęcie nie wydłuża przesadnie pierwszego ekranu.

## Wizualnie

- Zdjęcie wygląda naturalnie i nie-stockowo.
- Karta zdjęcia pasuje do obecnych paneli: zaokrąglenia, border, miękki cień, jasne tło.
- Brak agresywnych kolorów i krzykliwego CTA.
- Całość wygląda premium, spokojnie i behawioralnie.

## Technicznie

- Nie ma zmian w logice formularza.
- Nie ma zmian w endpointach.
- Nie ma regresji w nawigacji.
- Obraz ma alt text.
- Obraz jest zoptymalizowany przez `next/image`, jeżeli projekt używa Next.js.
- Build przechodzi lokalnie.

## Copy

Na stronie pojawia się maksymalnie krótki podpis zaufania:
`Spokojna rozmowa przed decyzją`

I opis:
`Nie musisz od razu wiedzieć, jaki rodzaj pomocy będzie najlepszy. Napisz krótko, co się dzieje — pomożemy uporządkować sytuację i wybrać kolejny krok.`
