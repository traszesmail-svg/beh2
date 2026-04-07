import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { BookingForm } from '@/components/BookingForm'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PricingDisclosure } from '@/components/PricingDisclosure'
import {
  DEFAULT_BOOKING_SERVICE,
  getBookableServiceAvailabilityWindow,
  getBookingServicePriceLabel,
  getBookingServiceRoomSummary,
  getBookingServiceTitle,
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
import { formatDateTimeLabel, getProblemLabel, isFutureAvailabilitySlot } from '@/lib/data'
import { getActiveConsultationPrice, getAvailabilitySlot, listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

  const dataMode = getDataModeStatus()
  let slot: Awaited<ReturnType<typeof getAvailabilitySlot>> = null
  let flowError: string | null = null
  let slotWindowAvailable = false
  let amountLabel = getBookingServicePriceLabel(serviceType, 59)

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
      amountLabel = getBookingServicePriceLabel(serviceType, quickConsultationPrice.amount)
    } catch (error) {
      console.warn('[behawior15][form] failed to load form or slot', error)
      flowError = 'Formularz chwilowo się odświeża. Spróbuj ponownie za moment.'
    }
  } else {
    flowError = 'Formularz chwilowo się odświeża. Spróbuj ponownie za moment.'
  }

  const slotIsBookable = slot
    ? !slot.isBooked &&
      !slot.lockedByBookingId &&
      isFutureAvailabilitySlot(slot.bookingDate, slot.bookingTime) &&
      slotWindowAvailable
    : false
  const activeSlot = slotIsBookable ? slot : null

  return (
    <main className="page-wrap" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <div className="container">
        <Header />
        <section className="two-col-section booking-layout booking-stage-layout">
          <div className="panel section-panel hero-surface booking-stage-panel booking-stage-summary-panel booking-flow-panel">
            <BookingStageEyebrow stage="details" className="section-eyebrow" />
            {qaBooking ? <div className="status-pill transaction-status-pill">Tryb testowy</div> : null}
            <h1>Uzupełnij dane do rezerwacji</h1>
            <p className="hero-text compact-panel-text">
              Wypełnij krótko dane. Po zapisaniu formularza termin zostanie chwilowo zablokowany, a na kolejnym ekranie przejdziesz do wpłaty ręcznej.
            </p>

            <div className="stack-gap top-gap booking-facts-stack">
              <div className="list-card tree-backed-card">
                <strong>Usługa</strong>
                <span>{getBookingServiceTitle(serviceType)}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Temat</strong>
                <span>{getProblemLabel(problem)}</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Termin rozmowy</strong>
                <span>{slot ? formatDateTimeLabel(slot.bookingDate, slot.bookingTime) : 'Termin nie jest już dostępny.'}</span>
              </div>
              <div className="list-card accent-outline tree-backed-card">
                <strong>Format</strong>
                <span>{getBookingServiceRoomSummary(serviceType)} Kamera nie jest potrzebna.</span>
              </div>
              <div className="list-card tree-backed-card">
                <PricingDisclosure
                  stage="pre-payment"
                  labelAs="strong"
                  message={`${amountLabel}. To finalna kwota dla tej usługi przed przejściem do wpłaty ręcznej.`}
                />
              </div>
            </div>
          </div>

          <div className="panel section-panel booking-stage-panel booking-stage-form-panel booking-flow-panel">
            {flowError ? (
              <>
                <div className="info-box">
                  {flowError} Jeśli temat jest pilny, napisz wiadomość i wróć do terminów, gdy będziesz gotowy.
                </div>
                <div className="hero-actions top-gap">
                  <Link href={buildSlotHref(problem, serviceQuery, qaBooking)} prefetch={false} className="button button-primary big-button">
                    Wróć do terminów
                  </Link>
                  <Link href="/kontakt" prefetch={false} className="button button-ghost">
                    Napisz wiadomość
                  </Link>
                </div>
              </>
            ) : activeSlot ? (
              <>
                <div className="section-eyebrow">Dane do potwierdzenia</div>
                <h2>Formularz konsultacji</h2>
                <p className="hero-text compact-panel-text">Wpisz tylko informacje potrzebne do rezerwacji i kontaktu.</p>
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
                <div className="error-box">
                  Ten termin nie jest już dostępny dla wybranej usługi. Wróć do listy, wybierz inną godzinę albo napisz wiadomość.
                </div>
                <div className="hero-actions top-gap">
                  <Link href={buildSlotHref(problem, serviceQuery, qaBooking)} prefetch={false} className="button button-primary big-button">
                    Wróć do terminów
                  </Link>
                  <Link href="/kontakt" prefetch={false} className="button button-ghost">
                    Napisz wiadomość
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <Footer
          ctaHref="/kontakt"
          ctaLabel="Masz pytanie? Napisz"
          headline="Masz pytanie przed płatnością?"
          description="Jeśli chcesz doprecyzować rezerwację albo opisać temat w dwóch linijkach, napisz wiadomość."
        />
      </div>
    </main>
  )
}
