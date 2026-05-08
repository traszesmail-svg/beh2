import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChevronDown,
  GraduationCap,
  Heart,
  Leaf,
  Mail,
  PawPrint,
  ShieldCheck,
  Sparkles,
  UserRound,
  Globe2,
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { CAPBT_PROFILE_URL, getPublicContactDetails } from '@/lib/site'
import { REGULSKI_WEB_LOGO } from '@/lib/regulski-web-assets'
import { buildMarketingMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Behawiorysta kotów online | Regulski Behawiorysta',
  path: '/koty',
  description:
    'Pomoc behawioralna online dla opiekunów kotów. Krótki wybór tematu, konsultacja 15 minut albo dłuższe wsparcie z Krzysztofem Regulskim.',
})

const quickHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, 'kot')
const bridgeHref = buildBookHref(null, 'konsultacja-30-min', false, 'kot')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, 'kot')
const catHeroImage = '/branding/topic-cards/cats/cat-night-meowing.jpg'

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/niezbednik', label: 'Niezbędnik' },
  { href: '/blog', label: 'Blog' },
  { href: '/kontakt', label: 'Kontakt' },
] as const

const trustItems = [
  {
    icon: Leaf,
    title: 'Bez kar i przymusu',
    copy: 'Pracuję etycznie i z szacunkiem.',
  },
  {
    icon: PawPrint,
    title: 'Indywidualne podejście',
    copy: 'Dopasowane do Waszych potrzeb i możliwości.',
  },
  {
    icon: GraduationCap,
    title: 'Wiedza i doświadczenie',
    copy: 'Praktyka oparta na nauce i wieloletniej pracy.',
  },
  {
    icon: Heart,
    title: 'Empatia i zrozumienie',
    copy: 'Wsparcie dla Ciebie i Twojego kota.',
  },
] as const

const footerTrust = [
  'Certyfikowany behawiorysta COAPE / CAPBT',
  'Technik weterynarii',
  'Pracuję online',
  'Dla kotów i psów',
  'W całej Polsce',
] as const

const reviews = [
  {
    quote: 'Dzięki konsultacji lepiej rozumiem mojego kota i wiem, jak mu pomóc. Efekty przerosły moje oczekiwania.',
    author: 'Kasia i Luna',
  },
  {
    quote: 'Profesjonalne podejście, ogromna wiedza i empatia. Polecam każdemu, kto chce naprawdę pomóc swojemu kotu.',
    author: 'Marta i Filemon',
  },
  {
    quote: 'Świetna wiedza poparta praktyką i cierpliwość. W końcu rozumiemy się z naszym kotem.',
    author: 'Tomek i Mru',
  },
] as const

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" prefetch={false} className="cat-ref-brand" aria-label="Regulski Behawiorysta - strona główna">
      <span className="cat-ref-logo" aria-hidden="true">
        <Image src={REGULSKI_WEB_LOGO} alt="" width={512} height={512} priority={!compact} />
      </span>
      <span className="cat-ref-brand-copy">
        <strong>Regulski</strong>
        <em>Terapia behawioralna</em>
      </span>
    </Link>
  )
}

function SelectLike({ label, value }: { label: string; value: string }) {
  return (
    <label className="cat-ref-select">
      <span>{label}</span>
      <span className="cat-ref-select-box">
        {value}
        <ChevronDown aria-hidden="true" />
      </span>
    </label>
  )
}

export default function CatsPage() {
  const contact = getPublicContactDetails()
  const structuredData = [
    getBreadcrumbJsonLd([{ name: 'Strona główna', path: '/' }, { name: 'Koty', path: '/koty' }]),
    getServiceJsonLd({
      name: 'Pomoc behawioralna dla opiekunów kotów online',
      description: 'Konsultacje online dla opiekunów kotów: kuweta, wycofanie, stres po zmianach i napięcie między kotami.',
      serviceUrl: '/behawiorysta-online-polska',
      offerPrice: 69,
      offerCatalog: [
        {
          name: '15-minutowa konsultacja behawioralna',
          description: '15 minut rozmowy audio bez kamery dla opiekuna kota.',
          url: quickHref,
          price: 69,
        },
        {
          name: 'Dwa kwadranse',
          description: '30 minut online na spokojniejsze uporządkowanie tematu kota.',
          url: bridgeHref,
          price: 169,
        },
        {
          name: 'Pełna konsultacja behawioralna',
          description: 'Szersza konsultacja online dla tematów kocich wielowątkowych albo długotrwałych.',
          url: consultationHref,
          price: 470,
        },
      ],
    }),
  ]

  return (
    <main className="cat-ref-page">
      <Schema data={structuredData} />
      <div className="cat-ref-shell">
        <header className="cat-ref-header">
          <BrandLockup />
          <nav className="cat-ref-nav" aria-label="Nawigacja">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false} data-active={item.href === '/koty' ? 'true' : 'false'}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="cat-ref-header-actions">
            <Link href={quickHref} prefetch={false} className="cat-ref-primary">
              Umów pierwszy krok
            </Link>
            <Link href="/kontakt" prefetch={false} className="cat-ref-round" aria-label="Kontakt">
              <UserRound aria-hidden="true" />
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <section className="cat-ref-hero">
          <div className="cat-ref-hero-copy">
            <h1>
              <span>Pierwszy krok</span>
              <span>do spokojniejszego życia</span>
              <span>
                z Twoim <em>kotem</em>
              </span>
            </h1>
            <p>Odpowiedz na kilka pytań, a pomogę dobrać najlepsze wsparcie dla Ciebie i Twojego kota.</p>
          </div>
          <div className="cat-ref-hero-media" aria-hidden="true">
            <Image
              src={catHeroImage}
              alt=""
              fill
              priority
              sizes="(max-width: 900px) 90vw, 520px"
              className="cat-ref-hero-image"
            />
          </div>
        </section>

        <section className="cat-ref-values" aria-label="Zasady pracy">
          {trustItems.map((item) => {
            const Icon = item.icon

            return (
              <article key={item.title}>
                <Icon aria-hidden="true" />
                <strong>{item.title}</strong>
                <p>{item.copy}</p>
              </article>
            )
          })}
        </section>

        <section className="cat-ref-choice" aria-labelledby="cat-choice-title">
          <div className="cat-ref-choice-head">
            <h2 id="cat-choice-title">Krótki wybór</h2>
            <p>Nie wiesz, co wybrać? Przejdź przez krótki wybór, a pomogę Ci znaleźć najlepsze rozwiązanie.</p>
          </div>

          <div className="cat-ref-choice-grid">
            <div className="cat-ref-step">
              <strong>1. Z kim potrzebujesz wsparcia?</strong>
              <div className="cat-ref-animal-options">
                <Link href="/psy" prefetch={false} className="cat-ref-animal-card">
                  <span className="cat-ref-animal-photo">
                    <Image src="/images/homepage/home-bg-dog-1to1.png" alt="" fill sizes="92px" />
                  </span>
                  Pies
                </Link>
                <span className="cat-ref-animal-card cat-ref-animal-card-active" aria-current="true">
                  <span className="cat-ref-animal-photo">
                    <Image src="/images/homepage/home-bg-cat-1to1.png" alt="" fill sizes="92px" />
                  </span>
                  Kot
                  <Check aria-hidden="true" />
                </span>
              </div>
              <Link href="/wybor" prefetch={false} className="cat-ref-text-link">
                Nie wiem, z kim potrzebuję wsparcia
              </Link>
            </div>

            <SelectLike label="2. Opisz ogólny problem:" value="Wybierz problem" />
            <SelectLike label="3. Jakiej pomocy szukasz?" value="Wybierz formę pomocy" />
            <SelectLike label="4. Doświadczenie:" value="Wybierz doświadczenie" />

            <div className="cat-ref-choice-action">
              <div>
                <Sparkles aria-hidden="true" />
                <span>
                  Pokaż dostępne opcje
                  <small>zajmie to 2-3 minuty</small>
                </span>
              </div>
              <Link href={quickHref} prefetch={false} className="cat-ref-primary cat-ref-choice-button">
                Zobacz rekomendację
                <ArrowRight aria-hidden="true" />
              </Link>
              <small>Bez zobowiązań</small>
            </div>
          </div>
        </section>

        <section className="cat-ref-proof-strip" aria-label="Dlaczego warto">
          {footerTrust.map((item) => (
            <span key={item}>
              <ShieldCheck aria-hidden="true" />
              {item}
            </span>
          ))}
        </section>

        <section className="cat-ref-reviews" aria-labelledby="cat-reviews-title">
          <h2 id="cat-reviews-title">Co mówią opiekunowie kotów?</h2>
          <div className="cat-ref-review-grid">
            {reviews.map((review) => (
              <article key={review.author} className="cat-ref-review-card">
                <div aria-hidden="true" className="cat-ref-stars">
                  ★★★★★
                </div>
                <p>“{review.quote}”</p>
                <strong>- {review.author}</strong>
              </article>
            ))}
          </div>
          <Link href="/opinie" prefetch={false} className="cat-ref-more-link">
            Zobacz więcej opinii <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <section className="cat-ref-final">
          <div>
            <h2>Gotowy na pierwszy krok?</h2>
            <p>Wybierz dogodny termin i zacznijmy wspólnie pracę nad spokojniejszym życiem Waszego kota.</p>
            <div className="cat-ref-final-actions">
              <Link href={quickHref} prefetch={false} className="cat-ref-light-button">
                Umów pierwszy krok <ArrowRight aria-hidden="true" />
              </Link>
              <Link href="/kontakt#formularz" prefetch={false} className="cat-ref-outline-button">
                Wyślij krótką wiadomość
              </Link>
            </div>
          </div>
          <div className="cat-ref-final-media" aria-hidden="true">
            <Image src={catHeroImage} alt="" fill sizes="(max-width: 900px) 0px, 420px" />
          </div>
        </section>

        <section className="cat-ref-credential-strip" aria-label="Kwalifikacje i dostępność">
          {footerTrust.map((item) => (
            <span key={item}>
              <ShieldCheck aria-hidden="true" />
              {item}
            </span>
          ))}
        </section>

        <footer className="cat-ref-footer">
          <BrandLockup compact />
          <nav aria-label="Linki stopki">
            {navItems.map((item) => (
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
            <a href={CAPBT_PROFILE_URL} target="_blank" rel="noopener noreferrer">
              Profil COAPE/CAPBT
            </a>
          </nav>
          <div className="cat-ref-footer-contact">
            <a href={`mailto:${contact.email}`}>
              <Mail aria-hidden="true" />
              {contact.email}
            </a>
            <span>
              <Globe2 aria-hidden="true" />
              Online w całej Polsce
            </span>
          </div>
        </footer>
      </div>
    </main>
  )
}
