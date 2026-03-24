'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProblemLabel } from '@/lib/data'
import { CONSULTATION_PRICE_COMPARE_COPY } from '@/lib/site'
import { AnimalType, ProblemType } from '@/lib/types'

interface BookingFormProps {
  problemType: ProblemType
  slotId: string
  slotLabel: string
  paymentMode: 'stripe' | 'mock'
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

export function BookingForm({ problemType, slotId, slotLabel, paymentMode }: BookingFormProps) {
  const router = useRouter()
  const formCopy = getProblemFormCopy(problemType)
  const isMockPayment = paymentMode === 'mock'
  const [ownerName, setOwnerName] = useState('')
  const [animalType, setAnimalType] = useState<AnimalType>(formCopy.animalType)
  const [petAge, setPetAge] = useState('')
  const [durationNotes, setDurationNotes] = useState('')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  function isEmailValid(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  function isPhoneValid(value: string): boolean {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 9
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!ownerName.trim() || !phone.trim() || !email.trim() || !description.trim() || !petAge.trim() || !durationNotes.trim()) {
      setError(
        isMockPayment
          ? 'Uzupełnij wszystkie pola, aby zarezerwować termin i przejść do testowego potwierdzenia.'
          : 'Uzupełnij wszystkie pola, aby zarezerwować termin i przejść do płatności.',
      )
      return
    }

    if (!isEmailValid(email.trim())) {
      setError('Podaj poprawny adres e-mail. Na ten adres wyślemy potwierdzenie rozmowy.')
      return
    }

    if (!isPhoneValid(phone.trim())) {
      setError('Podaj numer telefonu w poprawnym formacie. Wystarczy co najmniej 9 cyfr.')
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

      router.push(`/payment?bookingId=${payload.bookingId}&access=${encodeURIComponent(payload.accessToken)}`)
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Wystąpił błąd formularza.'
      if (message.includes('nie jest już dostępny') || message.includes('został przed chwilą zajęty')) {
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

      <div className="checkout-box full-width">
        <div>
          <div className="muted">
            {isMockPayment
              ? 'Po zapisaniu danych termin zostanie chwilowo zablokowany na czas testowego potwierdzenia, żeby nikt nie przejął go przed Tobą.'
              : 'Po zapisaniu danych termin zostanie chwilowo zablokowany na czas płatności, żeby nikt nie przejął go przed Tobą.'}
          </div>
          <div className="checkout-title">
            {isMockPayment ? 'Następny krok: potwierdzenie testowe' : 'Następny krok: bezpieczna płatność'}
          </div>
          <div className="muted">
            {isMockPayment
              ? 'Stripe jest tu odłączony. Przejdziesz dalej bez realnej płatności, ale zobaczysz ten sam dalszy flow potwierdzenia, materiałów i linku do rozmowy.'
              : 'Dokładną kwotę zobaczysz jeszcze raz na ekranie płatności, już po zapisaniu rezerwacji i zablokowaniu terminu.'}
          </div>
          <div className="price-compare-text">{CONSULTATION_PRICE_COMPARE_COPY}</div>
        </div>
        <div className="checkout-right">
          <button type="submit" className="button button-primary big-button" disabled={isSubmitting}>
            {isSubmitting
              ? 'Zapisuję dane...'
              : isMockPayment
                ? 'Zablokuj termin i przejdź dalej bez płatności'
                : 'Zablokuj termin i przejdź do płatności'}
          </button>
        </div>
      </div>
    </form>
  )
}
