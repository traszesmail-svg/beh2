import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikFinalCta, NotatnikFooter, NotatnikSectionHead, NotatnikTopbar } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { getBreadcrumbJsonLd, getFaqPageJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { FAQ_SHORTLISTS } from '@/lib/trust-layer'

const baseMetadata = buildMarketingMetadata({
  title: 'Najczęstsze pytania o konsultację behawioralną',
  path: '/faq',
  description: 'Najczęstsze pytania o konsultację behawioralną, rezerwację, płatność i pierwszy kontakt z behawiorystą.',
})

export const metadata: Metadata = baseMetadata

const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min')
const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online')
const contactHref = '/kontakt#formularz'

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/niezbednik', label: 'Niezbednik' },
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const topicLinks = [
  {
    eyebrow: 'Konsultacja',
    title: 'Jak wygląda pierwsza rozmowa',
    copy: 'Kwadrans, Dwa kwadranse i pełna konsultacja bez zgadywania, od czego zacząć.',
    href: '/konsultacja-behawioralna-online#faq',
  },
  {
    eyebrow: 'Psy',
    title: 'Pytania o psy',
    copy: 'Spacery, reaktywność, pobudzenie, rozłąka i trudności w domu.',
    href: '/psy#faq',
  },
  {
    eyebrow: 'Koty',
    title: 'Pytania o koty',
    copy: 'Kuweta, wycofanie, napięcie między kotami i zmiany w otoczeniu.',
    href: '/koty#faq',
  },
  {
    eyebrow: 'Kontakt',
    title: 'Kiedy lepiej napisać',
    copy: 'Jeśli nie chcesz od razu rezerwować, wiadomość pomoże ustalić najlepszy start.',
    href: '/kontakt#formularz',
  },
] as const

export default function FaqPage() {
  const structuredData = [getBreadcrumbJsonLd([{ name: 'Strona glowna', path: '/' }, { name: 'FAQ', path: '/faq' }]), getFaqPageJsonLd(FAQ_SHORTLISTS.home)]

  return (
    <main className="notatnik-page">
      <Schema data={structuredData} />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="FAQ / najczęstsze pytania" navItems={navItems} ctaHref={audioHref} ctaLabel={FUNNEL_CTA_LABELS.primary} />

        <section className="notatnik-subhero">
          <div>
            <div className="notatnik-subhero-tag notatnik-mono">FAQ</div>
            <h1>
              Najczęstsze pytania przed <em>pierwszym ruchem</em>.
            </h1>
            <p>
              Krótko, konkretnie i bez zbędnych objaśnień. Jeśli nie widzisz swojego pytania, zawsze możesz napisać wiadomość albo wejść od razu
              w Kwadrans.
            </p>
            <div className="notatnik-subhero-actions">
              <Link href={audioHref} prefetch={false} className="notatnik-btn">
                <span>{FUNNEL_CTA_LABELS.primary}</span>
                <span className="notatnik-btn-arrow" aria-hidden="true">
                  &rarr;
                </span>
              </Link>
              <Link href={contactHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                <span>Napisz wiadomość</span>
              </Link>
            </div>
          </div>

          <div className="notatnik-subhero-media">
            <div className="notatnik-quiet-card">
              <div className="notatnik-mono">Najczęściej pytacie o</div>
              <h3>
                Kwadrans, <em>kontakt</em>, dalszy krok.
              </h3>
              <p>Najwięcej wątpliwości dotyczy tego, od czego zacząć i czy trzeba od razu wchodzić w dużą konsultację.</p>
            </div>
          </div>
        </section>

        <section id="faq">
          <NotatnikSectionHead index="I." kicker="Najczęstsze pytania" title="Najczęściej zadawane pytania." />
          <div className="notatnik-faq-grid">
            {FAQ_SHORTLISTS.home.map((item) => (
              <article key={item.question} className="notatnik-faq-item">
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <NotatnikSectionHead index="II." kicker="Wybierz temat" title="Przejdź do pytań z Twojego obszaru." />
          <div className="notatnik-material-grid">
            {topicLinks.map((card) => (
              <article key={card.title} className="notatnik-material-card">
                <div className="notatnik-material-tag notatnik-mono">{card.eyebrow}</div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <Link href={card.href} prefetch={false}>
                  Przejdź dalej
                </Link>
              </article>
            ))}
          </div>
        </section>

        <NotatnikFinalCta
          title="Jeśli nie widzisz tu swojego pytania, <em>napisz wiadomość.</em>"
          copy="Wystarczy krótki opis sytuacji. Pomogę ustalić, czy najlepszym startem będzie Kwadrans, Dwa kwadranse czy pełna konsultacja."
          primaryHref={audioHref}
          primaryLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref={consultationHref}
          secondaryLabel="Pelna konsultacja"
        />

        <NotatnikFooter primaryHref={audioHref} primaryLabel={FUNNEL_CTA_LABELS.primary} />
      </div>
    </main>
  )
}
