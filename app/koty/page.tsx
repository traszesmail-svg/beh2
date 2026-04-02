import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { buildSlotHref } from '@/lib/booking-routing'
import { CAT_SUPPORT_AREAS } from '@/lib/offers'
import { buildMarketingMetadata } from '@/lib/seo'
import { CATS_PAGE_PHOTO } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Koty',
  path: '/koty',
  description: 'Kuweta, napięcie, konflikt albo trudny dotyk. Wybierz pierwszy krok dla kota.',
})

const catStartOptions = [
  {
    title: 'Umów 15 min',
    summary: 'Gdy chcesz szybko zacząć.',
    href: buildSlotHref('kot'),
    cta: 'Umów 15 min',
  },
  {
    title: 'Wybierz 30 min',
    summary: 'Gdy trzeba więcej czasu na start.',
    href: '/kontakt?service=konsultacja-30-min',
    cta: 'Napisz o 30 min',
  },
  {
    title: 'Napisz wiadomość',
    summary: 'Gdy temat jest pilny albo mieszany.',
    href: '/kontakt',
    cta: 'Napisz wiadomość',
  },
] as const

export default function CatsPage() {
  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section">
          <div className="panel section-panel">
            <div className="section-eyebrow">Koty</div>
            <h1>Masz problem z kotem? Wybierz pierwszy krok.</h1>
            <p className="hero-text">Kuweta, napięcie, konflikt albo trudny dotyk. Wybierz start.</p>

            <div className="stack-gap top-gap">
              {CAT_SUPPORT_AREAS.map((item) => (
                <div key={item} className="list-card tree-backed-card">
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="panel section-panel image-panel">
            <Image
              src={CATS_PAGE_PHOTO.src}
              alt={CATS_PAGE_PHOTO.alt}
              width={1200}
              height={900}
              sizes="(max-width: 980px) 100vw, 42vw"
              className="section-feature-image"
            />
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-eyebrow">Na start</div>
          <h2>Wybierz jedno z trzech</h2>
          <div className="offer-grid top-gap">
            {catStartOptions.map((option) => (
              <article key={option.title} className="offer-card tree-backed-card">
                <div className="offer-card-head">
                  <div>
                    <h3>{option.title}</h3>
                  </div>
                </div>
                <p>{option.summary}</p>
                <div className="offer-card-actions">
                  <Link href={option.href} prefetch={false} className="button button-primary">
                    {option.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel cta-panel compact-sales-cta">
          <div className="section-eyebrow">Kontakt</div>
          <h2>Nie wiesz? Napisz.</h2>
          <div className="hero-actions top-gap">
            <Link href="/kontakt" prefetch={false} className="button button-primary big-button">
              Napisz wiadomość
            </Link>
            <Link href={buildSlotHref('kot')} prefetch={false} className="button button-ghost big-button">
              Umów 15 min
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
