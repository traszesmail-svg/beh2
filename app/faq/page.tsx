import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { PUBLIC_OFFER_FAQ_ITEMS } from '@/lib/public-offer-faq'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { PUBLIC_OFFER_START_GUIDE } from '@/lib/public-offer-copy'

const baseMetadata = buildMarketingMetadata({
  title: 'Najczestsze pytania o konsultacje behawioralne',
  path: '/faq',
  description: 'Najczestsze pytania o oferte 69 / 99 / 169 / 470, rezerwacje, platnosc i pierwszy kontakt z behawiorysta.',
})

export const metadata: Metadata = baseMetadata

const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const contactHref = '/kontakt#formularz'

const topicLinks = [
  {
    eyebrow: 'Cennik',
    title: 'Roznica miedzy 69 / 99 / 169 / 470',
    copy: 'Kwadrans 69 zl, Kwadrans na juz 99 zl, Dwa kwadranse 169 zl i Pelna konsultacja 470 zl bez zgadywania, od czego zaczac.',
    href: '/cennik',
  },
  {
    eyebrow: 'Psy',
    title: 'Pytania o psy',
    copy: 'Spacery, reaktywnosc, pobudzenie, rozlaka i trudnosci w domu.',
    href: '/psy#faq',
  },
  {
    eyebrow: 'Koty',
    title: 'Pytania o koty',
    copy: 'Kuweta, wycofanie, napiecie miedzy kotami i zmiany w otoczeniu.',
    href: '/koty#faq',
  },
  {
    eyebrow: 'Kontakt',
    title: 'Kiedy lepiej napisac',
    copy: 'Jesli nie chcesz od razu rezerwowac, wiadomosc pomoze ustalic najlepszy start.',
    href: '/kontakt#formularz',
  },
] as const

export default function FaqPage() {
  const structuredData = [getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'FAQ', path: '/faq' }]), getFaqPageJsonLd(PUBLIC_OFFER_FAQ_ITEMS)]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="FAQ / najczestsze pytania" navItems={PUBLIC_SITE_NAV_ITEMS} ctaHref={audioHref} ctaLabel={FUNNEL_CTA_LABELS.primary} />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">FAQ</div>
            <h1>
              Najczestsze pytania przed <em>pierwszym ruchem</em>.
            </h1>
            <p>
              Krotko, konkretnie i bez zgadywania. Najwiecej watpliwosci dotyczy roznicy miedzy 69 a 99, tego kiedy wybrac 169 i kiedy od razu wejsc w
              470.
            </p>
            <div className="notatnik-subhero-actions">
              <Link href={audioHref} prefetch={false} className="notatnik-btn">
                <span>{FUNNEL_CTA_LABELS.primary}</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              <Link href="/cennik" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Zobacz cennik</span>
              </Link>
            </div>
          </div>

          <div className="notatnik-subhero-media">
            <div className="notatnik-quiet-card">
              <div className="notatnik-mono">Najczesciej pytacie o</div>
              <h3>
                69 czy 99, <em>kiedy 169</em>, kiedy 470.
              </h3>
              <p>Najwiecej watpliwosci dotyczy tego, od czego zaczac i kiedy zostac przy prostszym formacie, zamiast od razu wybierac najszersza usluge.</p>
              <ul className="notatnik-service-list top-gap-small">
                {PUBLIC_OFFER_START_GUIDE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="faq">
          <NotatnikSectionHead index="I." kicker="Najczestsze pytania" title="Najczesciej zadawane pytania o oferte." />
          <div className="notatnik-faq-grid">
            {PUBLIC_OFFER_FAQ_ITEMS.map((item) => (
              <article key={item.question} className="notatnik-faq-item">
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="II." kicker="Wybierz temat" title="Przejdz dalej tam, gdzie to ma sens." />
          <div className="notatnik-material-grid">
            {topicLinks.map((card) => (
              <article key={card.title} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <Link href={card.href} prefetch={false}>
                  Przejdz dalej
                </Link>
              </article>
            ))}
          </div>
        </section>

        <NotatnikFinalCta
          title="Jesli nadal nie wiesz, co wybrac, <em>zacznij od Kwadransu.</em>"
          copy="To najlzejszy pierwszy krok. Jesli temat jest pilny, szerszy albo przewlekly, od razu bedzie wiadomo, czy przejsc do 99, 169 albo 470."
          primaryHref={audioHref}
          primaryLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref={contactHref}
          secondaryLabel="Napisz wiadomosc"
        />

        <NotatnikFooter primaryHref={audioHref} primaryLabel={FUNNEL_CTA_LABELS.primary} />
      </div>
    </main>
  )
}
