import React from 'react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { type Offer, getOfferByServiceSlug } from '@/lib/offers'
import { getPdfAccessLabel, getPdfBundleBySlug, getPdfGuideBySlug } from '@/lib/pdf-guides'
import { buildMarketingMetadata } from '@/lib/seo'
import {
  SPECIALIST_ONLINE_PHOTO,
  buildMailtoHref,
  getPublicContactDetails,
  SPECIALIST_CREDENTIALS,
  SPECIALIST_NAME,
} from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kontakt',
  path: '/kontakt',
  description: 'Kontakt do marki Regulski | Terapia behawioralna. Opisz sytuację psa lub kota i wybierz dobry start.',
})

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
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
          `- wybrana usługa: ${offer?.title ?? 'Szybka konsultacja 15 min'}`,
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
          `- chcę zacząć od: ${offer?.title ?? ''}`,
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
  const contact = getPublicContactDetails()
  const mailtoHref = contact.email
    ? buildContactMailtoHref(contact.email, selectedOffer, selectedPdfInquiry, contactIntent, bookingId)
    : null
  const pageHeading = isRescheduleIntent
    ? 'Napisz w sprawie zmiany terminu lub rezygnacji'
    : selectedOffer
      ? `Zapytanie o: ${selectedOffer.title}`
      : 'Napisz wiadomość'
  const contactIntro = isRescheduleIntent
    ? 'Napisz krótko, jeśli chcesz zmienić termin albo zrezygnować.'
    : isResourceInquiry
      ? selectedPdfInquiry
        ? `Napisz krótko o sytuacji i o materiale „${selectedPdfInquiry.title}”. Powiem, czy to dobry start.`
        : 'Napisz krótko o sytuacji. Powiem, czy lepiej zacząć od PDF czy rozmowy.'
      : 'Napisz krótko, co się dzieje. Podpowiem najprostszy start.'
  const actionCardCopy = isRescheduleIntent
    ? `Podaj numer rezerwacji${bookingId ? ` (${bookingId})` : ''}, czy chodzi o zmianę terminu czy rezygnację, i nowy termin, jeśli go masz.`
    : isResourceInquiry
      ? selectedPdfInquiry
        ? `Napisz gatunek, problem i czego szukasz w materiale „${selectedPdfInquiry.title}”.`
        : 'Napisz gatunek, problem i czy wolisz PDF czy rozmowę.'
      : 'Napisz gatunek, problem i od kiedy to trwa.'
  const followupHref = selectedPdfInquiry?.routePath ?? (isResourceInquiry ? '/oferta/poradniki-pdf' : '/book')
  const followupLabel = selectedPdfInquiry
    ? selectedPdfInquiry.kind === 'bundle'
      ? 'Wróć do pakietu PDF'
      : 'Wróć do poradnika PDF'
    : isResourceInquiry
      ? 'Przejdź do PDF'
      : 'Umów 15 min'
  const primaryAnalyticsLocation = isRescheduleIntent
    ? 'contact-primary-reschedule'
    : isResourceInquiry
      ? 'contact-primary-resource'
      : 'contact-primary-message'
  const followupAnalyticsLocation = selectedPdfInquiry
    ? selectedPdfInquiry.kind === 'bundle'
      ? 'contact-followup-bundle'
      : 'contact-followup-guide'
    : isResourceInquiry
      ? 'contact-followup-resource'
      : 'contact-followup-book'

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="two-col-section contact-layout">
          <div className="panel section-panel hero-surface contact-side-panel">
            <div className="section-eyebrow">Kontakt</div>
            <h1>{pageHeading}</h1>
            <p className="hero-text">{contactIntro}</p>

            {selectedOffer || selectedPdfInquiry ? (
              <div className="list-card accent-outline tree-backed-card top-gap">
                <strong>Piszesz o</strong>
                <span>{selectedPdfInquiry?.title ?? selectedOffer?.title}</span>
              </div>
            ) : null}

            <div className="list-card tree-backed-card top-gap">
              <strong>Co napisać</strong>
              <span>{actionCardCopy}</span>
            </div>

            <div className="hero-actions top-gap">
              {mailtoHref ? (
                <a
                  href={mailtoHref}
                  className="button button-primary big-button"
                  data-analytics-event="cta_click"
                  data-analytics-location={primaryAnalyticsLocation}
                >
                  Napisz wiadomość
                </a>
              ) : null}
              <Link
                href={followupHref}
                prefetch={false}
                className="button button-ghost big-button"
                data-analytics-event="cta_click"
                data-analytics-location={followupAnalyticsLocation}
              >
                {followupLabel}
              </Link>
            </div>
          </div>

          <div className="panel section-panel contact-support-panel">
            <div className="contact-visual-shell">
              <Image
                src={SPECIALIST_ONLINE_PHOTO.src}
                alt={SPECIALIST_ONLINE_PHOTO.alt}
                width={1200}
                height={630}
                sizes="(max-width: 980px) 100vw, 40vw"
                className="contact-feature-image"
              />
            </div>
            <div className="section-eyebrow">Piszesz do mnie</div>
            <h2>{SPECIALIST_NAME}</h2>
            <p className="hero-text">
              {SPECIALIST_CREDENTIALS}. Odpowiadam osobiście i pomagam wybrać prosty start dla psa albo kota.
            </p>

            {contact.email ? (
              <div className="list-card tree-backed-card top-gap">
                <strong>E-mail</strong>
                <span>{contact.email}</span>
              </div>
            ) : null}
          </div>
        </section>

        <Footer variant="full" ctaHref="/book" ctaLabel="Umów 15 min" />
      </div>
    </main>
  )
}
