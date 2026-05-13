import type { Metadata } from 'next'
import Link from 'next/link'
import { ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PricingDirectBookingSection,
  PricingSummaryCard,
  bookHref,
  getPricingOfferCatalog,
  pricingFaqItems,
} from './pricing-page-content'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Cennik konsultacji behawioralnych',
  path: '/cennik',
  description:
    'Kwadrans 69 zł, Kwadrans na już 99 zł, Dwa kwadranse 169 zł i Pełna konsultacja 470 zł. W każdej usłudze diagnoza behawioralna oparta na danych od opiekuna.',
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
            name: 'Cennik rozmów behawioralnych - psy i koty',
            description:
              'Formaty rozmowy: Kwadrans, Kwadrans na już, Dwa kwadranse i Pełna konsultacja online.',
            serviceUrl: '/cennik',
            offerCatalog: getPricingOfferCatalog(),
          }),
        ]}
      />

      <section className="reference-hero reference-pricing-hero">
        <div className="reference-hero-copy">
          <span className="reference-pill">Cennik</span>
          <h1>Wybierz rozmowę na miarę sytuacji</h1>
          <p>
            Nie musisz od razu wiedzieć, czego potrzebujesz. Jeśli chcesz tylko sprawdzić, od czego zacząć - wystarczy Kwadrans. Jeśli sprawa trwa długo, wraca w różnych sytuacjach albo wpływa na życie całego domu, spokojniej będzie wybrać dłuższy format.
          </p>
          <p>
            W każdej usłudze dostajesz diagnozę behawioralną opartą na informacjach, które przekażesz. Im więcej danych mamy - opis, formularz, nagrania, historia zachowania, kontekst zdrowia, diety i domu - tym precyzyjniej można określić, co może napędzać zachowanie.
          </p>
        </div>
        <PricingSummaryCard />
      </section>

      <section className="reference-main-layout reference-main-layout-single">
        <div className="reference-content-column">
          <section className="reference-section-card">
            <h2>W każdej usłudze dostajesz diagnozę behawioralną opartą na danych</h2>
            <p>
              To nie jest przypadkowa porada z internetu. Analizuję opis sytuacji, odpowiedzi z formularza, historię zachowania, kontekst domu lub spacerów i - jeśli je masz - nagrania. Dzięki temu łatwiej ustalić, co naprawdę może napędzać zachowanie i od czego zacząć.
            </p>
            <p>
              Jako doświadczony technik weterynarii i dietetyk patrzę też szerzej: na zdrowie, ból, dietę, środowisko i rytm dnia. Jeśli coś może mieć tło zdrowotne, powiem jasno, kiedy warto równolegle skonsultować się z lekarzem weterynarii.
            </p>
            <Link href={bookHref} prefetch={false} className="reference-btn reference-btn-primary">
              Pomóż mi dobrać pierwszy krok
            </Link>
          </section>

          <PricingDirectBookingSection />

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
