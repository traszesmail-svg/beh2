import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { PUBLIC_OFFER_BOOKING_PAYMENT, PUBLIC_OFFER_PAYMENT_METHODS, PUBLIC_OFFER_PRICES } from '@/lib/public-offer-copy'
import { UrgentForm } from './UrgentForm'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kwadrans na już - termin w 15 minut',
  path: '/urgent',
  description:
    'Wyślij prośbę o Kwadrans na już. To ten sam 15-minutowy format co Kwadrans, ale z priorytetem i możliwie szybkim terminem.',
})

const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Wypisujesz formularz',
    body: 'Podajesz imię, e-mail, temat i 2-3 zdania opisu. Telefon opcjonalnie, żeby dostać SMS z potwierdzeniem.',
  },
  {
    number: '02',
    title: 'Dostajesz e-mail i SMS',
    body: 'Zaraz po kliknieciu dostajesz wiadomość, że prośba dotarła. Na stronie uruchamia się licznik 15 minut.',
  },
  {
    number: '03',
    title: 'Odpisze w ciągu 15 minut',
    body: 'Proponuje termin na kolejne 15 minut albo najbliższe możliwe okno. Dostaniesz dalszy krok płatności i potwierdzenie rezerwacji.',
  },
] as const

export default function UrgentPage() {
  return (
    <NotatnikPageShell
      tag="Kwadrans na już / 99 zł"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref="/urgent"
      ctaLabel="Kwadrans na już / 99 zł"
      footerPrimaryHref="/book?service=szybka-konsultacja-15-min"
      footerPrimaryLabel="15-minutowa konsultacja behawioralna"
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona główna', path: '/' },
            { name: 'Kwadrans na już', path: '/urgent' },
          ]),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Kwadrans na już / pilny termin</div>
          <h1>
            Kwadrans na już <em>- termin w 15 minut.</em>
          </h1>
          <p>
            Ten sam format co Kwadrans: 15 minut audio bez kamery, jeden konkretny kierunek. Różnica to czas oczekiwania - odpiszę z terminem w
            ciągu 15 minut od Twojej prośby.
          </p>
          <div className="info-box top-gap-small">
            Cena: {PUBLIC_OFFER_PRICES.urgent} zł. Płatność przychodzi dopiero po potwierdzeniu terminu - {PUBLIC_OFFER_PAYMENT_METHODS}.
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Co dostajesz</div>
          <h3>15 minut audio bez kamery z priorytetem i szybkim terminem.</h3>
          <p>
            Jeden konkretny priorytet i pierwszy ruch. Jeśli temat okaże się szerszy, od razu będzie widać, czy potrzebujesz Dwóch kwadransów albo
            Pełnej konsultacji.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="I." kicker="Jak to działa" title="Trzy kroki od formularza do terminu." />
        <div className="notatnik-steps">
          {HOW_IT_WORKS.map((step) => (
            <article key={step.number} className="notatnik-step">
              <div className="notatnik-step-number">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="notatnik-contact">
        <div className="notatnik-contact-left">
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz Kwadransu na już</div>
          <h2>
            Wyślij prośbę, <em>a ja odpiszę z terminem w ciągu 15 minut.</em>
          </h2>
          <p className="notatnik-contact-lede">
            Podaj gatunek, temat i krótki opis. Termin dostaniesz mailem - bez telefonu na stronie, bez kalendarza do klikania.
          </p>

          <div id="formularz">
            <UrgentForm />
          </div>
        </div>

        <div className="notatnik-contact-right notatnik-kinfo">
          <h3>Czego tu nie ma</h3>
          <p>Nie ma publicznego numeru telefonu na stronie. Nie ma kalendarza do klikania. Nie ma automatycznej płatności.</p>
          <p>{PUBLIC_OFFER_BOOKING_PAYMENT}</p>

          <h3 className="top-gap-small">Po wysłaniu prośby</h3>
          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <p>Na podany e-mail dostaniesz potwierdzenie, że prośba dotarła.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <p>Odpisze z proponowanym terminem w ciągu 15 minut.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <p>Po wpłacie 99 zł przez {PUBLIC_OFFER_PAYMENT_METHODS} potwierdzam rezerwację i wysyłam link do rozmowy.</p>
            </article>
          </div>

          <div className="notatnik-contact-note">
            <strong>Inne formaty</strong>
            <p>
              Nie potrzebujesz terminu w 15 minut?{' '}
              <Link href="/book?service=szybka-konsultacja-15-min" prefetch={false} className="notatnik-inline-link">
                Zarezerwuj zwykły Kwadrans za 69 zł
              </Link>
              {' '}albo{' '}
              <Link href="/cennik" prefetch={false} className="notatnik-inline-link">
                porównaj wszystkie usługi
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </NotatnikPageShell>
  )
}
