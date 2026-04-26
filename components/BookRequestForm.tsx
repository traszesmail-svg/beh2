'use client'

import Link from 'next/link'
import { useMemo, useState, type FormEvent } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import type { BookingServiceType } from '@/lib/booking-services'
import type { BookingSpecies } from '@/lib/booking-routing'
import {
  PUBLIC_OFFER_PAYMENT_EMAIL_STEP,
  PUBLIC_OFFER_BOOKING_PRIORITY_NOTE,
  PUBLIC_OFFER_BOOKING_PRIORITY_PROMPT,
} from '@/lib/public-offer-copy'

type FormState = 'idle' | 'loading' | 'success' | 'error'

type BookRequestFormProps = {
  initialService: BookingServiceType
  initialSpecies: BookingSpecies | null
  entryService: BookingServiceType | null
}

type BookingRequestPayload = {
  service: BookingServiceType
  name: string
  email: string
  species: BookingSpecies
  description: string
  preferredSlots: string
  consentRodo: boolean
  consentRegulamin: boolean
  consentEarlyStart: boolean
  honeypot: string
}

const PRIMARY_SERVICE_OPTIONS: Array<{ value: Exclude<BookingServiceType, 'kwadrans-na-juz'>; label: string; price: string }> = [
  { value: 'szybka-konsultacja-15-min', label: 'Kwadrans z behawiorysta', price: '69 zl' },
  { value: 'konsultacja-30-min', label: 'Dwa kwadranse', price: '169 zl' },
  { value: 'konsultacja-behawioralna-online', label: 'Pelna konsultacja', price: '470 zl' },
]

const URGENT_SERVICE_OPTION = {
  value: 'kwadrans-na-juz' as const,
  label: 'Kwadrans na juz',
  price: '99 zl',
}

function getServiceOption(service: BookingServiceType) {
  if (service === 'kwadrans-na-juz') {
    return URGENT_SERVICE_OPTION
  }

  return PRIMARY_SERVICE_OPTIONS.find((option) => option.value === service) ?? PRIMARY_SERVICE_OPTIONS[0]
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeSingleLine(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function normalizeLongText(value: string) {
  return value.replace(/\r\n/g, '\n').trim()
}

function createInitialForm(initialService: BookingServiceType, initialSpecies: BookingSpecies | null): BookingRequestPayload {
  return {
    service: initialService,
    name: '',
    email: '',
    species: initialSpecies ?? 'pies',
    description: '',
    preferredSlots: '',
    consentRodo: false,
    consentRegulamin: false,
    consentEarlyStart: false,
    honeypot: '',
  }
}

function getSelectedServiceIntro(service: BookingServiceType) {
  const option = getServiceOption(service)

  switch (service) {
    case 'konsultacja-30-min':
      return {
        title: `Wybrany format: ${option.label} / ${option.price}.`,
        copy: '30 minut online daje wiecej miejsca na dwa-trzy watki i spokojniejsze uporzadkowanie sytuacji niz sam Kwadrans.',
      }
    case 'konsultacja-behawioralna-online':
      return {
        title: `Wybrany format: ${option.label} / ${option.price}.`,
        copy: 'To osobny format 60 minut z diagnoza sytuacji, planem poprawy i 7 dniami konsultacji tekstowych przez WhatsApp.',
      }
    case 'kwadrans-na-juz':
      return {
        title: `Wybrany format: ${option.label} / ${option.price}.`,
        copy: 'To ten sam 15-minutowy format co zwykly Kwadrans, tylko z priorytetem i szybszym potwierdzeniem terminu.',
      }
    case 'szybka-konsultacja-15-min':
    default:
      return {
        title: `Wybrany format: ${option.label} / ${option.price}.`,
        copy: 'To najprostszy start, gdy chcesz nazwac problem, ustalic priorytet i wiedziec, co robic dalej.',
      }
  }
}

export function BookRequestForm({ initialService, initialSpecies, entryService }: BookRequestFormProps) {
  const [form, setForm] = useState<BookingRequestPayload>(() => createInitialForm(initialService, initialSpecies))
  const [status, setStatus] = useState<FormState>('idle')
  const [feedback, setFeedback] = useState('')
  const selectedService = useMemo(() => getServiceOption(form.service), [form.service])
  const selectedServiceIntro = useMemo(() => getSelectedServiceIntro(form.service), [form.service])
  const entryServiceOption = entryService ? getServiceOption(entryService) : null
  const isUrgentNow = form.service === 'kwadrans-na-juz'
  const showPriorityPrompt = form.service === 'szybka-konsultacja-15-min'
  const showEntryServiceBox = entryServiceOption !== null && entryService !== 'kwadrans-na-juz' && form.service !== entryService
  const showServiceChangeLegend = entryServiceOption !== null || isUrgentNow

  function updateField<K extends keyof BookingRequestPayload>(key: K, value: BookingRequestPayload[K]) {
    if (status !== 'idle') {
      setStatus('idle')
      setFeedback('')
    }

    setForm((current) => ({ ...current, [key]: value }))
  }

  function validate() {
    const name = normalizeSingleLine(form.name)
    const email = normalizeSingleLine(form.email)
    const description = normalizeLongText(form.description)
    const preferredSlots = normalizeLongText(form.preferredSlots)

    if (!name) {
      return 'Podaj imie.'
    }

    if (!email || !isEmailValid(email)) {
      return 'Podaj poprawny adres e-mail.'
    }

    if (description.length < 20 || description.length > 1000) {
      return 'Opis sytuacji powinien miec od 20 do 1000 znakow.'
    }

    if (!isUrgentNow && !preferredSlots) {
      return 'Podaj co najmniej jeden preferowany termin.'
    }

    if (!form.consentRodo || !form.consentRegulamin || !form.consentEarlyStart) {
      return 'Zaznacz wszystkie wymagane zgody.'
    }

    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationError = validate()

    if (validationError) {
      setStatus('error')
      setFeedback(validationError)
      return
    }

    setStatus('loading')
    setFeedback('')

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: form.service,
          name: normalizeSingleLine(form.name),
          email: normalizeSingleLine(form.email),
          species: form.species,
          description: normalizeLongText(form.description),
          preferredSlots: isUrgentNow
            ? 'Chce termin jak najszybciej - prosze o kontakt w ciagu 15 minut.'
            : normalizeLongText(form.preferredSlots),
          consentRodo: form.consentRodo,
          consentRegulamin: form.consentRegulamin,
          consentEarlyStart: form.consentEarlyStart,
          honeypot: form.honeypot.trim(),
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; error?: string; message?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udalo sie wyslac prosby o rezerwacje.')
      }

      setStatus('success')
      setFeedback(payload.message ?? 'Dostalem Twoja rezerwacje. Sprawdz skrzynke - wyslalem kopie.')
      trackAnalyticsEvent('booking_form_submitted', {
        service_key: form.service,
        species: form.species,
      })
      setForm(createInitialForm(form.service, form.species))
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Nie udalo sie wyslac prosby o rezerwacje.')
    }
  }

  if (status === 'success') {
    return (
      <div className="contact-form-card top-gap" role="status">
        <div className="notatnik-mono notatnik-kicker-spaced">Rezerwacja przyjeta</div>
        <h2>{isUrgentNow ? 'Dostalem Twoja prosbe o Kwadrans na juz.' : 'Dostalem Twoja rezerwacje.'}</h2>
        <p>
          {isUrgentNow
            ? 'Twoja prosba o Kwadrans na juz dotarla. Odpisze w ciagu 15 minut z terminem i dalszym krokiem platnosci. Sprawdz skrzynke - wyslalem Ci kopie.'
            : 'W ciagu kilku godzin, miedzy 9 a 21, odezwe sie z potwierdzeniem terminu i dalszym krokiem platnosci. Sprawdz skrzynke - wyslalem Ci kopie.'}
        </p>
        <div className="notatnik-steps top-gap-small">
          <article className="notatnik-step">
            <div className="notatnik-step-number">01</div>
            <p>{isUrgentNow ? 'Wracam z szybka odpowiedzia i pierwsza wolna chwila na dzis.' : 'Potwierdzam jeden z terminow albo odsylam najblizsza alternatywe.'}</p>
          </article>
          <article className="notatnik-step">
            <div className="notatnik-step-number">02</div>
            <p>{PUBLIC_OFFER_PAYMENT_EMAIL_STEP}</p>
          </article>
          <article className="notatnik-step">
            <div className="notatnik-step-number">03</div>
            <p>Po wplacie potwierdzam rezerwacje i odsylam link do rozmowy.</p>
          </article>
        </div>
        <div className="notatnik-subhero-actions top-gap-small">
          <Link href="/" prefetch={false} className="notatnik-btn">
            Wroc na strone glowna
          </Link>
          <button type="button" className="notatnik-btn notatnik-btn-ghost" onClick={() => setStatus('idle')}>
            Wyslij kolejna prosbe
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      className="form-grid top-gap"
      onSubmit={handleSubmit}
      noValidate
      data-analytics-form="booking"
      data-analytics-form-start-event="booking_form_started"
      data-analytics-service={form.service}
      data-analytics-species={form.species}
    >
      <div className="info-box full-width contact-form-intro">
        <strong>{selectedServiceIntro.title}</strong> {selectedServiceIntro.copy}
      </div>

      {showEntryServiceBox && entryServiceOption ? (
        <div className="info-box full-width">
          <strong>Ten formularz otworzyl sie z usluga: {entryServiceOption.label}.</strong> Nizej wybrales juz inny format, wiec po wyslaniu prosby zapisze sie aktualny wybor.
        </div>
      ) : null}

      {isUrgentNow ? (
        <div className="info-box full-width">
          <strong>
            Wybrany tryb: {URGENT_SERVICE_OPTION.label} / {URGENT_SERVICE_OPTION.price}.
          </strong>{' '}
          To ten sam 15-minutowy format co zwykly Kwadrans, ale z priorytetem i szybszym terminem.{' '}
          <button
            type="button"
            className="notatnik-inline-link"
            onClick={() => updateField('service', 'szybka-konsultacja-15-min')}
          >
            Wroc do zwyklego Kwadransu
          </button>
        </div>
      ) : null}

      <fieldset className="full-width form-field consent-stack">
        <legend className="field-legend">
          {showServiceChangeLegend ? 'Zmien usluge, jesli potrzebujesz innego formatu' : 'Wybierz usluge'}
        </legend>
        {PRIMARY_SERVICE_OPTIONS.map((option) => (
          <label key={option.value} className="checkbox-card" htmlFor={`service-${option.value}`}>
            <input
              id={`service-${option.value}`}
              type="radio"
              name="service"
              checked={form.service === option.value}
              onChange={() => updateField('service', option.value)}
            />
            <span>
              {option.label} / {option.price}
            </span>
          </label>
        ))}
        {isUrgentNow ? (
          <label className="checkbox-card" htmlFor="service-kwadrans-na-juz">
            <input
              id="service-kwadrans-na-juz"
              type="radio"
              name="service"
              checked
              onChange={() => updateField('service', 'kwadrans-na-juz')}
            />
            <span>
              {URGENT_SERVICE_OPTION.label} / {URGENT_SERVICE_OPTION.price} — szybki termin
            </span>
          </label>
        ) : null}
      </fieldset>

      {showPriorityPrompt ? (
        <div className="info-box full-width">
          <strong>Chcesz szybciej?</strong> {PUBLIC_OFFER_BOOKING_PRIORITY_PROMPT}{' '}
          <button
            type="button"
            className="notatnik-inline-link"
            onClick={() => updateField('service', 'kwadrans-na-juz')}
          >
            Przejdz do Kwadransu na juz
          </button>
          <div className="field-help top-gap-small">{PUBLIC_OFFER_BOOKING_PRIORITY_NOTE}</div>
        </div>
      ) : null}

      <div className="form-field">
        <label htmlFor="book-name">Imie</label>
        <input
          id="book-name"
          name="name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          autoComplete="name"
          placeholder="np. Anna"
        />
      </div>

      <div className="form-field">
        <label htmlFor="book-email">E-mail</label>
        <input
          id="book-email"
          name="email"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          autoComplete="email"
          inputMode="email"
          placeholder="np. anna@email.pl"
        />
      </div>

      <fieldset className="full-width form-field consent-stack">
        <legend className="field-legend">Gatunek</legend>
        <label className="checkbox-card" htmlFor="species-pies">
          <input
            id="species-pies"
            type="radio"
            name="species"
            checked={form.species === 'pies'}
            onChange={() => updateField('species', 'pies')}
          />
          <span>Pies</span>
        </label>
        <label className="checkbox-card" htmlFor="species-kot">
          <input
            id="species-kot"
            type="radio"
            name="species"
            checked={form.species === 'kot'}
            onChange={() => updateField('species', 'kot')}
          />
          <span>Kot</span>
        </label>
      </fieldset>

      <div className="full-width form-field">
        <label htmlFor="book-description">Krotki opis sytuacji</label>
        <textarea
          id="book-description"
          name="description"
          rows={5}
          value={form.description}
          onChange={(event) => updateField('description', event.target.value.slice(0, 1000))}
          placeholder="Napisz, co dzieje sie teraz, od kiedy trwa problem i co najbardziej chcesz uporzadkowac."
        />
        <div className="field-help">{form.description.length}/1000 znakow</div>
      </div>

      <div className="full-width form-field">
        <label htmlFor="book-preferred-slots">3 preferowane terminy</label>
        {isUrgentNow ? (
          <div className="info-box">Chce termin jak najszybciej - prosze o kontakt w ciagu 15 minut.</div>
        ) : (
          <textarea
            id="book-preferred-slots"
            name="preferredSlots"
            rows={4}
            value={form.preferredSlots}
            onChange={(event) => updateField('preferredSlots', event.target.value)}
            placeholder="np. wtorek 18:00, sroda 10:00, piatek 15:00"
          />
        )}
      </div>

      <fieldset className="full-width form-field consent-stack">
        <legend className="field-legend">Wymagane zgody</legend>
        <label className="checkbox-card" htmlFor="book-consent-rodo">
          <input
            id="book-consent-rodo"
            type="checkbox"
            checked={form.consentRodo}
            onChange={(event) => updateField('consentRodo', event.target.checked)}
            required
          />
          <span>Wyrazam zgode na przetwarzanie danych osobowych w celu obslugi rezerwacji.</span>
        </label>

        <label className="checkbox-card" htmlFor="book-consent-regulamin">
          <input
            id="book-consent-regulamin"
            type="checkbox"
            checked={form.consentRegulamin}
            onChange={(event) => updateField('consentRegulamin', event.target.checked)}
            required
          />
          <span>
            Zapoznalem/am sie z{' '}
            <Link href="/regulamin" prefetch={false}>
              regulaminem
            </Link>{' '}
            oraz{' '}
            <Link href="/regulamin-pelna-konsultacja" prefetch={false}>
              regulaminem Pelnej konsultacji
            </Link>{' '}
            i akceptuje warunki.
          </span>
        </label>

        <label className="checkbox-card" htmlFor="book-consent-early-start">
          <input
            id="book-consent-early-start"
            type="checkbox"
            checked={form.consentEarlyStart}
            onChange={(event) => updateField('consentEarlyStart', event.target.checked)}
            required
          />
          <span>
            Wyrazam zgode na rozpoczecie swiadczenia uslugi przed uplywem 14 dni i przyjmuje do wiadomosci, ze po
            wykonaniu konsultacji trace prawo odstapienia od umowy.
          </span>
        </label>
      </fieldset>

      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        <label htmlFor="book-company">Firma</label>
        <input
          id="book-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={(event) => updateField('honeypot', event.target.value)}
        />
      </div>

      {feedback ? (
        <div className={`info-box full-width ${status === 'error' ? 'error-box' : ''}`} role="status">
          {feedback}
        </div>
      ) : null}

      <div className="full-width">
        <button type="submit" className="button button-primary big-button" disabled={status === 'loading'}>
          {status === 'loading' ? `Wysylam prosbe o ${selectedService.label.toLowerCase()}...` : 'Wyslij prosbe o rezerwacje'}
        </button>
      </div>
    </form>
  )
}
