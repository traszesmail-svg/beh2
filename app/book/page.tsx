import type { Metadata } from 'next'
import Link from 'next/link'
import type { BookingServiceType } from '@/lib/booking-services'
import { BookRequestForm } from '@/components/BookRequestForm'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { Schema } from '@/components/schema'
import { ServicesComparison } from '@/components/ServicesComparison'
import { readBookingServiceSearchParam, readBookingSpeciesSearchParam } from '@/lib/booking-routing'
import { getOfferBySlug } from '@/lib/offers'
import { getBreadcrumbJsonLd, getServiceJsonLd } from '@/lib/schema'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  PUBLIC_OFFER_BOOKING_LEAD,
  PUBLIC_OFFER_PAYMENT_EMAIL_STEP,
  PUBLIC_OFFER_BOOKING_PAYMENT,
  PUBLIC_OFFER_BOOKING_PROCESS,
  PUBLIC_OFFER_BOOKING_PRIORITY_NOTE,
  PUBLIC_OFFER_BOOKING_REASSURANCE,
  PUBLIC_OFFER_CANCELLATION_COPY,
} from '@/lib/public-offer-copy'

type BookPageProps = {
  searchParams?: Record<string, string | string[] | undefined>
}

const DEFAULT_BOOKING_SERVICE: BookingServiceType = 'szybka-konsultacja-15-min'

const BOOK_PAGE_METADATA_BY_SERVICE: Record<BookingServiceType, { title: string; description: string }> = {
  'szybka-konsultacja-15-min': {
    title: 'Rezerwacja Kwadransu z behawiorysta',
    description:
      'Rezerwacja Kwadransu z behawiorysta: 15 minut audio bez kamery, spokojny pierwszy krok i potwierdzenie terminu po formularzu.',
  },
  'kwadrans-na-juz': {
    title: 'Rezerwacja Kwadransu na juz',
    description:
      'Rezerwacja Kwadransu na juz: ten sam 15-minutowy format co zwykly Kwadrans, ale z priorytetem i terminem potwierdzanym w ciagu 15 minut.',
  },
  'konsultacja-30-min': {
    title: 'Rezerwacja Dwoch kwadransow',
    description:
      'Rezerwacja Dwoch kwadransow z behawiorysta: 30 minut online, gdy 15 minut to za malo i potrzebujesz spokojniejszego wejscia w temat.',
  },
  'konsultacja-behawioralna-online': {
    title: 'Rezerwacja Pelnej konsultacji behawioralnej',
    description:
      'Rezerwacja Pelnej konsultacji behawioralnej: 60 minut online, diagnoza sytuacji, plan poprawy i 7 dni wsparcia tekstowego przez WhatsApp.',
  },
}

const NEXT_STEPS = [
  '1. Potwierdzam jeden z terminow albo odsylam najblizsza alternatywe.',
  `2. ${PUBLIC_OFFER_PAYMENT_EMAIL_STEP}`,
  '3. Po wplacie potwierdzam rezerwacje i odsylam link do rozmowy.',
] as const

function readRequestedBookService(searchParams?: Record<string, string | string[] | undefined>) {
  return readBookingServiceSearchParam(searchParams?.service)
}

export function generateMetadata({ searchParams }: BookPageProps): Metadata {
  const requestedService = readRequestedBookService(searchParams)

  if (!requestedService) {
    return buildMarketingMetadata({
      title: 'Rezerwacja konsultacji behawioralnych online',
      path: '/book',
      description:
        'Prosba o rezerwacje Kwadransu 69 zl, Dwoch kwadransow 169 zl albo Pelnej konsultacji 470 zl z diagnoza i 7 dniami wsparcia tekstowego przez WhatsApp. Priorytetowy wariant moze pojawic sie dopiero przy wyborze terminu Kwadransu.',
    })
  }

  const metadata = BOOK_PAGE_METADATA_BY_SERVICE[requestedService]

  return buildMarketingMetadata({
    title: metadata.title,
    path: `/book?service=${encodeURIComponent(requestedService)}`,
    description: metadata.description,
  })
}

export default function BookPage({ searchParams }: BookPageProps) {
  const requestedService = readRequestedBookService(searchParams)
  const service = requestedService ?? DEFAULT_BOOKING_SERVICE
  const species = readBookingSpeciesSearchParam(searchParams?.species)
  const selectedOffer = getOfferBySlug(service)
  const hasExplicitService = Boolean(requestedService && selectedOffer)
  const pageTag =
    hasExplicitService && selectedOffer ? `Rezerwacja / ${selectedOffer.shortTitle}` : 'Rezerwacja / PayPal albo BLIK po potwierdzeniu'
  const footerPrimaryHref =
    hasExplicitService && requestedService
      ? `/book?service=${encodeURIComponent(requestedService)}#formularz`
      : '/book?service=szybka-konsultacja-15-min#formularz'
  const footerPrimaryLabel =
    hasExplicitService && selectedOffer ? `Przejdz do formularza: ${selectedOffer.shortTitle}` : 'Przejdz do formularza'
  const heroTag = hasExplicitService && selectedOffer ? `Rezerwacja / ${selectedOffer.shortTitle}` : 'Rezerwacja / spokojny start'
  const heroLead = hasExplicitService && selectedOffer ? selectedOffer.whenToChoose : PUBLIC_OFFER_BOOKING_LEAD
  const heroSupport = hasExplicitService && selectedOffer ? selectedOffer.heroSummary : PUBLIC_OFFER_BOOKING_REASSURANCE
  const summaryTitle = hasExplicitService && selectedOffer ? `Startujesz juz od: ${selectedOffer.shortTitle}.` : 'Najpierw sens wyboru, potem platnosc.'
  const summaryLead = hasExplicitService && selectedOffer ? selectedOffer.nextStep : PUBLIC_OFFER_BOOKING_PAYMENT
  const formLead = hasExplicitService
    ? 'Startujesz juz z wybranego formatu. Jesli chcesz, mozesz jeszcze zmienic usluge nizej, ale ten wariant jest ustawiony jako punkt wyjscia.'
    : 'Wpisz gatunek, wybierz usluge i zaproponuj 2-3 terminy. Reszte potwierdzam mailem - bez telefonu na stronie i bez kalendarza do klikania.'
  const serviceJsonLdDescription =
    hasExplicitService && selectedOffer
      ? `Prosba o rezerwacje ${selectedOffer.title} z potwierdzeniem terminu oraz platnoscia PayPal albo BLIK po mailu.`
      : 'Prosba o rezerwacje Kwadransu, Dwoch kwadransow albo Pelnej konsultacji z potwierdzeniem PayPal albo BLIK po mailu.'

  return (
    <NotatnikPageShell
      tag={pageTag}
      navItems={PUBLIC_SITE_NAV_ITEMS}
      ctaHref="/cennik"
      ctaLabel="Zobacz cennik"
      footerPrimaryHref={footerPrimaryHref}
      footerPrimaryLabel={footerPrimaryLabel}
    >
      <Schema
        data={[
          getBreadcrumbJsonLd([
            { name: 'Strona glowna', path: '/' },
            { name: 'Rezerwacja', path: '/book' },
          ]),
          getServiceJsonLd({
            name: 'Rezerwacja konsultacji behawioralnych online',
            description: serviceJsonLdDescription,
            serviceUrl: '/book',
            offerCatalog: [
              // nazwa uslugi: Kwadrans z behawiorysta; format: 15 min audio bez kamery.
              { name: 'Kwadrans z behawiorysta', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
              { name: 'Dwa kwadranse', description: '30 min online z krotka notatka po rozmowie.', url: '/book?service=konsultacja-30-min', price: 169 },
              { name: 'Pelna konsultacja', description: '60 min audio albo video, diagnoza, plan poprawy i 7 dni wsparcia tekstowego przez WhatsApp.', url: '/book?service=konsultacja-behawioralna-online', price: 470 },
            ],
          }),
        ]}
      />

      <section className="notatnik-subhero">
        <div>
          <div className="notatnik-subhero-tag notatnik-mono">{heroTag}</div>
          {hasExplicitService && selectedOffer ? (
            <h1>
              Rezerwacja <em>{selectedOffer.title}</em>.
            </h1>
          ) : (
            <h1>
              Rezerwacja <em>konsultacji behawioralnych online</em>.
            </h1>
          )}
          <p>{heroLead}</p>
          <p>{heroSupport}</p>
          <NextSlot className="top-gap-small" />
          <div className="notatnik-subhero-actions">
            <Link href="/cennik" prefetch={false} className="notatnik-btn">
              <span>Porownaj uslugi</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href="#formularz" prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>Przejdz do formularza</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Co dzieje sie dalej</div>
          <h3>{summaryTitle}</h3>
          <p>{summaryLead}</p>
          {hasExplicitService ? <p className="muted">{PUBLIC_OFFER_BOOKING_PAYMENT}</p> : null}
        </div>
      </section>

      <section id="porownanie">
        <NotatnikSectionHead index="I." kicker="Uslugi" title="Najpierw porownaj trzy glowne formaty." />
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
        <div className="info-box top-gap-small">{PUBLIC_OFFER_BOOKING_PRIORITY_NOTE}</div>
      </section>

      <section className="notatnik-contact">
        <div className="notatnik-contact-left">
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz rezerwacji</div>
          {hasExplicitService && selectedOffer ? (
            <h2>
              Wyslij prosbe o <em>{selectedOffer.shortTitle}</em>, a ja odpisze z potwierdzeniem.
            </h2>
          ) : (
            <h2>
              Wyslij prosbe o termin, <em>a ja odpisze z potwierdzeniem.</em>
            </h2>
          )}
          <p className="notatnik-contact-lede">{formLead}</p>

          <div className="contact-form-card" id="formularz">
            <BookRequestForm initialService={service} initialSpecies={species} entryService={requestedService} />
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
