import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, BookOpen, CalendarCheck, Globe2, HeartHandshake, Mail, PawPrint, ShieldCheck, Sparkles } from 'lucide-react'
import { HomepageServiceSelector } from '@/components/HomepageServiceSelector'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { type HomepageSelectorAnimal } from '@/lib/homepage-data'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { CAPBT_PROFILE_URL, INSTAGRAM_PROFILE_URL, getPublicContactDetails } from '@/lib/site'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Krótki wybór pierwszego kroku',
  path: '/wybor',
  description: 'Krótki wybór dla opiekunów psów i kotów: wybierz zwierzę, temat i zakres sprawy.',
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

const choiceProofItems = [
  { icon: PawPrint, title: 'Indywidualne podejście', copy: 'Dopasowane do potrzeb i możliwości.' },
  { icon: BookOpen, title: 'Wiedza i doświadczenie', copy: 'Praktyka oparta na nauce.' },
  { icon: HeartHandshake, title: 'Empatia i zrozumienie', copy: 'Wsparcie bez oceniania.' },
  { icon: ShieldCheck, title: 'Bez presji i kar', copy: 'Spokojna, etyczna praca.' },
  { icon: Sparkles, title: 'Konkretny pierwszy krok', copy: 'Rekomendacja zamiast zgadywania.' },
] as const

const choiceReviewSets = {
  dog: [
    {
      author: 'Kasia i Niko',
      text: 'Po 3 miesiącach współpracy nasz pies stał się spokojniejszy i bardziej pewny siebie.',
    },
    {
      author: 'Marta i Luna',
      text: 'Profesjonalne i zrozumiałe podejście. Dzięki konsultacji lepiej rozumiemy naszego psa.',
    },
    {
      author: 'Tomek i Bruno',
      text: 'Świetna wiedza poparta praktyką i empatią. Indywidualne podejście krok po kroku.',
    },
  ],
  cat: [
    {
      author: 'Marta i Luna',
      text: 'Konsultacja pomogła nam spokojniej spojrzeć na zachowanie kotki i dobrać pierwszy krok.',
    },
    {
      author: 'Ania i Mela',
      text: 'Zamiast zgadywać, dostaliśmy jasne wskazówki dopasowane do naszego kota i domu.',
    },
    {
      author: 'Paweł i Tosia',
      text: 'Spokojne, konkretne podejście do kociego stresu bez straszenia i oceniania.',
    },
  ],
} as const

function getInitialAnimal(value: string | string[] | undefined): HomepageSelectorAnimal | null {
  if (value === 'dog' || value === 'cat') {
    return value
  }

  return null
}

export default function ChoicePage({ searchParams }: { searchParams?: { animal?: string | string[] } }) {
  const initialAnimal = getInitialAnimal(searchParams?.animal)
  const isCat = initialAnimal === 'cat'
  const petLabel = isCat ? 'kotem' : 'psem'
  const petImage = isCat ? '/images/homepage/home-bg-cat-1to1.webp' : '/images/homepage/home-bg-dog-1to1.webp'
  const petImageAlt = isCat
    ? 'Kot siedzący w spokojnym naturalnym świetle'
    : 'Pies siedzący w spokojnym naturalnym świetle'
  const reviews = isCat ? choiceReviewSets.cat : choiceReviewSets.dog
  const publicContact = getPublicContactDetails()

  return (
    <main className={`notatnik-page homepage-shell choice-page choice-page-${isCat ? 'cat' : 'dog'}`}>
      <Schema
        data={getBreadcrumbJsonLd([
          { name: 'Strona główna', path: '/' },
          { name: 'Krótki wybór', path: '/wybor' },
        ])}
      />
      <NotatnikSideVisuals variant={isCat ? 'cat' : 'dog'} />

      <div className="notatnik-shell homepage-main">
        <NotatnikTopbar
          tag="Krótki wybór"
          navItems={PUBLIC_SITE_NAV_ITEMS}
          ctaHref="/wybor"
          ctaLabel="Krótki wybór"
          ctaVariant="accent"
        />

        <section className="choice-first-screen">
          <div className="choice-hero">
            <div className="choice-hero-copy">
              <h1>Pierwszy krok do spokojniejszego życia z {petLabel}.</h1>
              <p>Odpowiedz na kilka pytań i pomóż mi dobrać najlepsze wsparcie dla Ciebie i Twojego zwierzęcia.</p>
            </div>
            <figure className="choice-hero-media" aria-label={petImageAlt}>
              <Image src={petImage} alt={petImageAlt} fill priority sizes="(max-width: 980px) 100vw, 420px" />
            </figure>
          </div>
          <HomepageServiceSelector mode="quiz" initialAnimal={initialAnimal} />
        </section>

        <section className="choice-proof-strip" aria-label="Dlaczego warto zacząć od krótkiego wyboru">
          {choiceProofItems.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title}>
                <Icon size={25} strokeWidth={1.75} aria-hidden="true" />
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.copy}</small>
                </span>
              </article>
            )
          })}
        </section>

        <section className="choice-reviews-section" aria-labelledby="choice-reviews-title">
          <h2 id="choice-reviews-title">Co mówią opiekunowie?</h2>
          <div className="choice-review-grid">
            {reviews.map((review) => (
              <article key={review.author} className="choice-review-card">
                <div aria-hidden="true">★★★★★</div>
                <p>“{review.text}”</p>
                <span>{review.author}</span>
              </article>
            ))}
          </div>
          <Link href="/opinie" prefetch={false} className="choice-review-link">
            Zobacz więcej opinii
          </Link>
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
