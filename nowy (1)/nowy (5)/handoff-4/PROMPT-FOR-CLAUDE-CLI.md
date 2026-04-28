# Prompt do Claude CLI — Paczka #4 (Mikro-animacje)

## Założenie
Paczki #1-3 są wdrożone. Teraz dodajemy Framer Motion + scroll reveal + hover effects.

---

```
Wdróż paczkę "Regulski Animacje" z folderu ./handoff-4/.

Wykonaj kolejno:

1. Zainstaluj framer-motion:
   npm i framer-motion

2. Skopiuj pliki:
   - ./handoff-4/components/*.tsx  →  src/components/
   - ./handoff-4/lib/motionVariants.ts  →  src/lib/

3. Dodaj LazyMotion globalnie w src/app/layout.tsx:
   ```
   import { LazyMotion, domAnimation } from 'framer-motion';

   export default function RootLayout({ children }) {
     return (
       <html lang="pl">
         <body>
           <LazyMotion features={domAnimation}>
             {children}
           </LazyMotion>
         </body>
       </html>
     );
   }
   ```

4. Owiń główne sekcje strony głównej w <Reveal>:
   - Sekcja "Co możesz zyskać"
   - Sekcja "Jak to działa" (4 kroki)
   - Sekcja Oferta (3 karty)
   - Sekcja FAQ
   - Sekcja Opinie (z paczki #3)

5. Zamień karty oferty na <StaggerList> + <StaggerItem>:
   ```
   <StaggerList className="grid grid-cols-1 lg:grid-cols-3 gap-6">
     <StaggerItem><OfferCard /></StaggerItem>
     <StaggerItem><OfferCard /></StaggerItem>
     <StaggerItem><OfferCard /></StaggerItem>
   </StaggerList>
   ```
   Tak samo dla 4 kroków "Jak to działa".

6. Dodaj <HoverCard variant="lift"> wokół wszystkich klikalnych kart (oferta, opinie, blog posts).

7. Jeśli na stronie są statystyki (np. "500+ konsultacji", "4.9 średnia ocena") — zamień na <AnimatedNumber>.

8. Dodaj <ScrollProgress /> w layout.tsx (raz, na górze).

9. (Opcjonalnie) Dodaj <PageTransition> wokół {children} w layout.tsx — fade między stronami.

10. Sprawdź czy wszędzie respektowany jest prefers-reduced-motion:
    Framer Motion robi to automatycznie, ale upewnij się że nie ma własnych keyframe animacji bez @media (prefers-reduced-motion: reduce).

11. npm run build i napraw błędy TypeScript

12. Pokaż listę zmienionych stron + wycenę bundle size (powinno wzrosnąć ~25-35KB).
```

---

## TODO dla Krzysztofa po wdrożeniu

1. **Sprawdź na 3 urządzeniach:**
   - Desktop (Chrome, Firefox)
   - Mobile (iPhone Safari, Android Chrome)
   - Tablet
2. **Włącz "Reduce motion" w systemie** — animacje powinny wyłączyć się automatycznie
3. **Sprawdź performance:**
   - [PageSpeed Insights](https://pagespeed.web.dev/) → wynik >90
   - Lighthouse → CLS <0.1, INP <200ms
4. **Jeśli coś za szybkie/wolne:** edytuj `src/lib/motionVariants.ts` — zmień `duration` w EASING.

## Zalecane poprawki dla każdej strony

| Strona | Co dodać |
|---|---|
| `/` | Reveal na każdej sekcji + StaggerList na ofercie + AnimatedNumber na statystykach |
| `/cennik` | StaggerList na 3 wariantach |
| `/o-mnie` | Reveal na osi czasu (kwalifikacje) |
| `/blog` | StaggerList na liście postów + ScrollProgress w pojedynczym poście |
| `/faq` | StaggerList na pytaniach |
| `/book` | LoadingSpinner przy submitach |
