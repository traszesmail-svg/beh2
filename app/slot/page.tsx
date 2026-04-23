import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { BookingServiceInfoCard } from '@/components/BookingServiceInfoCard'
import { NotatnikFooter, NotatnikTopbar, PUBLIC_BOOKING_FLOW_NAV_ITEMS } from '@/components/NotatnikA'
import { getServiceAnalyticsParams } from '@/lib/analytics-schema'
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
    noIndex: false,
    follow: true,
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
  const retryHref = buildSlotHref(problem, serviceQuery, qaBooking)
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
      <div key={`${slotTier}-${group.date}`} className="notatnik-slot-day" data-slot-tier={slotTier}>
        <div className="notatnik-slot-day-head">
          <div className="notatnik-slot-day-copy">
            <strong>{group.label}</strong>
            <p>
              {getBookingServiceSlotSummary(serviceType)}
              {slotTier === 'additional'
                ? ' To dodatkowe okno poza standardowym grafikiem tej usługi.'
                : serviceConfig.limitedAvailabilityNote
                  ? ` ${serviceConfig.limitedAvailabilityNote}`
                  : ''}
            </p>
          </div>
          <span className="notatnik-slot-day-badge">
            {slotTier === 'additional' ? 'termin dodatkowy' : getBookingServiceSlotBadge(serviceType)}
          </span>
        </div>

        <div className="notatnik-slot-grid">
          {group.slots.map((slot) => {
            const slotRangeLabel = `${slot.bookingTime}-${addMinutesToTime(slot.bookingTime, serviceConfig.durationMinutes)}`

            return (
              <Link
                key={slot.id}
                href={buildFormHref(problem, slot.id, serviceQuery, qaBooking)}
                prefetch={false}
                className="notatnik-slot-button"
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
    <main className="notatnik-page" data-analytics-disabled={qaBooking ? 'true' : undefined} data-qa-booking={qaBooking ? 'true' : 'false'}>
      <div className="notatnik-shell">
        <NotatnikTopbar tag="Rezerwacja konsultacji" navItems={PUBLIC_BOOKING_FLOW_NAV_ITEMS} ctaHref={returnHref} ctaLabel="Wroc do tematow" ctaVariant="ghost" />

        <AnalyticsEventOnMount
          eventName="view_page"
          params={{
            source_page: '/slot',
            problem_key: problem,
            species: getProblemSpecies(problem),
            ...getServiceAnalyticsParams(serviceType),
          }}
        />

        <div className="notatnik-booking">
          <div className="notatnik-booking-left">
            <BookingStageEyebrow stage="slot" />
            {qaBooking ? (
              <div className="notatnik-contact-note" style={{ marginTop: 18 }}>
                <strong>Tryb testowy</strong>
                <p>Wybierasz termin w sciezce testowej bez realnego obciazenia klienta.</p>
              </div>
            ) : null}

            <h1>
              Wybierz termin dla <em>{getProblemLabel(problem)}</em>.
            </h1>
            <p className="notatnik-booking-lede">
              {getBookingServiceSlotSummary(serviceType)}{' '}
              {isFullConsultation
                ? 'Kazdy wybor blokuje pelny blok tej konsultacji, czyli okolo 2 godziny.'
                : 'Kliknij godzine, ktora realnie pasuje do Twojego dnia.'}
            </p>

            <div className="notatnik-detail-stack">
              <BookingServiceInfoCard
                serviceType={serviceType}
                title="Ta usluga na tym etapie"
                stageLabel="Wybor terminu"
                emphasis="Po kliknieciu terminu przejdziesz do formularza i od razu zablokujesz wybrane okno na czas dokonczenia rezerwacji."
              />

              <div className="notatnik-detail-card">
                <strong>Temat</strong>
                <p>{getProblemLabel(problem)}</p>
              </div>

              <div className="notatnik-detail-card">
                <strong>Powrot</strong>
                <p>Jesli chcesz zmienic temat albo gatunek, wroc do poprzedniego kroku i wybierz inna sciezke.</p>
              </div>
            </div>
          </div>

          <div className="notatnik-booking-right">
            <div className="notatnik-booking-panel">
              <div className="notatnik-mono">Krok 03 / 04 · Termin</div>

              {publicFlowMessage ? (
                <>
                  <div className="notatnik-callout">
                    {publicFlowMessage} Jesli temat jest pilny, napisz wiadomosc i wroc za chwile.
                  </div>
                  <div className="notatnik-actions">
                    <Link
                      href={isFullConsultation ? quickAudioHref : retryHref}
                      prefetch={false}
                      className="notatnik-btn notatnik-btn-accent"
                    >
                      {isFullConsultation ? FUNNEL_CTA_LABELS.primary : 'Sprobuj ponownie'}
                    </Link>
                    <Link href={returnHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                      Wroc do tematow
                    </Link>
                    <Link href={messageHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                      {FUNNEL_CTA_LABELS.contact}
                    </Link>
                  </div>
                </>
              ) : hasOnlyAdditionalGroups ? (
                <>
                  <div className="notatnik-callout">
                    Pelna konsultacja nie ma teraz podstawowej puli terminow, ale pojawily sie dodatkowe okna w tej samej cenie.
                  </div>
                  <details className="notatnik-slot-extra" open>
                    <summary>Pokaz dodatkowe terminy pelnej konsultacji</summary>
                    <p>To nadal pelna konsultacja behawioralna. Wybierz termin, ktory naprawde pasuje do Twojego rytmu dnia.</p>
                    <div className="notatnik-slot-stack">{renderSlotGroups(additionalGroups, 'additional')}</div>
                  </details>
                  <div className="notatnik-actions">
                    <Link href={quickAudioHref} prefetch={false} className="notatnik-btn notatnik-btn-accent">
                      {FUNNEL_CTA_LABELS.primary}
                    </Link>
                    <Link href={returnHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                      Wroc do tematow
                    </Link>
                    <Link href={messageHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                      {FUNNEL_CTA_LABELS.contact}
                    </Link>
                  </div>
                </>
              ) : visibleGroups.length === 0 ? (
                <>
                  <div className="notatnik-callout">{serviceConfig.noAvailabilityMessage}</div>
                  <div className="notatnik-actions">
                    <Link
                      href={isFullConsultation ? quickAudioHref : retryHref}
                      prefetch={false}
                      className="notatnik-btn notatnik-btn-accent"
                    >
                      {isFullConsultation ? FUNNEL_CTA_LABELS.primary : 'Odswiez terminy'}
                    </Link>
                    <Link href={returnHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                      Wroc do tematow
                    </Link>
                    <Link href={messageHref} prefetch={false} className="notatnik-btn notatnik-btn-ghost">
                      {FUNNEL_CTA_LABELS.contact}
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="notatnik-slot-stack">{renderSlotGroups(visibleGroups)}</div>
                  {hasAdditionalGroups ? (
                    <details className="notatnik-slot-extra">
                      <summary>Pokaz dodatkowe terminy pelnej konsultacji</summary>
                      <p>To te same konsultacje w dodatkowych oknach poza podstawowa pula terminow.</p>
                      <div className="notatnik-slot-stack">{renderSlotGroups(additionalGroups, 'additional')}</div>
                    </details>
                  ) : null}
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
