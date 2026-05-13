import type { Metadata } from 'next'
import Image from 'next/image'
import { CredentialsGrid } from '@/components/CredentialsGrid'
import { ReferencePageShell } from '@/components/ReferencePageShell'
import { Schema } from '@/components/schema'
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
    src: 'https://magwet.pl/assets/magwet_logo_green-2c8e69910c786ae0c91c1e2a409bf5e8effee4241abbf9778fd43858d3cf696d.png',
    alt: 'Logo Magazynu Weterynaryjnego',
  },
  'magwet-fear': {
    src: 'https://magwet.pl/assets/magwet_logo_green-2c8e69910c786ae0c91c1e2a409bf5e8effee4241abbf9778fd43858d3cf696d.png',
    alt: 'Logo Magazynu Weterynaryjnego',
  },
}

const articleProofCards = MEDIA_MENTIONS.map((mention) => ({
  ...mention,
  thumbnail:
    articleThumbnails[mention.id] ??
    ({
      src: 'https://magwet.pl/assets/magwet_logo_green-2c8e69910c786ae0c91c1e2a409bf5e8effee4241abbf9778fd43858d3cf696d.png',
      alt: 'Logo Magazynu Weterynaryjnego',
    } as const),
}))

export default function AboutPage() {
  const faqItems = FAQ_SHORTLISTS.consultation.slice(0, 3)

  return (
    <ReferencePageShell className="reference-about-page" ctaHref="/wybor">
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

      <section className="reference-content-column reference-wide-column">
        <section className="reference-section-card reference-about-bio-card">
          <h2>Jak pracuję z opiekunami psów i kotów</h2>
          <p>
            Od ponad 10 lat pomagam opiekunom psów i kotów zrozumieć zachowania, które w domu albo na spacerze zaczynają robić się trudne. Pracuję spokojnie, bez oceniania i bez kar - najpierw szukam przyczyny napięcia, dopiero potem dobieram konkretne kroki.
          </p>
          <p>
            Możesz zgłosić się z codziennym tematem, takim jak szczekanie, ciągnięcie, kuweta, stres czy napięcie między zwierzętami - ale też z sytuacją bardziej złożoną, która trwa od miesięcy i zaczyna wpływać na całe życie w domu.
          </p>
          <p>
            Jako behawiorysta, doświadczony technik weterynarii i dietetyk patrzę na zachowanie szerzej: przez emocje, zdrowie, ból, dietę, środowisko i codzienną rutynę. Dzięki temu mogę pomóc oddzielić objaw od możliwej przyczyny i wybrać pierwszy krok, który ma sens.
          </p>
        </section>

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
                <div className="reference-article-proof-thumb reference-magwet-proof-thumb">
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
    </ReferencePageShell>
  )
}
