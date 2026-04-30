# Implementation notes

## Priorytet

Nie robić redesignu całej zakładki Kontakt. To ma być precyzyjna poprawka: fotografia + zaufaniowy microcopy + responsywne ułożenie.

## Sugestia klas CSS

```css
.contact-visual-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 18px 48px rgba(88, 63, 32, 0.08);
}

.contact-photo-wrap {
  position: relative;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 26px;
}

.contact-photo {
  object-fit: cover;
}

.contact-photo-caption {
  padding: 18px;
}

.contact-photo-caption strong {
  display: block;
  color: var(--muted-strong);
}

.contact-photo-caption p {
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.7;
}

.contact-trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.contact-trust-chip {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  border-radius: 999px;
  padding: 0 11px;
  border: 1px solid rgba(47, 118, 103, 0.16);
  background: rgba(47, 118, 103, 0.07);
  color: var(--accent-2);
  font-size: 12px;
  font-weight: 700;
}
```

## Sugestia JSX

```tsx
<div className="contact-visual-card">
  <div className="contact-photo-wrap">
    <Image
      src="/images/contact/contact-consultation.webp"
      alt="Spokojna konsultacja behawioralna z opiekunem psa"
      fill
      sizes="(max-width: 680px) 100vw, 420px"
      className="contact-photo"
      priority={false}
    />
  </div>
  <div className="contact-photo-caption">
    <strong>Spokojna rozmowa przed decyzją</strong>
    <p>
      Nie musisz od razu wiedzieć, jaki rodzaj pomocy będzie najlepszy.
      Napisz krótko, co się dzieje — pomożemy uporządkować sytuację i wybrać kolejny krok.
    </p>
    <div className="contact-trust-row">
      <span className="contact-trust-chip">Bez oceniania</span>
      <span className="contact-trust-chip">Z uważnością na psa</span>
      <span className="contact-trust-chip">Konkretny następny krok</span>
    </div>
  </div>
</div>
```

## Uwaga

Jeśli obecna strona używa CSS Modules, Tailwind albo innego systemu niż global CSS, przepisz klasy zgodnie z istniejącym stylem projektu. Nie mieszaj niepotrzebnie metod stylowania.
