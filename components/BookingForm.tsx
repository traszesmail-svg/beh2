'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { trackAnalyticsEvent } from '@/lib/analytics'
import { buildPaymentHref } from '@/lib/booking-routing'
import { getProblemLabel } from '@/lib/data'
import { isValidPolishPhone } from '@/lib/phone'
import { CONSULTATION_PRICE_COMPARE_COPY } from '@/lib/site'
import { AnimalType, ProblemType } from '@/lib/types'

interface BookingFormProps {
  problemType: ProblemType
  slotId: string
  slotLabel: string
}

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
        'W tym polu najlepiej od razu dopisać kontekst spotkania, grupę odbiorców i to, czego potrzebujesz po pierwszej rozmowie.',
    }
  }

  return {
    animalType: problemType === 'kot' ? ('Kot' as AnimalType) : ('Pies' as AnimalType),
    durationLabel: 'Od kiedy trwa problem',
    durationPlaceholder: 'np. od 3 tygodni',
    descriptionLabel: 'Krótki opis sytuacji',
    descriptionPlaceholder: 'Napisz, co się dzieje, kiedy problem występuje i co jest dla Ciebie najtrudniejsze.',
    helperText: null,
  }
}

export function BookingForm({ problemType, slotId, slotLabel }: BookingFormProps) {
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
    if (trackedStartRef.current) {
      return
    }

    trackedStartRef.current = true
    trackAnalyticsEvent('form_started', {
      problem: problemType,
      slot_id: slotId,
      slot_label: slotLabel,
    })
  }, [problemType, slotId, slotLabel])

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
      setError('Dodaj 2-4 konkretne zdania o problemie. To pomoże lepiej wykorzystać 15 minut rozmowy.')
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
          problemType,
          animalType,
          petAge,
          durationNotes,
          description,
          phone,
          email,
          slotId,
        }),
      })

      const payload = (await response.json()) as { bookingId?: string; accessToken?: string; error?: string }

      if (!response.ok || !payload.bookingId || !payload.accessToken) {
        throw new Error(payload.error ?? 'Nie udało się zapisać rezerwacji. Sprawdź dane lub wybierz inny termin.')
      }

      router.push(buildPaymentHref(payload.bookingId, payload.accessToken))
    } catch (submissionError) {
      console.error('[behawior15][booking-form] submit failed', submissionError)
      const message = submissionError instanceof Error ? submissionError.message : 'Wystąpił błąd formularza.'
      if (message.includes('nie jest już dostępny') || message.includes('zostal przed chwila zajety')) {
        setError('Ten termin został właśnie zajęty. Wróć do listy terminów i wybierz inną godzinę rozmowy.')
      } else {
        setError(message)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <form className="form-grid top-gap" onSubmit={handleSubmit}>
      <div>
        <label>Imię opiekuna</label>
        <input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="np. Anna" />
      </div>

      <div>
        <label>Zwierzę</label>
        <select value={animalType} onChange={(event) => setAnimalType(event.target.value as AnimalType)}>
          <option value="Pies">Pies</option>
          <option value="Kot">Kot</option>
        </select>
      </div>

      <div>
        <label>Wiek zwierzęcia</label>
        <input value={petAge} onChange={(event) => setPetAge(event.target.value)} placeholder="np. 8 miesięcy lub 4 lata" />
      </div>

      <div>
        <label>Temat</label>
        <input value={getProblemLabel(problemType)} readOnly />
      </div>

      <div>
        <label>Wybrany termin</label>
        <input value={slotLabel} readOnly />
      </div>

      <div>
        <label>{formCopy.durationLabel}</label>
        <input
          value={durationNotes}
          onChange={(event) => setDurationNotes(event.target.value)}
          placeholder={formCopy.durationPlaceholder}
        />
      </div>

      <div className="full-width">
        <label>{formCopy.descriptionLabel}</label>
        <textarea
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={formCopy.descriptionPlaceholder}
        />
        {formCopy.helperText ? <div className="muted top-gap-small">{formCopy.helperText}</div> : null}
      </div>

      <div>
        <label>Telefon</label>
        <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="np. 500 000 000" />
      </div>

      <div>
        <label>E-mail</label>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="np. klient@email.pl" />
      </div>

      {error ? <div className="error-box full-width">{error}</div> : null}

      <div className="checkout-box full-width tree-backed-card">
        <div>
          <div className="muted">Po zapisaniu danych termin zostanie chwilowo zablokowany, żeby nikt nie zajął go w trakcie płatności.</div>
          <div className="checkout-title">Następny krok: wybór płatności</div>
          <div className="muted">
            Na kolejnym ekranie wybierzesz wpłatę BLIK/przelewem albo PayU. Dokładną kwotę potwierdzisz jeszcze raz przy obu metodach.
          </div>
          <div className="price-compare-text">{CONSULTATION_PRICE_COMPARE_COPY}</div>
        </div>
        <div className="checkout-right">
          <button type="submit" className="button button-primary big-button" disabled={isSubmitting}>
            {isSubmitting ? 'Zapisuję dane...' : 'Zablokuj termin i przejdź do płatności'}
          </button>
        </div>
      </div>
    </form>
  )
}
