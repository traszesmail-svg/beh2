import type { Metadata } from 'next'
import Link from 'next/link'
import { ReferenceFinalCta, ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PricingCardsSection,
  bookHref,
  contactHref,
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
          <h1>Pełny cennik formatów konsultacji.</h1>
          <p>
            Tu jest pełna tabela formatów, cen i zakresów. Wybierz najkrótszą rozmowę, która wystarczy do Twojej
            sytuacji, albo pełną konsultację, jeśli potrzebny jest plan pracy.
          </p>
          <div className="reference-hero-actions">
            <Link href={bookHref} prefetch={false} className="reference-btn reference-btn-primary">
              Umów pierwszy krok
            </Link>
            <Link href="/cennik" prefetch={false} className="reference-btn reference-btn-secondary">
              Wróć do skrótu cennika
            </Link>
          </div>
        </div>
      </section>

      <PricingCardsSection className="reference-full-pricing-section" />

      <ReferenceFinalCta
        title="Gotowy wybrać format?"
        copy="Zarezerwuj najkrótszy pasujący format albo wyślij krótką wiadomość, jeśli nadal nie wiesz, od czego zacząć."
        primaryHref={bookHref}
        primaryLabel="Umów pierwszy krok"
        secondaryHref={contactHref}
        secondaryLabel="Wyślij krótką wiadomość"
      />
    </ReferencePageShell>
  )
}
