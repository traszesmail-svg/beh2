import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { AdminAvailabilityManager } from '@/components/AdminAvailabilityManager'
import { AdminBookingActions } from '@/components/AdminBookingActions'
import { AdminPricingManager } from '@/components/AdminPricingManager'
import { Header } from '@/components/Header'
import { getBuildMarkerSnapshot } from '@/lib/build-marker'
import { formatDateLabel, formatDateTimeLabel, getBookingStatusLabel, getPaymentStatusLabel, getProblemLabel } from '@/lib/data'
import { formatPreparationFileSize, hasPreparationMaterials } from '@/lib/preparation'
import { getActiveConsultationPrice, listAvailabilityAdmin, listBookings } from '@/lib/server/db'
import { getRuntimeModeSnapshot } from '@/lib/server/env'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPage() {
  noStore()
  const runtime = getRuntimeModeSnapshot()
  const buildMarker = getBuildMarkerSnapshot()
  let bookings: Awaited<ReturnType<typeof listBookings>> = []
  let availability: Awaited<ReturnType<typeof listAvailabilityAdmin>> = []
  let price: Awaited<ReturnType<typeof getActiveConsultationPrice>> | null = null

  if (runtime.data.isValid) {
    ;[bookings, availability, price] = await Promise.all([
      listBookings(),
      listAvailabilityAdmin(),
      getActiveConsultationPrice(),
    ])
  }
  const confirmedCount = bookings.filter((booking) => booking.bookingStatus === 'confirmed').length
  const paidCount = bookings.filter((booking) => booking.paymentStatus === 'paid').length
  const doneCount = bookings.filter((booking) => booking.bookingStatus === 'done').length
  const priceUpdatedAtLabel = price?.updatedAt
    ? `${formatDateLabel(price.updatedAt.slice(0, 10))}, ${price.updatedAt.slice(11, 16)}`
    : null

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />

        <section className="panel section-panel">
          <div className="section-head">
            <div>
              <div className="section-eyebrow">Panel specjalisty</div>
              <h1>Rezerwacje, płatności i terminy</h1>
            </div>
            <Link href="/problem" className="button button-primary">
              Przejdź do flow klienta
            </Link>
          </div>

          <div className="summary-grid top-gap">
            <div className="summary-card">
              <div className="stat-label">Liczba rezerwacji</div>
              <div className="summary-value">{bookings.length}</div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Potwierdzone / opłacone</div>
              <div className="summary-value">
                {confirmedCount} / {paidCount}
              </div>
            </div>
            <div className="summary-card">
              <div className="stat-label">Zakończone</div>
              <div className="summary-value">{doneCount}</div>
            </div>
          </div>

          <div className="stack-gap top-gap">
            <div className="list-card">
              <strong>Tryb danych</strong>
              <span>{runtime.data.summary}</span>
            </div>
            <div className="list-card">
              <strong>Tryb płatności</strong>
              <span>{runtime.payment.summary}</span>
            </div>
            <div className="list-card">
              <strong>Build marker</strong>
              <span>{buildMarker.value}</span>
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
              <div className="empty-box">Nie ma jeszcze rezerwacji. Przejdź przez flow klienta, aby utworzyć pierwszą konsultację.</div>
            ) : (
              <div className="booking-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-row">
                    <div>
                      <div className="booking-title">{getProblemLabel(booking.problemType)}</div>
                      <div className="booking-meta">{formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</div>
                      <div className="booking-meta">
                        {booking.ownerName} - {booking.email} - {booking.animalType}
                      </div>
                    </div>

                    <div className="booking-description">
                      <div>{booking.description}</div>
                      <div className="booking-meta top-gap-small">Status rezerwacji: {getBookingStatusLabel(booking.bookingStatus)}</div>
                      <div className="booking-meta">Status płatności: {getPaymentStatusLabel(booking.paymentStatus)}</div>
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
                      <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer" className="button button-ghost small-button">
                        Otwórz rozmowę
                      </a>
                      <AdminBookingActions
                        bookingId={booking.id}
                        bookingStatus={booking.bookingStatus}
                        paymentStatus={booking.paymentStatus}
                        meetingUrl={booking.meetingUrl}
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
