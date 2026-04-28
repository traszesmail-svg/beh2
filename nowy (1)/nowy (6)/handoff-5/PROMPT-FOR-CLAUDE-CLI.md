# Prompt do Claude CLI — Paczka #5 (Dark mode)

## Założenie
Paczki #1–#4 wdrożone. Tailwind, lucide-react i komponenty są już w repo.

---

```
Wdróż paczkę "Regulski Dark Mode" z folderu ./handoff-5/.

Wykonaj kolejno:

1. Przeczytaj ./handoff-5/README.md — szczególnie sekcje "Kluczowe decyzje" i "Co potrzebuje warianty dark"

2. Zainstaluj next-themes:
   npm install next-themes

3. Skopiuj pliki:
   - ./handoff-5/components/ThemeProvider.tsx   →  src/components/
   - ./handoff-5/components/ThemeScript.tsx     →  src/components/
   - ./handoff-5/components/ThemeToggle.tsx     →  src/components/
   - ./handoff-5/styles/theme-tokens.css        →  src/styles/

4. Zaimportuj theme-tokens.css w src/app/globals.css PRZED dyrektywami Tailwind:
   ```
   @import './styles/theme-tokens.css';
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. Rozszerz tailwind.config.ts:
   - Dodaj `darkMode: 'class'`
   - Zmień kolory z hex na CSS variables (zgodnie z ./handoff-5/tailwind.dark.config.ts)
   Konkretnie: bg, surface, surface-2, ink, muted, muted-2, accent (z .dark/.light/.fg), border, border-strong

6. Zmodyfikuj src/app/layout.tsx:
   ```
   import { ThemeProvider } from '@/components/ThemeProvider';
   import { ThemeScript } from '@/components/ThemeScript';

   export default function RootLayout({ children }) {
     return (
       <html lang="pl" suppressHydrationWarning>
         <head>
           <ThemeScript />
         </head>
         <body className="bg-bg text-ink">
           <ThemeProvider>
             {children}
           </ThemeProvider>
         </body>
       </html>
     );
   }
   ```

7. Wstaw <ThemeToggle /> w nawigacji (komponent Header/Nav) — między linkami a CTA:
   ```
   import { ThemeToggle } from '@/components/ThemeToggle';

   <nav>
     <Logo />
     <NavLinks />
     <ThemeToggle variant="icon" />   {/* lub "segmented" / "dropdown" */}
     <CTAButton />
   </nav>
   ```

8. KLUCZOWE — przeszukaj wszystkie komponenty z paczek #1-#4 i zamień hard-coded kolory na klasy Tailwind oparte na CSS vars:
   - bg-white          →  bg-surface
   - bg-neutral-50     →  bg-bg
   - bg-neutral-100    →  bg-surface-2
   - text-neutral-900  →  text-ink
   - text-neutral-600  →  text-muted
   - text-neutral-500  →  text-muted-2
   - border-neutral-200 →  border-border
   - bg-[#faf9f7]      →  bg-bg
   - bg-[#1c1a18]      →  bg-ink (UWAGA — odwraca w dark!) lub zostaw na sztywno

9. Dla obrazów Storyset (paczka #2) dodaj filtr w dark mode w HeroIllustration.tsx:
   ```
   <Image
     src={config.illustration}
     className="w-full h-auto dark:opacity-90 dark:contrast-110"
     ...
   />
   ```

10. Dla logo — jeśli jest czarne, dodaj wariant biały:
    ```
    <picture>
      <source srcSet="/logo-white.svg" media="(prefers-color-scheme: dark)" />
      <img src="/logo.svg" alt="Regulski" className="dark:invert" />
    </picture>
    ```

11. Zrób npm run build i napraw błędy. Uruchom dev server.

12. Test:
    - Przełącznik w nawigacji działa
    - Brak "flash" przy odświeżeniu strony
    - Wszystkie sekcje (hero, oferta, FAQ, opinie, footer) wyglądają OK w obu trybach
    - Kontrast tekstu OK (sprawdź devtools → Lighthouse a11y audit)
    - Po przełączeniu i refresh — preferencja zachowana

Pokaż listę zmienionych plików.
```

---

## Po wdrożeniu — co sprawdzić wizualnie

W każdym trybie przejdź przez wszystkie strony i sprawdź:

| Element | Light | Dark |
|---|---|---|
| TrustBar | jasne tło, ciemny tekst | ciemne tło, jasny tekst |
| Hero ilustracja | normalny kolor | lekko przyciemniona |
| Karty oferty (3) | białe na cream bg | ciemne na deep ink bg |
| Highlighted card (środkowy) | gradient zielony→biały | gradient ciemny zielony→ink |
| FAQ ikony | zielony accent | jasny zielony accent |
| Opinie / karuzela | białe karty | surface-2 karty |
| Gwiazdki (amber-400) | bez zmian | bez zmian |
| Google badge | logo Google takie samo | logo Google takie samo |
| ⚡ "Kwadrans na już" | accent-light bg | accent-light (1f3530) bg |
| Stopka | ciemna (zostaje ciemna) | ciemna (zostaje ciemna) |

Jeśli coś wygląda źle w dark — najpewniej hard-coded kolor który ominął search & replace. Wyszukaj `bg-white`, `text-black`, `#ffffff` po repo.
