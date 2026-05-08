import type { Metadata } from 'next'
import Link from 'next/link'
import { ReferenceFinalCta, ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { PUBLIC_OFFER_BOOKING_PROCESS } from '@/lib/public-offer-copy'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PricingBookingNotesCard,
  PricingSummaryCard,
  bookHref,
  contactHref,
  getPricingOfferCatalog,
  pricingFaqItems,
} from './pricing-page-content'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Cennik konsultacji behawioralnych',
  path: '/cennik',
  description:
    'Kwadrans 69 zł, Dwa kwadranse 169 zł, Pełna konsultacja 470 zł. Kwadrans na już (99 zł) to ten sam format z szybkim terminem - dostępny przy rezerwacji.',
})

export default function PricingPage() {
  return (
    <ReferencePageShell className="reference-pricing-page" ctaHref={bookHref}>
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona główna', path: '/' },
            { name: 'Cennik', path: '/cennik' },
          ]),
          getServiceJsonLd({
            name: 'Cennik konsultacji behawioralnych - psy i koty',
            description:
              'Formaty konsultacji: Kwadrans, Kwadrans na już, Dwa kwadranse i Pełna konsultacja behawioralna online.',
            serviceUrl: '/cennik',
            offerCatalog: getPricingOfferCatalog(),
          }),
        ]}
      />

      <section className="reference-hero reference-pricing-hero">
        <div className="reference-hero-copy">
          <span className="reference-pill">Cennik</span>
          <h1>Cennik konsultacji behawioralnych.</h1>
          <p>
            Wybierz najmniejszy format, który pasuje do sytuacji. Kwadrans jest pierwszym krokiem, Dwa kwadranse dają
            więcej miejsca, a pełna konsultacja obejmuje plan i dalsze wsparcie.
          </p>
          <div className="reference-hero-actions">
            <Link href={bookHref} prefetch={false} className="reference-btn reference-btn-primary">
              Umów pierwszy krok
            </Link>
            <Link href={contactHref} prefetch={false} className="reference-btn reference-btn-secondary">
              Wyślij krótką wiadomość
            </Link>
          </div>
        </div>
        <PricingSummaryCard />
      </section>

      <section className="reference-main-layout">
        <div className="reference-content-column">
          <section className="reference-section-card">
            <h2>Jak wygląda rezerwacja</h2>
            <div className="reference-steps">
              {PUBLIC_OFFER_BOOKING_PROCESS.map((step, index) => (
                <article key={step} className="reference-step">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{step}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="reference-section-card">
            <h2>Najczęstsze pytania przed wyborem</h2>
            <div className="reference-compact-faq">
              {pricingFaqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item.question}
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="reference-sidebar">
          <PricingBookingNotesCard />
        </aside>
      </section>

      <ReferenceFinalCta
        title="Gotowy na pierwszy krok?"
        copy="Wybierz dogodny termin albo napisz krótko, co się dzieje - podpowiem, od którego formatu zacząć."
        primaryHref={bookHref}
        primaryLabel="Umów pierwszy krok"
        secondaryHref={contactHref}
        secondaryLabel="Wyślij krótką wiadomość"
      />
    </ReferencePageShell>
  )
}
