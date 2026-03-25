import React from 'react'
import { buildPublicPricingDisclosureMessage } from '@/lib/pricing'
import { CONSULTATION_PRICE_COMPARE_COPY } from '@/lib/site'

type PricingDisclosureStage = 'pre-topic' | 'pre-payment'
type DisclosureTag = 'div' | 'span' | 'strong'

const PRICING_DISCLOSURE = {
  'pre-topic': {
    label: 'Oferta i płatność',
    message: buildPublicPricingDisclosureMessage(null),
    note: '15 minut rozmowy audio z jednym specjalistą',
  },
  'pre-payment': {
    label: 'Kwota',
    message: 'Kwotę potwierdzisz na ekranie płatności po zapisaniu rezerwacji i zablokowaniu terminu.',
    note: null,
  },
} satisfies Record<PricingDisclosureStage, { label: string; message: string; note: string | null }>

interface PricingDisclosureProps {
  stage: PricingDisclosureStage
  message?: string
  labelAs?: DisclosureTag
  labelClassName?: string
  messageAs?: DisclosureTag
  messageClassName?: string
  noteClassName?: string
  compareClassName?: string
  showLabel?: boolean
  showMessage?: boolean
  showNote?: boolean
  showCompare?: boolean
}

export function PricingDisclosure({
  stage,
  message,
  labelAs = 'span',
  labelClassName,
  messageAs = 'span',
  messageClassName,
  noteClassName,
  compareClassName,
  showLabel = true,
  showMessage = true,
  showNote = false,
  showCompare = false,
}: PricingDisclosureProps) {
  const content = PRICING_DISCLOSURE[stage]
  const LabelTag = labelAs
  const MessageTag = messageAs
  const resolvedMessage = message ?? content.message

  return (
    <>
      {showLabel ? <LabelTag className={labelClassName}>{content.label}</LabelTag> : null}
      {showMessage ? <MessageTag className={messageClassName}>{resolvedMessage}</MessageTag> : null}
      {showNote && content.note ? <span className={noteClassName}>{content.note}</span> : null}
      {showCompare ? <span className={compareClassName}>{CONSULTATION_PRICE_COMPARE_COPY}</span> : null}
    </>
  )
}
