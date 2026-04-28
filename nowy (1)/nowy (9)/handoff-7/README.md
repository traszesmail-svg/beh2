# Paczka #7 — Lead Magnet (darmowy poradnik PDF)

**Cel:** Pozyskiwanie maili przez ofertę darmowego poradnika PDF. Popup z exit-intent + sticky banner + sekcja na stronie. Po podaniu maila — automatyczna wysyłka PDF + zapisanie kontaktu.

## Co dostajesz

```
handoff-7/
├── README.md
├── PROMPT-FOR-CLAUDE-CLI.md
├── components/
│   ├── LeadMagnetPopup.tsx        ← exit-intent popup
│   ├── LeadMagnetBanner.tsx       ← sticky bottom banner
│   ├── LeadMagnetSection.tsx      ← inline sekcja na stronie
│   └── LeadMagnetForm.tsx         ← shared form logic
├── lib/
│   ├── lead-magnet.config.ts      ← treści, warianty
│   └── exit-intent.ts             ← hook detekcji wyjścia
├── app/
│   └── api/
│       └── lead-magnet/
│           └── route.ts            ← endpoint API
└── content/
    └── poradnik-template.md       ← struktura PDF do wypełnienia
```

## Strategia — 3 magnesy do wyboru

### 🐕 Wariant A — "Pies sam w domu — 7 kroków"
**Target:** opiekunowie psów z lękiem separacyjnym
**Format:** 14-stronicowy PDF
**Hook:** "Nie zostawiaj psa samego, zanim przeczytasz tych 7 kroków"

### 🐈 Wariant B — "Pierwszy tydzień z kotem — checklist"
**Target:** świeży opiekunowie kotów (adopcja, kupno)
**Format:** 8-stronicowy PDF + checklist do druku
**Hook:** "Co musisz przygotować zanim kot przekroczy próg domu"

### 🐾 Wariant C — "Lista 30 zachowań do obserwacji"
**Target:** wszyscy opiekunowie (najszerszy)
**Format:** 6-stronicowy PDF
**Hook:** "30 sygnałów które powinieneś obserwować u psa lub kota"

**Rekomendacja:** zacznij od **C** (najszerszy target = najwięcej zapisów), potem dodaj A i B i pozwól użytkownikowi wybrać podczas zapisu.

## Mechanika — 3 punkty kontaktu

### 1. Sekcja inline (na stronach pillar)
- Na `/`, `/psy`, `/koty`, blog posts
- Card z obrazkiem PDF, formularz email + checkbox zgody RODO
- CTA: "Wyślij mi PDF"

### 2. Exit-intent popup
- Pojawia się gdy mysz idzie do paska adresu (desktop)
- Lub po 30s scroll + 60% strony (fallback mobile)
- Tylko 1× na sesję (localStorage)
- Można zamknąć — szanuj wybór

### 3. Sticky bottom banner
- Pojawia się po 15s na stronie
- Mały, niewidoczny dla SEO ranking
- Można zamknąć — wraca po 7 dniach
- Tylko desktop + mobile bottom-bar

## Flow po zapisie

1. User wprowadza email → submit
2. API zapisuje do `/api/lead-magnet`:
   - Mailerlite/Brevo (jeśli skonfigurowane)
   - Lub plik JSON / Postgres
   - Trigger email z PDF jako załącznik (lub link do download)
3. Confirmation toast: "✅ Sprawdź skrzynkę — wysłałem Ci PDF"
4. PDF link expires po 7 dniach (anti-leech)

## Zgody RODO

Pojedynczy checkbox (rekomendowane) lub split:
- ☑️ Wyrażam zgodę na przetwarzanie email-a w celu wysłania mi PDF
- ☐ (opcjonalnie) Chcę otrzymywać newsletter z poradami behawioralnymi

Pierwsza zgoda jest **wymagana**, druga — opt-in. Bez tego nie wysyłaj PDF.

## Po implementacji — co potrzebujesz

⚠️ **PDF do dostarczenia:** sam plik PDF musi powstać. W folderze `content/poradnik-template.md` jest szkic struktury — uzupełnij treścią od Krzysztofa lub generuj z Notion/Pages.

⚠️ **Provider email:** Mailerlite (free do 1000 subs), Brevo (free 300/dzień), Resend (3000/mies free). Domyślnie kod idzie pod **Resend** + zapis do KV/Postgres.

⚠️ **Hosting PDF:** wgraj do `/public/poradniki/` lub do Vercel Blob / R2. Link generuj z signed URL żeby nie udostępniać publicznie.
