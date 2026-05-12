import type { Metadata } from 'next'
import { ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PricingSummaryCard,
  bookHref,
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
          <h1>Skrócony cennik konsultacji.</h1>
          <p>
            Tu masz szybki podgląd cen. Pełny opis formatów i wybór ścieżki jest dopiero w pełnym cenniku.
          </p>
        </div>
        <PricingSummaryCard />
      </section>

      <section className="reference-main-layout reference-main-layout-single">
        <div className="reference-content-column">
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
      </section>
    </ReferencePageShell>
  )
}
