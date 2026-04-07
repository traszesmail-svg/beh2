'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  DEFAULT_BOOKING_SERVICE,
  type BookingServiceType,
  getBookingServiceDurationLabel,
  getBookingServiceTitle,
} from '@/lib/booking-services'
import { buildPaymentHref } from '@/lib/booking-routing'
import { getProblemLabel, isCatProblemType } from '@/lib/data'
import { isValidPolishPhone } from '@/lib/phone'
import { CONSULTATION_PRICE_COMPARE_COPY } from '@/lib/site'
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
  if (problemType === 'dogoterapia') {
    return {
      animalType: 'Pies' as AnimalType,
      durationLabel: 'Na jakim etapie jest temat',
      durationPlaceholder: 'np. chcę ustalić plan pierwszego spotkania w tym miesiącu',
      descriptionLabel: 'Krótki opis celu rozmowy',
      descriptionPlaceholder:
        'Napisz, dla kogo ma być przygotowane spotkanie, jaki jest cel dogoterapii i co chcesz uporządkować na początku.',
      helperText:
        'W tym polu najlepiej od razu dopisz kontekst spotkania, grupę odbiorców i to, czego potrzebujesz po pierwszej rozmowie.',
    }
  }

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
  const [animalType, setAnimalType] = useState<AnimalType>(formCopy.animalType)
  const [petAge, setPetAge] = useState('')
  const [durationNotes, setDurationNotes] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (qaBooking || trackedStartRef.current) {
      return
    }

    trackedStartRef.current = true
    trackAnalyticsEvent('form_started', {
      problem: problemType,
      service_type: serviceType,
      slot_id: slotId,
      slot_label: slotLabel,
    })
  }, [problemType, qaBooking, serviceType, slotId, slotLabel])

  function isEmailValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!ownerName.trim() || !phone.trim() || !email.trim() || !description.trim() || !petAge.trim() || !durationNotes.trim()) {
      setError('Uzupełnij wszystkie pola, aby zarezerwować termin i przejść do wyboru płatności.')
      return
    }

    if (!isEmailValid(email.trim())) {
      setError('Podaj poprawny adres e-mail. Na ten adres wyślemy potwierdzenie rozmowy.')
      return
    }

    if (!isValidPolishPhone(phone.trim())) {
      setError('Podaj poprawny polski numer telefonu, np. 500 600 700 albo +48 500 600 700.')
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
          phone,
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
    <form className="form-grid top-gap" onSubmit={handleSubmit} data-booking-form="details" data-qa-booking={qaBooking ? 'true' : 'false'}>
      {qaBooking ? (
        <div className="info-box full-width">To jest rezerwacja testowa. Przejdziesz przez kontrolowaną płatność bez realnego obciążenia klienta.</div>
      ) : null}

      <div className="form-section-card tree-backed-card form-section-card-owner">
        <div className="form-section-heading">
          <span className="section-eyebrow">1. Dane podstawowe</span>
          <strong>Ty i zwierzak?</strong>
        </div>

        <div className="form-section-grid">
          <div className="form-field">
            <label>Imię opiekuna</label>
            <input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="np. Anna" data-booking-field="owner-name" />
          </div>

          <div className="form-field">
            <label>Zwierzak</label>
            <select value={animalType} onChange={(event) => setAnimalType(event.target.value as AnimalType)} data-booking-field="animal-type">
              <option value="Pies">Pies</option>
              <option value="Kot">Kot</option>
            </select>
          </div>

          <div className="form-field">
            <label>Wiek zwierzęcia</label>
            <input value={petAge} onChange={(event) => setPetAge(event.target.value)} placeholder="np. 8 miesięcy lub 4 lata" data-booking-field="pet-age" />
          </div>
        </div>
      </div>

      <div className="form-section-card tree-backed-card form-section-card-context">
        <div className="form-section-heading">
          <span className="section-eyebrow">2. Kontekst sprawy</span>
          <strong>Temat i krótki opis sytuacji</strong>
        </div>

        <div className="form-section-grid">
          <div className="form-field">
            <label>Usługa</label>
            <input value={getBookingServiceTitle(serviceType)} readOnly data-readonly="true" />
          </div>

          <div className="form-field">
            <label>Temat</label>
            <input value={getProblemLabel(problemType)} readOnly data-readonly="true" />
          </div>

          <div className="form-field">
            <label>Wybrany termin</label>
            <input value={slotLabel} readOnly data-readonly="true" />
          </div>

          <div className="form-field">
            <label>{formCopy.durationLabel}</label>
            <input
              value={durationNotes}
              onChange={(event) => setDurationNotes(event.target.value)}
              placeholder={formCopy.durationPlaceholder}
              data-booking-field="duration-notes"
            />
          </div>

          <div className="full-width form-field">
            <label>{formCopy.descriptionLabel}</label>
            <textarea
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder={formCopy.descriptionPlaceholder}
              data-booking-field="description"
            />
            {formCopy.helperText ? <div className="field-help">{formCopy.helperText}</div> : null}
          </div>
        </div>
      </div>

      <div className="form-section-card tree-backed-card form-section-card-contact">
        <div className="form-section-heading">
          <span className="section-eyebrow">3. Potwierdzenie kontaktu</span>
          <strong>Dane do potwierdzenia rezerwacji</strong>
        </div>

        <div className="form-section-grid">
          <div className="form-field">
            <label>Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="np. 500 000 000"
              data-booking-field="phone"
            />
          </div>

          <div className="form-field">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="np. klient@email.pl"
              data-booking-field="email"
            />
          </div>
        </div>
      </div>

      {error ? <div className="error-box full-width">{error}</div> : null}

      <div className="checkout-box full-width tree-backed-card booking-submit-box">
        <div>
          <div className="muted">
            {qaBooking
              ? 'Po zapisaniu danych blokujemy termin tylko dla Ciebie na czas testowej płatności.'
              : 'Po zapisaniu danych blokujemy termin tylko dla Ciebie na czas płatności.'}
          </div>
          <div className="checkout-title">{qaBooking ? 'Dalej: testowa płatność' : 'Dalej: wybór płatności'}</div>
          <div className="muted">
            {qaBooking
              ? 'Na kolejnym ekranie zobaczysz kontrolowaną płatność testową bez realnego obciążenia.'
              : `Na kolejnym ekranie przejdziesz do wpłaty ręcznej. Do zapłaty: ${amountLabel}. Tę samą kwotę zobaczysz jeszcze raz przed kliknięciem.`}
          </div>
          <div className="price-compare-text">{CONSULTATION_PRICE_COMPARE_COPY}</div>
        </div>
        <div className="checkout-right">
          <button type="submit" className="button button-primary big-button" disabled={isSubmitting} data-booking-submit="payment">
            {isSubmitting ? 'Zapisuję dane...' : qaBooking ? 'Zablokuj termin i przejdź do testowej płatności' : 'Zablokuj termin i przejdź do płatności'}
          </button>
        </div>
      </div>
    </form>
  )
}
