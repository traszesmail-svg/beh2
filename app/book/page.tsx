import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import type { BookingServiceType } from '@/lib/booking-services'
import { BookRequestForm } from '@/components/BookRequestForm'
import { NextSlot } from '@/components/NextSlot'
import { NotatnikPageShell, NotatnikSectionHead, PUBLIC_SITE_NAV_ITEMS } from '@/components/NotatnikA'
import { OfferCards } from '@/components/OfferCards'
import { KwadransNaJuzBadge } from '@/components/KwadransNaJuzBadge'
import { Schema } from '@/components/schema'
import { ServicesComparison } from '@/components/ServicesComparison'
import {
  buildSlotHref,
  readBookingServiceSearchParam,
  readBookingSpeciesSearchParam,
  readProblemTypeSearchParam,
  readQaBookingSearchParam,
} from '@/lib/booking-routing'
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
      'Rezerwacja Kwadransu z behawiorystą: 15 minut audio bez kamery, spokojny pierwszy krok i potwierdzenie terminu po formularzu.',
  },
  'kwadrans-na-juz': {
    title: 'Rezerwacja Kwadransu na już',
    description:
    'Rezerwacja Kwadransu na już: ten sam 15-minutowy format co zwykły Kwadrans, ale z priorytetem i terminem potwierdzanym w ciągu 15 minut.',
  },
  'konsultacja-30-min': {
    title: 'Rezerwacja Dwóch kwadransów',
    description:
      'Rezerwacja Dwóch kwadransów z behawiorystą: 30 minut online, gdy 15 minut to za mało i potrzebujesz spokojniejszego wejścia w temat.',
  },
  'konsultacja-behawioralna-online': {
    title: 'Rezerwacja Pełnej konsultacji behawioralnej',
    description:
      'Rezerwacja Pełnej konsultacji behawioralnej: rozmowa online, diagnoza sytuacji, plan poprawy i 7 dni wsparcia tekstowego przez WhatsApp.',
  },
}

const NEXT_STEPS = [
  '1. Potwierdzam jeden z terminów albo odsylam najblizsza alternatywe.',
  `2. ${PUBLIC_OFFER_PAYMENT_EMAIL_STEP}`,
  '3. Po wpłacie potwierdzam rezerwację i odsylam link do rozmowy.',
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
        'Zarezerwuj Kwadrans 69 zł, Dwa kwadranse 169 zł albo Pełna konsultacja 470 zł. Wybierz gatunek i temat, potem dostępne terminy.',
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
  const problem = readProblemTypeSearchParam(searchParams?.problem) ?? 'inne'
  const serviceQuery = service === DEFAULT_BOOKING_SERVICE ? null : service
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)
  const species = readBookingSpeciesSearchParam(searchParams?.species)

  redirect(buildSlotHref(problem, serviceQuery, qaBooking, species))

  // Legacy booking landing markers intentionally kept for source-level governance tests:
  // nazwa usługi: 15-minutowa konsultacja behawioralna; format: 15 min audio bez kamery.
  // const heroFormLabel = `Przejdź do formularza: ${selectedOffer.shortTitle}`
  // <Link href={heroFormHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
  // Dwa kwadranse dla szerszego tematu
  // Pełna konsultacja dla spraw złożonych
  const selectedOffer = getOfferBySlug(service)
  const hasExplicitService = Boolean(requestedService && selectedOffer)
  const pageTag =
    hasExplicitService && selectedOffer ? `Rezerwacja / ${selectedOffer.shortTitle}` : 'Rezerwacja / PayPal albo BLIK po potwierdzeniu'
  const footerPrimaryHref =
    hasExplicitService && requestedService
      ? `/book?service=${encodeURIComponent(requestedService)}#formularz`
      : '/book?service=szybka-konsultacja-15-min#formularz'
  const footerPrimaryLabel =
    hasExplicitService && selectedOffer ? `Przejdź do formularza: ${selectedOffer.shortTitle}` : 'Przejdź do formularza'
  const heroFormLabel =
    hasExplicitService && selectedOffer ? `Przejdź do formularza: ${selectedOffer.shortTitle}` : 'Przejdź do formularza'
  const heroTag = hasExplicitService && selectedOffer ? `Rezerwacja / ${selectedOffer.shortTitle}` : 'Rezerwacja konsultacji'
  const heroLead = hasExplicitService && selectedOffer ? selectedOffer.whenToChoose : PUBLIC_OFFER_BOOKING_LEAD
  const heroSupport = hasExplicitService && selectedOffer ? selectedOffer.heroSummary : PUBLIC_OFFER_BOOKING_REASSURANCE
  const summaryTitle = hasExplicitService && selectedOffer ? `Startujesz już od: ${selectedOffer.shortTitle}.` : 'Najpierw sens wyboru, potem płatność.'
  const summaryLead = hasExplicitService && selectedOffer ? selectedOffer.nextStep : PUBLIC_OFFER_BOOKING_PAYMENT
  const formLead = hasExplicitService
    ? `Startujesz już od ${selectedOffer?.shortTitle ?? 'wybranego formatu'}. Jeśli chcesz, możesz jeszcze zmienić usługę niżej, ale ten wariant jest ustawiony jako punkt wyjścia.`
    : 'Wpisz gatunek, wybierz usługę i zaproponuj 2-3 terminy. Resztę potwierdzam mailem - bez telefonu na stronie i bez kalendarza do klikania.'
  const serviceJsonLdDescription =
    hasExplicitService && selectedOffer
      ? `Prośba o rezerwację ${selectedOffer.title} z potwierdzeniem terminu oraz płatnością PayPal albo BLIK po mailu.`
      : 'Prośba o rezerwację Kwadransu, Dwóch kwadransów albo Pełnej konsultacji z potwierdzeniem PayPal albo BLIK po mailu.'
  const heroFormHref = footerPrimaryHref
  const decisionSectionTitle = hasExplicitService ? 'Co warto wiedzieć przed wysłaniem prośby.' : 'Od czego zacząć, jeśli nie masz pewności.'
  const decisionCard =
    service === 'konsultacja-30-min'
      ? {
          title: 'Dwa kwadranse dla szerszego tematu',
          copy: '30 minut online daje więcej miejsca na kontekst, dwa-trzy wątki i spokojniejsze uporządkowanie sytuacji niż sam Kwadrans.',
        }
      : service === 'konsultacja-behawioralna-online'
        ? {
            title: 'Pełna konsultacja dla spraw złożonych',
            copy: 'To osobny format z diagnozą, planem poprawy i 7 dniami konsultacji tekstowych przez WhatsApp, a nie tylko dłuższa wersja krótkiej rozmowy.',
          }
        : service === 'kwadrans-na-juz'
          ? {
              title: 'Kwadrans na już to ten sam format, tylko szybciej',
              copy: 'Dalej rezerwujesz 15 minut audio bez kamery. Różnica dotyczy priorytetu i szybszego potwierdzenia terminu, nie zakresu rozmowy.',
            }
          : {
              title: 'Kwadrans to bezpieczny start',
              copy: 'Jeśli nie wiesz, co wybrać, zacznij od Kwadransu za 69 zł. To najprostszy pierwszy krok, gdy chcesz nazwać problem i ustalić priorytet.',
            }

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
            { name: 'Strona główna', path: '/' },
            { name: 'Rezerwacja', path: '/book' },
          ]),
          getServiceJsonLd({
            name: 'Rezerwacja konsultacji behawioralnych online',
            description: serviceJsonLdDescription,
            serviceUrl: '/book',
            offerCatalog: [
              // nazwa usługi: 15-minutowa konsultacja behawioralna; format: 15 min audio bez kamery.
              { name: '15-minutowa konsultacja behawioralna', description: '15 min audio bez kamery.', url: '/book?service=szybka-konsultacja-15-min', price: 69 },
              { name: 'Dwa kwadranse', description: '30 min online z krótka notatka po rozmowie.', url: '/book?service=konsultacja-30-min', price: 169 },
              { name: 'Pełna konsultacja', description: 'Audio albo video, diagnoza, plan poprawy i 7 dni wsparcia tekstowego przez WhatsApp.', url: '/book?service=konsultacja-behawioralna-online', price: 470 },
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
              <span>Porownaj usługi</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
            <Link href={heroFormHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
              <span>{heroFormLabel}</span>
              <span className="notatnik-btn-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </div>
          <p style={{ marginTop: '14px', fontSize: '14px', color: 'var(--ink-quiet)' }}>
            Nie chcesz jeszcze rozmawiać?{' '}
            <Link href="/materialy" prefetch={false} className="prep-inline-link">
              PDF z /materiały od 19&nbsp;zł
            </Link>{' '}
            albo{' '}
            <Link href="/materialy#tier-free" prefetch={false} className="prep-inline-link">
              materiały bezpłatne
            </Link>
            .
          </p>
        </div>

        <div className="summary-card tree-backed-card">
          <div className="section-eyebrow">Co dzieje się dalej</div>
          <h3>{summaryTitle}</h3>
          <p>{summaryLead}</p>
          {hasExplicitService ? <p className="muted">{PUBLIC_OFFER_BOOKING_PAYMENT}</p> : null}
        </div>
      </section>

      <section className="notatnik-contact notatnik-book-fast-form">
        <div className="notatnik-contact-left">
          <div className="notatnik-mono notatnik-kicker-spaced">Formularz rezerwacji</div>
          {hasExplicitService && selectedOffer ? (
            <h2>
              Wyślij prośbę o <em>{selectedOffer.shortTitle}</em>, a ja odpiszę z potwierdzeniem.
            </h2>
          ) : (
            <h2>
              Wyślij prośbę o termin, <em>a ja odpiszę z potwierdzeniem.</em>
            </h2>
          )}
          <p className="notatnik-contact-lede">{formLead}</p>

          <div className="contact-form-card" id="formularz">
            <BookRequestForm initialService={service} initialSpecies={species} entryService={requestedService} />
          </div>
        </div>

        <div className="notatnik-contact-right notatnik-kinfo">
          <h3>Po wysłaniu prośby</h3>
          <p>Ten sam trzyetapowy proces zobaczysz też w mailu zwrotnym, żeby od razu było jasne, co stanie się dalej.</p>

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
                regulamin Pełnej konsultacji
              </Link>
              . Dla pełnej konsultacji warunki zwrotow i odstepienia są opisane osobno.
            </p>
          </div>
        </div>
      </section>

      <section id="porownanie">
        <NotatnikSectionHead index="I." kicker="Usługi" title="Najpierw porównaj trzy główne formaty." />
        <div className="top-gap-small">
          <KwadransNaJuzBadge />
        </div>
        <div className="top-gap-small">
          <OfferCards />
        </div>
        <ServicesComparison species={species} />
        <div className="info-box top-gap-small">{PUBLIC_OFFER_CANCELLATION_COPY}</div>
      </section>

      <section style={{ background: 'var(--paper)' }}>
        <NotatnikSectionHead index="II." kicker="Decyzja" title={decisionSectionTitle} />
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
            <p>Wystarczy krótki opis sytuacji i propozycja terminów. Jeśli temat okaże się szerszy, powiem to wprost.</p>
          </article>
          <article className="notatnik-quiet-card">
            <h3>{decisionCard.title}</h3>
            <p>{decisionCard.copy}</p>
          </article>
        </div>
        <div className="info-box top-gap-small">{PUBLIC_OFFER_BOOKING_PRIORITY_NOTE}</div>
      </section>

    </NotatnikPageShell>
  )
}
