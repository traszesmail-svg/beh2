import type { Metadata } from 'next'
import Link from 'next/link'
import { CaseStudyCard } from '@/components/CaseStudyCard'
import { CaseStudyGrid } from '@/components/CaseStudyGrid'
import { NotatnikFooter, NotatnikSectionHead, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { REAL_CASE_STUDIES, getRealCaseStudyPath } from '@/lib/real-case-studies'
import { getBreadcrumbJsonLd, getItemListJsonLd } from '@/lib/schema'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Historie i sytuacje startowe z konsultacji',
  path: '/historie',
  description:
    'Anonimowe sytuacje startowe z pracy behawioralnej online: psy, koty, pierwszy krok, dalszy kierunek i ograniczenia bez obietnic cudu.',
})

const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')

export default function StoriesPage() {
  const baseUrl = getCanonicalBaseUrl()
  const leadCaseStudy = REAL_CASE_STUDIES[0]
  const structuredData = [
    getBreadcrumbJsonLd([
      { name: 'Strona glowna', path: '/' },
      { name: 'Historie', path: '/historie' },
    ]),
    getItemListJsonLd(
      REAL_CASE_STUDIES.map((caseStudy) => ({
        name: caseStudy.headline,
        url: new URL(getRealCaseStudyPath(caseStudy), baseUrl).toString(),
      })),
    ),
  ]

  return (
    <main className="notatnik-page notatnik-historie-page">
      <Schema data={structuredData} />
      <NotatnikSideVisuals variant="mixed" />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Historie" navItems={PUBLIC_SITE_NAV_ITEMS} ctaHref={audioHref} ctaLabel={FUNNEL_CTA_LABELS.primary} />

        <section className="notatnik-subhero notatnik-case-hub-hero">
          <div className="notatnik-subhero-copy">
            <div className="notatnik-subhero-tag">Historie / punkt startu</div>
            <h1>
              Zobacz, jak wyglada <em>porzadkowanie problemu</em>.
            </h1>
            <p>
              To anonimowe sytuacje startowe, ktore pokazuja sposob myslenia w konsultacji: co trzeba nazwac najpierw, gdzie ustawic priorytet i kiedy
              temat wymaga szerszej pracy. Bez obietnic identycznego efektu.
            </p>
            <div className="notatnik-subhero-actions">
              <Link href={audioHref} prefetch={false} className="notatnik-btn">
                <span>Zacznij od Kwadransa</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              <Link href="/opinie" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Zobacz opinie</span>
              </Link>
            </div>
          </div>

          <aside className="notatnik-case-hero-card" aria-label="Przykladowa historia">
            {leadCaseStudy ? <CaseStudyCard caseStudy={leadCaseStudy} priority /> : null}
          </aside>
        </section>

        <section id="lista">
          <NotatnikSectionHead index="I." kicker="Anonimowe przypadki" title="Sytuacje najblizsze temu, co opisuja opiekunowie." />
          <p className="notatnik-service-description">
            Nie musisz znalezc historii identycznej z Twoja. Te karty maja pomoc zobaczyc, jak wyglada pierwszy krok przy podobnym problemie.
          </p>
          <div className="top-gap-small">
            <CaseStudyGrid caseStudies={REAL_CASE_STUDIES} />
          </div>
        </section>

        <section id="dalej" className="notatnik-case-final">
          <NotatnikSectionHead index="II." kicker="Dalej" title="Jesli problem pasuje do kilku historii, zacznij prosto." />
          <p className="notatnik-service-description">
            Przy pierwszym kontakcie nie trzeba znac diagnozy. Wystarczy opis sytuacji, zwierzecia, rytmu dnia i tego, co najbardziej obciaza dom.
          </p>
          <div className="notatnik-subhero-actions top-gap-small">
            <Link href={audioHref} prefetch={false} className="notatnik-btn">
              <span>{FUNNEL_CTA_LABELS.primary}</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href={consultationHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Umow pelna konsultacje</span>
            </Link>
          </div>
        </section>

        <NotatnikFooter primaryHref={audioHref} primaryLabel={FUNNEL_CTA_LABELS.primary} showReviews={false} />
      </div>
    </main>
  )
}
