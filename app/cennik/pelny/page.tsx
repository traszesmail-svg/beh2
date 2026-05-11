import type { Metadata } from 'next'
import { ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PricingCardsSection,
  bookHref,
  getPricingOfferCatalog,
} from '../pricing-page-content'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Pełny cennik konsultacji behawioralnych',
  path: '/cennik/pelny',
  description:
    'Pełna tabela formatów: Kwadrans 69 zł, Kwadrans na już 99 zł, Dwa kwadranse 169 zł i Pełna konsultacja 470 zł.',
})

export default function FullPricingPage() {
  return (
    <ReferencePageShell className="reference-pricing-page reference-full-pricing-page" ctaHref={bookHref}>
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona główna', path: '/' },
            { name: 'Cennik', path: '/cennik' },
            { name: 'Pełny cennik', path: '/cennik/pelny' },
          ]),
          getServiceJsonLd({
            name: 'Pełny cennik konsultacji behawioralnych - psy i koty',
            description:
              'Pełna tabela formatów konsultacji: Kwadrans, Kwadrans na już, Dwa kwadranse i Pełna konsultacja behawioralna online.',
            serviceUrl: '/cennik/pelny',
            offerCatalog: getPricingOfferCatalog(),
          }),
        ]}
      />

      <section className="reference-hero reference-pricing-hero">
        <div className="reference-hero-copy">
          <span className="reference-pill">Pełny cennik</span>
          <h1>Pełny cennik: krótka rozmowa, dłuższa rozmowa albo pełny plan.</h1>
          <p>
            Poniżej masz wszystkie formaty w jednym miejscu. Kliknięcie w dowolny format prowadzi do wyboru psa, kota i najbliższego tematu, żeby nie zaczynać od przypadkowej rezerwacji.
          </p>
        </div>
      </section>

      <PricingCardsSection className="reference-full-pricing-section" />
    </ReferencePageShell>
  )
}
