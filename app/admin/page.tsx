import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { AdminAvailabilityManager } from '@/components/AdminAvailabilityManager'
import { AdminBookingActions } from '@/components/AdminBookingActions'
import { AdminPricingManager } from '@/components/AdminPricingManager'
import { Header } from '@/components/Header'
import { getBuildMarkerSnapshot } from '@/lib/build-marker'
import { formatDateLabel, formatDateTimeLabel, getBookingStatusLabel, getPaymentStatusLabel, getProblemLabel } from '@/lib/data'
import { buildFunnelMetricsSnapshot } from '@/lib/server/funnel-metrics'
import { formatPreparationFileSize, hasPreparationMaterials } from '@/lib/preparation'
import { getActiveConsultationPrice, listAvailabilityAdmin, listBookings, listFunnelEvents } from '@/lib/server/db'
import { getRuntimeModeSnapshot } from '@/lib/server/env'
import { getGoLiveChecks } from '@/lib/server/go-live'
import { getPaymentOptionsSummary } from '@/lib/server/payment-options'
import { readLatestQaReport } from '@/lib/server/qa-report'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getPaymentMethodLabel(value: string | null | undefined) {
  switch (value) {
    case 'manual':
      return 'BLIK / przelew do potwierdzenia'
    case 'payu':
      return 'PayU'
    case 'stripe':
      return 'Stripe legacy'
    case 'mock':
      return 'Mock QA'
    default:
      return 'Jeszcze nie wybrano'
  }
}

function formatDataLoadError(label: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  return `${label}: ${message}`
}

export default async function AdminPage() {
  noStore()
  const runtime = getRuntimeModeSnapshot()
  const paymentOptions = getPaymentOptionsSummary()
  const goLiveChecks = getGoLiveChecks()
  const buildMarker = getBuildMarkerSnapshot()
  const latestQaReport = await readLatestQaReport()
  let bookings: Awaited<ReturnType<typeof listBookings>> = []
  let availability: Awaited<ReturnType<typeof listAvailabilityAdmin>> = []
  let funnelEvents: Awaited<ReturnType<typeof listFunnelEvents>> = []
  let price: Awaited<ReturnType<typeof getActiveConsultationPrice>> | null = null
  let funnelMetricsSnapshot: ReturnType<typeof buildFunnelMetricsSnapshot> | null = null
  const dataLoadErrors: string[] = []

  if (runtime.data.isValid) {
    const [bookingsResult, availabilityResult, funnelEventsResult, priceResult] = await Promise.allSettled([
      listBookings(),
      listAvailabilityAdmin(),
      listFunnelEvents(),
      getActiveConsultationPrice(),
    ])

    if (bookingsResult.status === 'fulfilled') {
      bookings = bookingsResult.value
    } else {
      dataLoadErrors.push(formatDataLoadError('bookings', bookingsResult.reason))
    }

    if (availabilityResult.status === 'fulfilled') {
      availability = availabilityResult.value
    } else {
      dataLoadErrors.push(formatDataLoadError('availability', availabilityResult.reason))
    }

    if (funnelEventsResult.status === 'fulfilled') {
      funnelEvents = funnelEventsResult.value
    } else {
      dataLoadErrors.push(formatDataLoadError('funnel_events', funnelEventsResult.reason))
    }

    if (priceResult.status === 'fulfilled') {
      price = priceResult.value
    } else {
      dataLoadErrors.push(formatDataLoadError('pricing', priceResult.reason))
    }

    funnelMetricsSnapshot = buildFunnelMetricsSnapshot({
      events: funnelEvents,
      bookings,
      now: new Date(),
    })
  }
  const bookingCounts =
    funnelMetricsSnapshot?.bookingCounts ?? {
      total: bookings.length,
      production: bookings.filter((booking) => !booking.qaBooking).length,
      qa: bookings.filter((booking) => booking.qaBooking).length,
      pendingManualReview: bookings.filter((booking) => booking.paymentStatus === 'pending_manual_review').length,
      paid: bookings.filter((booking) => booking.paymentStatus === 'paid').length,
      confirmed: bookings.filter((booking) => booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done').length,
      rejected: bookings.filter(
        (booking) =>
          booking.paymentStatus === 'rejected' ||
          booking.bookingStatus === 'cancelled' ||
          booking.paymentStatus === 'refunded',
      ).length,
      failed: bookings.filter((booking) => booking.paymentStatus === 'failed').length,
    }
  const goLiveReadyCount = goLiveChecks.filter((check) => check.tone === 'ready').length
  const goLiveAttentionCount = goLiveChecks.length - goLiveReadyCount
  const priceUpdatedAtLabel = price?.updatedAt
    ? `${formatDateLabel(price.updatedAt.slice(0, 10))}, ${price.updatedAt.slice(11, 16)}`
    : null
  const dataLoadIssue =
    dataLoadErrors.length > 0
      ? `Nie wszystkie dane panelu mogly sie zaladowac: ${dataLoadErrors.join(' | ')}`
      : null

  return (
    <main className="page-wrap" data-analytics-disabled="true">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Panel specjalisty</div>
              <h1>Rezerwacje, płatności i terminy</h1>
            </div>
            <Link href="/book" className="button button-primary">
              Przejdź do ścieżki klienta
            </Link>
          </div>

          <div className="summary-grid top-gap">
            <div className="summary-card">
              <div className="stat-label">Wszystkie bookingi</div>
              <div className="summary-value">{bookingCounts.total}</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Bookingi produkcyjne</div>
              <div className="summary-value">{bookingCounts.production}</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Bookingi QA</div>
              <div className="summary-value">{bookingCounts.qa}</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Do potwierdzenia</div>
              <div className="summary-value">{bookingCounts.pendingManualReview}</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Opłacone</div>
              <div className="summary-value">{bookingCounts.paid}</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Potwierdzone</div>
              <div className="summary-value">{bookingCounts.confirmed}</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Odrzucone / failed</div>
              <div className="summary-value">
                {bookingCounts.rejected} / {bookingCounts.failed}
              </div>
            </div>
          </div>

          <div className="stack-gap top-gap">
            <div className="list-card">
              <strong>Tryb danych</strong>
              <span>{runtime.data.summary}</span>
            </div>
            <div className="list-card">
              <strong>Tryb płatności live</strong>
              <span>{runtime.payment.summary}</span>
            </div>
            <div className="list-card">
              <strong>Opcje płatności</strong>
              <span>{paymentOptions.summary}</span>
            </div>
            <div className="list-card">
              <strong>QA checkout</strong>
              <span>{paymentOptions.qa}</span>
            </div>
            <div className="list-card">
              <strong>Build marker</strong>
              <span>{buildMarker.value}</span>
            </div>
          </div>

          {dataLoadIssue ? <div className="error-box top-gap">{dataLoadIssue}</div> : null}

          <div className="top-gap">
            <div className="section-eyebrow">Go-live</div>
            <h2>Stan go-live</h2>
            <p className="muted paragraph-gap">
              Te karty pokazują, czy customer email i PayU są aktywnie włączone. Gdy są celowo wyłączone, live działa na manual payment.
            </p>
            <div className="summary-grid">
              {goLiveChecks.map((check) => (
                <div
                  key={check.id}
                  className={`list-card tree-backed-card${check.tone === 'ready' ? '' : ' accent-outline'}`}
                >
                  <span className={`status-pill ${check.tone === 'ready' ? 'status-paid' : 'status-pending'}`}>{check.statusLabel}</span>
                  <strong>{check.label}</strong>
                  <span>Stan: {check.state}</span>
                  <span>{check.summary}</span>
                  <span>Dalej: {check.nextStep}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="top-gap">
            <div className="section-eyebrow">Analityka i operacje</div>
            <h2>First-party KPI i rytuał przed deployem</h2>
            <p className="muted paragraph-gap">
              Źródłem prawdy jest wewnętrzny ledger eventów i statusy bookingów. GA4 pozostaje opcjonalne i consent-gated.
            </p>

            {runtime.data.isValid && funnelMetricsSnapshot ? (
              <>
                <div className="summary-grid">
                  <div className="summary-card tree-backed-card">
                    <div className="stat-label">Eventy produkcyjne</div>
                    <div className="summary-value">{funnelMetricsSnapshot.totalEvents}</div>
                    <span>QA wykluczone: {funnelMetricsSnapshot.totalQaEvents}</span>
                  </div>
                  <div className="summary-card tree-backed-card">
                    <div className="stat-label">Bookingi produkcyjne</div>
                    <div className="summary-value">{bookingCounts.production}</div>
                    <span>QA bookingi: {bookingCounts.qa}</span>
                  </div>
                  <div className="summary-card tree-backed-card">
                    <div className="stat-label">Go-live readiness</div>
                    <div className="summary-value">
                      {goLiveReadyCount}/{goLiveChecks.length}
                    </div>
                    <span>Attention: {goLiveAttentionCount}</span>
                  </div>
                </div>

                <div className="summary-grid top-gap">
                  {funnelMetricsSnapshot.windows.map((window) => (
                    <div key={window.window} className="summary-card tree-backed-card">
                      <div className="stat-label">{window.label}</div>
                      <div className="summary-value">{window.eventCount}</div>
                      <span>
                        Home {window.stageCounts.home_view} · CTA {window.stageCounts.cta_click} · Topic {window.stageCounts.topic_selected} · Slot {window.stageCounts.slot_selected} · Form {window.stageCounts.form_started}
                      </span>
                      <span>
                        Payment {window.stageCounts.payment_opened} · Pending {window.stageCounts.manual_pending} · Paid {window.stageCounts.paid} · Confirmed {window.stageCounts.confirmed}
                      </span>
                      <span>
                        {window.conversions.homeToCta} home→CTA · {window.conversions.topicToSlot} topic→slot · {window.conversions.paidToConfirmed} paid→confirmed
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="error-box">Analitka jest zablokowana: {runtime.data.summary}</div>
            )}

            <div className="stack-gap top-gap">
              <div className="list-card tree-backed-card">
                <strong>Ostatni raport QA</strong>
                <span>
                  {latestQaReport.exists
                    ? `${latestQaReport.updatedAt ?? 'brak daty'} · ${latestQaReport.filePath}`
                    : 'Brak wygenerowanego raportu QA.'}
                </span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Rytuał przed deployem</strong>
                <span>npm run funnel-metrics · npm run live-readiness -- --report-only · npm run live-clickthrough-report</span>
                <span>Wejścia wewnętrzne: /admin oraz /_internal/qa-report.</span>
              </div>
              <div className="list-card tree-backed-card">
                <strong>Aktualny sygnał readiness</strong>
                <span>{goLiveChecks.find((check) => check.tone === 'attention')?.summary ?? 'Wszystkie kontrole są zielone.'}</span>
                <span>{goLiveChecks.find((check) => check.tone === 'attention')?.nextStep ?? 'Nie ma blokad przed deployem.'}</span>
              </div>
            </div>
          </div>

          <div className="top-gap">
            <div className="section-eyebrow">Cena konsultacji</div>
            <h2>Aktywna cena dla nowych rezerwacji</h2>
            <p className="muted paragraph-gap">Nowa cena dotyczy tylko kolejnych bookingów. Opłacone lub zapisane wcześniej rezerwacje zachowują swoją historyczną kwotę.</p>
            {runtime.data.isValid && price ? (
              <AdminPricingManager currentAmount={price.amount} currentLabel={price.formattedAmount} updatedAtLabel={priceUpdatedAtLabel} />
            ) : (
              <div className="error-box">Zmiana ceny jest zablokowana: {runtime.data.summary}</div>
            )}
          </div>

          <div className="top-gap">
            {!runtime.data.isValid ? (
              <div className="error-box">Warstwa danych panelu nie wystartowała: {runtime.data.summary}</div>
            ) : null}

            {bookings.length === 0 ? (
              <div className="empty-box">Nie ma jeszcze rezerwacji. Przejdź przez ścieżkę klienta, aby utworzyć pierwszą konsultację.</div>
            ) : (
              <div className="booking-list">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="booking-row"
                    data-booking-id={booking.id}
                    data-booking-email={booking.email}
                    data-booking-status={booking.bookingStatus}
                    data-payment-status={booking.paymentStatus}
                    data-booking-qa={booking.qaBooking ? 'true' : 'false'}
                  >
                    <div>
                      <div className="booking-title">{getProblemLabel(booking.problemType)}</div>
                      <div className="booking-meta">{formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</div>
                      <div className="booking-meta">
                        {booking.ownerName} - {booking.email} - {booking.animalType}
                      </div>
                      {booking.qaBooking ? <div className="booking-meta">Etykieta: booking testowy QA</div> : null}
                    </div>

                    <div className="booking-description">
                      <div>{booking.description}</div>
                      <div className="booking-meta top-gap-small">Status rezerwacji: {getBookingStatusLabel(booking.bookingStatus)}</div>
                      <div className="booking-meta">Status płatności: {getPaymentStatusLabel(booking.paymentStatus)}</div>
                      <div className="booking-meta">Metoda płatności: {getPaymentMethodLabel(booking.paymentMethod)}</div>
                      {booking.paymentReference ? <div className="booking-meta">Tytuł / ID płatności: {booking.paymentReference}</div> : null}
                      {booking.payuOrderId ? <div className="booking-meta">PayU orderId: {booking.payuOrderId}</div> : null}
                      {booking.paymentRejectedReason ? <div className="booking-meta">Powód odrzucenia: {booking.paymentRejectedReason}</div> : null}
                      <div className="booking-meta top-gap-small">
                        {hasPreparationMaterials(booking)
                          ? 'Dodano materiały przygotowawcze do rozmowy.'
                          : 'Bez dodatkowych materiałów przed rozmową.'}
                      </div>
                      {booking.prepVideoPath ? (
                        <div className="booking-meta">
                          Nagranie:{' '}
                          <a href={`/api/bookings/${booking.id}/prep/video`} target="_blank" rel="noopener noreferrer" className="prep-inline-link">
                            {booking.prepVideoFilename ?? 'Otwórz nagranie'}
                            {booking.prepVideoSizeBytes ? ` (${formatPreparationFileSize(booking.prepVideoSizeBytes)})` : ''}
                          </a>
                        </div>
                      ) : null}
                      {booking.prepLinkUrl ? (
                        <div className="booking-meta">
                          Link:{' '}
                          <a href={booking.prepLinkUrl} target="_blank" rel="noopener noreferrer" className="prep-inline-link">
                            {booking.prepLinkUrl}
                          </a>
                        </div>
                      ) : null}
                      {booking.prepNotes ? <div className="booking-meta">Notatki: {booking.prepNotes}</div> : null}
                    </div>

                    <div className="booking-actions">
                      <span
                        className={`status-pill ${
                          booking.bookingStatus === 'done'
                            ? 'status-done'
                            : booking.bookingStatus === 'confirmed'
                              ? 'status-paid'
                              : 'status-pending'
                        }`}
                      >
                        {getBookingStatusLabel(booking.bookingStatus)}
                      </span>
                      <span className={`status-pill ${booking.paymentStatus === 'paid' ? 'status-paid' : 'status-pending'}`}>
                        {getPaymentStatusLabel(booking.paymentStatus)}
                      </span>
                      <AdminBookingActions
                        bookingId={booking.id}
                        bookingStatus={booking.bookingStatus}
                        paymentStatus={booking.paymentStatus}
                        meetingUrl={booking.meetingUrl}
                        qaBooking={Boolean(booking.qaBooking)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="panel section-panel">
          <div className="section-eyebrow">Zarządzanie terminami</div>
          <h2>Wolne godziny jednego specjalisty</h2>
          <p className="muted paragraph-gap">Tutaj dodajesz i usuwasz terminy. Rezerwacji w trakcie płatności albo opłaconej nie da się usunąć.</p>
          {runtime.data.isValid ? (
            <AdminAvailabilityManager slots={availability} />
          ) : (
            <div className="error-box">Zarządzanie terminami jest zablokowane: {runtime.data.summary}</div>
          )}
        </section>
      </div>
    </main>
  )
}
