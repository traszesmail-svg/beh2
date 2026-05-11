import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, HeartHandshake, PawPrint, ShieldCheck, Sparkles } from 'lucide-react'
import { HomepageServiceSelector } from '@/components/HomepageServiceSelector'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { type HomepageSelectorAnimal } from '@/lib/homepage-data'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Krótki wybór pierwszego kroku',
  path: '/wybor',
  description: 'Krótki wybór dla opiekunów psów i kotów: wybierz zwierzę, temat i zakres sprawy.',
})

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

        <NotatnikFooter showReviews={false} />
      </div>
    </main>
  )
}
