import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { RegulskiWebHero } from '@/components/RegulskiWebHero'
import { buildBookHref } from '@/lib/booking-routing'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PRICE_LABEL,
  bundleSavings,
  categoryLabel,
  getMaterialyGuideCoverSrc,
  listMaterialyBundles,
  listMaterialyGuides,
  type MaterialyGuide,
} from '@/lib/materialy-catalog'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Materialy PDF od 19 zl | Regulski Behawiorysta',
  path: '/materialy',
  description:
    'Gotowe PDF-y dla opiekunow psow i kotow. Bezplatne lead magnety, pojedyncze przewodniki od 19 zl, pakiety tematyczne 49 zl. Tansze niz Kwadrans, do pobrania bez rozmowy.',
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false)

const TIER_INTRO = {
  free: {
    eyebrow: 'Tier 0 · bezplatne',
    title: 'Zacznij od materialu darmowego',
    lead: 'Dwa szerokie tematy — kot w napieciu i pies a poziom ruchu. Pobierasz po podaniu maila, bez platnosci.',
  },
  single: {
    eyebrow: 'Tier 1 · pojedynczy PDF',
    title: 'Konkretny temat za 19 lub 29 zl',
    lead: 'Najtanszy sposob, zeby kupic pomoc bez rozmowy. Wybierasz jeden temat, dostajesz plan na 14 dni i routing do nastepnego kroku.',
  },
  bundle: {
    eyebrow: 'Tier 2 · pakiet 49 zl',
    title: 'Trzy PDF-y w jednej cenie',
    lead: 'Tematy ulozone razem dla konkretnej sytuacji. Tansze niz osobno, tansze niz Kwadrans (69 zl).',
  },
} as const

function MaterialyGuideCoverPreview({ guide }: { guide: MaterialyGuide }) {
  const coverSrc = getMaterialyGuideCoverSrc(guide)

  if (!coverSrc) {
    return null
  }

  return (
    <Link href={`/materialy/${guide.slug}`} prefetch={false} className="notatnik-material-cover-link" aria-label={`Zobacz ${guide.title}`}>
      <span className="notatnik-material-cover-frame">
        <Image
          src={coverSrc}
          alt={`Okładka PDF: ${guide.title}`}
          fill
          sizes="(max-width: 760px) 58vw, (max-width: 1100px) 24vw, 180px"
          className="notatnik-material-cover-image"
          unoptimized
        />
      </span>
    </Link>
  )
}

export default function MaterialyLandingPage() {
  const guides = listMaterialyGuides()
  const free = guides.filter((g) => g.tier === 'free')
  const flagships = guides.filter((g) => g.priceCode === 'p29')
  const standards = guides.filter((g) => g.priceCode === 'p19')
  const bundles = listMaterialyBundles()

  return (
    <NotatnikPageShell
      tag="Materialy / PDF"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={quickHref}
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={quickHref}
      footerPrimaryLabel="Kwadrans z behawiorysta"
      sideVisualVariant="materials"
    >
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Materialy PDF od 19 zl</div>
          <h1>
            Tansze niz Kwadrans. <em>Bez rozmowy.</em>
          </h1>
          <p>
            21 gotowych przewodnikow PDF dla opiekunow psow i kotow. Od bezplatnego startu po pakiety
            tematyczne. Pobierasz, czytasz, wdrazasz pierwszy plan. Jesli temat wraca albo miesza sie
            z innymi watkami — przechodzisz do rozmowy.
          </p>
          <div className="notatnik-subhero-actions">
            <Link href="#tier-free" prefetch={false} className="notatnik-btn">
              <span>Zacznij od darmowego</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="#tier-single" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Pojedyncze od 19 zl</span>
            </Link>
          </div>
        </div>

        <div className="summary-card tree-backed-card regulski-web-summary-card">
          <RegulskiWebHero variant="materialy" priority />
          <div className="section-eyebrow">3 polki</div>
          <h3>Bezplatne · 19/29 zl · pakiet 49 zl</h3>
          <p>
            Bezplatne lead magnety za zapis na liste. Pojedyncze przewodniki, kiedy chcesz konkretny
            temat za grosze. Pakiety, kiedy temat jest szerszy i nie ma sensu kupowac trzech osobno.
          </p>
        </div>
      </section>

      <section id="tier-free">
        <NotatnikSectionHead index="I." kicker={TIER_INTRO.free.eyebrow} title={TIER_INTRO.free.title} />
        <p style={{ maxWidth: '720px', color: 'var(--ink-quiet)' }}>{TIER_INTRO.free.lead}</p>
        <div className="notatnik-material-grid top-gap-small">
          {free.map((g) => {
            const hasCover = getMaterialyGuideCoverSrc(g) !== null

            return (
              <article key={g.slug} className={hasCover ? 'notatnik-material-card notatnik-material-card-with-cover' : 'notatnik-material-card'}>
                <MaterialyGuideCoverPreview guide={g} />
                <div className="notatnik-material-tag notatnik-mono">{categoryLabel(g.category)} · {PRICE_LABEL.free}</div>
                <h3>{g.title}</h3>
                <p style={{ minHeight: '4em' }}>{g.subtitle}</p>
                <ul style={{ margin: '6px 0 12px', padding: '0 0 0 16px', fontSize: '13px', color: 'var(--ink-quiet)' }}>
                  {g.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
                <Link href={`/materialy/${g.slug}`} prefetch={false}>
                  Pobierz bezplatnie &rarr;
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section id="tier-single" style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker={TIER_INTRO.single.eyebrow} title={TIER_INTRO.single.title} />
        <p style={{ maxWidth: '720px', color: 'var(--ink-quiet)' }}>{TIER_INTRO.single.lead}</p>

        <div className="top-gap">
          <div className="section-eyebrow">Flagowce · 29 zl</div>
        </div>
        <div className="notatnik-material-grid top-gap-small">
          {flagships.map((g) => {
            const hasCover = getMaterialyGuideCoverSrc(g) !== null

            return (
              <article key={g.slug} className={hasCover ? 'notatnik-material-card notatnik-material-card-with-cover' : 'notatnik-material-card'}>
                <MaterialyGuideCoverPreview guide={g} />
                <div className="notatnik-material-tag notatnik-mono">{categoryLabel(g.category)} · {PRICE_LABEL[g.priceCode]}</div>
                <h3>{g.title}</h3>
                <p style={{ minHeight: '3.6em' }}>{g.subtitle}</p>
                <Link href={`/materialy/${g.slug}`} prefetch={false}>
                  Zobacz / zamow &rarr;
                </Link>
              </article>
            )
          })}
        </div>

        <div className="top-gap">
          <div className="section-eyebrow">Pojedyncze · 19 zl</div>
        </div>
        <div className="notatnik-material-grid top-gap-small">
          {standards.map((g) => {
            const hasCover = getMaterialyGuideCoverSrc(g) !== null

            return (
              <article key={g.slug} className={hasCover ? 'notatnik-material-card notatnik-material-card-with-cover' : 'notatnik-material-card'}>
                <MaterialyGuideCoverPreview guide={g} />
                <div className="notatnik-material-tag notatnik-mono">{categoryLabel(g.category)} · {PRICE_LABEL[g.priceCode]}</div>
                <h3>{g.title}</h3>
                <p style={{ minHeight: '3.6em' }}>{g.subtitle}</p>
                <Link href={`/materialy/${g.slug}`} prefetch={false}>
                  Zobacz / zamow &rarr;
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section id="tier-bundles">
        <NotatnikSectionHead index="III." kicker={TIER_INTRO.bundle.eyebrow} title={TIER_INTRO.bundle.title} />
        <p style={{ maxWidth: '720px', color: 'var(--ink-quiet)' }}>{TIER_INTRO.bundle.lead}</p>

        <div className="notatnik-material-grid top-gap-small">
          {bundles.map((b) => {
            const savings = bundleSavings(b)
            return (
              <article key={b.slug} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">
                  {categoryLabel(b.category)} · 49 zl
                  {savings > 0 ? ` · oszczedzasz ${savings} zl` : ''}
                </div>
                <h3>{b.title}</h3>
                <p style={{ minHeight: '3.6em' }}>{b.subtitle}</p>
                <p style={{ fontSize: '13px', margin: '4px 0 8px', color: 'var(--ink-quiet)' }}>
                  {b.guideSlugs.length} przewodniki w pakiecie
                </p>
                <Link href={`/materialy/pakiet/${b.slug}`} prefetch={false}>
                  Zobacz / zamow pakiet &rarr;
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      <section id="jak-to-dziala" style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="IV." kicker="Jak to dziala" title="Zamowienie i platnosc krok po kroku." />
        <div className="notatnik-steps">
          <article className="notatnik-step">
            <div className="notatnik-step-number">01</div>
            <p>
              Wybierasz PDF albo pakiet, klikasz „Zamow&quot;. Podajesz imie, e-mail, telefon i numer
              zamowienia dostajesz od razu.
            </p>
          </article>
          <article className="notatnik-step">
            <div className="notatnik-step-number">02</div>
            <p>
              Robisz BLIK na podany numer (albo zwykly przelew z tytulem zamowienia). To jeden krok i
              kilka sekund.
            </p>
          </article>
          <article className="notatnik-step">
            <div className="notatnik-step-number">03</div>
            <p>
              Po zaksiegowaniu wplaty dostajesz na e-mail jednorazowy link do pobrania PDF (do 60 minut,
              pon–pt 8–18; poza tymi godzinami w nastepny dzien roboczy).
            </p>
          </article>
        </div>

        <div className="notatnik-quiet-grid top-gap">
          <article className="notatnik-quiet-card">
            <h3>Dlaczego BLIK, a nie karta</h3>
            <p>
              Brak posrednika oznacza brak prowizji i brak danych karty u nas. Procedura jest reczna,
              dlatego moze chwile potrwac, ale za to bezpieczna i prosta.
            </p>
          </article>
          <article className="notatnik-quiet-card">
            <h3>Co dostajesz</h3>
            <p>
              Plik PDF A4 (druk domowy, kolor). Link wazny 72 godziny i do 3 pobran. Materialy sa
              wylacznie do uzytku wlasnego, bez prawa dalszej dystrybucji.
            </p>
          </article>
        </div>
      </section>

      <NotatnikFinalCta
        title="Jesli temat jest mieszany, <em>Kwadrans porzadkuje go w 15 minut.</em>"
        copy="PDF jest dobry punkt startu, ale przy splatanym temacie rozmowa jest szybsza niz czytanie trzech materialow."
        primaryHref={quickHref}
        primaryLabel="Zarezerwuj Kwadrans / 69 zl"
        secondaryHref="/cennik"
        secondaryLabel="Zobacz pelny cennik"
      />
    </NotatnikPageShell>
  )
}
