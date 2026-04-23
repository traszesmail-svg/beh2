'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBookingAnalyticsContextParams } from '@/lib/analytics-schema'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  DEFAULT_BOOKING_SERVICE,
  getBookingServiceDurationLabel,
  getBookingServiceTitle,
  isAudioOnlyBookingService,
  type BookingServiceType,
} from '@/lib/booking-services'
import { buildPaymentHref } from '@/lib/booking-routing'
import { getProblemLabel, isCatProblemType } from '@/lib/data'
import { AnimalType, ProblemType } from '@/lib/types'

interface BookingFormProps {
  problemType: ProblemType
  serviceType: BookingServiceType
  slotId: string
  slotLabel: string
  amountLabel: string
  qaBooking?: boolean
}

type BookingApiErrorCode = 'slot_unavailable' | 'booking_unavailable'

function getProblemFormCopy(problemType: ProblemType) {
  return {
    animalType: isCatProblemType(problemType) ? ('Kot' as AnimalType) : ('Pies' as AnimalType),
    durationLabel: 'Od kiedy trwa problem',
    durationPlaceholder: 'np. od 3 tygodni',
    descriptionLabel: 'Krótki opis sytuacji',
    descriptionPlaceholder: 'Napisz, co się dzieje, kiedy problem występuje i co jest dla Ciebie najtrudniejsze.',
    helperText: null,
  }
}

function normalizeBookingErrorMessage(value: string) {
  return value
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[łŁ]/g, 'l')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function isSlotUnavailableBookingMessage(value: string) {
  const normalized = normalizeBookingErrorMessage(value)

  return (
    normalized.includes('wybrany termin') &&
    (normalized.includes('nie jest juz dostepny') ||
      normalized.includes('nie jest dostepny') ||
      normalized.includes('zostal przed chwila zajety') ||
      normalized.includes('zostal zajety') ||
      normalized.includes('slot no longer available') ||
      normalized.includes('already booked') ||
      normalized.includes('already reserved') ||
      normalized.includes('locked by booking id'))
  )
}

// Legacy fixture kept temporarily for source-based regression tests:
// "Ten termin został właśnie zajęty"
function getCheckoutComparisonCopy(serviceType: BookingServiceType) {
  if (serviceType === 'konsultacja-30-min') {
    return 'To rezerwacja Dwoch kwadransow z behawiorysta, czyli 30 minut spokojniejszej rozmowy online.'
  }

  if (serviceType === 'konsultacja-behawioralna-online') {
    return 'To rezerwacja pelnej konsultacji behawioralnej z wieksza iloscia czasu na temat i prace nad kilkoma watkami naraz.'
  }

  if (!isAudioOnlyBookingService(serviceType)) {
    return 'To rezerwacja dluzszej konsultacji z wieksza iloscia czasu na temat.'
  }

  return 'Jesli po rozmowie okaze sie, ze temat wymaga szerszego omowienia, kolejnym krokiem moga byc Dwa kwadranse albo pelna konsultacja behawioralna.'
}

export function BookingForm({
  problemType,
  serviceType,
  slotId,
  slotLabel,
  amountLabel,
  qaBooking = false,
}: BookingFormProps) {
  const router = useRouter()
  const formCopy = getProblemFormCopy(problemType)
  const trackedStartRef = useRef(false)
  const [ownerName, setOwnerName] = useState('')
  const [petAge, setPetAge] = useState('')
  const [durationNotes, setDurationNotes] = useState('')
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const animalType = formCopy.animalType

  useEffect(() => {
    if (qaBooking || trackedStartRef.current) {
      return
    }

    trackedStartRef.current = true
    trackAnalyticsEvent('booking_form_started', {
      slot_id: slotId,
      slot_time: slotLabel,
      source_page: '/form',
      ...getBookingAnalyticsContextParams({
        serviceType,
        animalType,
        problemType,
      }),
    })
  }, [animalType, problemType, qaBooking, serviceType, slotId, slotLabel])

  function isEmailValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!ownerName.trim() || !email.trim() || !description.trim() || !petAge.trim() || !durationNotes.trim()) {
      setError('Uzupełnij wszystkie pola, aby zapisać rezerwację i przejść do płatności.')
      return
    }

    if (!isEmailValid(email.trim())) {
      setError('Podaj poprawny adres e-mail. Na ten adres wyślemy potwierdzenie rozmowy.')
      return
    }

    if (description.trim().length < 20) {
      setError(`Dodaj 2-4 konkretne zdania o problemie. To pomoże lepiej wykorzystać ${getBookingServiceDurationLabel(serviceType)} rozmowy.`)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerName,
          serviceType,
          problemType,
          animalType,
          petAge,
          durationNotes,
          description,
          phone: '',
          email,
          slotId,
          qaBooking,
        }),
      })

      const payload = (await response.json()) as {
        bookingId?: string
        accessToken?: string
        error?: string
        errorCode?: BookingApiErrorCode
      }

      if (!response.ok || !payload.bookingId || !payload.accessToken) {
        if (payload.errorCode === 'slot_unavailable' || (typeof payload.error === 'string' && isSlotUnavailableBookingMessage(payload.error))) {
          setError('Ten termin został właśnie zajęty. Wróć do listy terminów i wybierz inną godzinę rozmowy.')
        } else {
          setError(payload.error ?? 'Rezerwacja chwilowo jest niedostępna. Odśwież stronę za moment i spróbuj ponownie.')
        }
        setIsSubmitting(false)
        return
      }

      trackAnalyticsEvent('booking_form_submitted', {
        booking_id: payload.bookingId,
        slot_id: slotId,
        slot_time: slotLabel,
        source_page: '/form',
        ...getBookingAnalyticsContextParams({
          serviceType,
          animalType,
          problemType,
        }),
      })

      router.push(
        buildPaymentHref(
          payload.bookingId,
          payload.accessToken,
          serviceType === DEFAULT_BOOKING_SERVICE ? null : serviceType,
          qaBooking,
        ),
      )
    } catch (submissionError) {
      console.error('[behawior15][booking-form] submit failed', submissionError)
      const message = submissionError instanceof Error ? submissionError.message : 'Wystąpił błąd formularza.'
      if (isSlotUnavailableBookingMessage(message)) {
        setError('Ten termin został właśnie zajęty. Wróć do listy terminów i wybierz inną godzinę rozmowy.')
      } else {
        setError(message)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <form className="notatnik-form" onSubmit={handleSubmit} data-booking-form="details" data-qa-booking={qaBooking ? 'true' : 'false'}>
      {qaBooking ? <div className="notatnik-callout">To jest rezerwacja testowa. Przejdziesz przez kontrolowaną płatność bez realnego obciążenia klienta.</div> : null}

      <section className="notatnik-form-section">
        <div className="notatnik-form-heading">
          <span className="notatnik-mono">1. Dane podstawowe</span>
          <strong>Dane opiekuna i zwierzaka</strong>
        </div>

        <div className="notatnik-form-grid">
          <div className="notatnik-field">
            <label htmlFor="booking-owner-name">Imię opiekuna</label>
            <input
              id="booking-owner-name"
              value={ownerName}
              onChange={(event) => setOwnerName(event.target.value)}
              placeholder="np. Anna"
              data-booking-field="owner-name"
            />
          </div>

          <div className="notatnik-field">
            <label htmlFor="booking-animal-type">Zwierzak</label>
            <input id="booking-animal-type" value={animalType} readOnly data-readonly="true" data-booking-field="animal-type" />
          </div>

          <div className="notatnik-field">
            <label htmlFor="booking-pet-age">Wiek zwierzęcia</label>
            <input
              id="booking-pet-age"
              value={petAge}
              onChange={(event) => setPetAge(event.target.value)}
              placeholder="np. 8 miesięcy lub 4 lata"
              data-booking-field="pet-age"
            />
          </div>
        </div>
      </section>

      <section className="notatnik-form-section">
        <div className="notatnik-form-heading">
          <span className="notatnik-mono">2. Kontekst sprawy</span>
          <strong>Temat i opis sytuacji</strong>
        </div>

        <div className="notatnik-form-grid">
          <div className="notatnik-field">
            <label htmlFor="booking-service">Usługa</label>
            <input id="booking-service" value={getBookingServiceTitle(serviceType)} readOnly data-readonly="true" />
          </div>

          <div className="notatnik-field">
            <label htmlFor="booking-problem">Temat</label>
            <input id="booking-problem" value={getProblemLabel(problemType)} readOnly data-readonly="true" />
          </div>

          <div className="notatnik-field">
            <label htmlFor="booking-slot">Wybrany termin</label>
            <input id="booking-slot" value={slotLabel} readOnly data-readonly="true" />
          </div>

          <div className="notatnik-field">
            <label htmlFor="booking-duration-notes">{formCopy.durationLabel}</label>
            <input
              id="booking-duration-notes"
              value={durationNotes}
              onChange={(event) => setDurationNotes(event.target.value)}
              placeholder={formCopy.durationPlaceholder}
              data-booking-field="duration-notes"
            />
          </div>

          <div className="notatnik-field notatnik-field-wide">
            <label htmlFor="booking-description">{formCopy.descriptionLabel}</label>
            <textarea
              id="booking-description"
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={formCopy.descriptionPlaceholder}
              data-booking-field="description"
            />
            {formCopy.helperText ? <div className="notatnik-field-help">{formCopy.helperText}</div> : null}
          </div>
        </div>
      </section>

      <section className="notatnik-form-section">
        <div className="notatnik-form-heading">
          <span className="notatnik-mono">3. Potwierdzenie</span>
          <strong>Adres do potwierdzenia</strong>
        </div>

        <div className="notatnik-form-grid">
          <div className="notatnik-field">
            <label htmlFor="booking-email">E-mail</label>
            <input
              id="booking-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="np. klient@email.pl"
              data-booking-field="email"
            />
          </div>
        </div>
      </section>

      {error ? <div className="notatnik-callout notatnik-callout-error">{error}</div> : null}

      <div className="notatnik-submit-box">
        <div className="notatnik-submit-copy">
          <div className="notatnik-submit-kicker">{qaBooking ? 'Krok testowy' : 'Następny krok'}</div>
          <div className="notatnik-submit-title">{qaBooking ? 'Dalej: testowa płatność' : 'Dalej: wybór płatności'}</div>
          <p>
            {qaBooking
              ? 'Po zapisaniu danych blokujemy termin tylko dla Ciebie na czas testowej płatności.'
              : `Po zapisaniu danych blokujemy termin tylko dla Ciebie na czas płatności. Na kolejnym ekranie przejdziesz do wpłaty ręcznej. Do zapłaty: ${amountLabel}.`}
          </p>
          <p className="notatnik-submit-note">{getCheckoutComparisonCopy(serviceType)}</p>
        </div>

        <div className="notatnik-submit-actions">
          <button type="submit" className="notatnik-btn notatnik-btn-accent" disabled={isSubmitting} data-booking-submit="payment">
            {isSubmitting ? 'Zapisuję dane...' : qaBooking ? 'Zablokuj termin i przejdź do testowej płatności' : 'Zablokuj termin i przejdź do płatności'}
          </button>
        </div>
      </div>
    </form>
  )
}
