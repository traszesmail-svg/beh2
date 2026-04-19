import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { getServiceAnalyticsParams } from '@/lib/analytics-schema'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { BookingServiceInfoCard } from '@/components/BookingServiceInfoCard'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import {
  type BookingServiceType,
  DEFAULT_BOOKING_SERVICE,
  filterGroupedAvailabilityForService,
  getBookingServiceSlotBadge,
  getBookingServiceSlotSummary,
  normalizeBookingServiceType,
} from '@/lib/booking-services'
import {
  buildBookHref,
  buildFormHref,
  buildSlotHref,
  readBookingServiceSearchParam,
  readProblemTypeSearchParam,
  readQaBookingSearchParam,
} from '@/lib/booking-routing'
import { getProblemLabel, getProblemSpecies } from '@/lib/data'
import { FUNNEL_CTA_LABELS, FUNNEL_SERVICE_CONFIG } from '@/lib/funnel'
import { buildTechnicalMetadata } from '@/lib/seo'
import { listAvailability } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import type { GroupedAvailability } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function addMinutesToTime(time: string, minutesToAdd: number) {
  const [hours, minutes] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes + minutesToAdd
  const nextHours = Math.floor(totalMinutes / 60)
  const nextMinutes = totalMinutes % 60

  return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`
}

function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

function partitionAvailabilityForDisplay(groups: GroupedAvailability[], serviceType: BookingServiceType) {
  if (serviceType !== 'konsultacja-behawioralna-online') {
    return {
      primaryGroups: groups,
      additionalGroups: [] as GroupedAvailability[],
    }
  }

  const consultationDurationMinutes = FUNNEL_SERVICE_CONFIG[serviceType].durationMinutes
  const primaryGroups: GroupedAvailability[] = []
  const additionalGroups: GroupedAvailability[] = []

  for (const group of groups) {
    const primarySlots: GroupedAvailability['slots'] = []
    const additionalSlots: GroupedAvailability['slots'] = []
    let previousPrimaryStartMinutes: number | null = null

    for (const slot of group.slots) {
      const slotStartMinutes = parseTimeToMinutes(slot.bookingTime)

      if (
        previousPrimaryStartMinutes === null ||
        slotStartMinutes - previousPrimaryStartMinutes >= consultationDurationMinutes
      ) {
        primarySlots.push(slot)
        previousPrimaryStartMinutes = slotStartMinutes
      } else {
        additionalSlots.push(slot)
      }
    }

    if (primarySlots.length > 0) {
      primaryGroups.push({
        ...group,
        slots: primarySlots,
      })
    }

    if (additionalSlots.length > 0) {
      additionalGroups.push({
        ...group,
        slots: additionalSlots,
      })
    }
  }

  return {
    primaryGroups,
    additionalGroups,
  }
}

export function generateMetadata({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}): Metadata {
  const problem = readProblemTypeSearchParam(searchParams?.problem)

  return buildTechnicalMetadata({
    title: problem ? `Wybierz termin | ${getProblemLabel(problem)}` : 'Wybierz termin',
    path: '/slot',
    description: problem
      ? `Wybierz termin dla ${getProblemLabel(problem)} i przejdź do formularza rezerwacji.`
      : 'Wybierz termin i przejdź do formularza rezerwacji.',
  })
}

export default async function SlotPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const problem = readProblemTypeSearchParam(searchParams?.problem)
  const serviceType = normalizeBookingServiceType(readBookingServiceSearchParam(searchParams?.service))
  const serviceQuery = serviceType === DEFAULT_BOOKING_SERVICE ? null : serviceType
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)

  if (!problem) {
    redirect(buildBookHref(null, serviceQuery, qaBooking))
  }

  const messageHref = `/kontakt?species=${getProblemSpecies(problem)}#formularz`
  const returnHref = buildBookHref(null, serviceQuery, qaBooking, getProblemSpecies(problem))
  const quickAudioHref = buildBookHref(null, 'szybka-konsultacja-15-min', qaBooking, getProblemSpecies(problem))
  const dataMode = getDataModeStatus()
  const serviceConfig = FUNNEL_SERVICE_CONFIG[serviceType]
  const isFullConsultation = serviceType === 'konsultacja-behawioralna-online'
  let groupedAvailability: Awaited<ReturnType<typeof listAvailability>> = []
  let publicFlowMessage: string | null = null

  if (dataMode.isValid) {
    try {
      groupedAvailability = filterGroupedAvailabilityForService(await listAvailability(), serviceType)
    } catch (error) {
      console.warn('[behawior15][slot] failed to load availability', {
        dataMode: dataMode.summary,
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      })
      publicFlowMessage = isFullConsultation
        ? 'Pełna konsultacja chwilowo odświeża pulę otwieranych terminów. Spróbuj ponownie za moment.'
        : 'Terminy chwilowo się odświeżają. Spróbuj ponownie za moment.'
    }
  } else {
    console.warn('[behawior15][slot] booking data mode is invalid', dataMode.summary)
    publicFlowMessage = isFullConsultation
      ? 'Pełna konsultacja chwilowo odświeża pulę otwieranych terminów. Spróbuj ponownie za moment.'
      : 'Terminy chwilowo się odświeżają. Spróbuj ponownie za moment.'
  }

  const { primaryGroups, additionalGroups } = partitionAvailabilityForDisplay(groupedAvailability, serviceType)
  const visibleGroups = isFullConsultation ? primaryGroups : groupedAvailability
  const hasAdditionalGroups = additionalGroups.length > 0
  const hasOnlyAdditionalGroups = isFullConsultation && visibleGroups.length === 0 && hasAdditionalGroups

  const renderSlotGroups = (groups: GroupedAvailability[], slotTier: 'standard' | 'additional' = 'standard') =>
    groups.map((group) => (
      <div key={`${slotTier}-${group.date}`} className="slot-day-card tree-backed-card" data-slot-tier={slotTier}>
        <div className="slot-day-head">
          <div className="slot-day-copy">
            <strong>{group.label}</strong>
            <span>
              {getBookingServiceSlotSummary(serviceType)}
              {slotTier === 'additional'
                ? ' To dodatkowe okno poza standardowym grafikiem tej usługi.'
                : serviceConfig.limitedAvailabilityNote
                  ? ` ${serviceConfig.limitedAvailabilityNote}`
                  : ''}
            </span>
          </div>
          <span className="slot-day-format">
            {slotTier === 'additional' ? 'termin dodatkowy' : getBookingServiceSlotBadge(serviceType)}
          </span>
        </div>
        <div className="time-grid">
          {group.slots.map((slot) => {
            const slotRangeLabel = `${slot.bookingTime}–${addMinutesToTime(slot.bookingTime, serviceConfig.durationMinutes)}`

            return (
              <Link
                key={slot.id}
                href={buildFormHref(problem, slot.id, serviceQuery, qaBooking)}
                prefetch={false}
                className="slot-button slot-link"
                data-slot-id={slot.id}
                data-slot-problem={problem}
                data-slot-tier={slotTier}
                aria-label={`Wybierz ${slotTier === 'additional' ? 'dodatkowy termin ' : 'termin '}${group.label} od ${
                  slot.bookingTime
                } do ${addMinutesToTime(slot.bookingTime, serviceConfig.durationMinutes)} dla tematu ${getProblemLabel(problem)}`}
                data-analytics-event="booking_slot_selected"
                data-analytics-location="slot-list"
                data-analytics-problem={problem}
                data-analytics-service={serviceType}
                data-analytics-service-name={serviceConfig.title}
                data-analytics-service-duration={String(serviceConfig.durationMinutes)}
                data-analytics-service-price={String(serviceConfig.priceAmount)}
                data-analytics-slot-date={group.date}
                data-analytics-slot-time={slot.bookingTime}
              >
                {isFullConsultation ? slotRangeLabel : slot.bookingTime}
              </Link>
            )
          })}
        </div>
      </div>
    ))

  return (
    <main className="page-wrap" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <div className="container">
        <Header />
        <AnalyticsEventOnMount
          eventName="view_page"
          params={{
            source_page: '/slot',
            problem_key: problem,
            species: getProblemSpecies(problem),
            ...getServiceAnalyticsParams(serviceType),
          }}
        />

        <section className="panel section-panel hero-surface booking-stage-panel slot-page-panel booking-flow-panel">
          <div className="booking-stage-hero-grid">
            <div className="booking-stage-copy-column">
              <BookingStageEyebrow stage="slot" className="section-eyebrow" />
              {qaBooking ? <div className="status-pill transaction-status-pill">Tryb testowy</div> : null}
              <h1>Wybierz termin: {getProblemLabel(problem)}</h1>
              <p className="hero-text">
                {getBookingServiceSlotSummary(serviceType)}{' '}
                {isFullConsultation ? 'Każdy wybór rezerwuje pełne 60 minut.' : 'Wybierz godzinę.'}
              </p>
            </div>

              <BookingServiceInfoCard
                serviceType={serviceType}
                title="Po wyborze terminu przejdziesz do formularza"
                stageLabel="Ta usługa"
                emphasis="Kliknij termin, żeby przejść do formularza rezerwacji."
              />
          </div>

          {publicFlowMessage ? (
            <div className="stack-gap top-gap slot-state-stack">
              <div className="info-box">
                {publicFlowMessage} Jeśli temat jest pilny, napisz wiadomość.
              </div>
              <div className="hero-actions">
                <Link href={isFullConsultation ? quickAudioHref : buildSlotHref(problem, serviceQuery, qaBooking)} prefetch={false} className="button button-primary big-button">
                  {isFullConsultation ? FUNNEL_CTA_LABELS.primary : 'Spróbuj ponownie'}
                </Link>
                <Link href={returnHref} prefetch={false} className="button button-ghost">
                  Wróć do tematów
                </Link>
                <Link href={messageHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.contact}
                </Link>
              </div>
            </div>
          ) : hasOnlyAdditionalGroups ? (
            <div className="stack-gap top-gap slot-state-stack">
              <div className="list-card accent-outline tree-backed-card">
                <strong>Pojawiły się dodatkowe terminy konsultacji 60 min.</strong>
                <span>
                  To ta sama konsultacja 60 min w tej samej cenie. Poniżej masz dodatkowe godziny poza podstawową pulą terminów.
                </span>
              </div>
              <details className="list-card accent-outline tree-backed-card slot-extra-availability" open>
                <summary>Pokaż dodatkowe terminy 60 min</summary>
                <p className="slot-extra-availability-note">
                  To nadal konsultacja 60 min za 350 zł. Wybierz termin, który naprawdę Ci pasuje.
                </p>
                <div className="slot-extra-availability-panel">{renderSlotGroups(additionalGroups, 'additional')}</div>
              </details>
              <div className="hero-actions">
                <Link href={quickAudioHref} prefetch={false} className="button button-primary big-button">
                  {FUNNEL_CTA_LABELS.primary}
                </Link>
                <Link href={returnHref} prefetch={false} className="button button-ghost">
                  Wróć do tematów
                </Link>
                <Link href={messageHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.contact}
                </Link>
              </div>
            </div>
          ) : visibleGroups.length === 0 ? (
            <div className="stack-gap top-gap slot-state-stack">
              <div className="empty-box">{serviceConfig.noAvailabilityMessage}</div>
              <div className="hero-actions">
                <Link href={isFullConsultation ? quickAudioHref : buildSlotHref(problem, serviceQuery, qaBooking)} prefetch={false} className="button button-primary big-button">
                  {isFullConsultation ? FUNNEL_CTA_LABELS.primary : 'Odśwież terminy'}
                </Link>
                <Link href={returnHref} prefetch={false} className="button button-ghost">
                  Wróć do tematów
                </Link>
                <Link href={messageHref} prefetch={false} className="button button-ghost">
                  {FUNNEL_CTA_LABELS.contact}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="slot-list top-gap">{renderSlotGroups(visibleGroups)}</div>
              {hasAdditionalGroups ? (
                <details className="list-card accent-outline tree-backed-card top-gap slot-extra-availability">
                  <summary>Pokaż dodatkowe terminy 60 min</summary>
                  <p className="slot-extra-availability-note">
                    To te same konsultacje 60 min w dodatkowych oknach poza podstawową pulą terminów.
                  </p>
                  <div className="slot-extra-availability-panel">{renderSlotGroups(additionalGroups, 'additional')}</div>
                </details>
              ) : null}
            </>
          )}
        </section>

        <Footer
          ctaHref={quickAudioHref}
          ctaLabel={FUNNEL_CTA_LABELS.primary}
          secondaryHref="/niezbednik"
          secondaryLabel={FUNNEL_CTA_LABELS.secondary}
          headline="Żaden termin nie pasuje?"
          description="Możesz wybrać Kwadrans z behawiorystą albo napisać wiadomość."
        />
      </div>
    </main>
  )
}
