import React from 'react'

type BookingStage = 'topic' | 'slot' | 'details' | 'payment' | 'confirmation'

const BOOKING_STAGE_LABELS = {
  topic: 'Etap rezerwacji: wybór tematu',
  slot: 'Etap rezerwacji: wybór terminu',
  details: 'Etap rezerwacji: dane do konsultacji',
  payment: 'Etap rezerwacji: wybór płatności',
  confirmation: 'Etap rezerwacji: potwierdzenie',
} satisfies Record<BookingStage, string>

const BOOKING_STAGE_PROGRESS = [
  { id: 'topic', label: 'Temat' },
  { id: 'slot', label: 'Termin' },
  { id: 'details', label: 'Dane' },
  { id: 'payment', label: 'Płatność' },
  { id: 'confirmation', label: 'Potwierdzenie' },
] satisfies { id: BookingStage; label: string }[]

interface BookingStageEyebrowProps {
  stage: BookingStage
  className?: string
}

export function BookingStageEyebrow({ stage, className }: BookingStageEyebrowProps) {
  const currentStageIndex = BOOKING_STAGE_PROGRESS.findIndex((item) => item.id === stage)

  return (
    <div className="notatnik-progress">
      <div className={className ?? 'notatnik-mono'}>{BOOKING_STAGE_LABELS[stage]}</div>
      <div className="notatnik-progress-track" aria-hidden="true">
        {BOOKING_STAGE_PROGRESS.map((item, index) => {
          const state = index < currentStageIndex ? 'done' : index === currentStageIndex ? 'current' : 'upcoming'

          return (
            <span key={item.id} className={`notatnik-progress-pill notatnik-progress-pill-${state}`}>
              <span className="notatnik-progress-pill-index">{index + 1}</span>
              <span>{item.label}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
