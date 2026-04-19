import type { Metadata } from 'next'
import Link from 'next/link'
import { EditorialFaqSection } from '@/components/EditorialFaqSection'
import { Footer } from '@/components/Footer'
import { FunnelPrimaryActions } from '@/components/FunnelPrimaryActions'
import { Header } from '@/components/Header'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import { SITE_NAME, SITE_TAGLINE, SPECIALIST_CREDENTIALS, SPECIALIST_NAME } from '@/lib/site'

const baseMetadata = buildMarketingMetadata({
  title: 'FAQ',
  path: '/faq',
  description: 'Najczęstsze pytania przed kontaktem i pierwszą rozmową.',
})

export const metadata: Metadata = {
  ...baseMetadata,
  robots: { index: false, follow: true },
}

type TopicLink = {
  eyebrow: string
  title: string
  copy: string
  href: string
}

const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const contactHref = '/kontakt#formularz'

const topicLinks: TopicLink[] = [
  {
    eyebrow: 'Konsultacja',
    title: 'Jak wygląda pierwsza rozmowa',
    copy: 'Pytania o start rozmowy, przebieg spotkania i to, co dostajesz po konsultacji.',
    href: '/konsultacja-behawioralna-online#faq',
  },
  {
    eyebrow: 'Psy',
    title: 'Pytania o psy',
    copy: 'Spacery, reaktywność, pobudzenie, rozłąka i trudności w domu.',
    href: '/psy#faq',
  },
  {
    eyebrow: 'Koty',
    title: 'Pytania o koty',
    copy: 'Kuweta, wycofanie, napięcie między kotami i zmiany w otoczeniu.',
    href: '/koty#faq',
  },
  {
    eyebrow: 'Podejście',
    title: 'Jak pracuję',
    copy: 'Sposób pracy i to, czego możesz się spodziewać po rozmowie.',
    href: '/o-mnie#faq',
  },
]

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'FAQ',
    description: `${SITE_NAME}. ${SITE_TAGLINE}.`,
    url: new URL('/faq', getCanonicalBaseUrl()).toString(),
    mainEntity: {
      '@type': 'Person',
      name: SPECIALIST_NAME,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SPECIALIST_NAME,
    jobTitle: 'Behawiorysta i trener zwierząt towarzyszących',
    description: `${SPECIALIST_CREDENTIALS}.`,
  },
]

export default function FaqPage() {
  return (
    <main className="page-wrap editorial-home-page premium-home-page faq-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <div className="container editorial-stack">
        <Header />

        <section className="editorial-hero-shell premium-hero-shell faq-hero-shell" id="start">
          <div className="editorial-hero-grid">
            <div className="editorial-hero-copy">
              <div className="section-eyebrow">FAQ</div>
              <h1>Najczęstsze pytania przed kontaktem</h1>
              <p className="editorial-hero-lead">
                Jeśli potrzebujesz odpowiedzi od razu, znajdziesz tu najważniejsze pytania o Kwadrans z behawiorystą,
                konsultację 60 min i krótką wiadomość.
              </p>

              <FunnelPrimaryActions
                audioHref={audioHref}
                consultationHref={consultationHref}
                contactHref={contactHref}
                primaryLocation="faq-hero-audio"
                secondaryLocation="faq-hero-toolkit"
                actionsClassName="hero-actions editorial-hero-actions"
              />
            </div>
          </div>
        </section>

        <EditorialFaqSection
          id="faq"
          eyebrow="Najczęstsze pytania"
          title="Pytania, które najczęściej pojawiają się przed kontaktem"
          description="Krótko, konkretnie i bez zbędnych objaśnień."
          items={FAQ_SHORTLISTS.home}
        />

        <section className="panel section-panel editorial-section" id="tematy">
          <div className="editorial-section-head">
            <div className="editorial-section-head-copy">
              <div className="section-eyebrow">Wybierz temat</div>
              <h2>Przejdź do pytań z Twojego obszaru</h2>
            </div>
            <p className="editorial-section-lead">
              Pytania są ułożone w kontekście psa, kota, konsultacji i sposobu pracy.
            </p>
          </div>

          <nav className="faq-quick-grid top-gap" aria-label="Tematyczne sekcje FAQ">
            {topicLinks.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                prefetch={false}
                className="summary-card tree-backed-card faq-anchor-card"
                aria-label={`${card.title} - przejdź do pytań`}
              >
                <span className="pill subtle-pill">{card.eyebrow}</span>
                <h3>{card.title}</h3>
                <p className="muted">{card.copy}</p>
                <span className="faq-anchor-card-cta">Przejdź do pytań</span>
              </Link>
            ))}
          </nav>
        </section>

        <section className="panel cta-panel editorial-final-panel faq-short-contact-panel" id="kontakt">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Nie widzisz pytania?</div>
            <h2>Nie musisz znaleźć tu swojej sytuacji 1:1</h2>
            <p>
              Wystarczy krótka wiadomość. Wspólnie ustalimy, czy najlepszym startem będzie Kwadrans z behawiorystą,
              konsultacja 60 min czy po prostu wiadomość.
            </p>

            <FunnelPrimaryActions
              audioHref={audioHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="faq-short-contact-audio"
              secondaryLocation="faq-short-contact-toolkit"
            />
          </div>
        </section>

        <section className="panel cta-panel editorial-final-panel faq-final-cta-panel" id="final-cta">
          <div className="editorial-final-copy">
            <div className="section-eyebrow">Pierwszy krok</div>
            <h2>Masz już wystarczająco dużo, żeby się odezwać</h2>
            <p>
              Jeśli chcesz spokojnie uporządkować sytuację psa albo kota, wybierz Kwadrans z behawiorystą, konsultację
              60 min albo napisz wiadomość. Nie musisz przygotowywać wszystkiego przed kontaktem.
            </p>

            <FunnelPrimaryActions
              audioHref={audioHref}
              consultationHref={consultationHref}
              contactHref={contactHref}
              primaryLocation="faq-final-audio"
              secondaryLocation="faq-final-toolkit"
            />
          </div>
        </section>

        <Footer
          variant="home"
          sectionBasePath="/faq"
          ctaHref={audioHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/niezbednik"
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
        />
      </div>
    </main>
  )
}
