import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Heart,
  Home,
  Leaf,
  MessageSquare,
  PawPrint,
  Search,
  ShieldCheck,
  Target,
  UsersRound,
  Video,
} from 'lucide-react'
import { EditorialIndexTopbar } from '@/components/EditorialIndexTopbar'
import { NotatnikFooter } from '@/components/NotatnikA'
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
  title: 'Od czego zacząć',
  path: '/od-czego-zaczac',
  description:
    'Pierwszy krok do spokojniejszej relacji z psem albo kotem. Zobacz, jak wygląda współpraca i czego możesz się spodziewać.',
})

const bookingHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const contactHref = '/kontakt#formularz'

const heroProofs = [
  {
    title: 'Profesjonalne wsparcie',
    copy: 'Wiedza i doświadczenie w pracy z psami i kotami.',
    icon: ShieldCheck,
  },
  {
    title: 'Indywidualne podejście',
    copy: 'Każdy opiekun i każde zwierzę są inne - dostosowuję plan do Waszych potrzeb.',
    icon: PawPrint,
  },
  {
    title: 'Empatia i zrozumienie',
    copy: 'Wspieram Ciebie i Twojego zwierzaka na każdym etapie zmiany.',
    icon: Leaf,
  },
  {
    title: 'Skuteczna zmiana',
    copy: 'Pomagam rozwiązywać problemy u źródła, a nie tylko łagodzić objawy.',
    icon: Heart,
  },
] as const

const processSteps = [
  {
    title: 'Umów pierwszy krok',
    copy: 'Wybierz dogodny termin krótkiej konsultacji online. To 30 minut rozmowy, która pozwoli nam się lepiej poznać i zrozumieć problem.',
    icon: CalendarDays,
  },
  {
    title: 'Opowiedz o sytuacji',
    copy: 'Podczas rozmowy opowiedz o trudnościach, z jakimi się mierzycie. Zadamy pytania, które pomogą mi lepiej zrozumieć Waszą sytuację.',
    icon: MessageSquare,
  },
  {
    title: 'Analiza i rekomendacje',
    copy: 'Na podstawie rozmowy otrzymasz moje wstępne rekomendacje i propozycje dalszych kroków.',
    icon: Search,
  },
  {
    title: 'Konsultacja właściwa',
    copy: 'Jeśli zdecydujesz się na dalszą współpracę, spotkamy się na pełnej konsultacji online, aby opracować plan działania.',
    icon: Video,
  },
  {
    title: 'Plan i działanie',
    copy: 'Otrzymasz indywidualny plan oraz moje wsparcie na każdym etapie pracy nad zmianą.',
    icon: ClipboardCheck,
  },
] as const

const expectations = [
  {
    title: 'Zrozumienia',
    copy: 'Pomożemy Ci zrozumieć przyczyny zachowań Twojego zwierzaka.',
    icon: PawPrint,
  },
  {
    title: 'Praktycznych rozwiązań',
    copy: 'Otrzymasz konkretne wskazówki dopasowane do Waszej sytuacji.',
    icon: Leaf,
  },
  {
    title: 'Realnej zmiany',
    copy: 'Wspólnie krok po kroku będziemy pracować nad poprawą jakości życia.',
    icon: Heart,
  },
  {
    title: 'Wsparcia',
    copy: 'Nie zostawiam Cię samego - jestem z Wami na każdym etapie.',
    icon: ShieldCheck,
  },
  {
    title: 'Lepszej relacji',
    copy: 'Budujemy zaufanie i więź opartą na zrozumieniu i szacunku.',
    icon: Target,
  },
] as const

const audience = [
  {
    title: 'Dla psów i kotów',
    copy: 'Pracuję z psami i kotami w każdym wieku.',
    icon: PawPrint,
  },
  {
    title: 'Dla każdego opiekuna',
    copy: 'Niezależnie od doświadczenia - jesteś we właściwym miejscu.',
    icon: Home,
  },
  {
    title: 'Dla różnych problemów',
    copy: 'Od lęku i agresji, po problemy z zachowaniem i więcej.',
    icon: MessageSquare,
  },
  {
    title: 'Dla Ciebie i Twojego zwierzaka',
    copy: 'Razem tworzymy zespół, który pracuje na wspólny sukces.',
    icon: UsersRound,
  },
] as const

function StartHeroVisual() {
  return (
    <div className="start-showcase-hero-visual" aria-hidden="true">
      <div className="start-showcase-hero-blob" style={{ position: 'absolute' }}>
        <Image
          src="/branding/side-visuals/general-dog-walk.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 860px) 92vw, 540px"
        />
      </div>
      <svg className="start-showcase-branch" viewBox="0 0 120 260" aria-hidden="true">
        <path d="M66 244C55 186 56 127 72 40" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M70 96C96 80 105 56 100 31C75 43 62 64 70 96Z" fill="currentColor" />
        <path d="M60 142C31 125 19 100 24 74C51 86 66 111 60 142Z" fill="currentColor" />
        <path d="M63 187C93 171 106 143 101 112C72 127 56 154 63 187Z" fill="currentColor" />
        <path d="M55 219C29 207 17 184 22 158C47 169 62 193 55 219Z" fill="currentColor" />
      </svg>
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="start-section-title">
      <h2>{children}</h2>
      <span aria-hidden="true" />
    </div>
  )
}

export default function StartHerePage() {
  const baseUrl = getCanonicalBaseUrl()
  const contact = getPublicContactDetails()
  const email = contact.email ?? PUBLIC_CONTACT_EMAIL_FALLBACK
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: SITE_NAME,
      description: `${SITE_TAGLINE}. Pierwszy krok do konsultacji behawioralnej online.`,
      url: new URL('/od-czego-zaczac', baseUrl).toString(),
      areaServed: [{ '@type': 'Country', name: 'Polska' }],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email,
        areaServed: [{ '@type': 'Country', name: 'Polska' }],
      },
    },
    getBreadcrumbJsonLd([
      { name: 'Strona główna', path: '/' },
      { name: 'Od czego zacząć', path: '/od-czego-zaczac' },
    ]),
  ]

  return (
    <main className="notatnik-page homepage-shell start-showcase-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="notatnik-shell homepage-main start-showcase-shell">
        <EditorialIndexTopbar />

        <section className="start-showcase-hero">
          <div className="start-showcase-hero-copy">
            <h1>
              <span>Od czego zacząć?</span>
              <span>Pierwszy krok do zmiany</span>
              <em>zaczyna się od zrozumienia.</em>
            </h1>
            <p>
              Nie musisz mieć gotowych odpowiedzi. Jestem tu, aby pomóc Ci zrozumieć Twojego psa lub kota i znaleźć najlepsze rozwiązania.
            </p>
          </div>

          <StartHeroVisual />

          <div className="start-hero-proof-grid" aria-label="Najważniejsze założenia współpracy">
            {heroProofs.map((item) => {
              const Icon = item.icon

              return (
                <article key={item.title} className="start-hero-proof">
                  <Icon size={31} strokeWidth={1.5} />
                  <h2>{item.title}</h2>
                  <p>{item.copy}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="start-process-panel">
          <SectionTitle>Jak wygląda współpraca? To proste!</SectionTitle>
          <div className="start-process-grid">
            {processSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <article key={step.title} className="start-process-card">
                  <span className="start-process-number">{index + 1}</span>
                  <Icon size={40} strokeWidth={1.5} />
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="start-quiz-panel" aria-labelledby="start-quiz-title">
          <div className="start-quiz-copy">
            <span>Rozbudowany quiz</span>
            <h2 id="start-quiz-title">Dobierz pierwszy krok bez zgadywania.</h2>
            <p>
              Jeśli nie wiesz, czy zacząć od krótkiej rozmowy, pełnej konsultacji czy materiału do samodzielnej pracy,
              przejdź przez kilka pytań i zobacz najbliższą ścieżkę.
            </p>
          </div>
          <Link href="/quiz" prefetch={false} className="start-quiz-button">
            Przejdź do rozbudowanego quizu <ArrowRight size={21} strokeWidth={1.9} />
          </Link>
        </section>

        <section className="start-expectations-section">
          <SectionTitle>Czego możesz się spodziewać?</SectionTitle>
          <div className="start-expectations-strip">
            {expectations.map((item) => {
              const Icon = item.icon

              return (
                <article key={item.title} className="start-expectation-item">
                  <Icon size={33} strokeWidth={1.55} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="opinions-story-band start-story-band">
          <div className="opinions-story-copy start-story-copy">
            <Leaf size={64} strokeWidth={1.1} />
            <div>
              <h2>Nie czekaj, aż problem się pogłębi.</h2>
              <p>Im wcześniej zaczniemy, tym szybciej zobaczycie poprawę i odzyskacie spokój w codziennym życiu.</p>
              <div className="start-story-actions">
                <Link href={bookingHref} prefetch={false} className="opinions-story-button">
                  Umów pierwszy krok <ArrowRight size={17} strokeWidth={1.8} />
                </Link>
                <Link href="/opinie" prefetch={false} className="start-story-secondary">
                  Zobacz opinie opiekunów
                </Link>
              </div>
            </div>
          </div>
          <div className="opinions-story-photo start-story-photo" style={{ position: 'absolute' }} aria-hidden="true">
            <Image src="/images/homepage/home-bg-cat-1to1.webp" alt="" fill sizes="(max-width: 860px) 90vw, 420px" />
          </div>
        </section>

        <section className="start-audience-section">
          <SectionTitle>Dla kogo jest moja pomoc?</SectionTitle>
          <div className="start-audience-grid">
            {audience.map((item) => {
              const Icon = item.icon

              return (
                <article key={item.title} className="start-audience-item">
                  <Icon size={36} strokeWidth={1.5} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="opinions-final-cta start-final-cta">
          <span className="opinions-final-icon" aria-hidden="true">
            <CalendarDays size={34} strokeWidth={1.75} />
          </span>
          <div>
            <h2>Gotowy na pierwszy krok?</h2>
            <p>Umów konsultację i zacznijmy wspólnie pracę nad spokojniejszym życiem Waszego zwierzaka.</p>
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

        <NotatnikFooter showReviews={false} />
      </div>
    </main>
  )
}
