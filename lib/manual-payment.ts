type ManualPaymentCopyInput = {
  phoneDisplay?: string | null
  bankAccountDisplay?: string | null
  accountName?: string | null
}

export type ManualPaymentDisplayCopy = {
  selectionTitle: string
  summaryTitle: string
  description: string
}

export type ManualPaymentDetailCard = {
  key: 'phone' | 'bank' | 'account'
  label: string
  value: string
}

export function getManualPaymentDisplayCopy({
  phoneDisplay,
  bankAccountDisplay,
}: ManualPaymentCopyInput): ManualPaymentDisplayCopy {
  const hasPhone = Boolean(phoneDisplay)
  const hasBankAccount = Boolean(bankAccountDisplay)

  if (hasPhone && hasBankAccount) {
    return {
      selectionTitle: 'Przelew tradycyjny / BLIK na telefon',
      summaryTitle: 'BLIK / przelew z potwierdzeniem do 60 min',
      description: 'Najprostszy start: BLIK na telefon albo zwykły przelew z tytułem bookingu.',
    }
  }

  if (hasPhone) {
    return {
      selectionTitle: 'BLIK na telefon',
      summaryTitle: 'BLIK na telefon z potwierdzeniem do 60 min',
      description: 'Najprostszy start: wpłata BLIK na telefon z tytułem bookingu.',
    }
  }

  if (hasBankAccount) {
    return {
      selectionTitle: 'Przelew tradycyjny',
      summaryTitle: 'Przelew z potwierdzeniem do 60 min',
      description: 'Najprostszy start: zwykły przelew z tytułem bookingu.',
    }
  }

  return {
    selectionTitle: 'Wpłata manualna',
    summaryTitle: 'Wpłata manualna z potwierdzeniem do 60 min',
    description: 'Dostępność szczegółów zależy od aktywnej konfiguracji płatności.',
  }
}

export function getManualPaymentDetailCards({
  phoneDisplay,
  bankAccountDisplay,
  accountName,
}: ManualPaymentCopyInput): ManualPaymentDetailCard[] {
  const cards: ManualPaymentDetailCard[] = []

  if (phoneDisplay) {
    cards.push({
      key: 'phone',
      label: 'BLIK na telefon',
      value: phoneDisplay,
    })
  }

  if (bankAccountDisplay) {
    cards.push({
      key: 'bank',
      label: 'Numer konta do przelewu',
      value: bankAccountDisplay,
    })
  }

  cards.push({
    key: 'account',
    label: 'Odbiorca',
    value: accountName ?? 'Behawior 15',
  })

  return cards
}
