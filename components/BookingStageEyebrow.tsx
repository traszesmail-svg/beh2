import React from 'react'

type BookingStage = 'topic' | 'slot' | 'details'

const BOOKING_STAGE_LABELS = {
  topic: 'Etap rezerwacji: wybór tematu',
  slot: 'Etap rezerwacji: wybór terminu',
  details: 'Etap rezerwacji: dane do konsultacji',
} satisfies Record<BookingStage, string>

interface BookingStageEyebrowProps {
  stage: BookingStage
  className?: string
}

export function BookingStageEyebrow({ stage, className }: BookingStageEyebrowProps) {
  return <div className={className}>{BOOKING_STAGE_LABELS[stage]}</div>
}
