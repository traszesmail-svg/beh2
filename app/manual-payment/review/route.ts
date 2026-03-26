import { approveManualPayment, rejectManualPayment } from '@/lib/server/manual-payments'
import { verifyManualPaymentReviewToken } from '@/lib/server/manual-payment-review'
import { getBookingById } from '@/lib/server/db'

type HtmlOptions = {
  actionHref?: string
  actionLabel?: string
  redirectUrl?: string
}

function buildHtml(title: string, message: string, status: 'success' | 'error', options?: HtmlOptions) {
  const accent = status === 'success' ? '#0a5c36' : '#8a3022'
  const redirectTag = options?.redirectUrl
    ? `<meta http-equiv="refresh" content="0;url=${options.redirectUrl}" />`
    : ''
  const actionLink = options?.actionHref && options?.actionLabel
    ? `<p style="margin-top:24px;"><a href="${options.actionHref}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:${accent};color:#ffffff;text-decoration:none;font-weight:700;">${options.actionLabel}</a></p>`
    : ''

  return new Response(
    `<!doctype html>
      <html lang="pl">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${title}</title>
          ${redirectTag}
          <style>
            body { margin:0; font-family: Arial, sans-serif; background:#f8f4eb; color:#1f1a17; }
            main { min-height:100vh; display:grid; place-items:center; padding:24px; }
            article { max-width:640px; width:100%; background:#fff; border:1px solid #e9dfcf; border-radius:24px; padding:32px; box-shadow:0 18px 40px rgba(31,26,23,0.08); }
            .badge { display:inline-block; padding:8px 14px; border-radius:999px; background:${accent}; color:#fff; font-weight:700; margin-bottom:16px; }
            h1 { margin:0 0 12px; font-size:32px; line-height:1.1; }
            p { margin:0; line-height:1.7; }
          </style>
        </head>
        <body>
          <main>
            <article>
              <div class="badge">Behawior 15</div>
              <h1>${title}</h1>
              <p>${message}</p>
              ${actionLink}
            </article>
          </main>
        </body>
      </html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
      status: status === 'success' ? 200 : 400,
    },
  )
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const bookingId = url.searchParams.get('bookingId')
  const action = url.searchParams.get('action')
  const token = url.searchParams.get('token')

  if (!bookingId || !(action === 'approve' || action === 'reject')) {
    return buildHtml('Brak danych linku', 'Link do decyzji o płatności jest niekompletny.', 'error')
  }

  const booking = await getBookingById(bookingId)

  if (!booking) {
    return buildHtml('Booking nie istnieje', 'Nie znaleziono rezerwacji przypisanej do tego linku.', 'error')
  }

  if (!verifyManualPaymentReviewToken(booking.id, action, booking.paymentReportedAt, token)) {
    return buildHtml('Link jest nieprawidłowy', 'Ten link wygasł albo nie pasuje do ostatniego zgłoszenia wpłaty.', 'error')
  }

  try {
    if (action === 'approve') {
      const updated = await approveManualPayment(booking.id)
      return buildHtml(
        'Wpłata potwierdzona',
        `Rezerwacja ${updated.id} jest już opłacona. Otwieramy pokój rozmowy.`,
        'success',
        {
          redirectUrl: updated.meetingUrl,
          actionHref: updated.meetingUrl,
          actionLabel: 'Otwórz pokój rozmowy',
        },
      )
    }

    const updated = await rejectManualPayment(booking.id)
    return buildHtml(
      'Nie ma wpłaty',
      `Dla rezerwacji ${updated.id} nie znaleziono wpłaty. Klient musi wrócić do płatności.`,
      'success',
    )
  } catch (error) {
    return buildHtml(
      'Akcja nie powiodła się',
      error instanceof Error ? error.message : 'Nie udało się wykonać decyzji o płatności.',
      'error',
    )
  }
}
