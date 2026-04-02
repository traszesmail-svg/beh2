import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PdfBundleCard } from '@/components/PdfBundleCard'
import { PdfGuideCoverStack } from '@/components/PdfGuideCoverStack'
import { PdfGuideCard } from '@/components/PdfGuideCard'
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
    title: 'Tematy dla opiekunów psów',
    lead: 'Materiały dla sytuacji startowych, spacerowych, domowych i dla pierwszych tygodni ze szczeniakiem.',
  },
  cat: {
    title: 'Tematy dla opiekunów kotów',
    lead: 'Materiały dla problemów kuwetowych, stresu środowiskowego, konfliktu między kotami i trudnych procedur pielęgnacyjnych.',
  },
  mixed: {
    title: 'Materiały startowe i uniwersalne',
    lead: 'Krótsze PDF-y, które pomagają spokojnie wejść w temat albo uporządkować pierwszy tydzień po zmianie w domu.',
  },
}

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Poradniki PDF',
  path: PDF_GUIDES_LISTING_ROUTE,
  description:
    'Listing poradników PDF dla opiekunów psów i kotów: tematy problemowe, materiały wejściowe i pakiety dobierane do konsultacji.',
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

        <section className="panel section-panel">
          <div className="section-eyebrow">{PDF_GUIDES_SITE_DATA.hero.badge}</div>
          <h1>{PDF_GUIDES_SITE_DATA.hero.title}</h1>
          <p className="hero-text">{PDF_GUIDES_SITE_DATA.hero.lead}</p>

          <div className="stats-grid top-gap">
            <div className="stat-card tree-backed-card pdf-stat-card">
              <strong>{guides.length}</strong>
              <span>tematów PDF do wyboru</span>
            </div>
            <div className="stat-card tree-backed-card pdf-stat-card">
              <strong>{bundles.length}</strong>
              <span>pakietów na częste tematy</span>
            </div>
            <div className="stat-card tree-backed-card pdf-stat-card">
              <strong>{dogGuides.length}</strong>
              <span>PDF-y dla psów</span>
            </div>
            <div className="stat-card tree-backed-card pdf-stat-card">
              <strong>{catGuides.length}</strong>
              <span>PDF-y dla kotów</span>
            </div>
          </div>

          <div className="hero-actions top-gap">
            <Link href={buildPdfInquiryHref()} prefetch={false} className="button button-primary big-button">
              Napisz w sprawie poradnika lub pakietu
            </Link>
            <Link href="/book" prefetch={false} className="button button-ghost big-button">
              Umów konsultację 15 min
            </Link>
          </div>

          <div className="pdf-entry-grid top-gap">
            <div className="list-card tree-backed-card pdf-entry-card">
              <div className="section-eyebrow">1 poradnik PDF</div>
              <strong>Najlepszy przy jednym konkretnym temacie</strong>
              <span>Zacznij od najczęściej wybieranych poradników, jeśli problem jest wąski i chcesz wejść od razu w jeden plan działania.</span>
              <Link href={`${PDF_GUIDES_LISTING_ROUTE}#poradniki-startowe`} prefetch={false} className="inline-link">
                Przejdź do pojedynczych poradników
              </Link>
            </div>

            <div className="list-card tree-backed-card pdf-entry-card">
              <div className="section-eyebrow">Pakiet PDF</div>
              <strong>Lepszy, gdy temat ma kilka części</strong>
              <span>Pakiet pomaga, gdy temat dotyczy kilku spraw i trudno wybrać jeden materiał na start.</span>
              <Link href={`${PDF_GUIDES_LISTING_ROUTE}#pakiety-pdf`} prefetch={false} className="inline-link">
                Przejdź do pakietów PDF
              </Link>
            </div>

            <div className="list-card tree-backed-card pdf-entry-card">
              <div className="section-eyebrow">Kontakt</div>
              <strong>Gdy chcesz dopytać przed wyborem</strong>
              <span>Napisz, jeśli chcesz sprawdzić, czy lepszy będzie pakiet czy jeden poradnik.</span>
              <Link href={buildPdfInquiryHref()} prefetch={false} className="inline-link">
                Napisz w sprawie poradnika lub pakietu
              </Link>
            </div>

            <div className="list-card tree-backed-card pdf-entry-card">
              <div className="section-eyebrow">Konsultacja 15 min</div>
              <strong>Lepsza przy mieszanych albo szerszych tematach</strong>
              <span>Jeśli problem nie mieści się w jednym PDF-ie, szybciej będzie zacząć od rozmowy i dopiero potem dobrać materiał uzupełniający.</span>
              <Link href="/book" prefetch={false} className="inline-link">
                Umów konsultację 15 min
              </Link>
            </div>
          </div>

          <div className="pdf-listing-visual top-gap">
            <PdfGuideCoverStack
              guides={featuredGuides}
              title="Najczęściej wybierane poradniki PDF"
              className="pdf-listing-stack"
              showLegend
            />
          </div>
        </section>

        <section className="panel section-panel" id="poradniki-startowe">
          <div className="section-eyebrow">Najczęściej wybierane</div>
          <h2>Pojedyncze poradniki, od których najłatwiej zacząć</h2>
          <p className="hero-text">
            To najszybszy punkt wejścia, jeśli temat jest już dość czytelny. Każda karta prowadzi do jednego poradnika i osobnego
            kontaktu w sprawie zakupu albo dostępu.
          </p>

          <div className="offer-grid top-gap">
            {featuredGuides.map((guide) => (
              <PdfGuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </section>

        <section className="panel section-panel" id="pakiety-pdf">
          <div className="section-eyebrow">Pakiety</div>
          <h2>Pakiety, gdy jeden PDF to za mało</h2>
          <p className="hero-text">
            To dobry wybór przy szerszym temacie. Pakiet od razu pokazuje, co zawiera i czy lepiej pisać o zestawie niż o
            jednym poradniku.
          </p>

          <div className="offer-grid top-gap">
            {bundles.map((bundle) => (
              <PdfBundleCard key={bundle.slug} bundle={bundle} />
            ))}
          </div>
        </section>

        <section className="panel section-panel" id="katalog-pdf">
          <div className="section-eyebrow">Więcej tematów</div>
          <h2>Pozostałe poradniki</h2>
          <p className="hero-text">Najczęściej wybierane materiały są wyżej. Tutaj jest reszta tematów w krótszym układzie.</p>

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

        <section className="two-col-section">
          <div className="panel section-panel">
            <div className="section-eyebrow">FAQ</div>
            <h2>Najczęstsze pytania przed wyborem materiału</h2>

            <div className="stack-gap top-gap">
              {PDF_GUIDES_SITE_DATA.faq.map((item) => (
                <div key={item.question} className="list-card tree-backed-card">
                  <strong>{item.question}</strong>
                  <span>{item.answer}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel">
            <div className="section-eyebrow">Jak wybrać</div>
            <h2>Co wybrać na start</h2>

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>1 poradnik PDF</strong>
                <span>Najlepszy przy jednym konkretnym problemie, kiedy chcesz wejść od razu w temat i plan działania.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Pakiet PDF</strong>
                <span>Lepszy, gdy temat obejmuje kilka spraw i chcesz dostać gotowy zestaw zamiast składać go samodzielnie.</span>
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

        <Footer />
      </div>
    </main>
  )
}
