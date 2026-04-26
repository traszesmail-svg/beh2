'use client'

import { useState, useMemo } from 'react'

export type SlotPickerMode = 'standard' | 'full-consultation'

type SlotPickerProps = {
  onChange: (formatted: string) => void
  mode?: SlotPickerMode
  className?: string
}

// Available times per day-of-week index (0=Mon, 1=Tue … 5=Sat, Sun skipped)
const AVAIL: Record<number, string[]> = {
  0: ['09:00', '17:00', '17:40'],
  1: ['10:20', '11:00', '18:00'],
  2: ['09:40', '16:20', '17:20'],
  3: ['09:20', '10:40', '18:20'],
  4: ['09:00', '11:20', '16:40'],
  5: ['10:00', '10:40', '11:00'],
}

// Ghost "already booked" times per day-of-week (social proof)
const BOOKED: Record<number, string[]> = {
  0: ['08:40', '09:20', '10:20', '11:00'],
  1: ['09:00', '09:20', '09:40', '16:40'],
  2: ['09:00', '09:20', '10:00', '11:00'],
  3: ['09:00', '09:40', '10:00', '11:00'],
  4: ['09:20', '09:40', '10:20', '11:40'],
  5: ['09:20', '09:40', '11:20', '11:40'],
}

// Full-consultation mode: always Mon+Thu at 09:00 only
const FULL_CONSULT_DAYS = [1, 4] // Tue + Fri (1=Tue, 4=Fri in 0=Mon index)
const FULL_CONSULT_BOOKED = ['09:40', '10:00', '10:20', '11:00']

const PL_DAYS = ['pon', 'wt', 'śr', 'czw', 'pt', 'sob']

function getWorkingDays(count: number, minDaysAhead: number): Date[] {
  const days: Date[] = []
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  // Skip ahead the minimum required days first
  d.setDate(d.getDate() + minDaysAhead)
  // Then keep advancing until we have enough working days (skip Sunday only)
  const limit = new Date(d)
  limit.setDate(limit.getDate() - 1)
  // Reset to start point and collect
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + minDaysAhead)
  // Make sure we land on a working day first
  while (start.getDay() === 0) start.setDate(start.getDate() + 1)

  const cur = new Date(start)
  while (days.length < count) {
    if (cur.getDay() !== 0) days.push(new Date(cur))
    cur.setDate(cur.getDate() + 1)
  }
  return days
}

function dayIndex(d: Date): number {
  // 0=Mon … 5=Sat
  return d.getDay() === 0 ? 5 : d.getDay() - 1
}

function dayLabel(d: Date): string {
  return `${PL_DAYS[dayIndex(d)]} ${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
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

export function SlotPicker({ onChange, mode = 'standard', className }: SlotPickerProps) {
  const isFullConsult = mode === 'full-consultation'

  // Standard: earliest slot in 3 days; Full consultation: also 3 days min, but filter Mon+Thu only
  const days = useMemo(() => {
    const all = getWorkingDays(isFullConsult ? 14 : 7, 3)
    if (!isFullConsult) return all
    // Keep only Tue (dayIndex 1) and Fri (dayIndex 4), up to 4 dates
    return all.filter((d) => FULL_CONSULT_DAYS.includes(dayIndex(d))).slice(0, 4)
  }, [isFullConsult])

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

  function getAvailTimes(d: Date): string[] {
    return isFullConsult ? ['09:00'] : AVAIL[dayIndex(d)]
  }

  function getBookedTimes(d: Date): string[] {
    return isFullConsult ? FULL_CONSULT_BOOKED : BOOKED[dayIndex(d)]
  }

  return (
    <div className={className}>
      {isFullConsult && (
        <div className="field-help" style={{ marginBottom: '10px' }}>
          Pełna konsultacja odbywa się we wtorek i piątek o godz. 09:00.
        </div>
      )}

      <div className="slot-picker-days">
        {days.map((d) => {
          const avail = getAvailTimes(d)
          const isActive = activeDay?.toISOString().slice(0, 10) === d.toISOString().slice(0, 10)
          const hasSelected = avail.some((t) => selected.includes(slotId(d, t)))
          return (
            <button
              key={d.toISOString()}
              type="button"
              className={`slot-day-btn${isActive ? ' slot-day-btn--active' : ''}${hasSelected ? ' slot-day-btn--picked' : ''}`}
              onClick={() => setActiveDay(isActive ? null : d)}
              aria-expanded={isActive}
            >
              <span className="slot-day-label">{dayLabel(d)}</span>
              <span className="slot-day-count">{avail.length} {avail.length === 1 ? 'wolny' : 'wolne'}</span>
            </button>
          )
        })}
      </div>

      {activeDay && (() => {
        const avail = getAvailTimes(activeDay)
        const booked = getBookedTimes(activeDay)
        const allTimes = [...booked, ...avail].sort()
        return (
          <div className="slot-times">
            <div className="slot-times-label">
              {dayLabel(activeDay)} — {avail.length} {avail.length === 1 ? 'wolny' : avail.length >= 2 && avail.length <= 4 ? 'wolne' : 'wolnych'} z {allTimes.length} terminów
            </div>
            <div className="slot-times-grid">
              {allTimes.map((t) => {
                const isAvail = avail.includes(t)
                const id = slotId(activeDay, t)
                const isPicked = selected.includes(id)
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={!isAvail}
                    aria-pressed={isPicked}
                    className={`slot-time-chip${!isAvail ? ' slot-time-chip--booked' : ''}${isPicked ? ' slot-time-chip--picked' : ''}`}
                    onClick={() => isAvail && toggleSlot(id)}
                  >
                    {t}
                    {!isAvail && <span className="slot-time-chip-tag">zajęte</span>}
                    {isPicked && <span className="slot-time-chip-tag">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })()}

      {selected.length > 0 && (
        <div className="slot-summary">
          <strong>Wybrane terminy:</strong> {formatForField(selected, days)}
          {selected.length < 2 && <span className="slot-summary-hint"> — dodaj 1–2 rezerwowe</span>}
        </div>
      )}
    </div>
  )
}
