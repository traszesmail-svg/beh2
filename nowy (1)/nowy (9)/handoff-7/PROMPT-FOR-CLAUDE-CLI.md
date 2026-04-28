# Prompt do Claude CLI — Paczka #7 (Lead Magnet)

## Założenie
Paczki #1-#6 wdrożone. Tailwind, lucide-react, shadcn-style komponenty istnieją. Wybrałeś dostawcę email (Resend / Mailerlite / Brevo).

---

```
Wdróż paczkę "Regulski Lead Magnet" z folderu ./handoff-7/.

Wykonaj kolejno:

1. Przeczytaj ./handoff-7/README.md i ./handoff-7/lib/lead-magnet.config.ts

2. Skopiuj pliki:
   - ./handoff-7/lib/lead-magnet.config.ts        →  src/lib/
   - ./handoff-7/lib/exit-intent.ts               →  src/lib/
   - ./handoff-7/components/LeadMagnetForm.tsx    →  src/components/
   - ./handoff-7/components/LeadMagnetPopup.tsx   →  src/components/
   - ./handoff-7/components/LeadMagnetBanner.tsx  →  src/components/
   - ./handoff-7/components/LeadMagnetSection.tsx →  src/components/
   - ./handoff-7/app/api/lead-magnet/route.ts     →  src/app/api/lead-magnet/route.ts

3. Stwórz folder /public/poradniki/ i wgraj tam:
   - 30-zachowan.pdf (główny lead magnet — szkic w ./handoff-7/content/poradnik-template.md)
   - cover-mix.png (miniaturka okładki)
   PRZED tym — generuj PDF z szkicu lub poproś Krzysztofa o gotowy plik.

4. Zainstaluj zależności (jeśli nie ma):
   npm install resend           # jeśli wybrałeś Resend
   # LUB
   # niczego — Mailerlite/Brevo używają fetch() natywnie

5. Dodaj zmienne środowiskowe w .env.local:
   ```
   # Wariant A — Resend
   RESEND_API_KEY=re_xxxxxxxxxxxx

   # Wariant B — Mailerlite
   # MAILERLITE_API_KEY=ml_xxxxxxx
   # MAILERLITE_GROUP_PDF=12345
   # MAILERLITE_GROUP_NEWSLETTER=12346

   NEXT_PUBLIC_SITE_URL=https://regulskibehawiorysta.pl
   ```

6. Edytuj src/app/api/lead-magnet/route.ts:
   - Odkomentuj implementację dostawcy email który wybrałeś
   - Wykomentuj resztę
   - Zaimportuj odpowiedni SDK na górze

7. W src/app/layout.tsx dodaj globalny popup (działa na wszystkich stronach):
   ```tsx
   import { LeadMagnetPopup } from '@/components/LeadMagnetPopup';
   import { headers } from 'next/headers';

   export default async function RootLayout({ children }) {
     const headersList = await headers();
     const pathname = headersList.get('x-pathname') || '/';

     return (
       <html lang="pl">
         <body>
           {children}
           <LeadMagnetPopup pathname={pathname} />
         </body>
       </html>
     );
   }
   ```

   ALTERNATYWNIE (prościej) — w client component:
   ```tsx
   'use client';
   import { usePathname } from 'next/navigation';
   const pathname = usePathname();
   <LeadMagnetPopup pathname={pathname} />
   ```

8. Wstaw <LeadMagnetSection> na 3 stronach:
   - src/app/page.tsx (homepage) — przed footer
   - src/app/psy/page.tsx — przed footer
   - src/app/koty/page.tsx — przed footer

   Przykład:
   ```tsx
   import { LeadMagnetSection } from '@/components/LeadMagnetSection';
   <LeadMagnetSection pathname="/psy" />
   ```

9. (Opcjonalnie) wstaw <LeadMagnetBanner> globalnie obok popup w layout — sticky bottom:
   ```tsx
   <LeadMagnetBanner pathname={pathname} />
   ```

10. Stwórz/edytuj /polityka-prywatnosci jeśli nie istnieje — wymóg RODO.

11. Zrób npm run build i napraw błędy. Test:
    - Otwórz / w przeglądarce
    - Poczekaj 30s + scroll do dołu — powinien pojawić się popup
    - Wyślij email testowy → sprawdź czy PDF dotarł
    - Po refresh popup nie powinien się pokazać przez 7 dni
    - Sprawdź banner po 15s
    - Sprawdź sekcję na home/psy/koty

12. Pokaż listę zmienionych plików
```

---

## Co potrzebujesz przygotować przed wdrożeniem

### 📄 PDF lead magneta
1. Otwórz `handoff-7/content/poradnik-template.md`
2. Skopiuj do Notion / Google Docs
3. Uzupełnij treścią od Krzysztofa
4. Wyeksportuj jako PDF
5. Wgraj do `/public/poradniki/30-zachowan.pdf`

### 🖼️ Cover image
- Rozmiar: 600×800 px (proporcje 3:4)
- Format: PNG lub JPG
- Może być prostą kompozycją: tytuł + accent color background
- Lub renderowanie pierwszej strony PDF jako obrazek

### 📧 Konto email
- **Resend** — zalecane jeśli chcesz pełną kontrolę. 3000 maili/mies free. https://resend.com
- **Mailerlite** — zalecane jeśli chcesz też newsletter. 1000 subów free. Builtin automation. https://mailerlite.com
- **Brevo** (dawniej Sendinblue) — 300 maili/dzień free. Polska firma operuje też EU.

### 🌐 Domena email
Skonfiguruj DNS:
- SPF, DKIM (Resend / Mailerlite dadzą gotowe rekordy)
- Bez tego maile mogą lecieć do spam
- TXT verification rekord

## Po deployu — co śledzić

### KPI
- **Conversion rate** — # subskrybentów / # unikalnych wizyt
- **Cel:** 2-5% (popup), 0.5-2% (banner), 1-3% (section)
- **Open rate** PDF emaila — cel 50%+ (lead magnety mają wysokie OR)
- **Click-through** do oferty z newslettera

### A/B test (po 100+ zapisach)
- Hook copy (3 warianty)
- Color CTA buttona (zielony vs ciemny)
- Trigger popup (exit-intent vs scroll 70% vs time-based)
