import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  GraduationCap,
  Heart,
  Leaf,
  PawPrint,
  ShieldCheck,
} from 'lucide-react'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { OpinionsReviewGrid, type OpinionReview } from '@/components/OpinionsReviewGrid'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import {
  PUBLIC_CONTACT_EMAIL_FALLBACK,
  SITE_NAME,
  SITE_TAGLINE,
  getPublicContactDetails,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Opinie o konsultacjach behawioralnych',
  path: '/opinie',
  description:
    'Opinie opiekunów psów i kotów po konsultacjach behawioralnych. Historie, które pokazują spokojny proces zmiany.',
})

const bookingHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const addOpinionHref = '/opinie/dodaj'

const filters = [
  'Pies',
  'Kot',
] as const

const reviews: OpinionReview[] = [
  {
    name: 'Monika i Gdzieśtam',
    service: 'Konsultacja online',
    text:
      'Po wielu problemach z moim psem poza kuwetą, jedna konsultacja online z panem Krzysztofem rozwiązała sprawę. Okazało się, że problem był banalny, ale nikt wcześniej nie wpadł na właściwy trop.',
    avatar: '/branding/topic-cards/dog-forest-calm.jpg',
    categories: ['Pies', 'Konsultacje online', 'Problemy behawioralne'],
  },
  {
    name: 'Marta i Luna',
    service: 'Praca nad lękiem separacyjnym',
    text:
      'Profesjonalne i zrozumiałe podejście. Dzięki Krzysztofowi nauczyliśmy się lepiej rozumieć naszego psa i nasze spacery są teraz czystą przyjemnością.',
    avatar: '/branding/topic-cards/french-bulldog-leash.jpg',
    categories: ['Pies', 'Praca z lękiem', 'Konsultacje online'],
  },
  {
    name: 'Tomek i Bruno',
    service: 'Problemy behawioralne',
    text:
      'Świetna wiedza poparta praktyką i empatią. Indywidualne podejście i krok po kroku do realnej, trwałej zmiany. Polecam każdemu opiekunowi!',
    avatar: '/branding/topic-cards/dog-resting-home.jpg',
    categories: ['Pies', 'Problemy behawioralne'],
  },
  {
    name: 'Kasia i Mruczek',
    service: 'Konsultacje online',
    text:
      'Dzięki spotkaniom z panem Krzysztofem nauczyłam się, jak wspierać mojego kota w trudnych sytuacjach. Spokój w domu wrócił, a nasza relacja jest lepsza niż kiedykolwiek.',
    avatar: '/images/homepage/home-bg-cat-1to1.webp',
    categories: ['Kot', 'Konsultacje online'],
  },
  {
    name: 'Paweł i Nala',
    service: 'Agresja do psów',
    text:
      'Rzetelność, ogromna wiedza i indywidualne podejście. Widać serce do zwierząt i pasję do tego, co robi. Zdecydowanie polecam!',
    avatar: '/branding/topic-cards/dog-checkup.jpg',
    categories: ['Pies', 'Agresja', 'Problemy behawioralne'],
  },
  {
    name: 'Agnieszka i Mija',
    service: 'Problemy kuwetowe',
    text:
      'Pan Krzysztof pomógł nam zrozumieć potrzeby naszego kota i wypracować rozwiązania, które naprawdę działają. Cierpliwość i profesjonalizm na najwyższym poziomie.',
    avatar: '/branding/topic-cards/cats/cat-litter-box.jpg',
    categories: ['Kot', 'Problemy behawioralne'],
  },
  {
    name: 'Anna i Mia',
    service: 'Konsultacja online',
    text:
      'Po rozmowie przestaliśmy zgadywać. Dostaliśmy jasną diagnozę sytuacji, pierwsze kroki i spokojny plan obserwacji kota bez nerwowych zmian w domu.',
    avatar: '/branding/case-cat-sofa.jpg',
    categories: ['Kot', 'Konsultacje online', 'Problemy behawioralne'],
  },
  {
    name: 'Karolina i Niko',
    service: 'Kwadrans',
    text:
      'W 15 minut udało się nazwać problem i odróżnić to, co pilne, od tego, co można spokojnie obserwować. Bardzo konkretny pierwszy krok.',
    avatar: '/images/homepage/home-bg-dog-1to1.webp',
    categories: ['Pies', 'Konsultacje online'],
  },
  {
    name: 'Łukasz i Figa',
    service: 'Praca z lękiem',
    text:
      'Najbardziej pomogło mi wyjaśnienie, skąd może brać się napięcie. Plan był prosty i dopasowany do naszego rytmu dnia.',
    avatar: '/branding/topic-cards/dog-window-alone.jpg',
    categories: ['Pies', 'Praca z lękiem', 'Problemy behawioralne'],
  },
  {
    name: 'Natalia i Tosia',
    service: 'Problemy behawioralne',
    text:
      'Nie było oceniania ani straszenia. Były pytania, diagnoza na podstawie informacji i konkret: co zmienić dziś, a co sprawdzać później.',
    avatar: '/branding/topic-cards/cats/cat-anxious-hiding.jpg',
    categories: ['Kot', 'Problemy behawioralne', 'Praca z lękiem'],
  },
  {
    name: 'Michał i Roki',
    service: 'Spacer i reaktywność',
    text:
      'Pierwszy raz ktoś uporządkował nam spacer bez kolejnej magicznej metody. Wiemy, kiedy pies jeszcze daje radę i kiedy trzeba zwiększyć dystans.',
    avatar: '/branding/topic-cards/french-bulldog-leash.jpg',
    categories: ['Pies', 'Problemy behawioralne'],
  },
  {
    name: 'Ewa i Karmel',
    service: 'Konsultacja online',
    text:
      'Dostaliśmy spokojne wyjaśnienie prawdopodobnej przyczyny zachowania i plan pracy bez presji. To dało nam dużo pewności.',
    avatar: '/branding/topic-cards/dog-resting-home.jpg',
    categories: ['Pies', 'Konsultacje online'],
  },
  {
    name: 'Patrycja i Mela',
    service: 'Konflikt między kotami',
    text:
      'Zamiast czekać aż koty same się dogadają, zaczęliśmy od przestrzeni i zasobów. Napięcie w domu wyraźnie spadło.',
    avatar: '/branding/topic-cards/cats/cat-intercat-conflict.jpg',
    categories: ['Kot', 'Problemy behawioralne'],
  },
  {
    name: 'Grzegorz i Sara',
    service: 'Szczeniak',
    text:
      'Konsultacja pomogła nam zrozumieć pobudzenie szczeniaka. Po kilku zmianach w rytmie dnia w domu zrobiło się spokojniej.',
    avatar: '/images/cutover/dog-puppy-home.png',
    categories: ['Pies', 'Szczenięta / Kocięta'],
  },
  {
    name: 'Magda i Leon',
    service: 'Pełna konsultacja',
    text:
      'Przy dłuższym problemie potrzebowaliśmy więcej niż listy porad. Dostaliśmy diagnozę, możliwą etiologię i kierunek pracy krok po kroku.',
    avatar: '/branding/specialist-cat-support.jpg',
    categories: ['Kot', 'Konsultacje online', 'Problemy behawioralne'],
  },
  {
    name: 'Robert i Abi',
    service: 'Agresja i zasoby',
    text:
      'Bardzo spokojne podejście do trudnego tematu. Najpierw bezpieczeństwo i zrozumienie przyczyny, dopiero potem ćwiczenia.',
    avatar: '/branding/topic-cards/dog-checkup.jpg',
    categories: ['Pies', 'Agresja', 'Problemy behawioralne'],
  },
  {
    name: 'Iza i Frida',
    service: 'Konsultacja online',
    text:
      'Dzięki pytaniom Krzysztofa zobaczyliśmy, że problem nie jest jednym zachowaniem, tylko całym układem dnia. To dużo zmieniło.',
    avatar: '/branding/case-dog-home.jpg',
    categories: ['Pies', 'Konsultacje online'],
  },
  {
    name: 'Ola i Kropka',
    service: 'Kuweta',
    text:
      'W końcu mieliśmy kolejność sprawdzania: zdrowie, kuweta, stres i środowisko. Bez losowego zmieniania wszystkiego naraz.',
    avatar: '/branding/topic-cards/cats/cat-litter-box.jpg',
    categories: ['Kot', 'Problemy behawioralne'],
  },
  {
    name: 'Tomasz i Maja',
    service: 'Praca z lękiem',
    text:
      'Najważniejsze było dla nas tempo. Plan nie wymagał forsowania kontaktu, tylko dawał bezpieczne warunki i obserwację reakcji.',
    avatar: '/branding/topic-cards/cats/cat-anxious-hiding.jpg',
    categories: ['Kot', 'Praca z lękiem'],
  },
  {
    name: 'Beata i Hugo',
    service: 'Dwa kwadranse',
    text:
      '30 minut dało nam miejsce na kontekst. Po rozmowie wiedzieliśmy, co jest pierwszym priorytetem i czego nie dokładać psu.',
    avatar: '/branding/case-studies/German_Shepherd.jpg',
    categories: ['Pies', 'Konsultacje online', 'Problemy behawioralne'],
  },
]

const stats = [
  { value: '5.0/5', label: 'średnia ocen', icon: PawPrint },
  { value: '100%', label: 'zaangażowania', icon: ShieldCheck },
  { value: 'Setki', label: 'uratowanych relacji', icon: Heart },
] as const

const proofItems = [
  {
    title: 'Bezpieczeństwo',
    copy: 'Gwarancja etycznych i skutecznych metod.',
    icon: ShieldCheck,
  },
  {
    title: 'Wiedza i doświadczenie',
    copy: 'Praktyka oparta na nauce i wieloletniej pracy.',
    icon: GraduationCap,
  },
  {
    title: 'Empatia i zrozumienie',
    copy: 'Wsparcie dla Ciebie i Twojego zwierzęcia.',
    icon: PawPrint,
  },
  {
    title: 'Skuteczność i zmiana',
    copy: 'Realne efekty i trwała poprawa jakości życia.',
    icon: Leaf,
  },
] as const

function HeroVisual() {
  return (
    <div className="opinions-showcase-hero-visual" aria-hidden="true">
      <Image
        src="/images/opinions/dog-cat-header.png"
        alt=""
        fill
        priority
        sizes="(max-width: 860px) 92vw, 520px"
        className="opinions-showcase-hero-image"
      />
    </div>
  )
}

export default function OpinionsPage() {
  const baseUrl = getCanonicalBaseUrl()
  const contact = getPublicContactDetails()
  const email = contact.email ?? PUBLIC_CONTACT_EMAIL_FALLBACK
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Opinie po konsultacjach behawioralnych online.`,
      url: new URL('/opinie', baseUrl).toString(),
      areaServed: [{ '@type': 'Country', name: 'Polska' }],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5.0',
        reviewCount: String(reviews.length),
        bestRating: '5',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email,
        areaServed: [{ '@type': 'Country', name: 'Polska' }],
      },
    },
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Opinie', path: '/opinie' },
    ]),
  ]

  return (
    <main className="notatnik-page opinions-showcase-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <NotatnikSideVisuals variant="mixed" />
      <div className="notatnik-shell opinions-showcase-shell">
        <NotatnikTopbar
          tag="Opinie"
          navItems={PUBLIC_SITE_NAV_ITEMS}
          ctaHref={bookingHref}
          ctaLabel="Umów pierwszy krok"
        />

        <section className="opinions-showcase-hero">
          <div className="opinions-showcase-hero-copy">
            <span className="opinions-showcase-eyebrow">Opinie</span>
            <h1>
              Historie, które dają nadzieję i pokazują, że <span>zmiana</span> jest możliwa.
            </h1>
            <p>
              Każdy opiekun i każde zwierzę są inne. Poznaj opinie osób, które zaufały mi i wspólnie osiągnęliśmy realną zmianę.
            </p>

            <div className="opinions-showcase-stats" aria-label="Podsumowanie opinii">
              {stats.map((stat) => {
                const Icon = stat.icon

                return (
                  <div key={stat.value} className="opinions-showcase-stat">
                    <Icon size={26} strokeWidth={1.65} />
                    <strong>{stat.value}</strong>
                    <small>{stat.label}</small>
                  </div>
                )
              })}
            </div>
          </div>

          <HeroVisual />
        </section>

        <OpinionsReviewGrid filters={[...filters]} reviews={reviews} />

        <section className="opinions-story-band">
          <div className="opinions-story-copy">
            <Leaf size={58} strokeWidth={1.1} />
            <div>
              <h2>Twoja historia może pomóc innym</h2>
              <p>Każda opinia wspiera innych opiekunów w podjęciu decyzji i daje im nadzieję na lepszą relację ze zwierzęciem.</p>
              <Link href={addOpinionHref} prefetch={false} className="opinions-story-button">
                Dodaj opinię <ArrowRight size={17} strokeWidth={1.8} />
              </Link>
            </div>
          </div>
          <div className="opinions-story-photo" aria-hidden="true">
            <Image src="/images/homepage/home-bg-cat-1to1.webp" alt="" fill sizes="(max-width: 860px) 90vw, 390px" />
          </div>
        </section>

        <section className="opinions-proof-strip" aria-label="Dlaczego opiekunowie wracają do spokojnego procesu">
          {proofItems.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title} className="opinions-proof-item">
                <span>
                  <Icon size={32} strokeWidth={1.55} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            )
          })}
        </section>

        <NotatnikFooter />
      </div>
    </main>
  )
}
