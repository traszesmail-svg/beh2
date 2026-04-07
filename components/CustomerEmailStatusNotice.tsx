import type { CustomerEmailDeliveryStatus } from '@/lib/server/notifications'

type CustomerEmailStatusNoticeContext = 'payment' | 'confirmation'

type CustomerEmailStatusNoticeProps = {
  status: CustomerEmailDeliveryStatus
  recipientEmail: string
  context: CustomerEmailStatusNoticeContext
  className?: string
}

function getTitle(status: CustomerEmailDeliveryStatus, context: CustomerEmailStatusNoticeContext) {
  if (status.state === 'ready') {
    return context === 'payment' ? 'Maile klienta są aktywne' : 'Mail z potwierdzeniem jest aktywny'
  }

  if (status.state === 'disabled') {
    return 'Maile klienta są wyłączone'
  }

  return 'Wysyłka maili jest zablokowana'
}

function getBody(status: CustomerEmailDeliveryStatus, recipientEmail: string, context: CustomerEmailStatusNoticeContext) {
  if (status.state === 'ready') {
    if (context === 'payment') {
      return `Po potwierdzeniu wpłaty wyślemy link do pokoju na adres ${recipientEmail}. Jeśli skrzynka się opóźni, ta strona nadal pokazuje pełny status i kolejny krok.`
    }

    return `Wyślemy mail z potwierdzeniem na adres ${recipientEmail}. Jeśli skrzynka się opóźni, ta strona nadal pokazuje potwierdzenie, status SMS i link do pokoju.`
  }

  if (status.state === 'disabled') {
    if (context === 'payment') {
      return 'Po potwierdzeniu wpłaty pokażemy aktywne potwierdzenie i link do pokoju bezpośrednio na tej stronie. To świadomy fallback, dopóki CUSTOMER_EMAIL_MODE pozostaje wyłączony.'
    }

    return 'Ta strona pozostaje pełnym fallbackiem: potwierdzenie, status SMS i link do pokoju są zapisane tutaj, nawet gdy maile klienta są wyłączone.'
  }

  if (context === 'payment') {
    return `Po potwierdzeniu wpłaty pokażemy aktywne potwierdzenie i link do pokoju bezpośrednio na tej stronie. ${status.summary} Następny krok: ${status.nextStep}.`
  }

  return `Ta strona pozostaje pełnym fallbackiem: potwierdzenie, status SMS i link do pokoju są zapisane tutaj. ${status.summary} Następny krok: ${status.nextStep}.`
}

export function CustomerEmailStatusNotice({
  status,
  recipientEmail,
  context,
  className,
}: CustomerEmailStatusNoticeProps) {
  const isReady = status.state === 'ready'
  const isBlocked = status.state === 'blocked'
  const toneClass = isBlocked ? 'error-box' : 'info-box'

  return (
    <div className={`${toneClass}${className ? ` ${className}` : ''}`} data-customer-email-state={status.state}>
      <strong>{getTitle(status, context)}</strong>
      <span>{getBody(status, recipientEmail, context)}</span>
      {!isReady && !isBlocked ? <span>Następny krok: {status.nextStep}</span> : null}
    </div>
  )
}
