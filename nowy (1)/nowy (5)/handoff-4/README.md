# Paczka #4 — Mikro-animacje + Scroll Reveal

**Cel:** Dodać subtelne animacje wejścia sekcji, hover effects na kartach, loading states i page transitions. Strona ma się wydawać "żywa", ale bez przesady.

## Filozofia

- **Subtelność > efekciarstwo.** Animacje 200-600ms, easing natural, brak bouncing-shaking.
- **Tylko wtedy gdy coś znaczy.** Hover na karcie = afford, scroll reveal = hierarchia, loading = feedback. Nie animuj rzeczy bez powodu.
- **`prefers-reduced-motion`** szanowany w 100% — użytkownicy z migreną widzą natychmiastową wersję.

## Stack

**Framer Motion** (`motion`) — najlepsza biblioteka animacji React. Obsługuje:
- Scroll-based animations (`whileInView`)
- Variants z stagger
- Layout animations (FLIP)
- Gesture animations (drag, hover, tap)
- Auto `prefers-reduced-motion`

```bash
npm i framer-motion
```

## Co dostajesz

```
handoff-4/
├── README.md
├── PROMPT-FOR-CLAUDE-CLI.md
├── components/
│   ├── Reveal.tsx              ← scroll reveal wrapper
│   ├── StaggerList.tsx         ← lista z opóźnieniem dziecka
│   ├── HoverCard.tsx           ← hover z tilt/lift
│   ├── AnimatedNumber.tsx      ← liczenie od 0 do X
│   ├── PageTransition.tsx      ← fade między stronami
│   ├── LoadingSpinner.tsx      ← spinner dla rezerwacji
│   └── ScrollProgress.tsx      ← pasek progress przy scrollu
└── lib/
    └── motionVariants.ts       ← reużywalne variants
```

## Zasady stosowania

| Element | Animacja | Czas |
|---|---|---|
| Hero — heading | Fade up + delay 0.1s | 600ms |
| Hero — CTA | Fade up + delay 0.3s | 600ms |
| Sekcje (scroll) | Fade up gdy 30% widoczne | 500ms |
| Karty oferty | Stagger 0.1s każda | 400ms each |
| Liczby/statystyki | Liczenie 0→N | 1500ms |
| Karta hover | Lift -4px + shadow | 250ms |
| Przyciski hover | Scale 1.02 | 150ms |
| Page transition | Fade 200ms | - |
| Loading | Spinner 1s loop | infinite |

## Wdrożenie

### 1. Globalny respekt dla reduced-motion

W `src/app/layout.tsx` dodaj na początku body:

```tsx
import { LazyMotion, domAnimation } from 'framer-motion';

<LazyMotion features={domAnimation}>
  {children}
</LazyMotion>
```

`LazyMotion` ładuje features lazy → mniejszy bundle (-30KB).

### 2. Owijanie sekcji

Każdą sekcję na stronie owiń `<Reveal>`:

```tsx
import { Reveal } from '@/components/Reveal';

<Reveal>
  <section>
    <h2>Co mówią klienci</h2>
    {/* ... */}
  </section>
</Reveal>
```

### 3. Karty oferty z stagger

```tsx
import { StaggerList, StaggerItem } from '@/components/StaggerList';

<StaggerList className="grid grid-cols-3 gap-6">
  <StaggerItem><OfferCard /></StaggerItem>
  <StaggerItem><OfferCard /></StaggerItem>
  <StaggerItem><OfferCard /></StaggerItem>
</StaggerList>
```

### 4. Statystyki

```tsx
import { AnimatedNumber } from '@/components/AnimatedNumber';

<AnimatedNumber value={500} suffix="+" />
<AnimatedNumber value={4.9} decimals={1} />
```

### 5. Hover na kartach

```tsx
import { HoverCard } from '@/components/HoverCard';

<HoverCard variant="lift">
  <article>...</article>
</HoverCard>
```

## Anti-patterns (czego NIE robić)

- ❌ Bouncing/spring na wszystkim — wygląda dziecinnie
- ❌ Long delays (>800ms) — frustrujące przy scroll
- ❌ Confetti / falling leaves / particles — slop
- ❌ Auto-rotating elementy — odwracają uwagę od czytania
- ❌ Parallax tła — zawsze powodują motion sickness
- ❌ Animowane gradient tła — mocno spowalnia stronę
