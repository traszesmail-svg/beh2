import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { Header } from '@/components/Header'
import { ConfirmationStatusWatcher } from '@/components/ConfirmationStatusWatcher'
import { PreparationMaterialsCard } from '@/components/PreparationMaterialsCard'
import { SelfCancellationActions } from '@/components/SelfCancellationActions'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { canSelfCancelBooking, getRemainingSelfCancellationSeconds } from '@/lib/self-cancellation'
import { getBookingForViewer } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { getCustomerEmailDeliveryConfigIssue } from '@/lib/server/notifications'
import { syncPayuBookingByBookingId } from '@/lib/server/payu'
import { finalizeStripeCheckoutSession } from '@/lib/server/stripe'
import { SmsConfirmationStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value ?? null
}

function getSmsPanelContent(status: SmsConfirmationStatus | null | undefined) {
  if (status === 'sent') {
    return {
      title: 'SMS z potwierdzeniem został wysłany',
      body: 'Wysłaliśmy SMS z potwierdzeniem na numer telefonu podany w rezerwacji.',
    }
  }

  if (status === 'processing') {
    return {
      title: 'Kończymy wysyłkę SMS',
      body: 'Płatność jest już potwierdzona. Jeśli SMS nie pojawi się od razu, szczegóły rezerwacji są zapisane na tej stronie.',
    }
  }

  return {
    title: 'Potwierdzenie rezerwacji jest zapisane',
    body: 'Jeśli nie otrzymasz SMS, skontaktujemy się na podstawie danych z rezerwacji. Sukces płatności pozostaje ważny.',
  }
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  const bookingId = readSearchParam(searchParams?.bookingId)
  const accessToken = readSearchParam(searchParams?.access)
  const sessionId = readSearchParam(searchParams?.session_id)
  const payuReturn = readSearchParam(searchParams?.payu)
  const manualReported = readSearchParam(searchParams?.manual)
  const adminNotice = readSearchParam(searchParams?.adminNotice)
  const dataMode = getDataModeStatus()
  const returnedFromOnlineCheckout = Boolean(sessionId || payuReturn)
  let booking: Awaited<ReturnType<typeof getBookingForViewer>> = null
  let flowError: string | null = null
  let onlineSyncWarning: string | null = null

  if (!dataMode.isValid) {
    flowError = 'Potwierdzenie chwilowo nie jest dostępne. Spróbuj ponownie za kilka minut.'
  }

  if (!flowError && bookingId && sessionId) {
    try {
      await finalizeStripeCheckoutSession(sessionId, {
        triggerPaymentConfirmationSms: false,
      })
    } catch (error) {
      console.warn('[behawior15][confirmation] stripe return finalize failed', {
        bookingId,
        sessionId,
        error,
      })
      onlineSyncWarning =
        'Wrocilismy z platnosci online, ale nie udal sie teraz zapis finalnego statusu. Ta strona sprobuje ponownie sama za chwile.'
    }
  }

  if (!flowError && bookingId && payuReturn) {
    try {
      await syncPayuBookingByBookingId(bookingId)
    } catch (error) {
      console.warn('[behawior15][confirmation] payu return sync failed', {
        bookingId,
        payuReturn,
        error,
      })
      onlineSyncWarning =
        'Wrocilismy z PayU, ale nie udal sie teraz zapis finalnego statusu. Ta strona sprobuje ponownie sama za chwile.'
    }
  }

  if (!flowError && bookingId) {
    try {
      booking = await getBookingForViewer(bookingId, accessToken, headers().get('authorization'))
    } catch (error) {
      console.warn('[behawior15][confirmation] failed to load booking', {
        bookingId,
        hasAccessToken: Boolean(accessToken),
        error,
      })
      flowError = 'Nie udało się wczytać potwierdzenia. Spróbuj ponownie za moment.'
    }
  }

  const isConfirmed =
    booking?.paymentStatus === 'paid' && (booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'done')
  const isWaitingManual =
    booking?.bookingStatus === 'pending_manual_payment' && booking.paymentStatus === 'pending_manual_review'
  const isRejected = booking?.paymentStatus === 'rejected' && booking.bookingStatus === 'cancelled'
  const isSelfCancelled = booking?.paymentStatus === 'refunded' && booking.bookingStatus === 'cancelled'
  const isClosed =
    !isSelfCancelled &&
    !isRejected &&
    (booking?.bookingStatus === 'cancelled' ||
      booking?.bookingStatus === 'expired' ||
      booking?.paymentStatus === 'failed')
  const isAwaitingOnlineConfirmation =
    returnedFromOnlineCheckout && Boolean(booking) && !isConfirmed && !isWaitingManual && !isRejected && !isSelfCancelled && !isClosed
  const canSelfCancel = Boolean(booking && accessToken && canSelfCancelBooking(booking))
  const initialRemainingSeconds = booking ? getRemainingSelfCancellationSeconds(booking) : 0
  const smsPanel = getSmsPanelContent(booking?.smsConfirmationStatus)
  const customerEmailAvailable = booking ? !getCustomerEmailDeliveryConfigIssue(booking.email) : false
  const showAdminNoticeWarning =
    isWaitingManual &&
    manualReported === 'reported' &&
    (adminNotice === 'failed' || adminNotice === 'skipped')

  return (
    <main className="page-wrap">
      <div className="container">
        <Header />
        <section className="panel centered-panel">
          {flowError ? (
            <div className="error-box">{flowError}</div>
          ) : booking ? (
            <>
              <div className="success-badge">
                {isSelfCancelled
                  ? 'Zakup anulowany'
                  : isConfirmed
                    ? 'Płatność potwierdzona'
                    : isWaitingManual
                      ? 'Czekamy na potwierdzenie wpłaty'
                      : isRejected
                        ? 'Wpłata niepotwierdzona'
                        : 'Sprawdzamy status płatności'}
              </div>
              {isConfirmed ? (
                <AnalyticsEventOnMount
                  eventName="payment_success"
                  params={{
                    booking_id: booking.id,
                    payment_method: booking.paymentMethod ?? 'unknown',
                  }}
                />
              ) : null}
              <h1>
                {isSelfCancelled
                  ? 'Rezerwacja została anulowana'
                  : isConfirmed
                    ? 'Płatność za konsultację została potwierdzona'
                    : isWaitingManual
                      ? 'Wpłata czeka na potwierdzenie do 60 min'
                      : isRejected
                        ? 'Nie znaleziono wpłaty do tej rezerwacji'
                        : 'Płatność nie została jeszcze potwierdzona'}
              </h1>
              <p className="hero-text small-width center-text">
                {isSelfCancelled
                  ? 'Termin wrócił do kalendarza, a płatność została cofnięta. Jeśli chcesz, możesz od razu wybrać nowy termin albo wrócić później.'
                  : isConfirmed
                    ? 'Opłacona rezerwacja jest już zapisana. Poniżej masz podsumowanie zakupu, status SMS i kolejny krok po płatności.'
                    : isWaitingManual
                      ? 'Sprawdzamy wpłatę i potwierdzimy ją do 60 minut. Gdy status zmieni się na opłacona, ta strona sama pokaże pokój rozmowy i sekcję materiałów.'
                      : isRejected
                        ? booking?.paymentRejectedReason ??
                          'Termin wrócił do puli. Jeśli trzeba, utwórz nową rezerwację i zgłoś wpłatę ponownie.'
                        : 'Jeśli przed chwilą opłaciłeś konsultację online, odśwież tę stronę za chwilę. Jeśli płatność nie doszła, wróć do wyboru metody i spróbuj ponownie.'}
              </p>

              <div className="summary-grid">
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Usługa</div>
                  <div className="summary-value">Szybka konsultacja 15 min</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Temat rozmowy</div>
                  <div className="summary-value">{getProblemLabel(booking.problemType)}</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Termin</div>
                  <div className="summary-value">{formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Kontakt</div>
                  <div className="summary-value">{booking.email}</div>
                </div>
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Kwota</div>
                  <div className="summary-value">{formatPricePln(booking.amount)}</div>
                </div>
              </div>

              {canSelfCancel ? (
                <SelfCancellationActions
                  bookingId={booking.id}
                  accessToken={accessToken ?? ''}
                  initialRemainingSeconds={initialRemainingSeconds}
                  contactHref={`/kontakt?service=szybka-konsultacja-15-min&intent=reschedule&bookingId=${encodeURIComponent(booking.id)}`}
                />
              ) : null}

              <ConfirmationStatusWatcher active={isWaitingManual || isAwaitingOnlineConfirmation} />

              {showAdminNoticeWarning ? (
                <div className="info-box top-gap">
                  Zgłoszenie wpłaty zostało zapisane, ale automatyczne powiadomienie obsługi o tej wpłacie nie zostało teraz dostarczone. Zachowaj ten link. Jeśli status nie zmieni się w ciągu 60 minut, skontaktuj się bezpośrednio przez dane kontaktowe na stronie.
                </div>
              ) : null}

              {isAwaitingOnlineConfirmation ? (
                <div className="info-box top-gap">
                  Wrocilos przekierowanie z checkoutu online. Jesli operator jeszcze konczy potwierdzenie, ta strona sama sprawdzi status ponownie i odblokuje pokoj rozmowy bez dodatkowego klikania.
                </div>
              ) : null}

              {onlineSyncWarning ? <div className="info-box top-gap">{onlineSyncWarning}</div> : null}

              {isClosed ? (
                <div className="error-box top-gap">
                  {booking.paymentStatus === 'failed'
                    ? 'Platnosc online nie zostala potwierdzona, a termin wrocil do kalendarza.'
                    : 'Ta rezerwacja nie jest juz aktywna. Jesli chcesz, wybierz nowy termin.'}
                </div>
              ) : null}

              {isWaitingManual ? (
                <div className="info-box top-gap">
                  Tytuł wpłaty: <strong>{booking.paymentReference ?? booking.id}</strong>.{' '}
                  {customerEmailAvailable
                    ? `Gdy tylko potwierdzimy wpłatę, wyślemy link do rozmowy na ${booking.email}, odblokujemy materiały i pokażemy nowy stan na tej stronie.`
                    : 'Gdy tylko potwierdzimy wpłatę, odblokujemy materiały i pokażemy aktywny link do rozmowy bezpośrednio na tej stronie.'}
                </div>
              ) : null}

              {!isSelfCancelled && !isClosed ? (
                <div className="stack-gap top-gap">
                  {isConfirmed ? (
                    <>
                      <div className="list-card tree-backed-card">
                        <strong>{smsPanel.title}</strong>
                        <span>{smsPanel.body}</span>
                      </div>
                      <div className="prep-checklist tree-backed-card">
                        <strong>Przed rozmową</strong>
                        <ul>
                          <li>Zachowaj termin i wróć do tego linku przed rozmową audio.</li>
                          <li>Jeśli chcesz, dodaj teraz nagranie MP4, link do zdjęć lub krótki opis sytuacji.</li>
                          <li>Po rozmowie wskażemy, czy wystarczy domowy start, czy lepsza będzie dłuższa konsultacja albo terapia.</li>
                        </ul>
                      </div>
                      <div className="list-card accent-outline tree-backed-card">
                        <strong>Dodaj materiały do sprawy</strong>
                        <span>To nie jest obowiązkowe. Jeśli chcesz, możesz teraz dodać nagranie, link do materiałów albo krótki opis sytuacji, żeby lepiej przygotować rozmowę.</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="list-card tree-backed-card">
                        <strong>Po płatności zobaczysz</strong>
                        <span>Po statusie paid zobaczysz finalne potwierdzenie, status SMS i sekcję do dodania materiałów do sprawy.</span>
                      </div>
                      <div className="list-card accent-outline tree-backed-card">
                        <strong>Jeśli temat okaże się szerszy</strong>
                        <span>Można wtedy przejść do konsultacji 30 min, pełnej konsultacji online, wizyty domowej albo terapii.</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="list-card accent-outline top-gap tree-backed-card">
                  <strong>Co stało się po anulacji</strong>
                  <span>To anulowanie zwolniło termin i zakończyło ten booking. Jeśli wrócisz do rezerwacji, przejdziesz przez zwykły wybór tematu i nowego slotu.</span>
                </div>
              )}

              <div className="hero-actions centered-actions">
                {isSelfCancelled || isRejected || isClosed ? (
                  <Link href="/book" className="button button-primary big-button">
                    Wybierz nowy termin
                  </Link>
                ) : isConfirmed ? (
                  <>
                    <Link
                      href={`/call/${booking.id}${accessToken ? `?access=${encodeURIComponent(accessToken)}` : ''}`}
                      className="button button-primary big-button"
                    >
                      Dołącz do rozmowy audio
                    </Link>
                    <Link href="#materialy-do-sprawy" className="button button-ghost big-button">
                      Dodaj materiały
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/payment?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}`}
                    className="button button-primary big-button"
                  >
                    Wróć do płatności
                  </Link>
                )}
                <Link href="/book" className="button button-ghost big-button">
                  Umów kolejny termin
                </Link>
              </div>

              {isConfirmed ? (
                <div id="materialy-do-sprawy">
                  <PreparationMaterialsCard
                    bookingId={booking.id}
                    accessToken={accessToken ?? ''}
                    canEdit={true}
                    hasVideo={Boolean(booking.prepVideoPath)}
                    prepVideoFilename={booking.prepVideoFilename ?? null}
                    prepVideoSizeBytes={booking.prepVideoSizeBytes ?? null}
                    prepLinkUrl={booking.prepLinkUrl ?? null}
                    prepNotes={booking.prepNotes ?? null}
                    prepUploadedAt={booking.prepUploadedAt ?? null}
                  />
                </div>
              ) : null}
            </>
          ) : (
            <>
              <div className="error-box">Ten link do potwierdzenia jest nieprawidłowy albo wygasł.</div>
              <div className="hero-actions centered-actions">
                <Link href="/book" className="button button-primary big-button">
                  Przejdź do rezerwacji
                </Link>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
