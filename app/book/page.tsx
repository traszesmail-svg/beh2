import type { Metadata } from 'next'
import Link from 'next/link'
import { BookRequestForm } from '@/components/BookRequestForm'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikPageShell, NotatnikSectionHead } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { ServicesComparison } from '@/components/ServicesComparison'
import { readBookingServiceSearchParam, readBookingSpeciesSearchParam, readSearchParam } from '@/lib/booking-routing'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PUBLIC_OFFER_BOOKING_LEAD,
  PUBLIC_OFFER_BOOKING_PAYMENT,
  PUBLIC_OFFER_BOOKING_PROCESS,
  PUBLIC_OFFER_BOOKING_REASSURANCE,
  PUBLIC_OFFER_CANCELLATION_COPY,
} from '@/lib/public-offer-copy'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Rezerwacja Kwadransa z behawiorysta',
  path: '/book',
  description:
    'Prosba o rezerwacje Kwadransu 69 zl, Kwadransu na juz 99 zl, Dwoch kwadransow 169 zl albo Pelnej konsultacji 470 zl z diagnoza i 7 dniami wsparcia tekstowego przez WhatsApp.',
})

const navItems = [
  { href: '/psy', label: 'Pies' },
  { href: '/koty', label: 'Kot' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/faq', label: 'FAQ' },
  { href: '/kontakt#formularz', label: 'Kontakt' },
]

const NEXT_STEPS = [
  '1. Potwierdzam jeden z terminow albo odsylam najblizsza alternatywe.',
  '2. W mailu dostajesz PayPal.me albo instrukcje BLIK na telefon.',
  '3. Po wplacie potwierdzam rezerwacje i odsylam link do rozmowy.',
] as const

export default function BookPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const rawService = readSearchParam(searchParams?.service)
  const service =
    rawService === 'kwadrans-na-juz' ? 'kwadrans-na-juz' : (readBookingServiceSearchParam(searchParams?.service) ?? 'szybka-konsultacja-15-min')
  const species = readBookingSpeciesSearchParam(searchParams?.species)

  return (
    <NotatnikPageShell
      tag="Rezerwacja / PayPal.me lub BLIK po potwierdzeniu"
      navItems={navItems}
      ctaHref="/cennik"
      ctaLabel="Zobacz cennik"
      footerPrimaryHref="/book?service=szybka-konsultacja-15-min"
      footerPrimaryLabel="Kwadrans z behawiorysta"
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Rezerwacja', path: '/book' },
          ]),
          getServiceJsonLd({
            name: 'Rezerwacja konsultacji behawioralnych online',
            description: 'Prosba o rezerwacje Kwadransu, Dwoch kwadransow albo Pelnej konsultacji z potwierdzeniem PayPal lub BLIK po mailu.',
            serviceUrl: '/book',
            offerCatalog: [
              // nazwa uslugi: Kwadrans z behawiorysta
              // format: 15 min audio bez kamery
              { name: 'Kwadrans z behawiorysta', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
              { name: 'Kwadrans na juz', description: '15 min audio, termin w 15 minut.', url: '/book?service=kwadrans-na-juz', price: 99 },
              { name: 'Dwa kwadranse', description: '30 min online z krotka notatka po rozmowie.', url: '/book?service=konsultacja-30-min', price: 169 },
              { name: 'Pelna konsultacja', description: '60 min audio albo video, diagnoza, plan poprawy i 7 dni wsparcia tekstowego przez WhatsApp.', url: '/book?service=konsultacja-behawioralna-online', price: 470 },
            ],
          }),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">Rezerwacja / spokojny start</div>
          <h1>
            Rezerwacja <em>konsultacji behawioralnych online</em>.
          </h1>
          <p>{PUBLIC_OFFER_BOOKING_LEAD}</p>
          <p>{PUBLIC_OFFER_BOOKING_REASSURANCE}</p>
          <NextSlot className="top-gap-small" />
          <div className="notatnik-subhero-actions">
            <Link href="/cennik" prefetch={false} className="notatnik-btn">
              <span>Porownaj uslugi</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="/urgent" prefetch={false} className="notatnik-btn notatnik-btn-urgent">
              <span>Kwadrans na juz / 99 zl</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Co dzieje sie dalej</div>
          <h3>Najpierw sens wyboru, potem platnosc.</h3>
          <p>{PUBLIC_OFFER_BOOKING_PAYMENT}</p>
        </div>
      </section>

      <section id="porownanie">
        <NotatnikSectionHead index="I." kicker="Uslugi" title="Najpierw porownaj cztery formaty." />
        <ServicesComparison species={species} />
        <div className="info-box top-gap-small">{PUBLIC_OFFER_CANCELLATION_COPY}</div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="Decyzja" title="Od czego zaczac, jesli nie masz pewnosci." />
        <div className="notatnik-steps">
          {PUBLIC_OFFER_BOOKING_PROCESS.map((step, index) => (
            <article key={step} className="notatnik-step">
              <div className="notatnik-step-number">{String(index + 1).padStart(2, '0')}</div>
              <p>{step}</p>
            </article>
          ))}
        </div>
        <div className="notatnik-quiet-grid top-gap">
          <article className="notatnik-quiet-card">
            <h3>Nie musisz miec gotowej diagnozy</h3>
            <p>Wystarczy krotki opis sytuacji i propozycja terminow. Jesli temat okaze sie szerszy, powiem to wprost.</p>
          </article>
          <article className="notatnik-quiet-card">
            <h3>Kwadrans to bezpieczny start</h3>
            <p>Jesli nie wiesz, co wybrac, zacznij od Kwadransu za 69 zl. To najprostszy pierwszy krok, gdy chcesz nazwac problem i ustalic priorytet.</p>
          </article>
        </div>
      </section>

      <section className="notatnik-contact">
        <div className="notatnik-contact-left">
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz rezerwacji</div>
          <h2>
            Wyslij prosbe o termin, <em>a ja odpisze z potwierdzeniem.</em>
          </h2>
          <p className="notatnik-contact-lede">
            Wpisz gatunek, wybierz usluge i zaproponuj 2-3 terminy. Reszte potwierdzam mailem - bez telefonu na stronie i bez kalendarza do klikania.
          </p>

          <div className="contact-form-card" id="formularz">
            <BookRequestForm initialService={service} initialSpecies={species} />
          </div>
        </div>

        <div className="notatnik-contact-right notatnik-kinfo">
          <h3>Po wyslaniu prosby</h3>
          <p>Ten sam trzyetapowy proces zobaczysz tez w mailu zwrotnym, zeby od razu bylo jasne, co stanie sie dalej.</p>

          <div className="notatnik-steps">
            {NEXT_STEPS.map((step, index) => (
              <article key={step} className="notatnik-step">
                <div className="notatnik-step-number">{String(index + 1).padStart(2, '0')}</div>
                <p>{step}</p>
              </article>
            ))}
          </div>

          <div className="notatnik-contact-note">
            <strong>Regulaminy</strong>
            <p>
              Przy rezerwacji akceptujesz{' '}
              <Link href="/regulamin" prefetch={false}>
                regulamin ogolny
              </Link>{' '}
              oraz{' '}
              <Link href="/regulamin-pelna-konsultacja" prefetch={false}>
                regulamin Pelnej konsultacji
              </Link>
              . Dla pelnej konsultacji warunki zwrotow i odstepienia sa opisane osobno.
            </p>
          </div>
        </div>
      </section>
    </NotatnikPageShell>
  )
}
