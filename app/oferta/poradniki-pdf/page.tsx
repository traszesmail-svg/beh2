import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PdfBundleCard } from '@/components/PdfBundleCard'
import { PdfGuideCard } from '@/components/PdfGuideCard'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import {
  buildPdfInquiryHref,
  getPdfCategoryLabel,
  listFeaturedPdfGuides,
  listPdfBundles,
  listPdfGuides,
  listPdfGuidesByCategory,
  PDF_GUIDES_LISTING_ROUTE,
  PDF_GUIDES_SITE_DATA,
  type PdfGuideCategory,
} from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'

const categorySections: Record<PdfGuideCategory, { title: string; lead: string }> = {
  dog: {
    title: 'PDF-y dla psów',
    lead: 'Materiały na tematy spacerowe, domowe, startowe i dla pierwszych tygodni ze szczeniakiem.',
  },
  cat: {
    title: 'PDF-y dla kotów',
    lead: 'Materiały dla problemów kuwetowych, napięcia środowiskowego, konfliktu i trudnych procedur.',
  },
  mixed: {
    title: 'PDF-y startowe',
    lead: 'Krótsze materiały, gdy chcesz spokojnie wejść w temat albo uporządkować pierwszy tydzień po zmianie w domu.',
  },
}

const entryChoices = [
  {
    step: '01',
    eyebrow: '1 poradnik PDF',
    title: 'Jeden konkretny temat',
    summary: 'Dobry wybór, gdy problem jest wąski i chcesz wejść od razu w jeden plan działania.',
    href: `${PDF_GUIDES_LISTING_ROUTE}#poradniki-startowe`,
    cta: 'Zobacz pojedyncze PDF-y',
  },
  {
    step: '02',
    eyebrow: 'Pakiet PDF',
    title: 'Kilka części jednego problemu',
    summary: 'Lepszy, gdy temat ma kilka warstw i jeden materiał byłby za krótki na spokojny start.',
    href: `${PDF_GUIDES_LISTING_ROUTE}#pakiety-pdf`,
    cta: 'Zobacz pakiety PDF',
  },
  {
    step: '03',
    eyebrow: 'Kontakt',
    title: 'Chcę najpierw dopytać',
    summary: 'Napisz, jeśli nie chcesz zgadywać między pojedynczym poradnikiem, pakietem i rozmową.',
    href: buildPdfInquiryHref(),
    cta: 'Napisz o PDF',
  },
  {
    step: '04',
    eyebrow: 'Konsultacja 15 min',
    title: 'Temat jest mieszany',
    summary: 'Szybsza droga, gdy problem nie mieści się w jednym PDF-ie albo trzeba najpierw poukładać sytuację.',
    href: '/book',
    cta: 'Umów 15 min',
  },
] as const

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Poradniki PDF',
  path: PDF_GUIDES_LISTING_ROUTE,
  description: 'Poradniki PDF dla opiekunów psów i kotów: pojedyncze materiały, pakiety i spokojny start bez zgadywania.',
})

export default function PdfGuidesListingPage() {
  const featuredGuides = listFeaturedPdfGuides()
  const bundles = listPdfBundles()
  const guides = listPdfGuides()
  const dogGuides = listPdfGuidesByCategory('dog')
  const catGuides = listPdfGuidesByCategory('cat')
  const featuredGuideSlugs = new Set(featuredGuides.map((guide) => guide.slug))
  const categoryGroups = (Object.keys(categorySections) as PdfGuideCategory[])
    .map((category) => {
      const remainingGuides = listPdfGuidesByCategory(category).filter((guide) => !featuredGuideSlugs.has(guide.slug))

      if (remainingGuides.length === 0) {
        return null
      }

      return {
        category,
        section: categorySections[category],
        guides: remainingGuides,
      }
    })
    .filter(
      (
        value,
      ): value is {
        category: PdfGuideCategory
        section: { title: string; lead: string }
        guides: ReturnType<typeof listPdfGuidesByCategory>
      } => value !== null,
    )

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel hero-surface pdf-stage-shell pdf-listing-shell">
          <div className="pdf-stage-hero-grid">
            <div className="pdf-stage-hero-copy">
              <div className="section-eyebrow">{PDF_GUIDES_SITE_DATA.hero.badge}</div>
              <h1>{PDF_GUIDES_SITE_DATA.hero.title}</h1>
              <p className="hero-text">{PDF_GUIDES_SITE_DATA.hero.lead}</p>

              <div className="pdf-stage-pill-row" aria-label="Rodzaje wejścia">
                <span className="hero-proof-pill">1 poradnik PDF</span>
                <span className="hero-proof-pill">Pakiet PDF</span>
                <span className="hero-proof-pill">Kontakt</span>
                <span className="hero-proof-pill">Konsultacja 15 min</span>
              </div>
            </div>

            <aside className="pdf-stage-hero-card tree-backed-card">
              <span className="pdf-stage-hero-label">Najpierw wybierz typ wejścia</span>
              <strong>Jeden poradnik, pakiet, wiadomość albo konsultacja 15 min.</strong>
              <p>Najkrótsza ścieżka, jeśli chcesz zacząć od materiału zamiast od rozmowy, ale bez płaskiej ściany podobnych kart.</p>

              <div className="pdf-stage-hero-stats">
                <div className="pdf-stage-hero-stat">
                  <span>Poradniki</span>
                  <strong>{guides.length}</strong>
                </div>
                <div className="pdf-stage-hero-stat">
                  <span>Pakiety</span>
                  <strong>{bundles.length}</strong>
                </div>
                <div className="pdf-stage-hero-stat">
                  <span>Psy</span>
                  <strong>{dogGuides.length}</strong>
                </div>
                <div className="pdf-stage-hero-stat">
                  <span>Koty</span>
                  <strong>{catGuides.length}</strong>
                </div>
              </div>

              <PdfGuideCoverStack
                guides={featuredGuides}
                title="Najczęściej wybierane poradniki PDF"
                className="pdf-stage-hero-stack"
                showLegend
              />
            </aside>
          </div>

          <div className="pdf-stage-entry-grid top-gap">
            {entryChoices.map((choice) => (
              <article key={choice.step} className="list-card tree-backed-card pdf-stage-entry-card">
                <div className="pdf-stage-entry-topline">
                  <span className="pdf-stage-entry-step" aria-hidden="true">
                    {choice.step}
                  </span>
                  <span className="section-eyebrow">{choice.eyebrow}</span>
                </div>
                <strong>{choice.title}</strong>
                <span>{choice.summary}</span>
                <Link href={choice.href} prefetch={false} className="inline-link">
                  {choice.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="offer-section-block offer-section-block-start" id="poradniki-startowe">
          <div className="offer-section-head">
            <div className="offer-section-title-block">
              <span className="offer-section-marker" aria-hidden="true">
                01
              </span>
              <div>
                <div className="section-eyebrow offer-section-eyebrow">1 poradnik PDF</div>
                <h2>Najprostszy start od jednego materiału</h2>
              </div>
            </div>
            <p className="offer-section-intro">
              Dobre wejście, jeśli temat jest już czytelny i chcesz od razu przejść do jednego planu działania.
            </p>
          </div>

          <div className="offer-grid top-gap">
            {featuredGuides.map((guide) => (
              <PdfGuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section className="offer-section-block offer-section-block-moretime" id="pakiety-pdf">
          <div className="offer-section-head">
            <div className="offer-section-title-block">
              <span className="offer-section-marker" aria-hidden="true">
                02
              </span>
              <div>
                <div className="section-eyebrow offer-section-eyebrow">Pakiety PDF</div>
                <h2>Gdy jeden poradnik to za mało</h2>
              </div>
            </div>
            <p className="offer-section-intro">
              Pakiet porządkuje kilka części tego samego problemu, zanim zdecydujesz, czy potrzebna jest rozmowa.
            </p>
          </div>

          <div className="offer-grid top-gap">
            {bundles.map((bundle) => (
              <PdfBundleCard key={bundle.slug} bundle={bundle} />
            ))}
          </div>
        </section>

        <section className="offer-section-block offer-section-block-further" id="katalog-pdf">
          <div className="offer-section-head">
            <div className="offer-section-title-block">
              <span className="offer-section-marker" aria-hidden="true">
                03
              </span>
              <div>
                <div className="section-eyebrow offer-section-eyebrow">Pozostałe tematy</div>
                <h2>Reszta katalogu po grupach</h2>
              </div>
            </div>
            <p className="offer-section-intro">
              Najczęściej wybierane materiały są wyżej. Tu jest dalsza część katalogu w krótszym, porządkującym układzie.
            </p>
          </div>

          <div className="pdf-category-grid top-gap">
            {categoryGroups.map(({ category, section, guides: groupedGuides }) => (
              <article key={category} className="tree-backed-card pdf-category-block">
                <div className="section-eyebrow">{getPdfCategoryLabel(category)}</div>
                <h3>{section.title}</h3>
                <p>{section.lead}</p>

                <div className="offer-grid top-gap-small">
                  {groupedGuides.map((guide) => (
                    <PdfGuideCard key={guide.slug} guide={guide} compact />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="two-col-section pdf-stage-faq-grid">
          <div className="panel section-panel">
            <div className="section-eyebrow">FAQ</div>
            <h2>Najczęstsze pytania przed wyborem PDF</h2>

            <div className="stack-gap top-gap">
              {PDF_GUIDES_SITE_DATA.faq.map((item) => (
                <div key={item.question} className="list-card tree-backed-card">
                  <strong>{item.question}</strong>
                  <span>{item.answer}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel hero-surface">
            <div className="section-eyebrow">Jak wybrać</div>
            <h2>Co wybrać na start</h2>
            <p className="hero-text">{PDF_GUIDES_SITE_DATA.cta.body}</p>

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>1 poradnik PDF</strong>
                <span>Najlepszy przy jednym konkretnym problemie i chęci wejścia od razu w jeden plan działania.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Pakiet PDF</strong>
                <span>Lepszy, gdy temat obejmuje kilka spraw i chcesz dostać gotowy zestaw materiałów.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Kontakt</strong>
                <span>Tu pytasz o zakup, dostęp albo dobór materiału, jeśli nie chcesz zgadywać między poradnikiem i pakietem.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Konsultacja 15 min</strong>
                <span>Lepsza przy mieszanych albo szerszych tematach, gdy PDF nie domknie całego obrazu sytuacji.</span>
              </div>
            </div>

            <div className="hero-actions top-gap">
              <Link href={buildPdfInquiryHref()} prefetch={false} className="button button-primary big-button">
                {PDF_GUIDES_SITE_DATA.cta.primaryLabel}
              </Link>
              <Link href="/book" prefetch={false} className="button button-ghost big-button">
                {PDF_GUIDES_SITE_DATA.cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </section>

        <Footer variant="full" ctaHref={buildPdfInquiryHref()} ctaLabel="Napisz o PDF" />
      </div>
    </main>
  )
}
