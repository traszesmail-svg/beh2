import type { Metadata } from 'next'
import Link from 'next/link'
import { HeroIllustration } from '@/components/HeroIllustration'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { NotatnikFinalCta, NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { OfferCards } from '@/components/OfferCards'
import { KwadransNaJuzBadge } from '@/components/KwadransNaJuzBadge'
import { Schema } from '@/components/schema'
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
    'Kwadrans 69 zl, Dwa kwadranse 169 zl, Pelna konsultacja 470 zl. Kwadrans na juz (99 zl) to ten sam format z szybkim terminem - dostepny przy rezerwacji.',
})

const pricingFaqItems = [
  {
    question: 'Nie wiem, czy chce jeszcze rozmawiac. Jest jakis tanszy start?',
    answer:
      'Tak. W /materialy znajdziesz 21 PDF-ow od 19 zl (pojedyncze) lub 49 zl (pakiet 3 PDF). Sa tansze niz Kwadrans (69 zl) i nie wymagaja rezerwacji terminu — odbierasz mailem po BLIK-u. Dwa materialy darmowe (kot w napieciu, pies a poziom ruchu) bez platnosci, tylko na e-mail.',
  },
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
      'Wtedy, gdy 15 minut to za malo, temat ma kilka watkow albo chcesz spokojniej uporzadkowac sytuacje przed decyzja o Pelnej konsultacji.',
  },
  {
    question: 'Co obejmuje Pelna konsultacja 470 zl?',
    answer:
      '60 minut rozmowy online audio albo audio/video, diagnoze sytuacji, plan poprawy i 7 dni konsultacji tekstowych przez WhatsApp. To osobny format dla spraw zlozonych, przewleklych albo wielowatkowych.',
  },
  {
    question: 'Jak wyglada platnosc?',
    answer: `${PUBLIC_OFFER_BOOKING_PAYMENT} ${PUBLIC_OFFER_CANCELLATION_COPY}`,
  },
] as const

const visibleFaqItems = pricingFaqItems.slice(0, 4)

export default function PricingPage() {
  return (
    <NotatnikPageShell
      tag="Cennik / konsultacje"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref="/book?service=szybka-konsultacja-15-min"
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref="/book?service=szybka-konsultacja-15-min"
      footerPrimaryLabel="Kwadrans z behawiorysta"
      sideVisualVariant="pricing"
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Cennik', path: '/cennik' },
          ]),
          getServiceJsonLd({
            name: 'Cennik konsultacji behawioralnych - psy i koty',
            description:
              'Trzy glowne formaty konsultacji: Kwadrans (69 zl), Dwa kwadranse (169 zl) i Pelna konsultacja behawioralna (470 zl). Kwadrans na juz (99 zl) to ten sam format z szybkim terminem.',
            serviceUrl: '/cennik',
            offerCatalog: [
              { name: 'Kwadrans z behawiorysta', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
              { name: 'Dwa kwadranse', description: '30 min online, gdy 15 minut to za malo.', url: '/book?service=konsultacja-30-min', price: 169 },
              { name: 'Pelna konsultacja', description: '60 min audio albo video, diagnoza, plan poprawy i 7 dni wsparcia tekstowego przez WhatsApp.', url: '/book?service=konsultacja-behawioralna-online', price: 470 },
            ],
          }),
        ]}
      />

      <Breadcrumbs items={[{ name: 'Cennik', url: '/cennik' }]} />
      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Cennik / psy i koty</div>
          <h1>Cennik konsultacji behawioralnych.</h1>
          <p>
            Trzy formaty i jeden wariant priorytetowy. Wybierasz skale, nie pakiet: 69 zl na start, 99 zl za ten sam format szybciej, 169 zl przy
            szerszym temacie i 470 zl dla spraw zlozonych wymagajacych diagnozy i planu.
          </p>
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

        <div className="notatnik-subhero-media">
          <HeroIllustration slug="cennik" emojiPlaceholder="💰" className="w-full h-full min-h-[340px]" />
        </div>
      </section>

      <section id="porownanie">
        <NotatnikSectionHead index="I." kicker="Formaty" title="Cztery opcje. Jeden prosty wybor." />
        <div className="top-gap-small">
          <KwadransNaJuzBadge />
        </div>
        <div className="top-gap-small">
          <OfferCards />
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="Platnosc i FAQ" title="Platnosc, termin i najwazniejsze odpowiedzi przed rezerwacja." />

        <div className="notatnik-steps">
          {PUBLIC_OFFER_BOOKING_PROCESS.map((step, index) => (
            <article key={step} className="notatnik-step">
              <div className="notatnik-step-number">{String(index + 1).padStart(2, '0')}</div>
              <p>{step}</p>
            </article>
          ))}
        </div>

        <div className="notatnik-quiet-grid top-gap">
          <article className="notatnik-quiet-card">
            <h3>Jak wyglada platnosc</h3>
            <p>{PUBLIC_OFFER_BOOKING_PAYMENT}</p>
          </article>
          <article className="notatnik-quiet-card">
            <h3>Zmiana terminu i rezygnacja</h3>
            <p>{PUBLIC_OFFER_CANCELLATION_COPY}</p>
            <div className="hero-actions top-gap-small">
              <Link href="/regulamin" prefetch={false} className="prep-inline-link">
                Regulamin rezerwacji
              </Link>
              <Link href="/regulamin-pelna-konsultacja" prefetch={false} className="prep-inline-link">
                Regulamin Pelnej konsultacji
              </Link>
            </div>
          </article>
        </div>

        <div className="top-gap">
          <div className="section-eyebrow">FAQ</div>
          <h3>Najczestsze pytania o uslugi i platnosc.</h3>
        </div>
        <div className="notatnik-faq-grid top-gap-small">
          {visibleFaqItems.map((item) => (
            <article key={item.question} className="notatnik-faq-item">
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <NotatnikFinalCta
        title="Jesli chcesz ruszyc z tematem, <em>zacznij od Kwadransu.</em>"
        copy="To dalej najprostszy pierwszy krok. Jesli wolisz najpierw przygotowac sie materialami, przejdz do Niezbednika."
        primaryHref="/book?service=szybka-konsultacja-15-min"
        primaryLabel="Zarezerwuj Kwadrans"
        secondaryHref="/niezbednik"
        secondaryLabel="Przejdz do Niezbednika"
      />
    </NotatnikPageShell>
  )
}
