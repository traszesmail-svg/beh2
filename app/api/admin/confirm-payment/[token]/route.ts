export const dynamic = 'force-dynamic'
export const revalidate = 0

import {
  fulfillCommerceOrderAndNotify,
} from '@/lib/server/commerce-service'
import {
  getCommerceOrderByConfirmationToken,
  rejectCommerceManualPayment,
} from '@/lib/server/commerce-store'

function html(title: string, message: string, status: 200 | 400 = 200) {
  return new Response(
    `<!doctype html>
      <html lang="pl">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>${title}</title>
          <style>
            body{margin:0;font-family:Arial,sans-serif;background:#f8f4eb;color:#1f1a17}
            main{min-height:100vh;display:grid;place-items:center;padding:24px}
            article{max-width:680px;background:#fff;border:1px solid #e9dfcf;border-radius:24px;padding:32px;box-shadow:0 18px 40px rgba(31,26,23,.08)}
            h1{margin:0 0 12px;font-size:30px;line-height:1.15}
            p{line-height:1.7}
          </style>
        </head>
        <body><main><article><h1>${title}</h1><p>${message}</p></article></main></body>
      </html>`,
    {
      status,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
      },
    },
  )
}

function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    null
}

function alreadyConfirmedMessage(productType: string) {
  return productType === 'consultation'
    ? 'Konsultacja była już potwierdzona. Ponowne kliknięcie nie wysyła kolejnych maili.'
    : 'Kod dostępu został już wysłany do klienta. Ponowne kliknięcie nie tworzy nowego kodu.'
}

function confirmedMessage(productType: string) {
  return productType === 'consultation'
    ? 'Konsultacja została potwierdzona. Klient dostał mail z terminem i linkiem do rozmowy, a behawiorysta dostał osobne potwierdzenie z plikiem kalendarza.'
    : 'Kod dostępu został wysłany do klienta.'
}

export async function GET(request: Request, { params }: { params: { token: string } }) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action') === 'reject' ? 'reject' : 'approve'
  const order = await getCommerceOrderByConfirmationToken(params.token)

  if (!order) {
    return html('Link jest nieprawidłowy', 'Nie znaleziono zamówienia przypisanego do tego tokenu.', 400)
  }

  if (order.adminConfirmationTokenUsedAt && (order.status === 'access_sent' || order.status === 'paid')) {
    return html('Płatność była już potwierdzona', alreadyConfirmedMessage(order.productType))
  }

  if (order.adminConfirmationTokenUsedAt) {
    return html('Link był już użyty', 'Ta decyzja została już wykonana. Token jest jednorazowy.', 400)
  }

  try {
    if (action === 'reject') {
      await rejectCommerceManualPayment(order.orderNumber, {
        adminTokenUsedAt: new Date().toISOString(),
        adminIp: clientIp(request),
        adminUserAgent: request.headers.get('user-agent'),
      })
      return html('Płatność odrzucona', 'Zamówienie zostało oznaczone jako anulowane. Dostęp nie został wydany.')
    }

    const confirmedOrder = await fulfillCommerceOrderAndNotify(order.orderNumber, 'blik_phone', {
      adminTokenUsedAt: new Date().toISOString(),
      adminIp: clientIp(request),
      adminUserAgent: request.headers.get('user-agent'),
    })

    return html('Płatność potwierdzona', confirmedMessage(confirmedOrder.productType))
  } catch (error) {
    return html(
      'Nie udało się wykonać decyzji',
      error instanceof Error ? error.message : 'Wystąpił błąd potwierdzenia płatności.',
      400,
    )
  }
}
