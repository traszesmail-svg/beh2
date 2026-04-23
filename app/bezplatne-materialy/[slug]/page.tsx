import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { LeadMagnetSignup } from '@/components/LeadMagnetSignup'
import { NotatnikPageShell, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { TrustSignalSection } from '@/components/TrustSignalSection'
import { buildBookHref } from '@/lib/booking-routing'
import { getLeadMagnetBySlug, LEAD_MAGNETS } from '@/lib/growth-layer'
import { buildMarketingMetadata } from '@/lib/seo'
import { TRUST_SIGNAL_SETS } from '@/lib/trust-layer'

type LeadMagnetPageProps = {
  params: {
    slug: string
  }
}

export const dynamicParams = false

export function generateStaticParams() {
  return LEAD_MAGNETS.map((magnet) => ({
    slug: magnet.slug,
  }))
}

export function generateMetadata({ params }: LeadMagnetPageProps): Metadata {
  const magnet = getLeadMagnetBySlug(params.slug)

  if (!magnet) {
    return buildMarketingMetadata({
      title: 'Bezpłatne materiały',
      path: '/niezbednik',
      description: 'Bezpłatne materiały na spokojny start.',
    })
  }

  return buildMarketingMetadata({
    title: magnet.title,
    path: `/bezplatne-materialy/${magnet.slug}`,
    description: magnet.subtitle,
    appendLocalContext: false,
  })
}

export default function LeadMagnetPage({ params }: LeadMagnetPageProps) {
  const magnet = getLeadMagnetBySlug(params.slug)

  if (!magnet) {
    notFound()
  }

  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')

  return (
    <NotatnikPageShell
      tag="Bezplatny material / start"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref={audioHref}
      ctaLabel="Kwadrans / 69 zl"
      footerPrimaryHref={audioHref}
      footerPrimaryLabel="Kwadrans z behawiorysta"
    >
      <div className="container editorial-stack">
        <section className="editorial-hero-shell premium-hero-shell">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">Bezpłatny materiał</div>
              <h1>{magnet.h1}</h1>
              <p className="editorial-hero-lead">{magnet.subtitle}</p>
              <p className="muted">{magnet.lead}</p>

              <FunnelPrimaryActions
                audioHref={audioHref}
                consultationHref={consultationHref}
                contactHref="/kontakt#formularz"
                primaryLocation={`${magnet.slug}-hero-audio`}
                secondaryLocation={`${magnet.slug}-hero-toolkit`}
                note={<span>Jeśli po materiale chcesz od razu odnieść temat do swojej sytuacji, wybierz Kwadrans z behawiorystą.</span>}
              />
            </div>
          </div>
        </section>

        <section className="panel section-panel editorial-section">
          <div className="premium-two-column-grid top-gap-small">
            <LeadMagnetSignup magnet={magnet} location={`${magnet.slug}-page`} sourcePage={`/bezplatne-materialy/${magnet.slug}`} />

            <article className="summary-card tree-backed-card">
              <div className="section-eyebrow">Co znajdziesz</div>
              <h2>{magnet.shortTitle}</h2>
              <ul className="premium-bullet-list top-gap-small">
                {magnet.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="muted top-gap-small">{magnet.note}</p>
            </article>
          </div>
        </section>

        <TrustSignalSection
          eyebrow="Dlaczego ten materiał pomaga"
          title="To nie jest kolejny przypadkowy PDF do zapisania na później"
          description="Ten materiał pomaga uporządkować temat przed rozmową i ułatwia spokojny start."
          items={magnet.benefitCards}
        />

        <EditorialFaqSection
          id="faq"
          title="Krótki FAQ przed pobraniem"
          description="Najczęstsze pytania pojawiają się jeszcze przed zapisem. Tu zostaje tylko minimum potrzebne do decyzji."
          items={magnet.faq}
          afterContent={
            <p className="muted top-gap-small">
              Jeśli po materiale temat nadal będzie niejasny, kolejnym krokiem będzie Kwadrans z behawiorystą.
            </p>
          }
        />

        <TrustSignalSection
          eyebrow="Po pobraniu"
          title={magnet.followUpTitle}
          description={magnet.followUpBody}
          items={TRUST_SIGNAL_SETS.toolkit}
        />

        <section className="panel section-panel blog-related-panel">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Dalej z tego tematu</div>
              <h2>Co możesz zrobić dalej</h2>
            </div>
            <p className="editorial-section-lead">
              Po materiale możesz wrócić do strony tematycznej, przeczytać powiązany tekst w blogu albo przejść do Kwadransu z behawiorystą, jeśli temat okaże się bardziej złożony.
            </p>
          </div>

          <div className="blog-related-grid top-gap-small">
            <Link href={magnet.categoryHref} prefetch={false} className="summary-card tree-backed-card blog-related-card">
              <strong>{magnet.categoryLabel}</strong>
              <span>Wróć do strony tematycznej</span>
            </Link>
            {magnet.relatedLinks.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} className="summary-card tree-backed-card blog-related-card">
                <strong>{item.label}</strong>
                <span>Powiązany kontekst do tego materiału</span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </NotatnikPageShell>
  )
}
