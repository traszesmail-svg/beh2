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
    'Kwadrans 69 zl, Kwadrans na juz 99 zl, Dwa kwadranse 169 zl, Pelna konsultacja 470 zl z diagnoza, planem poprawy i 7 dniami wsparcia tekstowego przez WhatsApp.',
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
  '1. Wybierasz usluge i termin.',
  '2. Po rezerwacji dostajesz e-mailem PayPal.me albo instrukcje BLIK na telefon.',
  '3. Oplacasz rezerwacje przez PayPal.me albo BLIK na telefon w godzinach 9-21, poza dniami ustawowo wolnymi.',
  '4. Potwierdzenie przychodzi do 15 minut wraz z dalsza instrukcja i linkiem do rozmowy.',
] as const

const ctaSupportSnippets = [
  'Kwadrans za 69 zl to najprostszy start, gdy chcesz wiedziec, od czego zaczac.',
  'Kwadrans na juz za 99 zl to ten sam format 15 minut, ale z terminem w 15 minut.',
  'Dwa kwadranse za 169 zl spokojnie porzadkuja temat, a Pelna konsultacja za 470 zl sluzy sprawom zlozonym i przewleklym.',
] as const

const trustSnippets = [
  'Pracuje online z opiekunami psow i kotow w calej Polsce. Bez kamer, bez przygotowan - wystarczy mikrofon i 15 minut.',
  'Kwadrans za 69 zl jest najprostszym startem. Kwadrans na juz za 99 zl nie daje dluzszej rozmowy - daje szybszy termin.',
  'Pelna konsultacja za 470 zl obejmuje 60 minut rozmowy, diagnoze, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp.',
  'Nie obiecuje efektow w konkretnym czasie. Mowie, co realnie mozna zorganizowac - i co zalezy od zwierzecia, a co od srodowiska.',
  'Zakres pracy jest uczciwy: powiem, co lezy w zasiegu konsultacji, a co wymaga wiecej czasu, wsparcia specjalisty lub zmian w srodowisku.',
] as const

const pricingFaqItems = [
  {
    question: 'Czym jest Kwadrans z behawiorysta?',
    answer:
      'To podstawowy format startowy: 15 min audio bez kamery. Przy jednym konkretnym pytaniu albo orientacji w temacie wystarcza, zeby ustalic priorytet i pierwszy kierunek dzialania.',
  },
  {
    question: 'Czym rozni sie Kwadrans za 69 zl od Kwadransu na juz za 99 zl?',
    answer:
      'Forma rozmowy jest ta sama: 15 min audio bez kamery. Przy 99 zl placisz za priorytet i szybszy dostep, czyli termin w 15 minut, a nie za dluzsza albo lepsza konsultacje.',
  },
  {
    question: 'Czy 15 minut wystarczy?',
    answer:
      'Przy jednym pytaniu albo pierwszym uporzadkowaniu tematu - tak. Przy bardziej zlozonym, wielowatkowym problemie daje kierunek i pokazuje, czy lepszym kolejnym krokiem beda Dwa kwadranse albo Pelna konsultacja.',
  },
  {
    question: 'Czy musze miec kamere?',
    answer:
      'Nie. Kwadrans jest zawsze glosem, bez wideo. Wystarczy mikrofon i spokojne miejsce na rozmowe.',
  },
  {
    question: 'Co dostane po 15 minutach?',
    answer:
      'Jeden konkretny kierunek: co zrobic teraz, co obserwowac i czy temat wymaga glebszej pracy. To nie jest plan na trzy miesiace, tylko sensowny pierwszy krok i decyzja o ewentualnym kolejnym etapie.',
  },
  {
    question: 'Co obejmuje Pelna konsultacja 470 zl?',
    answer:
      '60 minut rozmowy online, diagnoze sytuacji, indywidualny plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp. W tym czasie mozna zadawac pytania, wysylac filmy i konsultowac kolejne kroki. Jesli ten etap nie daje poczucia skutecznego kierunku, wskazuje zasadnosc wizyty domowej i terapii ustalanej indywidualnie.',
  },
  {
    question: 'Jak wyglada platnosc?',
    answer:
      'Po rezerwacji dostajesz e-mailem PayPal.me albo instrukcje BLIK na telefon. Po wplacie potwierdzenie wraca do 15 minut wraz z dalsza instrukcja i linkiem do rozmowy.',
  },
  {
    question: 'Czy place za calosc od razu?',
    answer:
      'Tak. Platnosc jest jednorazowa przy rezerwacji. Kwadrans kosztuje 69 zl, Kwadrans na juz 99 zl, Dwa kwadranse 169 zl, a Pelna konsultacja 470 zl.',
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
      footerPrimaryLabel="Kwadrans z behawiorysta"
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Cennik', path: '/cennik' },
          ]),
          getServiceJsonLd({
            name: 'Cennik konsultacji behawioralnych - psy i koty',
            description: 'Cztery przejrzyste opcje: Kwadrans, Kwadrans na juz, Dwa kwadranse i Pelna konsultacja behawioralna.',
            serviceUrl: '/cennik',
            offerCatalog: [
              { name: 'Kwadrans z behawiorysta', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
              { name: 'Kwadrans na juz', description: '15 min audio, termin w 15 minut.', url: '/book?service=kwadrans-na-juz', price: 99 },
              { name: 'Dwa kwadranse', description: '30 min online z krotka notatka po rozmowie.', url: '/book?service=konsultacja-30-min', price: 169 },
              { name: 'Pelna konsultacja', description: '60 min audio albo video, diagnoza, plan poprawy i 7 dni wsparcia tekstowego przez WhatsApp.', url: '/book?service=konsultacja-behawioralna-online', price: 470 },
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
          <p>Cztery przejrzyste opcje w jednej logice wyboru. Kwadrans to prosty start, Kwadrans na juz przyspiesza wejscie, Dwa kwadranse daja wiecej miejsca, a Pelna konsultacja sluzy sprawom zlozonym.</p>
          <NextSlot className="top-gap-small" />
          <div className="info-box top-gap-small">Jesli nie wiesz, od czego zaczac, zacznij od Kwadransu. Nie trzeba wybierac najwiekszej uslugi na pierwszy ruch.</div>
          <div className="notatnik-subhero-actions">
            <Link href="/book?service=szybka-konsultacja-15-min" prefetch={false} className="notatnik-btn">
              <span>Zarezerwuj Kwadrans</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/kontakt#formularz" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Napisz wiadomosc</span>
            </Link>
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Sciezka wyboru</div>
          <h3>Zacznij od tego, co pasuje do skali problemu.</h3>
          <p>
            Kwadrans za 69 zl zostaje najlzejszym startem. Kwadrans na juz za 99 zl daje ten sam format, ale szybciej. Dwa kwadranse porzadkuja temat szerzej, a Pelna konsultacja jest dla spraw wielowatkowych albo przewleklych.
          </p>
        </div>
      </section>

      <section id="porownanie">
        <NotatnikSectionHead index="I." kicker="Porownanie" title="Jedna tabela, cztery role w tym samym lejku." />
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
        <NotatnikSectionHead index="II." kicker="Platnosc" title="Jak przebiega platnosc." />
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
        <NotatnikSectionHead index="III." kicker="FAQ" title="Najczestsze pytania o uslugi i platnosc." />
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
            <h3>Okno na zmiane lub rezygnacje</h3>
            <p>
              Krotkie formaty przewiduja 24-godzinne okno na zgloszenie zmiany terminu albo rezygnacji po potwierdzeniu
              wplaty. Szczegoly sa opisane w regulaminie rezerwacji.
            </p>
            <Link href="/regulamin" prefetch={false} className="notatnik-inline-link">
              Otworz regulamin rezerwacji
            </Link>
          </article>
          <article className="notatnik-quiet-card">
            <h3>Pelna konsultacja ma osobny regulamin</h3>
            <p>
              Dla pelnej konsultacji publikowany jest osobny dokument, bo ten format ma osobne warunki dotyczace zakresu,
              diagnozy, 7 dni wsparcia przez WhatsApp i zasad przed rozpoczeciem uslugi.
            </p>
            <Link href="/regulamin-pelna-konsultacja" prefetch={false} className="notatnik-inline-link">
              Otworz regulamin Pelnej konsultacji
            </Link>
          </article>
        </div>
      </section>

      <NotatnikFinalCta
        title="Jesli chcesz ruszyc z tematem, <em>zacznij od Kwadransu.</em>"
        copy="To najprostszy pierwszy krok. Jesli temat okaze sie szerszy, od razu bedzie widac, czy lepiej przejsc do kolejnego formatu."
        primaryHref="/book?service=szybka-konsultacja-15-min"
        primaryLabel="Zarezerwuj Kwadrans ->"
        secondaryHref="/kontakt#formularz"
        secondaryLabel="Kontakt"
      />
    </NotatnikPageShell>
  )
}
