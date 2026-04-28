'use client'

import { useState, useMemo } from 'react'

export type SlotPickerMode = 'standard' | 'urgent' | 'full-consultation'

type SlotPickerProps = {
  onChange: (formatted: string) => void
  mode?: SlotPickerMode
  className?: string
}

// Confirmed slots: 08:00–11:30 every 30 min, Mon–Fri only
const CONFIRMED_TIMES = [
  '08:00', '08:30',
  '09:00', '09:30',
  '10:00', '10:30',
  '11:00', '11:30',
]

// Question-mark slots for urgent mode: 12:20–16:40 every 20 min
const QUESTION_TIMES = [
  '12:20', '12:40',
  '13:00', '13:20', '13:40',
  '14:00', '14:20', '14:40',
  '15:00', '15:20', '15:40',
  '16:00', '16:20', '16:40',
]

// Social-proof "already booked" ghost slots for standard mode (Kwadrans/Dwa kwadranse)
// Times must not overlap CONFIRMED_TIMES — show realistic ~2 booked per day
const BOOKED_STANDARD: Record<number, string[]> = {
  0: ['07:30', '07:00'],
  1: ['07:30', '07:00'],
  2: ['07:30', '07:00'],
  3: ['07:30', '07:00'],
  4: ['07:30', '07:00'],
}

// Social-proof for full-consultation — slots are ~2h so show 1 booked per day, min 3h gap
const BOOKED_FULL: Record<number, string[]> = {
  0: ['06:00'],
  1: ['06:00'],
  2: ['06:00'],
  3: ['06:00'],
  4: ['06:00'],
  5: ['07:00'],
}

const PL_DAYS = ['pon', 'wt', 'śr', 'czw', 'pt', 'sob']

// Returns 0=Mon … 5=Sat, 6=Sun
function jsToWeekIndex(d: Date): number {
  const day = d.getDay()
  return day === 0 ? 6 : day - 1
}

function dayLabel(d: Date): string {
  return `${PL_DAYS[jsToWeekIndex(d)]} ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
}

function slotId(d: Date, time: string): string {
  return `${d.toISOString().slice(0, 10)}-${time}`
}

function formatForField(selected: string[], days: Date[]): string {
  return selected
    .map((id) => {
      const dateStr = id.slice(0, 10)
      const time = id.slice(11)
      const day = days.find((d) => d.toISOString().slice(0, 10) === dateStr)
      return day ? `${dayLabel(day)} godz. ${time}` : id
    })
    .join('; ')
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base)
  d.setDate(d.getDate() + n)
  d.setHours(0, 0, 0, 0)
  return d
}

function getStandardDays(minDaysAhead: number, count: number): Date[] {
  const days: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let offset = minDaysAhead
  while (days.length < count) {
    const d = addDays(today, offset)
    if (jsToWeekIndex(d) < 5) days.push(d) // Mon–Fri only
    offset++
  }
  return days
}

function getUrgentDays(): Date[] {
  const days: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i <= 2; i++) {
    const d = addDays(today, i)
    if (jsToWeekIndex(d) < 5) days.push(d) // Mon–Fri only
  }
  return days
}

function getFullConsultDays(count: number): Date[] {
  const days: Date[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let offset = 1
  while (days.length < count) {
    const d = addDays(today, offset)
    const wi = jsToWeekIndex(d)
    if (wi !== 6) days.push(d) // Mon–Sat, 1 slot each
    offset++
  }
  return days.slice(0, count)
}

export function SlotPicker({ onChange, mode = 'standard', className }: SlotPickerProps) {
  const days = useMemo(() => {
    if (mode === 'urgent') return getUrgentDays()
    if (mode === 'full-consultation') return getFullConsultDays(10)
    // standard: skip 3 days, show 14 working days
    return getStandardDays(4, 14)
  }, [mode])

  const [activeDay, setActiveDay] = useState<Date | null>(null)
  const [selected, setSelected] = useState<string[]>([])

  function toggleSlot(id: string) {
    let next: string[]
    if (selected.includes(id)) {
      next = selected.filter((s) => s !== id)
    } else if (selected.length >= 3) {
      next = [...selected.slice(1), id]
    } else {
      next = [...selected, id]
    }
    setSelected(next)
    onChange(formatForField(next, days))
  }

  function getConfirmedTimes(d: Date): string[] {
    if (mode === 'full-consultation') {
      return jsToWeekIndex(d) === 5 ? ['10:00'] : ['09:00']
    }
    return CONFIRMED_TIMES
  }

  function getQuestionTimes(): string[] {
    return mode === 'urgent' ? QUESTION_TIMES : []
  }

  function getBookedTimes(d: Date): string[] {
    if (mode === 'full-consultation') return BOOKED_FULL[jsToWeekIndex(d)] ?? []
    return BOOKED_STANDARD[jsToWeekIndex(d)] ?? []
  }

  return (
    <div className={className}>
      {mode === 'full-consultation' && (
        <div className="field-help" style={{ marginBottom: '10px' }}>
          Pełna konsultacja: pon–pt godz. 09:00, sobota godz. 10:00.
          Potwierdzenie terminu następuje do 24 h od rezerwacji.
        </div>
      )}
      {mode === 'urgent' && (
        <div className="field-help" style={{ marginBottom: '10px' }}>
          Terminy oznaczone pytajnikiem ? wymagaja potwierdzenia - odpowiedz w ciagu 15 minut w godzinach dyzuru.
        </div>
      )}

      <div className="slot-picker-days">
        {days.map((d) => {
          const confirmed = getConfirmedTimes(d)
          const question = getQuestionTimes()
          const isActive = activeDay?.toISOString().slice(0, 10) === d.toISOString().slice(0, 10)
          const hasSelected = confirmed.some((t) => selected.includes(slotId(d, t)))
          const totalFree = confirmed.length + question.length
          return (
            <button
              key={d.toISOString()}
              type="button"
              className={`slot-day-btn${isActive ? ' slot-day-btn--active' : ''}${hasSelected ? ' slot-day-btn--picked' : ''}`}
              onClick={() => setActiveDay(isActive ? null : d)}
              aria-expanded={isActive}
            >
              <span className="slot-day-label">{dayLabel(d)}</span>
              <span className="slot-day-count">
                {confirmed.length} wolne{question.length > 0 ? ` + ${question.length} ?` : ''}
              </span>
            </button>
          )
        })}
      </div>

      {activeDay && (() => {
        const confirmed = getConfirmedTimes(activeDay)
        const question = getQuestionTimes()
        const booked = getBookedTimes(activeDay)
        const allTimes = [...booked, ...confirmed].sort()

        return (
          <div className="slot-times">
            <div className="slot-times-label">
              {dayLabel(activeDay)} — {confirmed.length} wolne z {allTimes.length} terminów
              {question.length > 0 && `, ${question.length} do potwierdzenia`}
            </div>
            <div className="slot-times-grid">
              {allTimes.map((t) => {
                const isConfirmed = confirmed.includes(t)
                const id = slotId(activeDay, t)
                const isPicked = selected.includes(id)
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={!isConfirmed}
                    aria-pressed={isPicked}
                    className={`slot-time-chip${!isConfirmed ? ' slot-time-chip--booked' : ''}${isPicked ? ' slot-time-chip--picked' : ''}`}
                    onClick={() => isConfirmed && toggleSlot(id)}
                  >
                    {t}
                    {!isConfirmed && <span className="slot-time-chip-tag">zajęte</span>}
                    {isPicked && <span className="slot-time-chip-tag">✓</span>}
                  </button>
                )
              })}

              {question.length > 0 && (
                <>
                  <div className="slot-times-section-label" style={{ gridColumn: '1/-1', marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                    Poniższe terminy wymagają potwierdzenia — odpowiedź w ciągu 15 min
                  </div>
                  {question.map((t) => {
                    const id = slotId(activeDay, t)
                    const isPicked = selected.includes(id)
                    return (
                      <button
                        key={`q-${t}`}
                        type="button"
                        aria-pressed={isPicked}
                        className={`slot-time-chip slot-time-chip--question${isPicked ? ' slot-time-chip--picked' : ''}`}
                        onClick={() => toggleSlot(id)}
                      >
                        {t}
                        <span className="slot-time-chip-tag">?</span>
                        {isPicked && <span className="slot-time-chip-tag">✓</span>}
                      </button>
                    )
                  })}
                </>
              )}
            </div>
          </div>
        )
      })()}

      {selected.length > 0 && (
        <div className="slot-summary">
          <strong>Wybrane terminy:</strong> {formatForField(selected, days)}
          {selected.length < 2 && <span className="slot-summary-hint"> — mozesz dodac wiecej opcji</span>}
        </div>
      )}
    </div>
  )
}
