import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { BookingForm } from '@/components/BookingForm'
import { BookingServiceInfoCard } from '@/components/BookingServiceInfoCard'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_BOOKING_FLOW_NAV_ITEMS } from '@/components/NotatnikA'
import { PricingDisclosure } from '@/components/PricingDisclosure'
import {
  DEFAULT_BOOKING_SERVICE,
  getBookableServiceAvailabilityWindow,
  getBookingServicePriceLabel,
  getBookingServiceRoomSummary,
  getBookingServiceTitle,
  isAudioOnlyBookingService,
  normalizeBookingServiceType,
} from '@/lib/booking-services'
import {
  buildBookHref,
  buildSlotHref,
  readBookingServiceSearchParam,
  readProblemTypeSearchParam,
  readQaBookingSearchParam,
  readSearchParam,
} from '@/lib/booking-routing'
import { formatDateTimeLabel, getProblemLabel, getProblemSpecies, isFutureAvailabilitySlot } from '@/lib/data'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { DEFAULT_PRICE_PLN } from '@/lib/pricing'
import { getAvailabilitySlot, getActiveConsultationPrice, listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { buildTechnicalMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateMetadata(): Metadata {
  return buildTechnicalMetadata({
    title: 'Dane do rezerwacji',
    path: '/form',
    description: 'Uzupelnij dane potrzebne do potwierdzenia terminu i przejscia do platnosci.',
    noIndex: false,
    follow: true,
  })
}

export default async function FormPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const serviceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service))
  const serviceQuery = serviceType === DEFAULT_BOOKING_SERVICE ? null : serviceType
  const slotId = readSearchParam(searchParams?.slotId)
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)

  if (!problem || !slotId) {
    redirect(buildBookHref(null, serviceQuery, qaBooking))
  }

  const messageHref = `/kontakt?species=${getProblemSpecies(problem)}#formularz`
  const quickAudioHref = buildBookHref(null, 'szybka-konsultacja-15-min', qaBooking, getProblemSpecies(problem))
  const slotsHref = buildSlotHref(problem, serviceQuery, qaBooking)
  const dataMode = getDataModeStatus()
  let slot: Awaited<ReturnType<typeof getAvailabilitySlot>> = null
  let flowError: string | null = null
  let slotWindowAvailable = false
  let amount = DEFAULT_PRICE_PLN
  let amountLabel = getBookingServicePriceLabel(serviceType, DEFAULT_PRICE_PLN)

  if (dataMode.isValid) {
    try {
      const [selectedSlot, groupedAvailability, quickConsultationPrice] = await Promise.all([
        getAvailabilitySlot(slotId),
        listAvailability(),
        getActiveConsultationPrice(),
      ])
      slot = selectedSlot
      const availableSlots = groupedAvailability.flatMap((group) => group.slots)
      slotWindowAvailable = Boolean(selectedSlot && getBookableServiceAvailabilityWindow(availableSlots, slotId, serviceType))
      amount = quickConsultationPrice.amount
      amountLabel = getBookingServicePriceLabel(serviceType, quickConsultationPrice.amount)
    } catch (error) {
      console.warn('[behawior15][form] failed to load form or slot', error)
      flowError = 'Formularz chwilowo sie odswieza. Sprobuj ponownie za moment.'
    }
  } else {
    flowError = 'Formularz chwilowo sie odswieza. Sprobuj ponownie za moment.'
  }

  const slotIsBookable = slot
    ? !slot.isBooked &&
      !slot.lockedByBookingId &&
      isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime) &&
      slotWindowAvailable
    : false
  const activeSlot = slotIsBookable ? slot : null

  return (
    <main className="notatnik-page" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <NotatnikSideVisuals variant={getProblemSpecies(problem) === 'kot' ? 'cat' : 'dog'} />
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Rezerwacja konsultacji" navItems={PUBLIC_BOOKING_FLOW_NAV_ITEMS} ctaHref={slotsHref} ctaLabel="Wroc do terminow" ctaVariant="ghost" />

        <div className="notatnik-booking">
          <div className="notatnik-booking-left">
            <BookingStageEyebrow stage="details" />
            {qaBooking ? (
              <div className="notatnik-contact-note" style={{ marginTop: 18 }}>
                <strong>Tryb testowy</strong>
                <p>Przejdziesz przez kontrolowana platnosc testowa bez realnego obciazenia klienta.</p>
              </div>
            ) : null}

            <h1>
              Uzupelnij <em>potrzebne dane</em>.
            </h1>
            <p className="notatnik-booking-lede">
              Wpisz tylko informacje potrzebne do rezerwacji. Po zapisaniu formularza przejdziesz do wpłaty ręcznej i końcowego potwierdzenia terminu.
            </p>

            <div className="notatnik-detail-stack">
              <BookingServiceInfoCard
                serviceType={serviceType}
                quickConsultationPrice={amount}
                title="Parametry tej rezerwacji"
                stageLabel="Dane do potwierdzenia"
                emphasis="To ostatni spokojny krok przed platnoscia. Po zapisaniu formularza wybrane okno zostanie tymczasowo zablokowane."
              />

              <div className="notatnik-detail-card">
                <strong>Usluga</strong>
                <p>{getBookingServiceTitle(serviceType)}</p>
              </div>

              <div className="notatnik-detail-card">
                <strong>Temat</strong>
                <p>{getProblemLabel(problem)}</p>
              </div>

              <div className="notatnik-detail-card">
                <strong>Termin rozmowy</strong>
                <p>{slot ? formatDateTimeLabel(slot.bookingDate, slot.bookingTime) : 'Ten termin nie jest juz dostepny.'}</p>
              </div>

              <div className="notatnik-detail-card">
                <strong>Format</strong>
                <p>
                  {getBookingServiceRoomSummary(serviceType)}{' '}
                  {isAudioOnlyBookingService(serviceType)
                    ? 'Kamera nie jest potrzebna.'
                    : serviceType === 'konsultacja-30-min'
                      ? 'Wiecej czasu na uporzadkowanie kilku watkow, gdy 15 minut to za malo.'
                      : 'To najszersza konsultacja online z wieksza iloscia czasu na temat i kilka watkow naraz.'}
                </p>
              </div>

              <div className="notatnik-detail-card">
                <PricingDisclosure
                  stage="pre-payment"
                  labelAs="strong"
                  message={`${amountLabel}. To finalna kwota dla tej uslugi przed przejsciem do platnosci.`}
                />
              </div>
            </div>
          </div>

          <div className="notatnik-booking-right">
            <div className="notatnik-booking-panel">
              <div className="notatnik-mono">Krok 04 / 04 · Formularz</div>

              {flowError ? (
                <>
                  <div className="notatnik-callout">
                    {flowError} Jesli temat jest pilny, wyslij krotka wiadomosc i wroc do terminow pozniej.
                  </div>
                  <div className="notatnik-actions">
                    <Link href={slotsHref} prefetch={false} className="notatnik-btn notatnik-btn-accent">
                      Wroc do terminow
                    </Link>
                    <Link href={messageHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                      {FUNNEL_CTA_LABELS.contact}
                    </Link>
                  </div>
                </>
              ) : activeSlot ? (
                <>
                  <div className="notatnik-contact-note">
                    <strong>Formularz rezerwacji</strong>
                    <p>Wpisz tylko informacje potrzebne do rezerwacji i przejscia do platnosci.</p>
                  </div>
                  <BookingForm
                    problemType={problem}
                    serviceType={serviceType}
                    slotId={activeSlot.id}
                    slotLabel={formatDateTimeLabel(activeSlot.bookingDate, activeSlot.bookingTime)}
                    amountLabel={amountLabel}
                    qaBooking={qaBooking}
                  />
                </>
              ) : (
                <>
                  <div className="notatnik-callout notatnik-callout-error">
                    Ten termin nie jest juz dostepny dla wybranej uslugi. Wroc do listy albo wyslij krotka wiadomosc.
                  </div>
                  <div className="notatnik-actions">
                    <Link href={slotsHref} prefetch={false} className="notatnik-btn notatnik-btn-accent">
                      Wroc do terminow
                    </Link>
                    <Link href={messageHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                      {FUNNEL_CTA_LABELS.contact}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <NotatnikFooter primaryHref={quickAudioHref} primaryLabel={FUNNEL_CTA_LABELS.primary} />
      </div>
    </main>
  )
}
