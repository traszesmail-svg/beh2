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
  title: 'Pomóż mi dobrać pierwszy krok',
  path: '/wybor',
  description: 'Quiz dla opiekunów psów i kotów: opisz sytuację i sprawdź najrozsądniejszy pierwszy krok.',
})

const choiceProofItems = [
  { icon: PawPrint, title: 'Zaczynamy od sytuacji', copy: 'Nie musisz znać fachowej nazwy zachowania.' },
  { icon: BookOpen, title: 'Szersze spojrzenie', copy: 'Behawior, zdrowie, dieta, środowisko i rutyna.' },
  { icon: HeartHandshake, title: 'Empatia i zrozumienie', copy: 'Wsparcie bez oceniania.' },
  { icon: ShieldCheck, title: 'Bez presji i kar', copy: 'Spokojna, etyczna praca.' },
  { icon: Sparkles, title: 'Konkretny pierwszy krok', copy: 'Najrozsądniejszy kierunek zamiast zgadywania.' },
] as const

const choiceReviewSets = {
  dog: [
    {
      author: 'Opiekunka psa - reakcje na spacerze',
      text: 'Przed rozmową mieliśmy w głowie chaos: spacer, szczekanie, emocje. Po konsultacji wiedzieliśmy, co robimy najpierw i czego na razie nie dokładać.',
    },
    {
      author: 'Opiekunka psa - praca w domu',
      text: 'Najbardziej pomogło mi to, że nikt mnie nie oceniał. Zamiast listy zakazów dostałam prosty plan, który dało się wdrożyć w naszym domu.',
    },
    {
      author: 'Opiekunowie kota - kuweta i napięcie',
      text: 'Myśleliśmy, że kotka jest złośliwa. Po rozmowie zobaczyliśmy, że to raczej napięcie i środowisko. Wreszcie wiedzieliśmy, co sprawdzić po kolei.',
    },
  ],
  cat: [
    {
      author: 'Opiekunka psa - reakcje na spacerze',
      text: 'Przed rozmową mieliśmy w głowie chaos: spacer, szczekanie, emocje. Po konsultacji wiedzieliśmy, co robimy najpierw i czego na razie nie dokładać.',
    },
    {
      author: 'Opiekunka psa - praca w domu',
      text: 'Najbardziej pomogło mi to, że nikt mnie nie oceniał. Zamiast listy zakazów dostałam prosty plan, który dało się wdrożyć w naszym domu.',
    },
    {
      author: 'Opiekunowie kota - kuweta i napięcie',
      text: 'Myśleliśmy, że kotka jest złośliwa. Po rozmowie zobaczyliśmy, że to raczej napięcie i środowisko. Wreszcie wiedzieliśmy, co sprawdzić po kolei.',
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
  const petImage = isCat ? '/images/homepage/home-bg-cat-1to1.webp' : '/images/homepage/home-bg-dog-1to1.webp'
  const petImageAlt = isCat
    ? 'Kot siedzący w spokojnym naturalnym świetle'
    : 'Pies siedzący w spokojnym naturalnym świetle'
  const reviews = isCat ? choiceReviewSets.cat : choiceReviewSets.dog
  const heroTitle = isCat ? 'Zobaczmy, co Twój kot próbuje pokazać zachowaniem' : 'Zacznijmy od tego, co najbardziej przeszkadza Wam dziś'
  const heroCopy = 'Odpowiedz na kilka krótkich pytań. Na końcu zobaczysz najrozsądniejszy format rozmowy - bez zgadywania, co wybrać.'

  return (
    <main className={`notatnik-page homepage-shell choice-page choice-page-${isCat ? 'cat' : 'dog'}`}>
      <Schema
        data={getBreadcrumbJsonLd([
          { name: 'Strona główna', path: '/' },
          { name: 'Quiz', path: '/wybor' },
        ])}
      />
      <NotatnikSideVisuals variant={isCat ? 'cat' : 'dog'} />

      <div className="notatnik-shell homepage-main">
        <NotatnikTopbar
          tag="Quiz"
          navItems={PUBLIC_SITE_NAV_ITEMS}
          ctaHref="/wybor"
          ctaLabel="Quiz"
          ctaVariant="accent"
        />

        <section className="choice-first-screen">
          <div className="choice-hero">
            <div className="choice-hero-copy">
              <h1>{heroTitle}</h1>
              <p>{heroCopy}</p>
            </div>
            <figure className="choice-hero-media" aria-label={petImageAlt}>
              <Image src={petImage} alt={petImageAlt} fill priority sizes="(max-width: 980px) 100vw, 420px" />
            </figure>
          </div>
          <HomepageServiceSelector mode="quiz" initialAnimal={initialAnimal} />
        </section>

        <section className="choice-proof-strip" aria-label="Dlaczego warto zacząć od quizu">
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
          <h2 id="choice-reviews-title">Co mówią opiekunowie po rozmowie?</h2>
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
