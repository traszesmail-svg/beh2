import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, Cat, Clock3, CreditCard, Dog, Headphones, PawPrint } from 'lucide-react'
import { NotatnikFooter, NotatnikSideVisuals, NotatnikTopbar, PUBLIC_BOOKING_FLOW_NAV_ITEMS } from '@/components/NotatnikA'
import {
  readBookingSpeciesSearchParam,
  readProblemTypeSearchParam,
  readQaBookingSearchParam,
  readSearchParam,
} from '@/lib/booking-routing'
import { getProblemLabel, getProblemSpecies } from '@/lib/data'
import { FUNNEL_SERVICE_CONFIG, getProblemOptionsForSpecies, type FunnelSpecies } from '@/lib/funnel'
import { buildMarketingMetadata } from '@/lib/seo'
import { buildTodayUrgentSlotCandidates } from '@/lib/urgent-now'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = buildMarketingMetadata({
  title: 'Kwadrans na już',
  path: '/kwadrans-na-juz',
  description: 'Pilny Kwadrans: wybierz temat i jeden z najbliższych terminów na dziś, a potem przejdź normalnie do danych i płatności.',
})

function buildKwadransHref(params: { species?: FunnelSpecies | null; problem?: string | null; error?: string | null }) {
  const searchParams = new URLSearchParams()

  if (params.species) searchParams.set('species', params.species)
  if (params.problem) searchParams.set('problem', params.problem)
  if (params.error) searchParams.set('error', params.error)

  const query = searchParams.toString()
  return query ? `/kwadrans-na-juz?${query}` : '/kwadrans-na-juz'
}

function buildStartHref(params: { date: string; time: string; species: FunnelSpecies; problem: string; qaBooking: boolean }) {
  const searchParams = new URLSearchParams({
    date: params.date,
    time: params.time,
    species: params.species,
    problem: params.problem,
  })

  if (params.qaBooking) {
    searchParams.set('qa', '1')
  }

  return `/kwadrans-na-juz/start?${searchParams.toString()}`
}

function getErrorCopy(error: string | null) {
  switch (error) {
    case 'expired':
      return 'Ten pilny termin właśnie przestał być dostępny. Wybierz aktualną godzinę z listy.'
    case 'unavailable':
      return 'Ten termin został już zablokowany lub zarezerwowany. Wybierz inną godzinę.'
    case 'topic':
      return 'Wybierz gatunek i najbliższy temat, żeby przejść dalej.'
    default:
      return null
  }
}

export default function KwadransNaJuzPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>
}) {
  const querySpecies = readBookingSpeciesSearchParam(searchParams?.species)
  const queryProblem = readProblemTypeSearchParam(searchParams?.problem)
  const selectedSpecies = queryProblem ? getProblemSpecies(queryProblem) : querySpecies
  const selectedProblem = queryProblem && (!querySpecies || querySpecies === getProblemSpecies(queryProblem)) ? queryProblem : null
  const topicOptions = selectedSpecies ? getProblemOptionsForSpecies(selectedSpecies) : []
  const urgentSlots = buildTodayUrgentSlotCandidates()
  const qaBooking = readQaBookingSearchParam(searchParams?.qa)
  const errorCopy = getErrorCopy(readSearchParam(searchParams?.error))
  const service = FUNNEL_SERVICE_CONFIG['kwadrans-na-juz']

  return (
    <main className="notatnik-page urgent-now-page">
      <NotatnikSideVisuals variant="booking" />
      <div className="notatnik-shell urgent-now-shell">
        <NotatnikTopbar
          tag="Kwadrans na już"
          navItems={PUBLIC_BOOKING_FLOW_NAV_ITEMS}
          ctaHref="/wybor"
          ctaLabel="Nie wiem, co wybrać"
          ctaVariant="ghost"
        />

        <section className="urgent-now-hero">
          <div>
            <span className="notatnik-mono notatnik-kicker-spaced">Pilny termin dzisiaj</span>
            <h1>Kwadrans na już: wybierz najbliższą godzinę.</h1>
            <p>
              To krótka, 15-minutowa rozmowa audio za {service.priceLabel}. Wybierasz temat i jeden z
              najbliższych terminów na dziś, potem przechodzisz tym samym torem co zwykła rezerwacja.
            </p>
          </div>
          <div className="urgent-now-hero-facts" aria-label="Jak działa Kwadrans na już">
            <article>
              <Clock3 size={24} strokeWidth={1.8} aria-hidden="true" />
              <span>5 najbliższych okien co 30 minut</span>
            </article>
            <article>
              <CalendarDays size={24} strokeWidth={1.8} aria-hidden="true" />
              <span>Tylko bieżący dzień</span>
            </article>
            <article>
              <CreditCard size={24} strokeWidth={1.8} aria-hidden="true" />
              <span>Po formularzu od razu płatność</span>
            </article>
            <article>
              <Headphones size={24} strokeWidth={1.8} aria-hidden="true" />
              <span>Potem zwykły pokój rozmowy</span>
            </article>
          </div>
        </section>

        <section className="urgent-now-panel" aria-labelledby="urgent-now-title">
          <div className="urgent-now-head">
            <span>{service.priceLabel} / {service.durationLabel} / audio</span>
            <h2 id="urgent-now-title">Wybierz temat i godzinę rozmowy</h2>
            <p>
              Terminy są tylko na dziś, od najbliższego sensownego okna do 18:00. Jeśli wybierzesz godzinę,
              system założy slot i przeniesie Cię do krótkiego formularza danych.
            </p>
          </div>

          {errorCopy ? <div className="urgent-now-feedback is-error">{errorCopy}</div> : null}

          <div className="urgent-now-step">
            <div className="urgent-now-step-head">
              <strong>1. Gatunek</strong>
              <span>{selectedSpecies ? (selectedSpecies === 'pies' ? 'Pies' : 'Kot') : 'Wybierz'}</span>
            </div>
            <div className="urgent-now-choice-row">
              {(['pies', 'kot'] as const).map((species) => {
                const selected = selectedSpecies === species
                const Icon = species === 'pies' ? Dog : Cat

                return (
                  <Link
                    key={species}
                    href={buildKwadransHref({ species })}
                    prefetch={false}
                    className={selected ? 'is-selected' : ''}
                    aria-current={selected ? 'step' : undefined}
                  >
                    <Icon size={18} strokeWidth={1.9} aria-hidden="true" />
                    {species === 'pies' ? 'Pies' : 'Kot'}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="urgent-now-step">
            <div className="urgent-now-step-head">
              <strong>2. Najbliższy temat</strong>
              <span>{selectedProblem ? getProblemLabel(selectedProblem) : selectedSpecies ? 'Wybierz' : 'Najpierw gatunek'}</span>
            </div>
            {selectedSpecies ? (
              <div className="urgent-now-topic-grid">
                {topicOptions.map((option) => {
                  const selected = selectedProblem === option.id

                  return (
                    <Link
                      key={option.id}
                      href={buildKwadransHref({ species: selectedSpecies, problem: option.id })}
                      prefetch={false}
                      className={selected ? 'is-selected' : ''}
                      aria-current={selected ? 'step' : undefined}
                    >
                      <PawPrint size={18} strokeWidth={1.8} aria-hidden="true" />
                      <span>
                        <strong>{option.title}</strong>
                        <small>{option.desc}</small>
                      </span>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="urgent-now-feedback">Wybierz psa albo kota, żeby zobaczyć tematy.</div>
            )}
          </div>

          <div className="urgent-now-step urgent-now-slots" aria-label="Godziny do wyboru na dziś">
            <div className="urgent-now-slot-header">
              <strong>3. Godzina na dziś</strong>
              <span>{urgentSlots.length}/5 dostępnych do 18:00</span>
            </div>
            {urgentSlots.length > 0 ? (
              <div className="urgent-now-slot-grid">
                {urgentSlots.map((slot) => {
                  const href =
                    selectedSpecies && selectedProblem
                      ? buildStartHref({
                          date: slot.date,
                          time: slot.time,
                          species: selectedSpecies,
                          problem: selectedProblem,
                          qaBooking,
                        })
                      : null

                  return href ? (
                    <Link key={slot.id} href={href} prefetch={false} className="urgent-now-slot-link">
                      {slot.time}
                    </Link>
                  ) : (
                    <span key={slot.id} className="urgent-now-slot-link is-disabled" aria-disabled="true">
                      {slot.time}
                    </span>
                  )
                })}
              </div>
            ) : (
              <div className="urgent-now-feedback is-error">
                Na dziś nie ma już półgodzinnych okien do 18:00. Wróć jutro albo napisz przez kontakt.
              </div>
            )}
            {urgentSlots.length > 0 && urgentSlots.length < 5 ? (
              <small>Dziś zostało mniej niż 5 okien, więc pokazuję tylko realnie dostępne godziny.</small>
            ) : (
              <small>Po kliknięciu godziny przejdziesz do danych rezerwacji i płatności.</small>
            )}
          </div>
        </section>

        <section className="urgent-now-flow-note">
          <h2>Co dzieje się dalej?</h2>
          <ol>
            <li>Wybierasz gatunek, temat i godzinę na dziś.</li>
            <li>Uzupełniasz krótkie dane w standardowym formularzu rezerwacji.</li>
            <li>Przechodzisz do płatności za Kwadrans na już.</li>
            <li>Po płatności dostajesz potwierdzenie i link do pokoju rozmowy.</li>
          </ol>
          <Link href="/cennik" prefetch={false}>
            Zobacz pozostałe formaty rozmowy
          </Link>
        </section>

        <NotatnikFooter primaryHref="/wybor" primaryLabel="Wróć do wyboru" />
      </div>
    </main>
  )
}
