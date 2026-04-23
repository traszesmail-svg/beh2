import type { Metadata } from 'next'
import Link from 'next/link'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { ServicesComparison } from '@/components/ServicesComparison'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PUBLIC_OFFER_BOOKING_PROCESS,
  PUBLIC_OFFER_BOOKING_PAYMENT,
  PUBLIC_OFFER_CANCELLATION_COPY,
  PUBLIC_OFFER_FULL_CONSULTATION_VALUE,
  PUBLIC_OFFER_PRIORITY_VARIANT_NOTE,
  PUBLIC_OFFER_START_GUIDE,
} from '@/lib/public-offer-copy'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Cennik konsultacji behawioralnych | Regulski COAPE',
  path: '/cennik',
  description:
    'Kwadrans 69 zl, Dwa kwadranse 169 zl, Pelna konsultacja 470 zl. Przy Kwadransie moze byc dostepny wariant priorytetowy przy rezerwacji.',
})

const pricingFaqItems = [
  {
    question: 'Czym jest Kwadrans z behawiorysta?',
    answer:
      'To 15 minut rozmowy audio bez kamery. Przy jednym pytaniu albo pierwszym uporzadkowaniu tematu wystarcza, zeby ustalic priorytet i pierwszy kierunek dzialania.',
  },
  {
    question: 'Czym rozni sie Kwadrans za 69 zl od Kwadransu na juz za 99 zl?',
    answer:
      'Forma rozmowy jest ta sama: 15 minut audio bez kamery. Przy 99 zl placisz za priorytet i mozliwie szybki termin, a nie za dluzsza konsultacje.',
  },
  {
    question: 'Kiedy wybrac Dwa kwadranse za 169 zl?',
    answer:
      'Wtedy, gdy 15 minut to za malo, temat ma 2-3 watki albo chcesz spokojniej uporzadkowac sytuacje przed decyzja o Pelnej konsultacji.',
  },
  {
    question: 'Co obejmuje Pelna konsultacja 470 zl?',
    answer:
      '60 minut rozmowy online audio albo audio/video, diagnoze sytuacji, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp. To osobny format dla spraw zlozonych, przewleklych albo wielowatkowych.',
  },
  {
    question: 'Co jesli nie wiem, od czego zaczac?',
    answer:
      'Najprostszy start to zwykly Kwadrans za 69 zl. Jesli potrzebujesz tego samego formatu szybciej, wybierz Kwadrans na juz. Jesli temat jest szerszy, wejdz w Dwa kwadranse. Jesli sprawa jest zlozona albo przewlekla, wybierz Pelna konsultacje.',
  },
  {
    question: 'Jak wyglada platnosc?',
    answer: PUBLIC_OFFER_BOOKING_PAYMENT,
  },
]

export default function PricingPage() {
  return (
    <NotatnikPageShell
      tag="Cennik / konsultacje"
      navItems={PUBLIC_SITE_NAV_ITEMS}
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
            description: 'Trzy glowne formaty konsultacji: Kwadrans, Dwa kwadranse i Pelna konsultacja behawioralna. Przy Kwadransie moze byc dostepny wariant priorytetowy w rezerwacji.',
            serviceUrl: '/cennik',
            offerCatalog: [
              { name: 'Kwadrans z behawiorysta', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
              { name: 'Dwa kwadranse', description: '30 min online, gdy 15 minut to za malo.', url: '/book?service=konsultacja-30-min', price: 169 },
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
          <p>
            Trzy glowne formaty w jednej logice wyboru. Kwadrans to prosty start, Dwa kwadranse porzadkuja temat szerzej, a Pelna konsultacja sluzy
            sprawom zlozonym. Przy Kwadransie moze pojawic sie tez wariant priorytetowy w rezerwacji.
          </p>
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
          <p>Kwadrans 69 zl = najprostszy start. 169 zl = szerszy temat. 470 zl = pelny plan i wsparcie po rozmowie.</p>
          <p className="muted">{PUBLIC_OFFER_PRIORITY_VARIANT_NOTE}</p>
        </div>
      </section>

      <section id="porownanie">
        <NotatnikSectionHead index="I." kicker="Porownanie" title="Jedna tabela, trzy role w tym samym lejku." />
        <p className="notatnik-service-description">
          Kwadrans 69 zl to najprostszy start. Dwa kwadranse 169 zl porzadkuja temat szerzej, a Pelna konsultacja 470 zl daje diagnoze, plan poprawy i
          7 dni wsparcia po rozmowie.
        </p>
        <ServicesComparison />
        <div className="notatnik-faq-grid top-gap">
          {PUBLIC_OFFER_START_GUIDE.map((snippet) => (
            <article key={snippet} className="notatnik-faq-item">
              <p>{snippet}</p>
            </article>
          ))}
        </div>
        <div className="info-box top-gap-small">{PUBLIC_OFFER_PRIORITY_VARIANT_NOTE}</div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="Od czego zaczac" title="Prosty blok decyzji przed rezerwacja." />
        <div className="notatnik-steps">
          {PUBLIC_OFFER_BOOKING_PROCESS.map((step, index) => (
            <article key={step} className="notatnik-step">
              <div className="notatnik-step-number">{String(index + 1).padStart(2, '0')}</div>
              <p>{step}</p>
            </article>
          ))}
        </div>
        <div className="notatnik-quiet-grid top-gap">
          {PUBLIC_OFFER_START_GUIDE.map((item) => (
            <article key={item} className="notatnik-quiet-card">
              <p>{item}</p>
            </article>
          ))}
        </div>
        <div className="info-box top-gap-small">{PUBLIC_OFFER_CANCELLATION_COPY}</div>
      </section>

      <section>
        <NotatnikSectionHead index="III." kicker="Wartosc premium" title="Dlaczego Pelna konsultacja kosztuje 470 zl." />
        <div className="notatnik-quiet-grid">
          <article className="notatnik-quiet-card">
            <h3>To nie jest dluzszy Kwadrans</h3>
            <p>{PUBLIC_OFFER_FULL_CONSULTATION_VALUE}</p>
          </article>
          <article className="notatnik-quiet-card">
            <h3>Co dochodzi poza samym czasem rozmowy</h3>
            <ul className="notatnik-service-list">
              <li>diagnoza sytuacji i priorytetow</li>
              <li>plan poprawy po rozmowie</li>
              <li>7 dni konsultacji tekstowych przez WhatsApp</li>
            </ul>
          </article>
        </div>
      </section>

      <section>
        <NotatnikSectionHead index="IV." kicker="FAQ" title="Najczestsze pytania o uslugi i platnosc." />
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
        <NotatnikSectionHead index="V." kicker="Zwroty i zmiany" title="Zmiany terminu i zwroty sa opisane wprost." />
        <div className="notatnik-quiet-grid">
          <article className="notatnik-quiet-card">
            <h3>Okno na zmiane lub rezygnacje</h3>
            <p>{PUBLIC_OFFER_CANCELLATION_COPY}</p>
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
