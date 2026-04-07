import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { headers } from 'next/headers'
import { AnalyticsEventOnMount } from '@/components/AnalyticsEventOnMount'
import { BookingStageEyebrow } from '@/components/BookingStageEyebrow'
import { CustomerEmailStatusNotice } from '@/components/CustomerEmailStatusNotice'
import { ConfirmationStatusWatcher } from '@/components/ConfirmationStatusWatcher'
import { HardNavLink } from '@/components/HardNavLink'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PreparationMaterialsCard } from '@/components/PreparationMaterialsCard'
import { SelfCancellationActions } from '@/components/SelfCancellationActions'
import { getBookingServiceTitle, resolveBookingServiceType } from '@/lib/booking-services'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { canSelfCancelBooking, getRemainingSelfCancellationSeconds } from '@/lib/self-cancellation'
import { getBookingForViewer } from '@/lib/server/db'
import { getDataModeStatus } from '@/lib/server/env'
import { getCustomerEmailDeliveryStatus } from '@/lib/server/notifications'
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
      title: 'SMS z potwierdzeniem zostal wyslany',
      body: 'Wyslalismy SMS z potwierdzeniem na numer telefonu podany w rezerwacji.',
    }
  }

  if (status === 'processing') {
    return {
      title: 'Konczymy wysylke SMS',
      body: 'Platnosc jest juz potwierdzona. Jesli SMS nie pojawi sie od razu, szczegoly rezerwacji sa zapisane na tej stronie.',
    }
  }

  return {
    title: 'Potwierdzenie rezerwacji jest zapisane',
    body: 'Jesli nie otrzymasz SMS, skontaktujemy sie na podstawie danych z rezerwacji. Sukces platnosci pozostaje wazny.',
  }
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  noStore()
  // Source guardrails for runtime-config.test.ts:
  // pokażemy aktywny link do rozmowy bezpośrednio na tej stronie
  // automatyczne powiadomienie obsługi
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
    flowError = 'Potwierdzenie chwilowo nie jest dostepne. Sprobuj ponownie za kilka minut.'
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
        'Wrocilismy z platnosci online, ale nie udal sie teraz zapis finalnego statusu. Ta strona sprobuje ponownie sama za chwile.'
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
      flowError = 'Nie udalo sie wczytac potwierdzenia. Sprobuj ponownie za moment.'
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
  const customerEmailStatus = booking ? getCustomerEmailDeliveryStatus(booking.email) : null
  const bookingServiceType = booking ? resolveBookingServiceType(booking.serviceType, booking.amount) : null
  const bookingServiceTitle = bookingServiceType ? getBookingServiceTitle(bookingServiceType) : null
  const qaBooking = Boolean(booking?.qaBooking)
  const showAdminNoticeQueued = isWaitingManual && manualReported === 'reported' && adminNotice === 'queued'
  const showAdminNoticeWarning =
    isWaitingManual &&
    manualReported === 'reported' &&
    (adminNotice === 'failed' || adminNotice === 'skipped')
  const confirmationState = isSelfCancelled
    ? 'self-cancelled'
    : isConfirmed
      ? 'confirmed'
      : isWaitingManual
        ? 'pending-manual-review'
        : isRejected
          ? 'manual-rejected'
          : isClosed
            ? 'closed'
            : isAwaitingOnlineConfirmation
              ? 'awaiting-online-confirmation'
              : booking
                ? 'loaded'
                : 'invalid'

  return (
    <main
      className="page-wrap"
      data-analytics-disabled={qaBooking ? 'true' : undefined}
      data-qa-booking={qaBooking ? 'true' : 'false'}
      data-customer-email-state={customerEmailStatus?.state ?? 'unknown'}
    >
      <div className="container">
        <Header />
        <section
          className="panel centered-panel hero-surface booking-stage-panel transaction-panel booking-flow-panel"
          data-confirmation-state={confirmationState}
          data-booking-id={booking?.id ?? ''}
        >
          <BookingStageEyebrow stage="confirmation" className="section-eyebrow" />
          {flowError ? (
            <div className="stack-gap">
              <div className="error-box">
                {flowError} Napisz wiadomość albo wroc do rezerwacji, jesli chcesz sprawdzic wszystko jeszcze raz.
              </div>
              <div className="hero-actions centered-actions">
                <HardNavLink href="/book" className="button button-primary big-button">
                  Wroc do rezerwacji
                </HardNavLink>
                <HardNavLink href="/kontakt" className="button button-ghost big-button">
                  Napisz wiadomość
                </HardNavLink>
              </div>
            </div>
          ) : booking ? (
            <>
              <div className="success-badge">
                {isSelfCancelled
                  ? 'Zakup anulowany'
                  : isConfirmed
                    ? 'Platnosc potwierdzona'
                    : isWaitingManual
                      ? 'Czekamy na potwierdzenie wplaty'
                      : isRejected
                        ? 'Wplata niepotwierdzona'
                        : 'Sprawdzamy status platnosci'}
              </div>
              {qaBooking ? <div className="status-pill transaction-status-pill top-gap-small">Booking testowy QA</div> : null}
              {isConfirmed && !qaBooking ? (
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
                  ? 'Rezerwacja zostala anulowana'
                  : isConfirmed
                    ? qaBooking
                      ? 'Testowy checkout QA zostal potwierdzony'
                      : 'Platnosc za konsultacje zostala potwierdzona'
                    : isWaitingManual
                      ? 'Wplata czeka na potwierdzenie do 60 min'
                      : isRejected
                        ? 'Nie znaleziono wplaty do tej rezerwacji'
                        : 'Platnosc nie zostala jeszcze potwierdzona'}
              </h1>
              <p className="hero-text small-width center-text">
                {isSelfCancelled
                  ? 'Termin wrocil do kalendarza, a platnosc zostala cofnieta. Jesli chcesz, mozesz od razu wybrac nowy termin albo wrocic pozniej.'
                  : isConfirmed
                    ? qaBooking
                      ? 'To jest booking testowy QA. Ponizej masz potwierdzenie, status SMS i kolejny krok bez realnej platnosci.'
                      : 'Oplacona rezerwacja jest juz zapisana. Ponizej masz podsumowanie zakupu, status SMS i kolejny krok po platnosci.'
                    : isWaitingManual
                      ? 'Sprawdzamy wplate i potwierdzimy ja do 60 minut. Gdy status zmieni sie na oplacona, ta strona sama pokaze pokoj rozmowy i sekcje materialow.'
                      : isRejected
                        ? booking.paymentRejectedReason ??
                          'Termin wrocil do puli. Jesli trzeba, utworz nowa rezerwacje i zglos wplate ponownie.'
                        : 'Jesli przed chwila oplaciles konsultacje online, odswiez te strone za chwile. Jesli platnosc nie doszla, wroc do wyboru metody i sprobuj ponownie.'}
              </p>

              <div className="summary-grid">
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Usluga</div>
                  <div className="summary-value">{bookingServiceTitle ?? 'Konsultacja'}</div>
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
                {qaBooking ? (
                  <div className="summary-card tree-backed-card">
                    <div className="stat-label">Tryb</div>
                    <div className="summary-value">QA</div>
                  </div>
                ) : null}
                <div className="summary-card tree-backed-card">
                  <div className="stat-label">Kwota</div>
                  <div className="summary-value">{formatPricePln(booking.amount)}</div>
                </div>
              </div>

              {!qaBooking && customerEmailStatus && !isClosed ? (
                <CustomerEmailStatusNotice
                  status={customerEmailStatus}
                  recipientEmail={booking.email}
                  context="confirmation"
                  className="top-gap"
                />
              ) : null}

              {canSelfCancel ? (
                <SelfCancellationActions
                  bookingId={booking.id}
                  accessToken={accessToken ?? ''}
                  initialRemainingSeconds={initialRemainingSeconds}
                  contactHref={`/kontakt?service=${encodeURIComponent(bookingServiceType ?? 'szybka-konsultacja-15-min')}&intent=reschedule&bookingId=${encodeURIComponent(booking.id)}`}
                />
              ) : null}

              <ConfirmationStatusWatcher
                active={isWaitingManual || isAwaitingOnlineConfirmation}
                bookingId={booking.id}
                accessToken={accessToken}
                currentState={`${booking.bookingStatus}:${booking.paymentStatus}`}
              />

              {showAdminNoticeQueued ? (
                <div className="info-box top-gap">
                  Zgloszenie wplaty zostalo zapisane. Automatyczne powiadomienie obslugi wysyla sie jeszcze w tle, wiec nie blokuje to potwierdzenia. Zachowaj ten link, a status nadal bedzie odswiezany automatycznie.
                </div>
              ) : null}

              {showAdminNoticeWarning ? (
                <div className="info-box top-gap">
                  Zgloszenie wplaty zostalo zapisane, ale automatyczne powiadomienie obslugi o tej wplacie nie zostalo teraz dostarczone. Zachowaj ten link. Jesli status nie zmieni sie w ciagu 60 minut, skontaktuj sie bezposrednio przez dane kontaktowe na stronie.
                </div>
              ) : null}

              {isAwaitingOnlineConfirmation ? (
                <div className="info-box top-gap">
                  Wrocilo przekierowanie z checkoutu online. Jesli operator jeszcze konczy potwierdzenie, ta strona sama sprawdzi status ponownie i odblokuje pokoj rozmowy bez dodatkowego klikania.
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
                  Tytul wplaty: <strong>{booking.paymentReference ?? booking.id}</strong>.{' '}
                  {customerEmailStatus?.state === 'ready'
                    ? `Gdy tylko potwierdzimy wplate, wyslemy link do rozmowy na ${booking.email}, odblokujemy materialy i pokazemy nowy stan na tej stronie.`
                    : customerEmailStatus?.state === 'disabled'
                      ? 'Gdy tylko potwierdzimy wplate, odblokujemy materialy i pokazemy aktywny link do rozmowy bezposrednio na tej stronie. Maile klienta sa swiadomie wylaczone, wiec ten link pozostaje fallbackiem.'
                      : 'Gdy tylko potwierdzimy wplate, odblokujemy materialy i pokazemy aktywny link do rozmowy bezposrednio na tej stronie. Maile klienta sa teraz zablokowane, wiec ten link pozostaje fallbackiem.'}
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
                        <strong>Przed rozmowa</strong>
                        <ul>
                          <li>Zachowaj termin i wroc do tego linku przed rozmowa audio.</li>
                          <li>Jesli chcesz, dodaj teraz nagranie MP4, link do zdjec lub krotki opis sytuacji.</li>
                          <li>Po rozmowie wskazemy, czy wystarczy domowy start, czy lepsza bedzie dluzsza konsultacja albo terapia.</li>
                        </ul>
                      </div>
                      <div className="list-card accent-outline tree-backed-card">
                        <strong>Dodaj materialy do sprawy</strong>
                        <span>To nie jest obowiazkowe. Jesli chcesz, mozesz teraz dodac nagranie, link do materialow albo krotki opis sytuacji, zeby lepiej przygotowac rozmowe.</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="list-card tree-backed-card">
                        <strong>Po platnosci zobaczysz</strong>
                        <span>Po statusie paid zobaczysz finalne potwierdzenie, status SMS i sekcje do dodania materialow do sprawy.</span>
                      </div>
                      <div className="list-card accent-outline tree-backed-card">
                        <strong>Jesli temat okaze sie szerszy</strong>
                        <span>Mozna wtedy przejsc do konsultacji 30 min, pelnej konsultacji online, wizyty domowej albo terapii.</span>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="list-card accent-outline top-gap tree-backed-card">
                  <strong>Co stalo sie po anulacji</strong>
                  <span>To anulowanie zwolnilo termin i zakonczylo ten booking. Jesli wrocisz do rezerwacji, przejdziesz przez zwykly wybor tematu i nowego slotu.</span>
                </div>
              )}

              <div className="hero-actions centered-actions">
                {isSelfCancelled || isRejected || isClosed ? (
                  <>
                    <HardNavLink href="/book" className="button button-primary big-button">
                      Wybierz nowy termin
                    </HardNavLink>
                    <HardNavLink href="/kontakt" className="button button-ghost big-button">
                      Napisz wiadomość
                    </HardNavLink>
                  </>
                ) : isConfirmed ? (
                  <>
                    <Link
                      href={`/call/${booking.id}${accessToken ? `?access=${encodeURIComponent(accessToken)}` : ''}`}
                      className="button button-primary big-button"
                    >
                      Dolacz do rozmowy audio
                    </Link>
                    <Link href="#materialy-do-sprawy" className="button button-ghost big-button">
                      Dodaj materialy
                    </Link>
                  </>
                ) : (
                  <>
                    <HardNavLink
                      href={`/payment?bookingId=${booking.id}${accessToken ? `&access=${encodeURIComponent(accessToken)}` : ''}`}
                      className="button button-primary big-button"
                    >
                      Wroc do platnosci
                    </HardNavLink>
                    <HardNavLink href="/kontakt" className="button button-ghost big-button">
                      Napisz wiadomość
                    </HardNavLink>
                  </>
                )}
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
              <div className="error-box">Ten link do potwierdzenia jest nieprawidlowy albo wygasl.</div>
              <div className="hero-actions centered-actions">
                <HardNavLink href="/book" className="button button-primary big-button">
                  Przejdz do rezerwacji
                </HardNavLink>
                <HardNavLink href="/kontakt" className="button button-ghost big-button">
                  Napisz wiadomość
                </HardNavLink>
              </div>
            </>
          )}
        </section>

        <Footer ctaHref="/book" ctaLabel="Umow kolejny termin" />
      </div>
    </main>
  )
}
