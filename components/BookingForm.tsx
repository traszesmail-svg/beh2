'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getProblemLabel } from '@/lib/data'
import { AnimalType, ProblemType } from '@/lib/types'

interface BookingFormProps {
  problemType: ProblemType
  slotId: string
  slotLabel: string
  priceLabel: string
}

export function BookingForm({ problemType, slotId, slotLabel, priceLabel }: BookingFormProps) {
  const router = useRouter()
  const [ownerName, setOwnerName] = useState('')
  const [animalType, setAnimalType] = useState<AnimalType>('Pies')
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
      setError('Uzupelnij wszystkie pola, aby zarezerwowac termin i przejsc do platnosci.')
      return
    }

    if (!isEmailValid(email.trim())) {
      setError('Podaj poprawny adres e-mail. Na ten adres wyslemy potwierdzenie rozmowy.')
      return
    }

    if (!isPhoneValid(phone.trim())) {
      setError('Podaj numer telefonu w poprawnym formacie. Wystarczy co najmniej 9 cyfr.')
      return
    }

    if (description.trim().length < 20) {
      setError('Dodaj 2-4 konkretne zdania o problemie. To pomoze lepiej wykorzystac 15 minut rozmowy.')
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
        throw new Error(payload.error ?? 'Nie udalo sie zapisac rezerwacji. Sprawdz dane lub wybierz inny termin.')
      }

      router.push(`/payment?bookingId=${payload.bookingId}&access=${encodeURIComponent(payload.accessToken)}`)
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Wystapil blad formularza.'
      if (message.includes('nie jest juz dostepny')) {
        setError('Ten termin zostal wlasnie zajety. Wroc do listy terminow i wybierz inna godzine rozmowy.')
      } else {
        setError(message)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <form className="form-grid top-gap" onSubmit={handleSubmit}>
      <div>
        <label>Imie opiekuna</label>
        <input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} placeholder="np. Anna" />
      </div>

      <div>
        <label>Zwierze</label>
        <select value={animalType} onChange={(event) => setAnimalType(event.target.value as AnimalType)}>
          <option value="Pies">Pies</option>
          <option value="Kot">Kot</option>
        </select>
      </div>

      <div>
        <label>Wiek zwierzecia</label>
        <input value={petAge} onChange={(event) => setPetAge(event.target.value)} placeholder="np. 8 miesiecy lub 4 lata" />
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
        <label>Od kiedy trwa problem</label>
        <input
          value={durationNotes}
          onChange={(event) => setDurationNotes(event.target.value)}
          placeholder="np. od 3 tygodni"
        />
      </div>

      <div className="full-width">
        <label>Krotki opis sytuacji</label>
        <textarea
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Napisz, co sie dzieje, kiedy problem wystepuje i co jest dla Ciebie najtrudniejsze."
        />
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
          <div className="muted">Po zapisaniu danych termin zostanie chwilowo zablokowany na czas platnosci, zeby nikt nie przejal go przed Toba.</div>
          <div className="checkout-title">Nastepny krok: bezpieczna platnosc</div>
          <div className="muted">Kwota do oplacenia: {priceLabel}. Po oplaceniu od razu zobaczysz potwierdzenie, link do rozmowy audio i kolejne kroki.</div>
        </div>
        <div className="checkout-right">
          <button type="submit" className="button button-primary big-button" disabled={isSubmitting}>
            {isSubmitting ? 'Zapisuje dane...' : 'Zablokuj termin i przejdz do platnosci'}
          </button>
        </div>
      </div>
    </form>
  )
}
