import type { Metadata } from 'next'
import Link from 'next/link'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { ServicesComparison } from '@/components/ServicesComparison'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Cennik konsultacji behawioralnych | Regulski COAPE',
  path: '/cennik',
  description:
    'Kwadrans z behawiorysta 69 zl, Dwa kwadranse 129 zl, pelna konsultacja 350 zl. PayPal albo BLIK na telefon, potwierdzenie do 15 minut, bez kamery.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const PAYMENT_STEPS = [
  '1. Wybierasz usĹ‚ugÄ™ i termin.',
  '2. Po rezerwacji dostajesz e-mailem PayPal albo instrukcje BLIK na telefon.',
  '3. Oplacasz rezerwacje przez PayPal albo BLIK na telefon w godzinach 9-21, poza dniami ustawowo wolnymi.',
  '4. Potwierdzenie przychodzi do 15 minut wraz z dalszÄ… instrukcjÄ… i linkiem do rozmowy.',
] as const

const ctaSupportSnippets = [
  'Jesli nie wiesz, od czego zaczac - to jest wlasnie ten krok.',
  '15 minut. Jedno konkretne pytanie. Juz wiesz wiecej niz przed rozmowa.',
  'Bez kamery. Bez formalnosci. Bez stresu.',
] as const

const trustSnippets = [
  'Pracuje online z opiekunami psow i kotow w calej Polsce. Bez kamer, bez przygotowan - wystarczy mikrofon i 15 minut.',
  'Nie obiecuje efektow w konkretnym czasie. Mowie, co realnie mozna zorganizowac - i co zalezy od zwierzecia, a co od srodowiska.',
  'Zakres pracy jest uczciwy: powiem, co lezy w zasiegu konsultacji, a co wymaga wiecej czasu, wsparcia specjalisty lub zmian w srodowisku.',
] as const

const pricingFaqItems = [
  {
    question: 'Czym jest Kwadrans z behawiorysta?',
    answer:
      'To samodzielny format 15 min audio bez kamery. Przy jednym konkretnym pytaniu albo orientacji w temacie wystarcza, zeby ustalic priorytet i pierwszy kierunek dzialania.',
  },
  {
    question: 'Czy 15 minut wystarczy?',
    answer:
      'Przy jednym pytaniu albo orientacji w temacie - tak. Przy bardziej zlozonym, wielowatkowym problemie daje kierunek i mowie wprost, czy potrzebujesz pelniejszej konsultacji.',
  },
  {
    question: 'Czy musze miec kamere?',
    answer:
      'Nie. Kwadrans jest zawsze glosem, bez wideo. Wystarczy mikrofon i spokojne miejsce na rozmowe.',
  },
  {
    question: 'Co dostane po 15 minutach?',
    answer:
      'Jeden konkretny kierunek: co zrobic teraz, co obserwowac i czy temat wymaga glebszej pracy. To nie jest plan na trzy miesiace, tylko sensowny pierwszy krok.',
  },
  {
    question: 'Jak wyglada platnosc?',
    answer:
      'Po rezerwacji dostajesz e-mailem PayPal albo instrukcje BLIK na telefon. Po wplacie potwierdzenie wraca do 15 minut wraz z dalsza instrukcja i linkiem do rozmowy.',
  },
  {
    question: 'Czy place za calosc od razu?',
    answer:
      'Tak. Platnosc jest jednorazowa przy rezerwacji. Kwadrans kosztuje 69 zl, Dwa kwadranse 129 zl, a Pelna konsultacja 350 zl.',
  },
] as const

export default function PricingPage() {
  return (
    <NotatnikPageShell
      tag="Cennik / konsultacje"
      navItems={navItems}
      ctaHref="/book?service=szybka-konsultacja-15-min"
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref="/book?service=szybka-konsultacja-15-min"
      footerPrimaryLabel="Kwadrans z behawiorystÄ…"
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Cennik', path: '/cennik' },
          ]),
          getServiceJsonLd({
            name: 'Cennik konsultacji behawioralnych - psy i koty',
            description: 'Trzy przejrzyste opcje: Kwadrans, Dwa kwadranse i peĹ‚na konsultacja behawioralna.',
            serviceUrl: '/cennik',
            offerCatalog: [
              { name: 'Kwadrans z behawiorystÄ…', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
              { name: 'Dwa kwadranse', description: '30 min audio.', url: '/book?service=konsultacja-30-min', price: 129 },
              { name: 'PeĹ‚na konsultacja', description: '60 min audio albo video z planem dalszej pracy.', url: '/book?service=konsultacja-behawioralna-online', price: 350 },
            ],
          }),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Cennik / psy i koty</div>
          <h1>
            Cennik konsultacji behawioralnych <em>- psy i koty</em>
          </h1>
          <p>Trzy przejrzyste opcje. PayPal albo BLIK na telefon, potwierdzenie do 15 minut.</p>
          <NextSlot className="top-gap-small" />
          <div className="info-box top-gap-small">Jesli nie wiesz, od czego zaczac - zacznij od Kwadransu. To najlzejszy i najszybszy pierwszy krok.</div>
          <div className="notatnik-subhero-actions">
            <Link href="/book?service=szybka-konsultacja-15-min" prefetch={false} className="notatnik-btn">
              <span>Zarezerwuj Kwadrans</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/kontakt#formularz" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Napisz wiadomoĹ›Ä‡</span>
            </Link>
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">ĹšcieĹĽka wyboru</div>
          <h3>Zacznij od tego, co pasuje do skali problemu.</h3>
          <p>
            Kwadrans zostaje najlĹĽejszym startem. Dwa kwadranse porzÄ…dkujÄ… temat szerzej, a peĹ‚na konsultacja jest dla
            spraw wielowÄ…tkowych albo przewlekĹ‚ych.
          </p>
        </div>
      </section>

      <section id="porownanie">
        <NotatnikSectionHead index="I." kicker="PorĂłwnanie" title="Jedna tabela, trzy rĂłĹĽne zastosowania." />
        <ServicesComparison />
        <div className="notatnik-faq-grid top-gap">
          {ctaSupportSnippets.map((snippet) => (
            <article key={snippet} className="notatnik-faq-item">
              <p>{snippet}</p>
            </article>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="PĹ‚atnoĹ›Ä‡" title="Jak przebiega pĹ‚atnoĹ›Ä‡." />
        <div className="notatnik-steps">
          {PAYMENT_STEPS.map((step, index) => (
            <article key={step} className="notatnik-step">
              <div className="notatnik-step-number">{String(index + 1).padStart(2, '0')}</div>
              <p>{step}</p>
            </article>
          ))}
        </div>
        <div className="notatnik-quiet-grid top-gap">
          {trustSnippets.map((snippet) => (
            <article key={snippet} className="notatnik-quiet-card">
              <p>{snippet}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="III." kicker="FAQ" title="Najczestsze pytania o Kwadrans i platnosc." />
        <div className="notatnik-faq-grid">
          {pricingFaqItems.map((item) => (
            <article key={item.question} className="notatnik-faq-item">
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="IV." kicker="Zwroty i zmiany" title="Zmiany terminu i zwroty sa opisane wprost." />
        <div className="notatnik-quiet-grid">
          <article className="notatnik-quiet-card">
            <h3>Okno na zmianÄ™ lub rezygnacjÄ™</h3>
            <p>
              KrĂłtkie formaty przewidujÄ… 24-godzinne okno na zgĹ‚oszenie zmiany terminu albo rezygnacji po potwierdzeniu
              wpĹ‚aty. SzczegĂłĹ‚y sÄ… opisane w regulaminie rezerwacji.
            </p>
            <Link href="/regulamin" prefetch={false} className="notatnik-inline-link">
              OtwĂłrz regulamin rezerwacji
            </Link>
          </article>
          <article className="notatnik-quiet-card">
            <h3>PeĹ‚na konsultacja ma osobny regulamin</h3>
            <p>
              Dla peĹ‚nej konsultacji publikowany jest osobny dokument, bo ten format ma osobne warunki dotyczÄ…ce zakresu,
              materiaĹ‚Ăłw po rozmowie i zasad przed rozpoczÄ™ciem usĹ‚ugi.
            </p>
            <Link href="/regulamin-pelna-konsultacja" prefetch={false} className="notatnik-inline-link">
              OtwĂłrz regulamin PeĹ‚nej konsultacji
            </Link>
          </article>
        </div>
      </section>

      <NotatnikFinalCta
        title="JeĹ›li chcesz ruszyÄ‡ z tematem, <em>zacznij od Kwadransu.</em>"
        copy="To najprostszy pierwszy krok. JeĹ›li temat jest szerszy, od razu bÄ™dzie widaÄ‡, czy lepiej przejĹ›Ä‡ do kolejnego formatu."
        primaryHref="/book?service=szybka-konsultacja-15-min"
        primaryLabel="Zarezerwuj Kwadrans ->"
        secondaryHref="/kontakt#formularz"
        secondaryLabel="Kontakt"
      />
    </NotatnikPageShell>
  )
}
