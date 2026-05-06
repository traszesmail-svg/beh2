import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { BadgeCheck, BookOpen, HeartHandshake, ShieldCheck, UserRound } from 'lucide-react'
import { CredentialsGrid } from '@/components/CredentialsGrid'
import { ReferenceContactCard, ReferenceFinalCta, ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getPersonJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  CAPBT_ORG_URL,
  CAPBT_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  MEDIA_MENTIONS,
  SPECIALIST_NAME,
  SPECIALIST_PHOTO,
  SPECIALIST_PUBLIC_STATUS,
  SPECIALIST_STATUS_EXPLANATION,
} from '@/lib/site'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Krzysztof Regulski - behawiorysta COAPE',
  path: '/o-mnie',
  description:
    'Krzysztof Regulski - behawiorysta psów i kotów online. Podejście, kwalifikacje, profil publiczny i informacje przed pierwszym kontaktem.',
})

const bookHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
const contactHref = '/kontakt#formularz'

const workStyleCards = [
  {
    icon: UserRound,
    title: 'Zaczynam od codzienności',
    copy: 'Interesuje mnie, kiedy problem się pojawia, co go poprzedza i co najbardziej obciąża dom.',
  },
  {
    icon: HeartHandshake,
    title: 'Bez oceniania opiekuna',
    copy: 'Rozmowa ma pomóc zrozumieć sytuację, a nie egzaminować z idealnej opieki nad psem albo kotem.',
  },
  {
    icon: ShieldCheck,
    title: 'Oddzielam objaw od tła',
    copy: 'Sprawdzam środowisko, relacje, rytm dnia, zdrowie i to, co może podtrzymywać zachowanie.',
  },
]

const proofCards = [
  {
    label: 'Status publiczny',
    title: SPECIALIST_PUBLIC_STATUS,
    copy: SPECIALIST_STATUS_EXPLANATION,
    href: CAPBT_PROFILE_URL,
    cta: 'Zweryfikuj profil',
  },
  {
    label: 'Środowisko zawodowe',
    title: 'COAPE / CAPBT',
    copy: 'Publiczne punkty odniesienia dla sposobu pracy i profilu zawodowego.',
    href: CAPBT_ORG_URL,
    cta: 'Zobacz organizację',
  },
  {
    label: 'Publiczne treści',
    title: 'Publikacje i Instagram',
    copy: 'Możesz sprawdzić sposób komunikacji i tematy, o których piszę poza samą stroną.',
    href: MEDIA_MENTIONS[0]?.href ?? INSTAGRAM_PROFILE_URL,
    cta: MEDIA_MENTIONS[0] ? 'Zobacz artykuł' : 'Otwórz Instagram',
  },
]

export default function AboutPage() {
  const faqItems = FAQ_SHORTLISTS.consultation.slice(0, 3)

  return (
    <ReferencePageShell className="reference-about-page" ctaHref={bookHref}>
      <Schema
        data={[
          getPersonJsonLd(),
          getBreadcrumbJsonLd([
            { name: 'Strona główna', path: '/' },
            { name: 'O mnie', path: '/o-mnie' },
          ]),
          getFaqPageJsonLd(faqItems),
        ]}
      />

      <section className="reference-hero reference-about-hero">
        <div className="reference-hero-copy">
          <span className="reference-pill">O mnie</span>
          <h1>{SPECIALIST_NAME}. Behawiorysta psów i kotów.</h1>
          <p>
            Pomagam uporządkować sytuację psa albo kota tak, żeby po rozmowie został jasny pierwszy krok. Bez sztucznej
            pewności tam, gdzie najpierw trzeba coś sprawdzić.
          </p>
          <div className="reference-hero-actions">
            <Link href={bookHref} prefetch={false} className="reference-btn reference-btn-primary">
              Umów pierwszy krok
            </Link>
            <Link href={contactHref} prefetch={false} className="reference-btn reference-btn-secondary">
              Wyślij krótką wiadomość
            </Link>
          </div>
        </div>
        <figure className="reference-photo-card">
          <Image
            src={SPECIALIST_PHOTO.src}
            alt={SPECIALIST_PHOTO.alt}
            width={SPECIALIST_PHOTO.width}
            height={SPECIALIST_PHOTO.height}
            priority
            sizes="(max-width: 760px) 82vw, 360px"
          />
        </figure>
      </section>

      <section className="reference-category-grid" aria-label="Najważniejsze informacje">
        {workStyleCards.map((card) => {
          const Icon = card.icon

          return (
            <article key={card.title} className="reference-category-card reference-static-card">
              <Icon size={25} strokeWidth={1.7} aria-hidden="true" />
              <span>
                <strong>{card.title}</strong>
                <small>{card.copy}</small>
              </span>
            </article>
          )
        })}
      </section>

      <section className="reference-main-layout">
        <div className="reference-content-column">
          <section className="reference-section-card">
            <h2>Kwalifikacje i profil</h2>
            <p>
              Na stronie pokazuję tylko publicznie wspierane informacje: status, organizacje i profil, które można
              sprawdzić samodzielnie.
            </p>
            <CredentialsGrid />
          </section>

          <section className="reference-section-card">
            <h2>Co możesz sprawdzić publicznie</h2>
            <div className="reference-proof-grid">
              {proofCards.map((card) => (
                <article key={card.title} className="reference-proof-card">
                  <span>{card.label}</span>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                  <a href={card.href} target="_blank" rel="noopener noreferrer">
                    {card.cta}
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className="reference-section-card">
            <h2>Najczęstsze pytania o sposób pracy</h2>
            <div className="reference-compact-faq">
              {faqItems.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    {item.question}
                  </summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <aside className="reference-sidebar">
          <div className="reference-side-card">
            <h2>Szybkie informacje</h2>
            <div className="reference-info-list">
              <div className="reference-info-row">
                <BadgeCheck size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Dyplomant COAPE</strong>
                  <small>Publiczny profil CAPBT / COAPE.</small>
                </span>
              </div>
              <div className="reference-info-row">
                <BookOpen size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Psy i koty</strong>
                  <small>Sprawy behawioralne, start i dalsze kroki.</small>
                </span>
              </div>
              <div className="reference-info-row">
                <HeartHandshake size={24} strokeWidth={1.7} aria-hidden="true" />
                <span>
                  <strong>Bez oceniania</strong>
                  <small>Praca z sytuacją, nie z poczuciem winy opiekuna.</small>
                </span>
              </div>
            </div>
            <Link href={consultationHref} prefetch={false} className="reference-btn reference-btn-secondary">
              Jak wygląda pełna konsultacja
            </Link>
          </div>
          <ReferenceContactCard />
        </aside>
      </section>

      <ReferenceFinalCta
        title="Gotowy na pierwszy krok?"
        copy="Jeśli chcesz sprawdzić, czy ten sposób pracy pasuje do Twojej sytuacji, zacznij od Kwadransu albo wyślij krótką wiadomość."
        primaryHref={bookHref}
        primaryLabel="Umów pierwszy krok"
        secondaryHref={contactHref}
        secondaryLabel="Wyślij krótką wiadomość"
      />
    </ReferencePageShell>
  )
}
