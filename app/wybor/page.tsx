import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, BookOpen, CalendarCheck, Globe2, HeartHandshake, Mail } from 'lucide-react'
import { HomepageServiceSelector } from '@/components/HomepageServiceSelector'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { type HomepageSelectorAnimal } from '@/lib/homepage-data'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL, getPublicContactDetails } from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Krotki wybor pierwszego kroku',
  path: '/wybor',
  description: 'Krotki wybor dla opiekunow psow i kotow: wybierz zwierze, temat i zakres sprawy.',
})

const quickInfoCards = [
  {
    icon: BadgeCheck,
    title: 'Dyplomant COAPE',
    copy: 'Publiczny profil CAPBT / COAPE.',
  },
  {
    icon: BookOpen,
    title: 'Psy i koty',
    copy: 'Sprawy behawioralne, start i dalsze kroki.',
  },
  {
    icon: HeartHandshake,
    title: 'Bez oceniania',
    copy: 'Praca z sytuacją, nie z poczuciem winy opiekuna.',
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
  const publicContact = getPublicContactDetails()

  return (
    <main className="notatnik-page homepage-shell">
      <Schema
        data={getBreadcrumbJsonLd([
          { name: 'Strona glowna', path: '/' },
          { name: 'Krotki wybor', path: '/wybor' },
        ])}
      />
      <NotatnikSideVisuals variant="contact" />

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

        <section className="choice-contact-section">
          <article className="choice-info-card">
            <h2>Szybkie informacje</h2>
            <div className="choice-info-list">
              {quickInfoCards.map((card) => {
                const Icon = card.icon

                return (
                  <div key={card.title} className="choice-info-row">
                    <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                    <span>
                      <strong>{card.title}</strong>
                      <small>{card.copy}</small>
                    </span>
                  </div>
                )
              })}
            </div>
            <Link href="/konsultacja-behawioralna-online" prefetch={false} className="choice-secondary-link">
              Jak wygląda pełna konsultacja
            </Link>
          </article>

          <article className="choice-info-card">
            <h2>Kontakt bez formularza</h2>
            <div className="choice-info-list">
              <a href={`mailto:${publicContact.email}`} className="choice-info-row">
                <Mail size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>E-mail</strong>
                  <small>{publicContact.email}</small>
                </span>
              </a>
              <div className="choice-info-row">
                <CalendarCheck size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Odpowiedź</strong>
                  <small>1-2 dni robocze</small>
                </span>
              </div>
              <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="choice-info-row">
                <Globe2 size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Instagram</strong>
                  <small>@regulskibehawiorysta</small>
                </span>
              </a>
              <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="choice-info-row">
                <Globe2 size={22} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Profil COAPE</strong>
                  <small>behawioryscicoape.pl/Regulski</small>
                </span>
              </a>
            </div>
          </article>
        </section>

        <NotatnikFooter showReviews={false} />
      </div>
    </main>
  )
}
