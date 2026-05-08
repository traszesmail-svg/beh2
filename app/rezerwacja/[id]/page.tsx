import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLeadBookingByToken } from '@/lib/server/lead-bookings'
import { Header } from '@/components/Header'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Status rezerwacji | Regulski',
  description: 'Status Twojej rezerwacji konsultacji behawioralnej.',
  robots: {
    index: false,
    follow: false,
  },
}

const STATUS_INFO: Record<
  'pending' | 'awaiting_payment' | 'paid' | 'cancelled',
  { label: string; description: string; color: string }
> = {
  pending: {
    label: 'Oczekuje na potwierdzenie terminu',
    description:
      'Otrzymaliśmy Twoją rezerwację. Skontaktuję się z Tobą wkrótce z propozycją terminu i instrukcją płatności.',
    color: '#b07b3f',
  },
  awaiting_payment: {
    label: 'Termin potwierdzony - czeka na płatność',
    description:
      'Termin został potwierdzony. Po zaksięgowaniu płatności otrzymasz link do rozmowy oraz wpis do kalendarza.',
    color: '#2f7667',
  },
  paid: {
    label: 'Rezerwacja opłacona',
    description:
      'Płatność została zaksięgowana. Poniżej znajdziesz link do pokoju rozmowy i wpisu do Twojego kalendarza.',
    color: '#1a5d3a',
  },
  cancelled: {
    label: 'Rezerwacja anulowana',
    description: 'Ta rezerwacja została anulowana. Jeśli to pomyłka, skontaktuj się że mną.',
    color: '#8a3022',
  },
}

type Props = {
  params: { id: string }
  searchParams?: { token?: string }
}

export default async function ReservationStatusPage({ params, searchParams }: Props) {
  const token = searchParams?.token

  if (!token) {
    notFound()
  }

  const booking = await getLeadBookingByToken(params.id, token)

  if (!booking) {
    notFound()
  }

  const statusInfo = STATUS_INFO[booking.status]
  const speciesLabel = booking.species === 'kot' ? 'Kot' : 'Pies'

  return (
    <>
      <Header />
      <main className="container" style={{ maxWidth: '720px', padding: '40px 20px' }}>
        <article
          style={{
            background: '#fff',
            border: '1px solid rgba(92, 76, 58, 0.12)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 8px 24px rgba(97, 74, 44, 0.06)',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: '999px',
              background: `${statusInfo.color}15`,
              color: statusInfo.color,
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            {statusInfo.label}
          </div>

          <h1 style={{ fontSize: '28px', marginTop: '8px', marginBottom: '12px' }}>
            Twoja rezerwacja: {booking.serviceLabel}
          </h1>

          <p style={{ color: 'rgba(31, 26, 23, 0.72)', lineHeight: 1.6, marginBottom: '24px' }}>
            {statusInfo.description}
          </p>

          <section style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Szczegóły rezerwacji</h2>
            <dl style={{ fontSize: '15px', lineHeight: 1.8, margin: 0 }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <dt style={{ minWidth: '160px', color: 'rgba(31, 26, 23, 0.6)' }}>Imię:</dt>
                <dd style={{ margin: 0, fontWeight: '500' }}>{booking.name}</dd>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <dt style={{ minWidth: '160px', color: 'rgba(31, 26, 23, 0.6)' }}>E-mail:</dt>
                <dd style={{ margin: 0 }}>{booking.email}</dd>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <dt style={{ minWidth: '160px', color: 'rgba(31, 26, 23, 0.6)' }}>Usługa:</dt>
                <dd style={{ margin: 0 }}>
                  {booking.serviceLabel} ({booking.servicePrice})
                </dd>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <dt style={{ minWidth: '160px', color: 'rgba(31, 26, 23, 0.6)' }}>Gatunek:</dt>
                <dd style={{ margin: 0 }}>{speciesLabel}</dd>
              </div>
              {booking.confirmedDate && booking.confirmedTime && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <dt style={{ minWidth: '160px', color: 'rgba(31, 26, 23, 0.6)' }}>
                    Potwierdzony termin:
                  </dt>
                  <dd style={{ margin: 0, fontWeight: '600', color: '#2f7667' }}>
                    {booking.confirmedDate}, {booking.confirmedTime}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '8px', color: 'rgba(31, 26, 23, 0.6)' }}>
              Twoje preferowane terminy:
            </h3>
            <p
              style={{
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                margin: 0,
                background: 'rgba(245, 241, 234, 0.6)',
                padding: '12px 16px',
                borderRadius: '8px',
              }}
            >
              {booking.preferredSlots}
            </p>
          </section>

          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '15px', marginBottom: '8px', color: 'rgba(31, 26, 23, 0.6)' }}>
              Opis sytuacji:
            </h3>
            <p
              style={{
                fontSize: '14px',
                whiteSpace: 'pre-wrap',
                margin: 0,
                background: 'rgba(245, 241, 234, 0.6)',
                padding: '12px 16px',
                borderRadius: '8px',
              }}
            >
              {booking.description}
            </p>
          </section>

          {booking.status === 'awaiting_payment' && booking.paymentLink && (
            <section
              style={{
                background: '#2f7667',
                color: '#fff',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '17px' }}>Płatność</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px', opacity: 0.9 }}>
                Kliknij poniżej aby przejść do płatności ({booking.servicePrice}):
              </p>
              <a
                href={booking.paymentLink}
                style={{
                  display: 'inline-block',
                  background: '#fff',
                  color: '#2f7667',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Zapłać teraz →
              </a>
              {booking.paymentMethod && (
                <p style={{ margin: '12px 0 0 0', fontSize: '13px', opacity: 0.8 }}>
                  Metoda: {booking.paymentMethod}
                </p>
              )}
            </section>
          )}

          {booking.status === 'paid' && (
            <section
              style={{
                background: '#1a5d3a',
                color: '#fff',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px',
              }}
            >
              <h3 style={{ margin: '0 0 12px 0', fontSize: '17px' }}>
                ✓ Rezerwacja potwierdzona
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {booking.callRoomUrl && (
                  <a
                    href={booking.callRoomUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: '#fff',
                      color: '#1a5d3a',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '600',
                    }}
                  >
                    Otwórz pokój rozmowy →
                  </a>
                )}
                {booking.calendarUrl && (
                  <a
                    href={booking.calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: '#fff',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '14px',
                    }}
                  >
                    Dodaj do Google Calendar
                  </a>
                )}
              </div>
            </section>
          )}

          <p
            style={{
              fontSize: '13px',
              color: 'rgba(31, 26, 23, 0.5)',
              borderTop: '1px solid rgba(92, 76, 58, 0.1)',
              paddingTop: '16px',
              marginTop: '24px',
            }}
          >
            Pytania? Napisz na{' '}
            <a href="mailto:kontakt@regulskibehawiorysta.pl" style={{ color: '#2f7667' }}>
              kontakt@regulskibehawiorysta.pl
            </a>{' '}
            lub odpowiedz na maila potwierdzającego.
          </p>

          <p
            style={{
              fontSize: '11px',
              color: 'rgba(31, 26, 23, 0.4)',
              marginTop: '16px',
            }}
          >
            ID rezerwacji: {booking.id.substring(0, 8)} | Utworzono:{' '}
            {new Date(booking.createdAt).toLocaleString('pl-PL')}
          </p>

          <div style={{ marginTop: '24px' }}>
            <Link
              href="/"
              style={{
                color: '#2f7667',
                textDecoration: 'underline',
                fontSize: '14px',
              }}
            >
              ← Wróć na stronę główną
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
