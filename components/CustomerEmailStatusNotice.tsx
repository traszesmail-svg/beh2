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
    return context === 'payment' ? 'Potwierdzenie mailowe jest aktywne' : 'Mail z potwierdzeniem jest aktywny'
  }

  if (status.state === 'disabled' || status.state === 'blocked') {
    return 'Mail z potwierdzeniem jest chwilowo niedostępny'
  }

  return 'Mail z potwierdzeniem może się opóźnić'
}

function getBody(status: CustomerEmailDeliveryStatus, recipientEmail: string, context: CustomerEmailStatusNoticeContext) {
  if (status.state === 'ready') {
    if (context === 'payment') {
      return `Po potwierdzeniu wpłaty wyślemy link do pokoju na adres ${recipientEmail}. Jeśli skrzynka się opóźni, ta strona nadal pokazuje pełny status i kolejny krok.`
    }

    return `Wyślemy mail z potwierdzeniem na adres ${recipientEmail}. Jeśli skrzynka się opóźni, ta strona nadal pokazuje potwierdzenie i link do pokoju.`
  }

  if (status.state === 'disabled' || status.state === 'blocked') {
    if (context === 'payment') {
      return 'Po potwierdzeniu wpłaty aktywne potwierdzenie i link do pokoju zobaczysz bezpośrednio na tej stronie.'
    }

    return 'Ta strona nadal pokazuje potwierdzenie i link do pokoju, nawet jeśli mail dotrze później.'
  }

  if (context === 'payment') {
    return 'Po potwierdzeniu wpłaty aktywne potwierdzenie i link do pokoju zobaczysz bezpośrednio na tej stronie.'
  }

  return 'Ta strona nadal pokazuje potwierdzenie i link do pokoju, nawet jeśli mail dotrze później.'
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
