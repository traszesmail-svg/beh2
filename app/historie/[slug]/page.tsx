import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CaseStudyFull } from '@/components/CaseStudyFull'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import {
  REAL_CASE_STUDIES,
  getRealCaseStudyBySlug,
  getRealCaseStudyPath,
  type RealCaseStudy,
} from '@/lib/real-case-studies'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { SITE_NAME, SPECIALIST_NAME } from '@/lib/site'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

type StoryPageProps = {
  params: {
    slug: string
  }
}

const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')

export function generateStaticParams() {
  return REAL_CASE_STUDIES.map((caseStudy) => ({ slug: caseStudy.slug }))
}

export function generateMetadata({ params }: StoryPageProps): Metadata {
  const caseStudy = getRealCaseStudyBySlug(params.slug)

  if (!caseStudy) {
    return buildMarketingMetadata({
      title: 'Historia nie znaleziona',
      path: '/historie',
      description: 'Anonimowe sytuacje startowe z konsultacji behawioralnych online.',
    })
  }

  return buildMarketingMetadata({
    title: `${caseStudy.headline} - historia konsultacji`,
    path: getRealCaseStudyPath(caseStudy),
    description: caseStudy.metaDescription,
  })
}

function getCaseStudyArticleJsonLd(caseStudy: RealCaseStudy) {
  const baseUrl = getCanonicalBaseUrl()
  const url = new URL(getRealCaseStudyPath(caseStudy), baseUrl).toString()

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: caseStudy.headline,
    description: caseStudy.metaDescription,
    url,
    mainEntityOfPage: url,
    inLanguage: 'pl-PL',
    author: {
      '@type': 'Person',
      name: SPECIALIST_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  }
}

export default function StoryDetailPage({ params }: StoryPageProps) {
  const caseStudy = getRealCaseStudyBySlug(params.slug)

  if (!caseStudy) {
    notFound()
  }

  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Historie', path: '/historie' },
      { name: caseStudy.headline, path: getRealCaseStudyPath(caseStudy) },
    ]),
    getCaseStudyArticleJsonLd(caseStudy),
  ]

  return (
    <main className="notatnik-page notatnik-historie-page">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="mixed" />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Historie" navItems={PUBLIC_SITE_NAV_ITEMS} ctaHref={audioHref} ctaLabel={FUNNEL_CTA_LABELS.primary} />

        <section className="notatnik-case-detail-page">
          <CaseStudyFull caseStudy={caseStudy} bookingHref={audioHref} />
        </section>

        <NotatnikFooter primaryHref={audioHref} primaryLabel={FUNNEL_CTA_LABELS.primary} showReviews={false} />
      </div>
    </main>
  )
}
