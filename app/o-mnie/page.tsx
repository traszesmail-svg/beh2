import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeartHandshake, ShieldCheck, UserRound } from 'lucide-react'
import { CredentialsGrid } from '@/components/CredentialsGrid'
import { ReferenceFinalCta, ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getFaqPageJsonLd, getPersonJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  CAPBT_POLSKA_LOGO,
  CAPBT_PROFILE_URL,
  COAPE_ORG_URL,
  COAPE_POLSKA_LOGO,
  MEDIA_MENTIONS,
  ABOUT_SPECIALIST_PHOTO,
  SPECIALIST_NAME,
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

const organizationProofCards = [
  {
    label: 'CAPBT / COAPE',
    title: SPECIALIST_PUBLIC_STATUS,
    copy: SPECIALIST_STATUS_EXPLANATION,
    href: CAPBT_PROFILE_URL,
    cta: 'Zweryfikuj profil',
    logo: CAPBT_POLSKA_LOGO,
  },
  {
    label: 'COAPE Polska',
    title: 'COAPE',
    copy: 'Publiczny punkt odniesienia dla kwalifikacji i sposobu pracy ze zwierzętami towarzyszącymi.',
    href: COAPE_ORG_URL,
    cta: 'Zobacz organizację',
    logo: COAPE_POLSKA_LOGO,
  },
]

const articleThumbnails: Record<string, { src: string; alt: string }> = {
  'magwet-litter-box': {
    src: '/branding/topic-cards/cats/cat-litter-box.jpg',
    alt: 'Kot przy kuwecie jako miniatura artykułu o terapii behawioralnej i farmakologicznej',
  },
  'magwet-fear': {
    src: '/branding/case-studies/blog-case-animals.jpg',
    alt: 'Pies i kot jako miniatura artykułu o strachu, lęku i fobii',
  },
}

const articleProofCards = MEDIA_MENTIONS.map((mention) => ({
  ...mention,
  thumbnail:
    articleThumbnails[mention.id] ??
    ({
      src: '/branding/case-studies/blog-case-animals.jpg',
      alt: 'Miniatura publikacji',
    } as const),
}))

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
            src={ABOUT_SPECIALIST_PHOTO.src}
            alt={ABOUT_SPECIALIST_PHOTO.alt}
            width={ABOUT_SPECIALIST_PHOTO.width}
            height={ABOUT_SPECIALIST_PHOTO.height}
            priority
            sizes="(max-width: 760px) 82vw, 360px"
          />
        </figure>
      </section>

      <section className="reference-about-info-strip" aria-label="Szybkie informacje">
        <div className="reference-about-info-title">
          <span className="reference-pill">O pracy</span>
          <h2>Szybkie informacje</h2>
        </div>
        {workStyleCards.map((card) => {
          const Icon = card.icon

          return (
            <article key={card.title} className="reference-about-info-item">
              <Icon size={25} strokeWidth={1.7} aria-hidden="true" />
              <span>
                <strong>{card.title}</strong>
                <small>{card.copy}</small>
              </span>
            </article>
          )
        })}
      </section>

      <section className="reference-content-column reference-wide-column">
        <section className="reference-section-card">
          <h2>Kwalifikacje i profil</h2>
          <p>
            Na stronie pokazuję tylko publicznie wspierane informacje: status, organizacje i profil, które można
            sprawdzić samodzielnie.
          </p>
          <CredentialsGrid />
        </section>

        <section className="reference-section-card reference-public-proof-section">
          <h2>Co możesz sprawdzić publicznie</h2>
          <div className="reference-proof-feature-grid">
            {organizationProofCards.map((card) => (
              <article key={card.title} className="reference-proof-card reference-logo-proof-card">
                <span>{card.label}</span>
                <div className="reference-logo-proof-media">
                  <Image src={card.logo.src} alt={card.logo.alt} width={card.logo.width} height={card.logo.height} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <a href={card.href} target="_blank" rel="noopener noreferrer">
                  {card.cta}
                </a>
              </article>
            ))}

            {articleProofCards.map((card) => (
              <article key={card.id} className="reference-proof-card reference-article-proof-card">
                <div className="reference-article-proof-thumb">
                  <Image src={card.thumbnail.src} alt={card.thumbnail.alt} fill sizes="(max-width: 760px) 90vw, 260px" />
                </div>
                <span>{card.label}</span>
                <h3>{card.title}</h3>
                <p>{card.summary}</p>
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
