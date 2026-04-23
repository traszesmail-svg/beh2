import type { Metadata } from 'next'
import Link from 'next/link'
import { NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { getBreadcrumbJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import { PUBLIC_OFFER_BOOKING_PAYMENT, PUBLIC_OFFER_PAYMENT_METHODS, PUBLIC_OFFER_PRICES } from '@/lib/public-offer-copy'
import { UrgentForm } from './UrgentForm'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kwadrans na juz - termin w 15 minut',
  path: '/urgent',
  description:
    'Wyslij prosbe o Kwadrans na juz. To ten sam 15-minutowy format co Kwadrans, ale z priorytetem i mozliwie szybkim terminem.',
})

const HOW_IT_WORKS = [
  {
    number: '01',
    title: 'Wypisujesz formularz',
    body: 'Podajesz imie, e-mail, temat i 2-3 zdania opisu. Telefon opcjonalnie, zeby dostac SMS z potwierdzeniem.',
  },
  {
    number: '02',
    title: 'Dostajesz e-mail i SMS',
    body: 'Zaraz po kliknieciu dostajesz wiadomosc, ze prosba dotarla. Na stronie uruchamia sie licznik 15 minut.',
  },
  {
    number: '03',
    title: 'Odpisze w ciagu 15 minut',
    body: 'Proponuje termin na kolejne 15 minut albo najblizsze mozliwe okno. Dostaniesz dalszy krok platnosci i potwierdzenie rezerwacji.',
  },
] as const

export default function UrgentPage() {
  return (
    <NotatnikPageShell
      tag="Kwadrans na juz / 99 zl"
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref="/urgent"
      ctaLabel="Kwadrans na juz / 99 zl"
      footerPrimaryHref="/book?service=szybka-konsultacja-15-min"
      footerPrimaryLabel="Kwadrans z behawiorysta"
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Kwadrans na juz', path: '/urgent' },
          ]),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Kwadrans na juz / pilny termin</div>
          <h1>
            Kwadrans na juz <em>- termin w 15 minut.</em>
          </h1>
          <p>
            Ten sam format co Kwadrans: 15 minut audio bez kamery, jeden konkretny kierunek. Roznica to czas oczekiwania - odpisze z terminem w
            ciagu 15 minut od Twojej prosby.
          </p>
          <div className="info-box top-gap-small">
            Cena: {PUBLIC_OFFER_PRICES.urgent} zl. Platnosc przychodzi dopiero po potwierdzeniu terminu - {PUBLIC_OFFER_PAYMENT_METHODS}.
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Co dostajesz</div>
          <h3>15 minut audio bez kamery z priorytetem i szybkim terminem.</h3>
          <p>
            Jeden konkretny priorytet i pierwszy ruch. Jesli temat okaze sie szerszy, od razu bedzie widac, czy potrzebujesz Dwoch kwadransow albo
            Pelnej konsultacji.
          </p>
        </div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="I." kicker="Jak to dziala" title="Trzy kroki od formularza do terminu." />
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
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz Kwadransu na juz</div>
          <h2>
            Wyslij prosbe, <em>a ja odpisze z terminem w ciagu 15 minut.</em>
          </h2>
          <p className="notatnik-contact-lede">
            Podaj gatunek, temat i krotki opis. Termin dostaniesz mailem - bez telefonu na stronie, bez kalendarza do klikania.
          </p>

          <div id="formularz">
            <UrgentForm />
          </div>
        </div>

        <div className="notatnik-contact-right notatnik-kinfo">
          <h3>Czego tu nie ma</h3>
          <p>Nie ma publicznego numeru telefonu na stronie. Nie ma kalendarza do klikania. Nie ma automatycznej platnosci.</p>
          <p>{PUBLIC_OFFER_BOOKING_PAYMENT}</p>

          <h3 className="top-gap-small">Po wyslaniu prosby</h3>
          <div className="notatnik-steps">
            <article className="notatnik-step">
              <div className="notatnik-step-number">01</div>
              <p>Na podany e-mail dostaniesz potwierdzenie, ze prosba dotarla.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">02</div>
              <p>Odpisze z proponowanym terminem w ciagu 15 minut.</p>
            </article>
            <article className="notatnik-step">
              <div className="notatnik-step-number">03</div>
              <p>Po wplacie 99 zl przez {PUBLIC_OFFER_PAYMENT_METHODS} potwierdzam rezerwacje i wysylam link do rozmowy.</p>
            </article>
          </div>

          <div className="notatnik-contact-note">
            <strong>Inne formaty</strong>
            <p>
              Nie potrzebujesz terminu w 15 minut?{' '}
              <Link href="/book?service=szybka-konsultacja-15-min" prefetch={false} className="notatnik-inline-link">
                Zarezerwuj zwykly Kwadrans za 69 zl
              </Link>
              {' '}albo{' '}
              <Link href="/cennik" prefetch={false} className="notatnik-inline-link">
                porownaj wszystkie uslugi
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </NotatnikPageShell>
  )
}
