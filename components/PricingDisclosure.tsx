import React from 'react'
import { CONSULTATION_PRICE_COMPARE_COPY } from '@/lib/site'

type PricingDisclosureStage = 'pre-topic' | 'pre-payment'
type DisclosureTag = 'div' | 'span' | 'strong'

const PRICING_DISCLOSURE = {
  'pre-topic': {
    label: 'Aktualna cena i płatność',
    message: 'Kwotę potwierdzisz po wyborze tematu konsultacji',
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

  return (
    <>
      {showLabel ? <LabelTag className={labelClassName}>{content.label}</LabelTag> : null}
      {showMessage ? <MessageTag className={messageClassName}>{content.message}</MessageTag> : null}
      {showNote && content.note ? <span className={noteClassName}>{content.note}</span> : null}
      {showCompare ? <span className={compareClassName}>{CONSULTATION_PRICE_COMPARE_COPY}</span> : null}
    </>
  )
}
