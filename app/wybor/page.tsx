import type { Metadata } from 'next'
import Image from 'next/image'
import { BadgeCheck, Monitor, PawPrint, ShieldCheck, Star, Stethoscope } from 'lucide-react'
import { HomepageServiceSelector } from '@/components/HomepageServiceSelector'
import { Reveal } from '@/components/Reveal'
import { NotatnikFooter, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { homepageTrustBadges, type HomepageSelectorAnimal } from '@/lib/homepage-data'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Krotki wybor pierwszego kroku',
  path: '/wybor',
  description: 'Krotki wybor dla opiekunow psow i kotow: wybierz zwierze, temat i zakres sprawy.',
})

const trustIcons = [BadgeCheck, Stethoscope, PawPrint, ShieldCheck, Monitor] as const

const opinionCards = [
  {
    species: 'Pies',
    quote: 'Po 15 minutach wiedzialam, co robic ze spacerami. W koncu mamy spokoj.',
    note: 'opiekunka Mii',
  },
  {
    species: 'Kot',
    quote: 'Problem z kuweta wreszcie mial konkretna przyczyne. Duza ulga dla nas i kota.',
    note: 'opiekunka Luny',
  },
  {
    species: 'Pies',
    quote: 'Kwadrans wystarczyl, zeby ustalic pierwszy krok i odzyskac spokoj.',
    note: 'opiekun Bruno',
  },
] as const

function getInitialAnimal(value: string | string[] | undefined): HomepageSelectorAnimal | null {
  if (value === 'dog' || value === 'cat') {
    return value
  }

  return null
}

export default function ChoicePage({ searchParams }: { searchParams?: { animal?: string | string[] } }) {
  const initialAnimal = getInitialAnimal(searchParams?.animal)

  return (
    <main className="notatnik-page homepage-shell">
      <Schema
        data={getBreadcrumbJsonLd([
          { name: 'Strona glowna', path: '/' },
          { name: 'Krotki wybor', path: '/wybor' },
        ])}
      />
      <div className="side-bg side-bg-left home-side-bg-left" aria-hidden="true">
        <Image
          src="/images/homepage/home-bg-dog-1to1.png"
          alt=""
          fill
          priority
          sizes="(max-width: 980px) 0px, (max-width: 1280px) 210px, 320px"
          aria-hidden="true"
        />
      </div>
      <div className="side-bg side-bg-right home-side-bg-right" aria-hidden="true">
        <Image
          src="/images/homepage/home-bg-cat-1to1.png"
          alt=""
          fill
          priority
          sizes="(max-width: 980px) 0px, (max-width: 1280px) 220px, 340px"
          aria-hidden="true"
        />
      </div>

      <div className="notatnik-shell homepage-main">
        <NotatnikTopbar
          tag="Krotki wybor"
          navItems={PUBLIC_SITE_NAV_ITEMS}
          ctaHref="/wybor"
          ctaLabel="Krotki wybor"
          ctaVariant="accent"
        />

        <section className="notatnik-router-quiz-section">
          <div className="home-section-title home-section-title-spacious">
            <h1>Krotki wybor</h1>
            <p>Odpowiedz na kilka pytan i przejdz do najlepszego pierwszego kroku.</p>
          </div>
          <HomepageServiceSelector mode="quiz" initialAnimal={initialAnimal} />
        </section>

        <Reveal as="section" className="notatnik-home-trust-section compact-home-section">
          <div className="trust-bar trust-bar-compact" aria-label="Najwazniejsze informacje">
            {homepageTrustBadges.map((badge, index) => {
              const Icon = trustIcons[index] ?? BadgeCheck

              return (
                <span key={badge.title} className="trust-item">
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  <strong>{badge.title}</strong>
                  {badge.helper ? <small>{badge.helper}</small> : null}
                </span>
              )
            })}
          </div>
        </Reveal>

        <Reveal as="section" className="compact-home-section">
          <div className="home-section-title">
            <h2>Co mowia opiekunowie?</h2>
          </div>
          <div className="notatnik-home-opinion-grid notatnik-home-opinion-grid-short top-gap-small">
            {opinionCards.map((opinion) => (
              <article key={`${opinion.species}-${opinion.note}`} className="notatnik-home-opinion-card">
                <div className="opinion-stars" aria-label="5 gwiazdek">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" strokeWidth={1.6} aria-hidden="true" />
                  ))}
                </div>
                <div className="notatnik-mono">{opinion.species}</div>
                <blockquote>{opinion.quote}</blockquote>
                <span>{opinion.note}</span>
              </article>
            ))}
          </div>
        </Reveal>

        <NotatnikFooter primaryHref="/wybor" primaryLabel="Wroc do wyboru" />
      </div>
    </main>
  )
}
