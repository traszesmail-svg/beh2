import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  Globe2,
  GraduationCap,
  Heart,
  Leaf,
  Mail,
  Menu,
  MessageSquare,
  PawPrint,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { OpinionsReviewGrid, type OpinionReview } from '@/components/OpinionsReviewGrid'
import { ThemeToggle } from '@/components/ThemeToggle'
import { buildBookHref } from '@/lib/booking-routing'
import { REGULSKI_WEB_LOGO } from '@/lib/regulski-web-assets'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { getCanonicalBaseUrl } from '@/lib/server/env'
import {
  INSTAGRAM_PROFILE_URL,
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
const contactHref = '/kontakt#formularz'
const addOpinionHref = '/opinie/dodaj'

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/niezbednik', label: 'Niezbędnik' },
  { href: '/blog', label: 'Blog' },
  { href: '/kontakt', label: 'Kontakt' },
  { href: '/opinie', label: 'Opinie' },
] as const

const filters = [
  'Wszystkie opinie',
  'Pies',
  'Kot',
  'Konsultacje online',
  'Problemy behawioralne',
  'Praca z lękiem',
  'Agresja',
  'Szczenięta / Kocięta',
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
    avatar: '/images/homepage/home-bg-cat-1to1.png',
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
]

const stats = [
  { value: '500+', label: 'pozytywnych opinii', icon: MessageSquare },
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

function SocialGlyph({ label }: { label: 'facebook' | 'instagram' | 'youtube' }) {
  if (label === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17" cy="7" r="1.2" fill="currentColor" />
      </svg>
    )
  }

  if (label === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.8" y="6.5" width="16.4" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M10.5 9.5v5l4.4-2.5-4.4-2.5Z" fill="currentColor" />
      </svg>
    )
  }

  return <span aria-hidden="true">f</span>
}

function OpinionsHeader() {
  return (
    <header className="opinions-showcase-header">
      <Link href="/" prefetch={false} className="opinions-showcase-brand" aria-label="Regulski Behawiorysta">
        <span className="opinions-showcase-logo">
          <Image src={REGULSKI_WEB_LOGO} alt="" width={512} height={512} priority />
        </span>
        <span className="opinions-showcase-brand-copy">
          <span>Regulski</span>
          <small>Terapia behawioralna</small>
        </span>
      </Link>

      <nav className="opinions-showcase-nav" aria-label="Główna nawigacja">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} prefetch={false} className={item.href === '/opinie' ? 'is-active' : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="opinions-showcase-actions">
        <Link href={bookingHref} prefetch={false} className="opinions-showcase-primary">
          Umów pierwszy krok
        </Link>
        <Link href={contactHref} prefetch={false} className="opinions-showcase-round" aria-label="Kontakt">
          <UserRound size={20} strokeWidth={1.8} />
        </Link>
        <ThemeToggle />
        <details className="opinions-showcase-menu">
          <summary aria-label="Otwórz menu">
            <Menu size={20} strokeWidth={2} />
          </summary>
          <div>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false}>
                {item.label}
              </Link>
            ))}
            <Link href={bookingHref} prefetch={false}>
              Umów pierwszy krok
            </Link>
          </div>
        </details>
      </div>
    </header>
  )
}

function HeroVisual() {
  return (
    <div className="opinions-showcase-hero-visual" aria-hidden="true">
      <div className="opinions-showcase-hero-media opinions-showcase-hero-dog">
        <Image
          src="/images/homepage/home-bg-dog-1to1.png"
          alt=""
          fill
          priority
          sizes="(max-width: 860px) 92vw, 520px"
        />
      </div>
      <div className="opinions-showcase-hero-media opinions-showcase-hero-cat">
        <Image
          src="/images/homepage/home-bg-cat-1to1.png"
          alt=""
          fill
          priority
          sizes="(max-width: 860px) 40vw, 240px"
        />
      </div>
      <svg className="opinions-showcase-wave" viewBox="0 0 600 150" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 78C112 116 188 146 300 142C418 137 504 92 600 64V150H0V78Z" />
      </svg>
      <svg className="opinions-showcase-branch" viewBox="0 0 120 260" aria-hidden="true">
        <path d="M66 244C55 186 56 127 72 40" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M70 96C96 80 105 56 100 31C75 43 62 64 70 96Z" fill="currentColor" />
        <path d="M60 142C31 125 19 100 24 74C51 86 66 111 60 142Z" fill="currentColor" />
        <path d="M63 187C93 171 106 143 101 112C72 127 56 154 63 187Z" fill="currentColor" />
        <path d="M55 219C29 207 17 184 22 158C47 169 62 193 55 219Z" fill="currentColor" />
      </svg>
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
        reviewCount: '500',
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
    <main className="opinions-showcase-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="opinions-showcase-shell">
        <OpinionsHeader />

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
            <Image src="/images/homepage/home-bg-cat-1to1.png" alt="" fill sizes="(max-width: 860px) 90vw, 390px" />
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

        <section className="opinions-final-cta">
          <span className="opinions-final-icon" aria-hidden="true">
            <CalendarDays size={34} strokeWidth={1.75} />
          </span>
          <div>
            <h2>Gotowy na pierwszy krok?</h2>
            <p>Umów konsultację i zacznijcie wspólnie pracę nad spokojniejszym życiem Waszego zwierzęcia.</p>
          </div>
          <div className="opinions-final-actions">
            <Link href={bookingHref} prefetch={false} className="opinions-showcase-primary">
              Umów pierwszy krok <ArrowRight size={17} strokeWidth={1.8} />
            </Link>
            <Link href={contactHref} prefetch={false} className="opinions-final-secondary">
              Wyślij krótką wiadomość
            </Link>
          </div>
        </section>

        <footer className="opinions-showcase-footer">
          <Link href="/" prefetch={false} className="opinions-footer-brand" aria-label="Strona główna Regulski">
            <span className="opinions-footer-logo">
              <Image src={REGULSKI_WEB_LOGO} alt="" width={512} height={512} />
            </span>
            <span>
              <strong>Regulski</strong>
              <small>Terapia behawioralna</small>
            </span>
          </Link>

          <nav className="opinions-footer-nav" aria-label="Nawigacja w stopce">
            {navItems.slice(0, 8).map((item) => (
              <Link key={item.href} href={item.href} prefetch={false}>
                {item.label}
              </Link>
            ))}
            <Link href="/polityka-prywatnosci" prefetch={false}>
              Polityka prywatności
            </Link>
            <Link href="/regulamin" prefetch={false}>
              Regulamin
            </Link>
          </nav>

          <div className="opinions-footer-social" aria-label="Profile publiczne">
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <SocialGlyph label="facebook" />
            </a>
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <SocialGlyph label="instagram" />
            </a>
            <a href={INSTAGRAM_PROFILE_URL} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <SocialGlyph label="youtube" />
            </a>
          </div>

          <div className="opinions-footer-contact">
            <a href={`mailto:${email}`}>
              <Mail size={17} strokeWidth={1.7} />
              {email}
            </a>
            <span>
              <Globe2 size={17} strokeWidth={1.7} />
              Online w całej Polsce
            </span>
          </div>
        </footer>
      </div>
    </main>
  )
}
