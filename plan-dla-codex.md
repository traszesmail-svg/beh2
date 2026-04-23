# Regulski — plan wdrożenia w promptach dla Codex CLI

**Stan wejściowy (22.04.2026):**
Next.js SPA na regulskibehawiorysta.pl, zawartość solidna, ale placeholder w telefonie, email na @gmail, brak indeksu w Google, rozjechane nazewnictwo usługi, martwe linki w blogu i lead magnetach.

**Decyzje klienta:**
- BLIK na telefon **zostaje**, skracamy potwierdzenie **60 min → 15 min**.
- Telefon kontaktowy **wywalamy** z całej strony (klient płaci za rozmowę, a nie dzwoni za darmo).
- Email globalnie: **`kontakt@regulskibehawiorysta.pl`** zamiast `coapebehawiorysta@gmail.com`.
- Niezbędnik **na końcu** — najpierw sprzedaż i SEO.

**Kolejność promptów (wklejaj po kolei do Codex CLI):**
1. Pożary — telefon, email, nazwa usługi, martwe linki, regulamin
2. SEO techniczne — sitemap, robots, title, meta, OG
3. Schema.org — FAQPage, Person, Service
4. Trust — COAPE link, Instagram, testimoniale
5. Formularz — backend + RODO
6. **Manualne** (nie dla Codex) — GSC, Bing, Analytics
7. Niezbędnik — dopiero teraz

---

## PROMPT 1 · Pożary

**Cel:** strona przestaje mieć placeholdery, rozjechane nazwy i martwe linki. 1h roboty dla agenta.

```
Jesteś w repo Next.js strony regulskibehawiorysta.pl. Wykonaj w kolejności:

1. USUŃ TELEFON Z CAŁEJ STRONY
Znajdź wszystkie wystąpienia:
- "500 600 700" (także z różnym formatowaniem: "500600700", "500-600-700")
- tel:500600700
- całe komponenty telefonu/bloki kontaktu telefonicznego w stopkach i sekcjach kontakt
Usuń je razem z otaczającym wrapperem (ikonka + label + link). Nie zostawiaj pustej ramki ani "—".
Sprawdź szczególnie: footer globalny, /kontakt, /regulamin, /polityka-prywatnosci, stopki /psy, /koty, /niezbednik, /bezplatne-materialy/*.

2. EMAIL — PODMIEŃ DOMENĘ
Zamień WSZĘDZIE:
- coapebehawiorysta@gmail.com → kontakt@regulskibehawiorysta.pl
W tym w: mailto: linkach, text content, meta tagach, schema JSON-LD, footer, regulamin, polityka prywatności, kontakt.
Zachowaj istniejące URL-parametry mailto (subject=, body=) — tylko podmień adres przed "?".

3. NAZWA USŁUGI — UJEDNOLIĆ DO "Kwadrans z behawiorystą"
Zamień w tekście widocznym dla użytkownika:
- "Krótka rozmowa wstępna 15 min audio" → "Kwadrans z behawiorystą"
- "Krótka rozmowa wstępna" (samo) → "Kwadrans z behawiorystą"
- "Szybka konsultacja 15 min" → "Kwadrans z behawiorystą"
- "szybka konsultacja 15 min" → "Kwadrans z behawiorystą"
- "15 min audio" jako samodzielna nazwa w przyciskach → "Kwadrans z behawiorystą"
UWAGA: nie ruszaj technicznych nazw w kodzie (slug "szybka-konsultacja-15-min" w URL ?service= ZOSTAJE bez zmian, to service ID w backendzie). Ruszaj tylko tekst wyświetlany.
Przykład: <Button href="/book?service=szybka-konsultacja-15-min">Umów 15 min audio</Button>
→ <Button href="/book?service=szybka-konsultacja-15-min">Kwadrans z behawiorystą</Button>

Po zmianach:
- W H1, tytułach sekcji, przyciskach, listach zawsze "Kwadrans z behawiorystą"
- Podtytuł/opis pod spodem może doprecyzować: "15 min / audio / bez kamery / 69 zł"
- W tytułach <title> w /psy, /koty, /o-mnie sprawdź czy jest spójne

4. REGULAMIN — SKRÓĆ CZAS POTWIERDZENIA
W /regulamin znajdź frazę "potwierdzana do 60 minut" i zmień na "potwierdzana do 15 minut".
Sprawdź też inne miejsca gdzie pojawia się "60 minut" w kontekście płatności BLIK.
Jeśli w sekcji o płatności jest opis typu "BLIK lub przelewem potwierdzana do 60 minut", zmień całe zdanie na:
"Publicznie dostępną metodą płatności jest BLIK na telefon z potwierdzeniem do 15 minut."
(Usuwamy przelew, zostawiamy tylko BLIK — user nie chce przelewów).

5. MARTWY LINK W LEAD MAGNECIE
W /bezplatne-materialy/pies-reaktywnosc-5-krokow znajdź link do /blog/prog-pobudzenia-u-psa.
Zamień go na /blog/dlaczego-moj-pies-szczeka-na-inne-psy (ten wpis istnieje).
Zachowaj tekst linku "Blog: próg pobudzenia u psa" albo zmień na "Blog: dlaczego mój pies szczeka na inne psy" — zależnie od tego co pasuje do kontekstu.

6. TYPO W SLUGU BLOGA
Znajdź plik lub route: /blog/pies-cignnie-na-smyczy
Zmień slug na: /blog/pies-ciagnie-na-smyczy
Dodaj 301 redirect ze starego slugu na nowy (w next.config.js w redirects() albo middleware).
Zaktualizuj wszystkie wewnętrzne linki do tego wpisu w całym repo.

7. WYKONANIE I WERYFIKACJA
- grep -r "500 600 700" — powinno zwrócić 0
- grep -r "coapebehawiorysta@gmail.com" — powinno zwrócić 0
- grep -ri "Krótka rozmowa wstępna" — powinno zwrócić 0
- grep -ri "Szybka konsultacja 15 min" — powinno zwrócić 0 (jako nazwa usługi)
- grep -r "60 minut" w /regulamin — powinno zwrócić 0
- grep -r "prog-pobudzenia-u-psa" — powinno zwrócić 0
- grep -r "cignnie" — powinno zwrócić 0

Zrób git commit z wiadomością: "fix: remove phone placeholder, unify service name, fix broken links"
```

---

## PROMPT 2 · SEO techniczne

**Cel:** Google widzi stronę, każda podstrona ma porządny title + meta + OG. 2–3h.

```
Jesteś w repo Next.js strony regulskibehawiorysta.pl. Zadanie SEO:

1. SITEMAP
Dodaj next-sitemap:
- npm i next-sitemap
- Utwórz next-sitemap.config.js z:
  siteUrl: 'https://regulskibehawiorysta.pl'
  generateRobotsTxt: true
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }, { userAgent: '*', disallow: ['/api/'] }]
  }
  exclude: ['/api/*']
- Dodaj postbuild: "next-sitemap" w package.json
- Sprawdź że /book NIE jest excludowane (ma być indeksowane)

2. ROBOTS.TXT
Obecnie /book jest disallow. Zmień na allow — to jest strona sprzedażowa, ma być w Google.
Zostaw disallow tylko dla: /api/*, /_next/*, widoczne endpointy administracyjne jeśli są.

3. TITLE TAGS — DIAKRYTYKI
Przejdź każdą stronę (app/page.tsx, app/psy/page.tsx, app/koty/page.tsx, etc.) i ustaw metadata.title z polskimi znakami:
- / : "Behawiorysta psów i kotów online | Regulski COAPE"
- /psy: "Pomoc behawioralna dla psów – konsultacja online | Regulski"
- /koty: "Pomoc behawioralna dla kotów – konsultacja online | Regulski"
- /o-mnie: "Krzysztof Regulski – behawiorysta COAPE psów i kotów"
- /faq: "Najczęstsze pytania o konsultację behawioralną | Regulski"
- /kontakt: "Kontakt i rezerwacja konsultacji | Regulski"
- /niezbednik: "Niezbędnik – materiały dla opiekunów psów i kotów | Regulski"
- /behawiorysta-online-polska: "Behawiorysta online dla całej Polski | Regulski COAPE"
- /book: "Rezerwacja Kwadransa z behawiorystą | Regulski"
- /blog: "Blog o zachowaniu psów i kotów | Regulski"
- /regulamin: "Regulamin | Regulski"
- /polityka-prywatnosci: "Polityka prywatności | Regulski"

Dla każdego blog-posta zachowaj tytuł wpisu + " | Blog Regulski".

4. META DESCRIPTIONS (150–160 znaków)
Przykład dla /:
"Spokojna pomoc behawioralna online dla opiekunów psów i kotów. Kwadrans z behawiorystą za 69 zł – BLIK, bez kamery, konkretny pierwszy krok."

Dla /psy:
"Konsultacja behawioralna online dla opiekunów psów. Spacery, reaktywność, rozłąka, pobudzenie. Kwadrans z behawiorystą COAPE – 69 zł, bez kamery."

Dla /koty:
"Pomoc behawioralna online dla opiekunów kotów. Kuweta, wycofanie, napięcie między kotami, stres po zmianach. Kwadrans z behawiorystą – 69 zł."

Napisz analogiczne, naturalne, z frazą kluczową na początku, dla wszystkich pozostałych podstron.

5. OG IMAGES
Użyj @vercel/og do dynamicznego generowania OG images (1200×630).
Utwórz app/opengraph-image.tsx (dla home) i app/[route]/opengraph-image.tsx dla podstron.
Template:
- tło: #faf8f4 (jasny motyw strony)
- duży serif tytuł (Cormorant Garamond) — title strony
- mały sans (DM Sans) — podtytuł + "regulskibehawiorysta.pl"
- amber akcent (#c07d3a) jako kreska pod tytułem
Sprawdź w https://www.opengraph.xyz/ po deployu.

6. CANONICAL
Dodaj metadata.alternates.canonical dla każdej strony: `https://regulskibehawiorysta.pl${pathname}`.

7. JĘZYK I LOCALE
W root layout upewnij się że <html lang="pl"> i metadata ma openGraph.locale: 'pl_PL'.

Weryfikacja:
- npm run build — brak błędów
- npm run build + serve: wejdź na /sitemap.xml i /robots.txt — powinny być dostępne
- Każda podstrona ma unikalny <title> i <meta name="description">
- View source: widać JSON-LD i OG tagi

git commit: "seo: sitemap, robots, polish titles, descriptions, OG images"
```

---

## PROMPT 3 · Schema.org

**Cel:** rich snippets w Google (gwiazdki, FAQ akordeony, ceny w wynikach). 1–2h.

```
Dodaj JSON-LD schema.org do strony regulskibehawiorysta.pl. Next.js App Router.

1. ORGANIZATION + PERSON (na każdej stronie, w layout.tsx)
W root layout dodaj w <head> lub przez Next Script:

{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://regulskibehawiorysta.pl/#krzysztof",
      "name": "Krzysztof Regulski",
      "jobTitle": "Behawiorysta COAPE, trener zwierząt towarzyszących, technik weterynarii",
      "email": "kontakt@regulskibehawiorysta.pl",
      "url": "https://regulskibehawiorysta.pl/o-mnie",
      "sameAs": [
        "https://behawioryscicoape.pl/behawiorysta/Regulski",
        "https://www.instagram.com/coapebehawiorysta/"
      ]
    },
    {
      "@type": "ProfessionalService",
      "@id": "https://regulskibehawiorysta.pl/#business",
      "name": "Regulski — Behawiorysta psów i kotów online",
      "url": "https://regulskibehawiorysta.pl",
      "email": "kontakt@regulskibehawiorysta.pl",
      "areaServed": { "@type": "Country", "name": "Polska" },
      "priceRange": "69-350 PLN",
      "founder": { "@id": "https://regulskibehawiorysta.pl/#krzysztof" }
    }
  ]
}

2. SERVICE (na /psy, /koty, /behawiorysta-online-polska)
Dla każdej z usług dodaj w <head> strony:

{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Konsultacja behawioralna online",
  "provider": { "@id": "https://regulskibehawiorysta.pl/#krzysztof" },
  "areaServed": "Polska",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Konsultacje behawioralne",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Kwadrans z behawiorystą",
        "price": "69",
        "priceCurrency": "PLN",
        "description": "15 minut rozmowy audio bez kamery"
      },
      {
        "@type": "Offer",
        "name": "Pełna konsultacja behawioralna online",
        "price": "350",
        "priceCurrency": "PLN",
        "description": "60 minut konsultacji online"
      }
    ]
  }
}

3. FAQPAGE (na /faq, /psy, /koty, /kontakt)
Znajdź w każdym z tych plików sekcje z pytaniami i odpowiedziami (obecne w JSX).
Wygeneruj odpowiadający JSON-LD typu FAQPage, np:

{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Czym jest Kwadrans z behawiorystą?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "To 15 minut rozmowy audio bez kamery..."
      }
    },
    // ... każde pytanie z sekcji FAQ
  ]
}

Waz*ne: treść FAQ w JSON-LD MUSI być identyczna z tym co widzi user na stronie (Google penalizuje niespójność).

4. BREADCRUMBLIST (na podstronach innych niż /)
Dla np. /bezplatne-materialy/pies-reaktywnosc-5-krokow:

{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://regulskibehawiorysta.pl" },
    { "@type": "ListItem", "position": 2, "name": "Bezpłatne materiały", "item": "https://regulskibehawiorysta.pl/niezbednik" },
    { "@type": "ListItem", "position": 3, "name": "5 kroków dla reaktywnego psa" }
  ]
}

5. ARTICLE (na wpisach bloga)
Dla każdego /blog/[slug]:

{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[tytuł]",
  "author": { "@id": "https://regulskibehawiorysta.pl/#krzysztof" },
  "datePublished": "[data z matter]",
  "image": "[og image]",
  "publisher": { "@id": "https://regulskibehawiorysta.pl/#business" }
}

6. STRUKTURA
Utwórz komponent <Schema data={...} /> w components/schema.tsx który renderuje <script type="application/ld+json">.
Używaj go w każdej stronie.

Weryfikacja:
- npm run build
- Otwórz stronę, view source, sprawdź że JSON-LD jest w HTML
- Wklej URL do https://search.google.com/test/rich-results — powinny przejść bez błędów
- Dla /faq powinny wyjść "FAQ rich results"
- Dla /o-mnie powinien wyjść Person

git commit: "seo: add schema.org JSON-LD (Person, Service, FAQPage, Article, Breadcrumb)"
```

---

## PROMPT 4 · Trust signals

**Cel:** klient widzi COAPE, Instagram, realne social proof. 1h.

```
Zadanie: podnieść trust na regulskibehawiorysta.pl. Next.js.

1. COAPE PROFIL — GLOBALNIE
Obecnie link do https://behawioryscicoape.pl/behawiorysta/Regulski jest tylko w /regulamin.
Dodaj go do globalnej stopki (components/footer.tsx lub gdziekolwiek jest footer):
W sekcji "Zaufanie" lub "O Regulskim" dodaj:
<a href="https://behawioryscicoape.pl/behawiorysta/Regulski" target="_blank" rel="noopener">
  Zweryfikuj kwalifikacje COAPE →
</a>

Dodaj też w /o-mnie w sekcji "Kwalifikacje i afiliacje" jako zewnętrzny link przy "Behawiorysta COAPE":
<span>Behawiorysta COAPE</span> <a href="..." target="_blank">zweryfikuj profil →</a>

2. INSTAGRAM — W NAVIE I STOPCE
Dodaj link do https://www.instagram.com/coapebehawiorysta/ w:
- Globalnym footer (sekcja "Kontakt" albo nowa "Społeczność")
- Navie desktop — jako mała ikonka IG obok przycisku "Kwadrans"
  (użyj lucide-react Instagram icon, size 18, color var(--ink-mid))
Przy najechaniu kolor zmieni się na var(--amber).

3. STOPKA — JEDNA, GLOBALNA
Zauważyłem że footer w /psy, /koty ma wewnętrzną nawigację sekcji (np. #jak-pomagam),
a footer na / i /faq ma linki do innych stron (Pies, Kot, Kontakt).
To jest rozjazd. Ujednolić: wszędzie ten sam globalny footer z:
- Regulski. (logo + krótki opis)
- Nawigacja: Pies, Kot, O mnie, FAQ, Blog, Kontakt, Niezbędnik
- Start: Kwadrans z behawiorystą, Pełna konsultacja
- Kontakt: email kontakt@regulskibehawiorysta.pl, Instagram, COAPE profil
- Dół: © 2026 Krzysztof Regulski • Polityka prywatności • Regulamin

4. TESTIMONIALE — PLACEHOLDER POD PRAWDZIWE
Obecne testimoniale są anonimowe ("Opiekunka psa reaktywnego"). To zostaje,
ALE struktura danych powinna pozwolić na szybką podmianę gdy klient da zgodę.

Utwórz data/testimonials.json z formatem:
[
  {
    "id": "maria-border-collie",
    "quote": "Po rozmowie wiedziałam, co zrobić od razu...",
    "author": "Opiekunka psa reaktywnego",
    "authorFull": null,  // do uzupełnienia po zgodzie: "Maria K., Warszawa"
    "dog": null,         // do uzupełnienia: "Bailey, border collie, 3 lata"
    "photo": null,       // do uzupełnienia: "/testimonials/bailey.jpg"
    "consent": false,
    "category": "reaktywnosc-pies",
    "service": "kwadrans"
  }
]

Komponent <Testimonial> ma korzystać z authorFull || author i pokazywać dog + photo jeśli są.

5. "PUBLICZNY PROFIL EKSPERCKI" W /o-mnie
W /o-mnie jest bullet "Publiczny profil ekspercki" bez linku.
Przypisz mu link do COAPE profilu.

Weryfikacja:
- Otwórz stronę, przewiń na sam dół — COAPE link i Instagram są widoczne
- W navie desktop po prawej widać ikonkę IG
- /psy i /koty mają ten sam footer co /

git commit: "trust: global footer unified, COAPE + Instagram links everywhere"
```

---

## PROMPT 5 · Formularz kontaktowy — backend + RODO

**Cel:** formularz realnie wysyła email, ma zgodę RODO, spam protection. 1–2h.

```
Formularz na /kontakt obecnie tylko ustawia setSent(true), nie wysyła maili.
Naprawić.

1. RESEND
- npm i resend
- Utwórz konto na resend.com (free: 3000 maili/mies, 100/dzień)
- Wygeneruj API key, dodaj do .env.local jako RESEND_API_KEY
- Zweryfikuj domenę regulskibehawiorysta.pl w Resend (SPF, DKIM, DMARC — Resend generuje DNS do wklejenia u hostingodawcy)

2. API ROUTE
Utwórz app/api/contact/route.ts:

import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, species, topic, message, consent, honeypot } = body;
    
    // Honeypot antispam
    if (honeypot) return NextResponse.json({ ok: true }); // cichy success dla bota
    
    // Walidacja
    if (!name || !email || !message || !consent) {
      return NextResponse.json({ error: 'Brakuje pól' }, { status: 400 });
    }
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json({ error: 'Wiadomość za krótka lub za długa' }, { status: 400 });
    }
    
    // Mail do Krzysztofa
    await resend.emails.send({
      from: 'Regulski <kontakt@regulskibehawiorysta.pl>',
      to: 'kontakt@regulskibehawiorysta.pl',
      replyTo: email,
      subject: `[${species}] ${topic} — ${name}`,
      text: `Gatunek: ${species}\nTemat: ${topic}\nImię: ${name}\nEmail: ${email}\n\nWiadomość:\n${message}`,
    });
    
    // Auto-reply do klienta
    await resend.emails.send({
      from: 'Regulski <kontakt@regulskibehawiorysta.pl>',
      to: email,
      subject: 'Dostałem Twoją wiadomość — Regulski',
      text: `Cześć ${name},\n\nodebrałem Twoją wiadomość i odpowiem w ciągu 1–2 dni roboczych.\n\nJeśli sytuacja wymaga szybszego wejścia, możesz umówić Kwadrans z behawiorystą (69 zł, audio, bez kamery):\nhttps://regulskibehawiorysta.pl/book?service=szybka-konsultacja-15-min\n\nDo usłyszenia,\nKrzysztof Regulski\nBehawiorysta COAPE`,
    });
    
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

3. FRONTEND — FORMULARZ
Znajdź komponent formularza na /kontakt. Zamień onSubmit:

async function onSubmit(e) {
  e.preventDefault();
  setStatus('sending');
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (res.ok) setStatus('sent');
  else setStatus('error');
}

Stany: 'idle' | 'sending' | 'sent' | 'error'.
'sending': przycisk disabled, "Wysyłam…"
'sent': zielony komunikat "Wysłane. Odpowiem w 1–2 dni. Sprawdź skrzynkę — masz też kopię."
'error': czerwony "Coś poszło nie tak. Napisz na kontakt@regulskibehawiorysta.pl"

4. HONEYPOT
Dodaj ukryte pole przed submit:
<input type="text" name="honeypot" tabIndex={-1} autoComplete="off" 
  style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
Boty je wypełnią, ludzie nie. API cicho odrzuca.

5. RODO CHECKBOX — WYMAGANY
Przed przyciskiem Submit:
<label style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--ink-mid)' }}>
  <input type="checkbox" name="consent" required
    checked={form.consent} onChange={handleChange} />
  <span>
    Zapoznałem/am się z <a href="/polityka-prywatnosci" target="_blank">polityką prywatności</a>
    i wyrażam zgodę na przetwarzanie moich danych w celu odpowiedzi na zapytanie.
  </span>
</label>

Submit disabled jeśli !form.consent.

6. RATE LIMITING (opcjonalne ale polecane)
W API route dodaj prosty rate limit po IP, np. 3 zgłoszenia/h:
- Upstash Redis free tier, albo
- In-memory Map (nie idealnie ale lepsze niż nic dla single instance)

Weryfikacja:
- Wypełnij formularz, sprawdź skrzynkę kontakt@ — przychodzi mail
- Sprawdź skrzynkę nadawcy — przychodzi auto-reply
- Wypełnij honeypot przez dev tools — API zwraca 200 ale mail NIE przychodzi
- Bez zgody RODO — przycisk disabled

git commit: "feat: working contact form with Resend, RODO consent, honeypot"
```

---

## PROMPT 6 · [MANUALNE — nie dla Codex] Zgłoszenia i Analytics

**Cel:** Google wie że strona istnieje. Ty wiesz kto na nią wchodzi. 1h ręcznej roboty.

### 6.1 Google Search Console

1. Idź na https://search.google.com/search-console
2. Dodaj "Domain property" → wpisz `regulskibehawiorysta.pl` (bez https://).
3. Google da ci rekord DNS TXT do dodania u hostingodawcy (OVH/home/mydevil/cokolwiek masz).
4. Wklej TXT record, poczekaj 5–30 min, wróć, kliknij "Verify".
5. Po weryfikacji: **Sitemaps** → dodaj `https://regulskibehawiorysta.pl/sitemap.xml`.
6. Sprawdź za 48h czy jest w indeksie: `site:regulskibehawiorysta.pl` w Google.

### 6.2 Bing Webmaster Tools

1. Idź na https://www.bing.com/webmasters
2. "Add a site" → `https://regulskibehawiorysta.pl`
3. Bing pozwala zaimportować z GSC — najszybciej. Albo własna weryfikacja (meta tag / file / DNS).
4. Po weryfikacji: Sitemaps → `https://regulskibehawiorysta.pl/sitemap.xml`.

### 6.3 Analytics — Plausible (rekomendowane) LUB GA4

**Plausible** (9 USD/mies, EU, RODO, bez cookie bannera, mniej ładowania):
1. plausible.io → 30-dniowy free trial.
2. Add site → `regulskibehawiorysta.pl`.
3. Dostajesz 1 linijkę `<script defer data-domain="..." src="...">`.
4. Wklej w `app/layout.tsx` przed `</head>`.

**LUB GA4** (darmowe, ale trzeba cookie banner):
1. analytics.google.com → Create property.
2. Data stream → Web → `https://regulskibehawiorysta.pl`.
3. Measurement ID (G-XXXXX). Wklej do `app/layout.tsx` standardowym GA snippetem.
4. Dodaj cookie banner (np. `react-cookie-consent`) — wymagane RODO.

### 6.4 Meta Pixel (zrobić przed reklamami)

1. business.facebook.com → Events Manager → Connect data source → Web.
2. Pixel ID. Wklej standardowy snippet do `app/layout.tsx`.
3. Standard events: `ViewContent` na stronach usług, `Lead` po submit formularza kontaktowego, `InitiateCheckout` po wejściu na /book.

### 6.5 Weryfikacja

- Po 48h: `site:regulskibehawiorysta.pl` w Google → min 5–10 URLi.
- W GSC: **Coverage** pokazuje zaindeksowane strony.
- W Plausible/GA: widzisz ruch real-time po wejściu na stronę.

---

## PROMPT 7 · Niezbędnik — na końcu

**Cel:** hub materiałów przestaje być pustką, ale bez przesady. 1h.

```
Zadanie: sekcja /niezbednik ma dziś treść "sekcja jest rozwijana etapami" — to publiczny placeholder.
Zastąpić prawdziwymi linkami.

1. PDF-Y
W sekcji "PDF-y" podmień ogólny opis na listę 3 prawdziwych lead magnetów:

- 5 pierwszych kroków, gdy pies szczeka na spacerach
  → link do /bezplatne-materialy/pies-reaktywnosc-5-krokow
  krótki opis: "Pierwszy tydzień obserwacji i decyzji dla reaktywnego psa."
  
- Checklista kuweta — krok po kroku
  → link do /bezplatne-materialy/kot-kuweta-checklista
  krótki opis: "Zdrowie, kuweta, środowisko, zmiany w domu. Uporządkuj temat zanim pogłębi się."
  
- Jak przygotować się do konsultacji behawioralnej
  → link do /bezplatne-materialy/przygotowanie-do-konsultacji-online
  krótki opis: "Co warto mieć przed Kwadransem albo pełną konsultacją. Czego NIE musisz przygotowywać."

Każdy jako card z ikoną (lucide-react: FileDown / BookOpen / CheckSquare), tytułem, opisem, CTA.

2. POLECANE KSIĄŻKI
Lista 4–6 pozycji które Krzysztof realnie poleca. Przykłady (ZWERYFIKUJ z klientem przed dodaniem):
- "Nauka psa bez przemocy" — Pat Miller
- "Cat Sense" — John Bradshaw
- "The Other End of the Leash" — Patricia McConnell
- (do uzupełnienia)

Każda pozycja: tytuł, autor, krótki opis DLACZEGO jest wartościowa (2–3 zdania w tonie marki).
Link: do empik.com, lubimyczytac.pl LUB affiliate (jeśli klient ma Amazon/Empik partnera — do rozważenia później).

3. PRZYBORY
Lista 3–5 prostych rzeczy typu:
- Szelki H / szelki krzyżowe (konkretny model, np. "Julius K9 IDC")
- Długa linka treningowa (5–10m)
- Drapak pionowy o wysokości ≥ 90 cm (konkretny model)
- Mata węchowa
- Feromony Feliway / Adaptil

Każda z krótkim opisem "kiedy ma sens" (nie sprzedażowym).

4. SEKCJA "DALEJ"
Zachowaj obecną końcówkę z linkami do Kwadransa i Pełnej konsultacji. 
Dodaj subtelne CTA: "Jeśli któryś z materiałów okazał się niewystarczający, Kwadrans z behawiorystą porządkuje temat w 15 minut."

5. USUŃ
Teksty typu "To nie jest pełny sklep", "Sekcja jest rozwijana etapami", "Początek uporządkowanej listy" — są teraz nieaktualne, bo sekcja MA treść.

Weryfikacja:
- /niezbednik pokazuje 3 konkretne PDF-y z linkami
- Książki mają tytuł + autor + opis + link zewnętrzny
- Każda sekcja ma CTA dół-strony

git commit: "feat: fill niezbednik with real content (PDFs, books, tools)"
```

---

## Kolejność wykonania

**Dzień 1 (wieczór, 2h):** Prompt 1 + Prompt 6 (GSC + sitemap manualnie po Prompt 2).  
**Dzień 2 (wieczór, 3h):** Prompt 2 + 3.  
**Dzień 3 (1.5h):** Prompt 4.  
**Dzień 4 (2h):** Prompt 5.  
**Dzień 5–7:** Zgłoszenia do GSC robią swoje, czekamy na pierwsze indeksy. Content patrz niżej.  
**Dzień 8+ (1h):** Prompt 7 (Niezbędnik) po ustabilizowaniu reszty.  

---

## Co musisz sam dać Codex-owi w kontekście

Przed pierwszym promptem: upewnij się, że repo jest zcommitowane (łatwy rollback jak coś pójdzie nie tak) i że Codex CLI ma dostęp do całego projektu (nie tylko jednego pliku).

Po każdym promcie:
1. `git diff` — zobacz co zmienił
2. `npm run build` — sprawdź że się buduje
3. Ręcznie wejdź na 2–3 podstrony — zobacz czy wygląda jak powinno
4. Deploy (Vercel auto-deploy jeśli podpięte, albo `git push`)

---

## Co nie wymaga Codex-a, a wymaga ciebie

- Zarejestruj email **kontakt@regulskibehawiorysta.pl** u hostingodawcy domeny (forward na gmail OK) — Codex zmieni teksty, ale sam email musisz utworzyć.
- Dodaj rekordy **SPF / DKIM / DMARC** dla Resend (instrukcja w panelu Resend po dodaniu domeny).
- Zrób / znajdź **2–3 dobre zdjęcia Krzysztofa** — bez tego wizualnie strona zostaje w placeholder mode (obecnie są generyczne obrazki `/branding/omnie-hero.webp` itd.). Zdjęcia wstawisz przez podmianę plików w `/public/branding/`.
- **Nagraj 60s wideo** jak możesz — telefon w poziomie, statyw lub stół, naturalne światło. Cel: umieścić na home jako trust signal.

---

## Pierwszy klient — kiedy

Realistyczna oś czasu po wykonaniu promptów 1–6:

- **Dzień 3–5:** GSC zaczyna widzieć strony, pierwsze wejścia organic (≤5/dzień).
- **Dzień 7–10:** blog post albo lead magnet łapie pierwsze kliknięcia z Google.
- **Dzień 10–14:** jeśli odpalisz Meta Ads (50 zł/dzień × 5 dni = 250 zł) na lead magnet → powinny wejść 30–80 leadów, 1–3 konwersje na Kwadrans.

**Warunek brzegowy:** BLIK na telefon, potwierdzenie do 15 min. Jeśli klient ma zapłacić w nocy w sobotę i dostanie potwierdzenie w poniedziałek — strata. Ustal z klientem, że albo obsługuje BLIK w oknie 9–21 (i tak komunikuje), albo skraca jeszcze bardziej (5 min, ale wymaga że będzie przy telefonie).

Alternatywa do rozważenia w przyszłości jak biznes ruszy: **Tpay / Przelewy24** — 1,6–2,2% prowizji ale BLIK zautomatyzowany, klient płaci o 23:00, system automatycznie blokuje slot, wysyła link Google Meet. Ale to osobny projekt, nie na teraz.
