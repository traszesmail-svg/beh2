import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { type Offer, getOfferByServiceSlug, getOfferDetailCtaLabel, getOfferDetailHref, OFFERS } from '@/lib/offers'
import { getPdfAccessLabel, getPdfBundleBySlug, getPdfGuideBySlug, getPdfPricingBadge } from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  buildMailtoHref,
  getContactDetails,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
  SPECIALIST_TRUST_STATEMENT,
  SPECIALIST_WIDE_PHOTO,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt',
  path: '/kontakt',
  description:
    'Kontakt do marki Regulski | Terapia behawioralna. Opisz sytuację psa lub kota i dobierz odpowiednią formę współpracy.',
})

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function buildOfferMailtoHref(offer: Offer, email: string | null) {
  if (!email) {
    return offer.primaryHref
  }

  return buildMailtoHref(
    email,
    `Zapytanie - ${offer.title}`,
    `Dzień dobry,\n\nopisuję krótko swoją sytuację:\n\n- gatunek:\n- problem:\n- od kiedy trwa:\n- interesująca mnie forma pracy: ${offer.title}\n\nNajwygodniejsza forma kontaktu zwrotnego:\n`,
  )
}

type PdfInquirySelection = {
  kind: 'guide' | 'bundle'
  title: string
  summary: string
  pricing: string
  accessLabel: string
  routePath: string
}

type ContactIntent = 'general' | 'reschedule'
const CONTACT_SHORTCUT_PRIORITY = [
  'szybka-konsultacja-15-min',
  'konsultacja-30-min',
  'konsultacja-behawioralna-online',
  'pobyty-socjalizacyjno-terapeutyczne',
] as const

function buildContactMailtoHref(
  email: string,
  offer: Offer | null,
  pdfInquiry: PdfInquirySelection | null,
  intent: ContactIntent,
  bookingId: string | null,
) {
  const subjectParts =
    intent === 'reschedule'
      ? ['Zmiana terminu lub rezygnacja', offer?.title ?? 'Rezerwacja']
      : [offer?.title ?? 'Regulski | Terapia behawioralna']

  if (pdfInquiry) {
    subjectParts.push(pdfInquiry.title)
  }

  const bodyLines =
    intent === 'reschedule'
      ? [
          'Dzień dobry,',
          '',
          'piszę w sprawie zmiany terminu albo rezygnacji:',
          '',
          bookingId ? `- numer rezerwacji: ${bookingId}` : '- numer rezerwacji:',
          `- forma pracy: ${offer?.title ?? 'Szybka konsultacja 15 min'}`,
          '- czy chodzi o zmianę terminu czy rezygnację:',
          '- preferowany nowy termin:',
          '- dodatkowe informacje:',
          '',
          'Najwygodniejsza forma kontaktu zwrotnego:',
          '',
        ]
      : [
          'Dzień dobry,',
          '',
          'opisuję krótko swoją sytuację:',
          '',
          '- gatunek:',
          '- problem:',
          '- od kiedy trwa:',
          pdfInquiry ? `- interesujący mnie materiał PDF: ${pdfInquiry.title}` : '- interesujący mnie materiał PDF:',
          `- interesująca mnie forma pracy: ${offer?.title ?? ''}`,
          '',
          'Najwygodniejsza forma kontaktu zwrotnego:',
          '',
        ]

  return buildMailtoHref(email, `Zapytanie - ${subjectParts.join(' - ')}`, bodyLines.join('\n'))
}

export default function ContactPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const serviceSlug = readSearchParam(searchParams?.service)
  const guideSlug = readSearchParam(searchParams?.guide)
  const bundleSlug = readSearchParam(searchParams?.bundle)
  const intentParam = readSearchParam(searchParams?.intent)
  const bookingId = readSearchParam(searchParams?.bookingId)
  const selectedOffer = serviceSlug ? getOfferByServiceSlug(serviceSlug) : null
  const selectedPdfGuide = guideSlug ? getPdfGuideBySlug(guideSlug) : null
  const selectedPdfBundle = bundleSlug ? getPdfBundleBySlug(bundleSlug) : null
  const selectedPdfInquiry: PdfInquirySelection | null = selectedPdfBundle
    ? {
        kind: 'bundle',
        title: selectedPdfBundle.title,
        summary: selectedPdfBundle.promise,
        pricing: selectedPdfBundle.pricing,
        accessLabel: getPdfAccessLabel(selectedPdfBundle.accessType),
        routePath: selectedPdfBundle.routePath,
      }
    : selectedPdfGuide
      ? {
          kind: 'guide',
          title: selectedPdfGuide.title,
          summary: selectedPdfGuide.description,
          pricing: selectedPdfGuide.pricing,
          accessLabel: getPdfAccessLabel(selectedPdfGuide.accessType),
          routePath: selectedPdfGuide.routePath,
        }
      : null
  const isResourceInquiry = selectedOffer?.kind === 'resource'
  const isRescheduleIntent = intentParam === 'reschedule'
  const contactIntent: ContactIntent = isRescheduleIntent ? 'reschedule' : 'general'
  const shortcutCandidates = OFFERS.filter((offer) => offer.kind !== 'resource')
  let featuredShortcutOffers = shortcutCandidates.filter((offer) => CONTACT_SHORTCUT_PRIORITY.includes(offer.slug as (typeof CONTACT_SHORTCUT_PRIORITY)[number]))
  if (selectedOffer && selectedOffer.kind !== 'resource' && !featuredShortcutOffers.some((offer) => offer.slug === selectedOffer.slug)) {
    featuredShortcutOffers = [...featuredShortcutOffers.slice(0, 3), selectedOffer]
  }
  const remainingShortcutCount = Math.max(0, shortcutCandidates.length - featuredShortcutOffers.length)
  const contact = getContactDetails()
  const mailtoHref = contact.email
    ? buildContactMailtoHref(contact.email, selectedOffer, selectedPdfInquiry, contactIntent, bookingId)
    : null
  const contactIntro = isRescheduleIntent
    ? 'Jeśli chcesz zmienić termin albo zrezygnować z opłaconej konsultacji, napisz. Sprawdzę możliwe terminy i dalszy krok.'
    : isResourceInquiry
      ? selectedPdfInquiry
        ? `Jeśli chcesz zapytać o materiał „${selectedPdfInquiry.title}”, napisz krótko o sytuacji. Odpowiem, czy to dobry start, czy lepiej od razu przejść do konsultacji.`
        : 'Jeśli szukasz poradnika PDF albo pakietu, napisz krótko o sytuacji. Odpowiem, czy lepszy będzie materiał czy konsultacja.'
      : 'Jeśli nie wiesz, od czego zacząć, napisz kilka zdań o sytuacji psa lub kota. Lepiej dobrać pierwszy krok niż zgadywać usługę.'
  const whatToWriteCopy = isRescheduleIntent
    ? `W wiadomości podaj numer rezerwacji${bookingId ? ` (${bookingId})` : ''}, informację, czy chodzi o zmianę terminu czy rezygnację, oraz preferowany nowy termin.`
    : isResourceInquiry
      ? selectedPdfInquiry
        ? `W wiadomości napisz o gatunku, głównym problemie, czasie trwania trudności i czego oczekujesz po materiale „${selectedPdfInquiry.title}”.`
        : 'W wiadomości napisz o gatunku, głównym problemie, czasie trwania trudności i czy PDF ma być pierwszym krokiem czy wsparciem po konsultacji.'
      : 'W wiadomości napisz o gatunku, głównym problemie, czasie trwania trudności i o tym, co jest dziś najtrudniejsze.'
  const responseCopy = isRescheduleIntent
    ? 'W odpowiedzi napiszę, czy zmiana terminu jest możliwa, jakie sloty są dostępne i co dalej.'
    : isResourceInquiry
      ? selectedPdfInquiry
        ? `W odpowiedzi napiszę, czy „${selectedPdfInquiry.title}” ma sens na teraz, jak wygląda dostęp i czy lepiej przejść do rozmowy.`
        : 'W odpowiedzi napiszę, jaki materiał ma największy sens na start i czy lepiej przejść do konsultacji.'
      : 'W odpowiedzi zaproponuję najlepszy kolejny krok: konsultację startową, pogłębioną, terapię, wizytę albo pobyt.'
  const followupHref = selectedPdfInquiry?.routePath ?? (isResourceInquiry ? '/oferta/poradniki-pdf' : '/book')
  const followupLabel = selectedPdfInquiry
    ? selectedPdfInquiry.kind === 'bundle'
      ? 'Wróć do pakietu PDF'
      : 'Wróć do poradnika PDF'
    : isResourceInquiry
      ? 'Przejdź do listy poradników PDF'
      : 'Umów pierwszy krok'

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section contact-layout">
          <div className="panel section-panel contact-side-panel">
            <div className="section-eyebrow">Kontakt i dobór formy</div>
            <h1>
              {isRescheduleIntent
                ? 'Napisz w sprawie zmiany terminu lub rezygnacji'
                : selectedOffer
                  ? `Zapytanie o: ${selectedOffer.title}`
                  : 'Opisz sytuację i dobierz pierwszy krok'}
            </h1>
            <p className="hero-text">{contactIntro}</p>

            {selectedOffer ? (
              <div className="list-card accent-outline tree-backed-card top-gap">
                <strong>Wybrana forma</strong>
                <span>{selectedOffer.heroSummary}</span>
              </div>
            ) : null}

            {selectedPdfInquiry ? (
              <div className="list-card tree-backed-card top-gap">
                <strong>{selectedPdfInquiry.kind === 'bundle' ? 'Wybrany pakiet PDF' : 'Wybrany poradnik PDF'}</strong>
                <span>{selectedPdfInquiry.summary}</span>
                <span>
                  {selectedPdfInquiry.accessLabel}. {getPdfPricingBadge(selectedPdfInquiry.pricing)}
                </span>
              </div>
            ) : null}

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Co warto napisać</strong>
                <span>{whatToWriteCopy}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Jak odpowiadam</strong>
                <span>{responseCopy}</span>
              </div>
            </div>

            <div className="hero-actions top-gap">
              {mailtoHref ? (
                <a href={mailtoHref} className="button button-primary big-button">
                  Wyślij e-mail
                </a>
              ) : null}
              {contact.phoneDisplay && contact.phoneHref ? (
                <a href={`tel:${contact.phoneHref}`} className="button button-ghost big-button">
                  Zadzwoń
                </a>
              ) : null}
              <Link href={followupHref} prefetch={false} className="button button-ghost big-button">
                {followupLabel}
              </Link>
            </div>
          </div>

          <div className="panel section-panel contact-support-panel">
            <div className="section-eyebrow">Kto odpowiada</div>
            <h2>Odpowiadam osobiście</h2>

            <div className="contact-visual-shell top-gap">
              <Image
                src={SPECIALIST_WIDE_PHOTO.src}
                alt={SPECIALIST_WIDE_PHOTO.alt}
                width={1200}
                height={900}
                sizes="(max-width: 980px) 100vw, 42vw"
                className="contact-feature-image"
              />
            </div>

            <div className="list-card accent-outline tree-backed-card top-gap">
              <strong>{SPECIALIST_NAME}</strong>
              <span>{SPECIALIST_CREDENTIALS}</span>
              <span>{SPECIALIST_TRUST_STATEMENT}</span>
            </div>

            <div className="section-eyebrow top-gap">Skróty do ścieżek</div>
            <h2>Najczęstsze wejścia</h2>
            <div className="contact-shortcut-grid top-gap">
              {featuredShortcutOffers.map((offer) => (
                <div key={offer.slug} className="list-card tree-backed-card contact-shortcut-card">
                  <strong>{offer.title}</strong>
                  <span>{offer.cardSummary}</span>
                  <div className="offer-card-actions top-gap-small">
                    <Link href={getOfferDetailHref(offer)} prefetch={false} className="button button-ghost">
                      {getOfferDetailCtaLabel(offer)}
                    </Link>
                    <a href={buildOfferMailtoHref(offer, contact.email)} className="button button-primary">
                      Napisz w sprawie tej usługi
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="list-card accent-outline tree-backed-card top-gap contact-shortcut-summary">
              <strong>Potrzebujesz innej formy pracy?</strong>
              <span>
                {remainingShortcutCount > 0
                  ? `Pozostałe ${remainingShortcutCount} formy pracy są w pełnej ofercie. Jeśli nie chcesz wybierać samodzielnie, napisz od razu.`
                  : 'Pełną ofertę znajdziesz niżej i w zakładce oferta. Jeśli nie chcesz wybierać samodzielnie, napisz od razu.'}
              </span>
              <div className="offer-card-actions top-gap-small">
                <Link href="/oferta" prefetch={false} className="button button-ghost">
                  Zobacz całą ofertę
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
