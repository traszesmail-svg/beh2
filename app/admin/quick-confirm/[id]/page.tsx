import { notFound } from 'next/navigation'
import { getLeadBookingById } from '@/lib/server/lead-bookings'
import { verifyConfirmToken } from '@/lib/admin-confirm-token'
import { QuickConfirmForm } from './QuickConfirmForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function QuickConfirmPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: Record<string, string | undefined>
}) {
  const token = searchParams?.token ?? ''
  const valid = verifyConfirmToken(params.id, token)

  if (!valid) {
    return (
      <main style={{ maxWidth: '520px', margin: '80px auto', padding: '32px 20px', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#8a3022' }}>Nieprawidłowy link</h1>
        <p>Link wygasł albo jest nieprawidłowy. Otwórz panel admina bezpośrednio.</p>
      </main>
    )
  }

  const booking = await getLeadBookingById(params.id)
  if (!booking) notFound()

  if (booking.status === 'paid') {
    return (
      <main style={{ maxWidth: '520px', margin: '80px auto', padding: '32px 20px', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#2f7667' }}>✓ Już potwierdzone</h1>
        <p>Ta rezerwacja jest już oznaczona jako opłacona.</p>
        <p><strong>{booking.name}</strong> — {booking.serviceLabel}</p>
        {booking.confirmedDate && <p>Termin: {booking.confirmedDate} {booking.confirmedTime}</p>}
      </main>
    )
  }

  if (booking.status === 'cancelled') {
    return (
      <main style={{ maxWidth: '520px', margin: '80px auto', padding: '32px 20px', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#8a3022' }}>Rezerwacja anulowana</h1>
        <p>Ta rezerwacja została wcześniej anulowana.</p>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: '520px', margin: '80px auto', padding: '32px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '22px', marginBottom: '4px' }}>Potwierdź płatność</h1>
      <p style={{ color: '#666', marginTop: 0, marginBottom: '24px' }}>
        {booking.name} · {booking.serviceLabel} ({booking.servicePrice})
      </p>

      <div style={{ background: '#f5f1ea', borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', fontSize: '14px' }}>
        <strong>Preferowane terminy klienta:</strong>
        <pre style={{ margin: '6px 0 0', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{booking.preferredSlots}</pre>
      </div>

      <QuickConfirmForm
        bookingId={booking.id}
        token={token}
        defaultDate={booking.confirmedDate ?? ''}
        defaultTime={booking.confirmedTime ?? ''}
      />
    </main>
  )
}
