'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  homepageAnimalQuestion,
  homepageProblemOptionsByAnimal,
  homepageSelectorRecommendations,
  homepageUrgencyQuestion,
  resolveHomepageSelectorRecommendation,
  type HomepageSelectorAnswers,
  type HomepageSelectorAnimal,
  type HomepageSelectorOption,
  type HomepageSelectorQuestion,
  type HomepageSelectorQuestionId,
  type HomepageSelectorRecommendationKey,
} from '@/lib/homepage-data'

const problemToBookingProblem: Record<string, string> = {
  dog_walk: 'spacer',
  dog_separation: 'separacja',
  puppy: 'szczeniak',
  dog_aggression: 'agresja',
  dog_barking_arousal: 'pobudzenie',
  dog_other: 'inne',
  cat_litter: 'kot-kuweta',
  cat_stress: 'kot-wycofanie',
  cat_conflict: 'kot-konflikt',
  cat_vocalization: 'kot-wokalizacja',
  cat_change: 'kot-zmiany-w-domu',
  cat_other: 'inne',
}

function getAnimal(value: string | undefined): HomepageSelectorAnimal | null {
  if (value === 'dog' || value === 'cat') {
    return value
  }

  return null
}

function buildSelectorHref(answers: HomepageSelectorAnswers, resultKey: HomepageSelectorRecommendationKey) {
  const recommendation = homepageSelectorRecommendations[resultKey]
  const problem = answers.problem ? problemToBookingProblem[answers.problem] ?? 'inne' : null
  const params = new URLSearchParams()

  params.set('service', recommendation.service)

  if (problem) {
    params.set('problem', problem)
  }

  return `/termin?${params.toString()}`
}

function buildProblemQuestion(animal: HomepageSelectorAnimal | null): HomepageSelectorQuestion {
  const isCat = animal === 'cat'

  return {
    id: 'problem',
    label: '2',
    title: 'Co jest najbliżej problemu?',
    helper: isCat ? 'Wybierz najbliższy koci temat.' : 'Wybierz najbliższy psi temat.',
    options: homepageProblemOptionsByAnimal[animal ?? 'dog'],
  }
}

function QuestionOptions({
  question,
  selectedValue,
  onSelect,
}: {
  question: HomepageSelectorQuestion
  selectedValue?: string
  onSelect: (questionId: HomepageSelectorQuestionId, option: HomepageSelectorOption) => void
}) {
  return (
    <div className="selector-options">
      {question.options.map((option) => {
        const selected = selectedValue === option.id

        return (
          <button
            key={option.id}
            type="button"
            className={`selector-option${selected ? ' is-selected' : ''}`}
            aria-pressed={selected}
            onClick={() => onSelect(question.id, option)}
          >
            <strong>{option.label}</strong>
            {option.helper ? <small>{option.helper}</small> : null}
          </button>
        )
      })}
    </div>
  )
}

const heroChoices = [
  {
    id: 'dog',
    title: 'Mam psa',
    copy: 'Spacery, lęk, reaktywność, szczeniak i inne problemy.',
    href: '/wybor?animal=dog',
  },
  {
    id: 'cat',
    title: 'Mam kota',
    copy: 'Kuweta, stres, konflikt, zmiany w domu i sen.',
    href: '/wybor?animal=cat',
  },
  {
    id: 'unknown',
    title: 'Nie wiem, od czego zacząć',
    copy: 'Materiały, wiadomość albo quiz - wybierz spokojny start.',
    href: '/od-czego-zaczac',
  },
] as const

const heroChoiceDisplay: Record<(typeof heroChoices)[number]['id'], { title: string; copy: string }> = {
  dog: {
    title: 'Mam psa',
    copy: 'Spacery, lęki, reakcje, szczeniak i inne problemy.',
  },
  cat: {
    title: 'Mam kota',
    copy: 'Kuweta, stres, konflikty, zmiany w domu i inne.',
  },
  unknown: {
    title: 'Nie wiem, od czego zacząć',
    copy: 'Odpowiedz na kilka pytań, podpowiem najlepszy krok.',
  },
}

function RouterChoiceIcon({ choiceId }: { choiceId: (typeof heroChoices)[number]['id'] }) {
  if (choiceId === 'dog') {
    return (
      <Image
        className="router-choice-silhouette router-choice-silhouette-dog"
        src="/branding/homepage/choice-dog-clean.png"
        alt=""
        width={438}
        height={384}
      />
    )
  }

  if (choiceId === 'cat') {
    return (
      <Image
        className="router-choice-silhouette router-choice-silhouette-cat"
        src="/branding/homepage/choice-cat-clean.png"
        alt=""
        width={404}
        height={466}
      />
    )
  }

  return (
    <Image
      className="router-choice-silhouette router-choice-silhouette-question"
      src="/branding/homepage/choice-question-clean.png"
      alt=""
      width={324}
      height={324}
    />
  )
}

type HomepageServiceSelectorProps = {
  mode?: 'home' | 'quiz'
  initialAnimal?: HomepageSelectorAnimal | null
}

export function HomepageServiceSelector({ mode = 'home', initialAnimal = null }: HomepageServiceSelectorProps) {
  const [answers, setAnswers] = useState<HomepageSelectorAnswers>(() => (initialAnimal ? { animal: initialAnimal } : {}))
  const [stepIndex, setStepIndex] = useState(() => (initialAnimal ? 1 : 0))
  const [completedSignature, setCompletedSignature] = useState('')
  const showHero = mode === 'home'

  const animal = getAnimal(answers.animal)
  const questions = useMemo(() => [homepageAnimalQuestion, buildProblemQuestion(animal), homepageUrgencyQuestion], [animal])
  const currentQuestion = questions[Math.min(stepIndex, questions.length - 1)]
  const problemQuestion = questions[1]
  const urgencyQuestion = questions[2]
  const answeredCount = questions.filter((question) => answers[question.id]).length
  const isComplete = questions.every((question) => answers[question.id])
  const resultKey = useMemo(() => resolveHomepageSelectorRecommendation(answers), [answers])
  const recommendation = homepageSelectorRecommendations[resultKey]
  const resultHref = buildSelectorHref(answers, resultKey)

  function chooseAnswer(questionId: HomepageSelectorQuestionId, option: HomepageSelectorOption) {
    const nextAnswers: HomepageSelectorAnswers =
      questionId === 'animal'
        ? { animal: option.id }
        : {
            ...answers,
            [questionId]: option.id,
          }
    const nextStep = questionId === 'urgency' ? stepIndex : Math.min(stepIndex + 1, questions.length - 1)
    const signature = questions.map((question) => nextAnswers[question.id] ?? '').join('|')

    setAnswers(nextAnswers)
    setStepIndex(nextStep)

    trackAnalyticsEvent('topic_selected', {
      location: 'home-router',
      question: questionId,
      answer: option.id,
    })

    if (questions.every((question) => nextAnswers[question.id]) && signature !== completedSignature) {
      setCompletedSignature(signature)
      trackAnalyticsEvent('quiz_completed', {
        location: 'home-router',
        result: resolveHomepageSelectorRecommendation(nextAnswers),
        animal: nextAnswers.animal ?? 'unknown',
      })
    }
  }

  function goBack() {
    setStepIndex((current) => Math.max(0, current - 1))
  }

  return (
    <div className={`homepage-router${showHero ? '' : ' homepage-router-quiz'}`} id="wybor">
      {showHero ? (
        <>
      <div className="router-hero-stage">
        <header className="router-hero-copy">
          <h1 className="router-reference-title">Z czym potrzebujesz pomocy u psa lub kota?</h1>
          <p className="router-reference-copy">Wybierz zwierzę albo odpowiedz na kilka krótkich pytań - podpowiem najlepszy pierwszy krok.</p>
          <div className="router-choice-grid" aria-label="Wybierz kierunek">
            {heroChoices.map((choice) => {
              return (
                <Link
                  key={choice.id}
                  href={choice.href}
                  prefetch={false}
                  className="router-choice-card"
                  onClick={() =>
                    trackAnalyticsEvent('cta_click', {
                      location: 'home-router-choice',
                      choice: choice.id,
                    })
                  }
                >
                  <span className="router-choice-icon" aria-hidden="true">
                    <RouterChoiceIcon choiceId={choice.id} />
                  </span>
                  <strong>{heroChoiceDisplay[choice.id].title}</strong>
                  <span>{heroChoiceDisplay[choice.id].copy}</span>
                  <ArrowRight className="router-choice-arrow" size={18} strokeWidth={1.8} aria-hidden="true" />
                </Link>
              )
            })}
          </div>
        </header>
      </div>
      <section className="home-guided-selector" aria-labelledby="home-guided-selector-title">
        <div className="home-guided-copy">
          <h2 id="home-guided-selector-title">Nie wiesz, co wybrać? Przejdź przez krótki wybór</h2>
        </div>
        <div className="home-guided-grid">
          <article className="home-guided-step">
            <div className="home-guided-step-head">
              <span>1</span>
              <strong>Kogo dotyczy problem?</strong>
            </div>
            <div className="home-guided-animal-options">
              {homepageAnimalQuestion.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={answers.animal === option.id ? 'is-selected' : ''}
                  aria-pressed={answers.animal === option.id}
                  onClick={() => chooseAnswer('animal', option)}
                >
                  {option.id === 'dog' ? <RouterChoiceIcon choiceId="dog" /> : <RouterChoiceIcon choiceId="cat" />}
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </article>

          <article className="home-guided-step">
            <div className="home-guided-step-head">
              <span>2</span>
              <strong>Co jest najbliżej problemu?</strong>
            </div>
            <p>Wybierz temat z listy dopasowanej do Twojego zwierzęcia.</p>
            <label className="home-guided-select">
              <select
                value={answers.problem ?? ''}
                disabled={!animal}
                onChange={(event) => {
                  const option = problemQuestion.options.find((item) => item.id === event.target.value)
                  if (option) chooseAnswer('problem', option)
                }}
              >
                <option value="">Wybierz...</option>
                {problemQuestion.options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={17} strokeWidth={1.9} aria-hidden="true" />
            </label>
          </article>

          <article className="home-guided-step">
            <div className="home-guided-step-head">
              <span>3</span>
              <strong>Jak pilna jest sytuacja?</strong>
            </div>
            <div className="home-guided-urgency-options">
              {urgencyQuestion.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={answers.urgency === option.id ? 'is-selected' : ''}
                  aria-pressed={answers.urgency === option.id}
                  onClick={() => chooseAnswer('urgency', option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </article>

          <aside className="home-guided-result">
            <strong>Rekomendacja</strong>
            <p>
              {isComplete
                ? recommendation.summary
                : 'Odpowiedz na 3 pytania i podpowiem najlepszy pierwszy krok.'}
            </p>
            {isComplete ? (
              <Link href={resultHref} prefetch={false} className="notatnik-btn notatnik-btn-accent">
                <span>{recommendation.ctaLabel}</span>
              </Link>
            ) : (
              <button type="button" className="notatnik-btn notatnik-btn-accent" disabled>
                <span>Sprawdź rekomendację</span>
              </button>
            )}
          </aside>
        </div>
      </section>
        </>
      ) : null}

      {showHero ? null : (
      <div className="home-selector" aria-labelledby="home-selector-title">
        <div className="selector-shell-heading">
          <h2>Szybki wybór - znajdź najlepszy pierwszy krok</h2>
          <div className="selector-step-track" aria-label="Postęp wyboru">
            {questions.map((question, index) => {
              const active = index === stepIndex
              const complete = Boolean(answers[question.id])

              return (
                <button
                  key={question.id}
                  type="button"
                  className={`selector-step${active ? ' is-active' : ''}${complete ? ' is-complete' : ''}`}
                  onClick={() => setStepIndex(index)}
                >
                  <span>{question.label}</span>
                  {question.title}
                </button>
              )
            })}
            <span className={`selector-step selector-step-result${isComplete ? ' is-complete' : ''}`}>
              <span>4</span>
              Rekomendacja
            </span>
          </div>
        </div>
        <div className="selector-grid">
          <article className="selector-question">
            <div className="selector-question-header">
              <span aria-hidden="true">{currentQuestion.label}</span>
              <div>
                <p className="notatnik-mono">Krótki wybór {stepIndex + 1}/3</p>
                <h2 id="home-selector-title">{currentQuestion.title}</h2>
                <p>{currentQuestion.helper}</p>
              </div>
            </div>
            <QuestionOptions question={currentQuestion} selectedValue={answers[currentQuestion.id]} onSelect={chooseAnswer} />
            {stepIndex > 0 ? (
              <button type="button" className="selector-back-button" onClick={goBack}>
                <RotateCcw size={14} strokeWidth={1.8} aria-hidden="true" />
                Wróć do poprzedniego kroku
              </button>
            ) : null}
          </article>

          <aside className="selector-result" aria-live="polite">
            <span className="notatnik-mono">Rekomendacja</span>
            {isComplete ? (
              <>
                <h2>{recommendation.title}</h2>
                <p>{recommendation.summary}</p>
                <div className="selector-result-price" aria-label="Sugerowany format">
                  <strong>{recommendation.price}</strong>
                  <span>{recommendation.duration}</span>
                </div>
                <p className="selector-result-note">
                  To nie diagnoza. Wynik ma pomóc wybrać pierwszy krok, a nie zamykać temat.
                </p>
                <Link
                  href={resultHref}
                  prefetch={false}
                  className="notatnik-btn notatnik-btn-accent"
                  onClick={() =>
                    trackAnalyticsEvent('cta_click', {
                      location: 'home-router-result',
                      service: recommendation.service,
                    })
                  }
                >
                  <span>{recommendation.ctaLabel}</span>
                </Link>
              </>
            ) : (
              <>
                <h2>Odpowiedz na 3 pytania</h2>
                <p>
                  Odpowiedziano: {answeredCount}/3. Po ostatniej odpowiedzi zostanie jeden główny krok do kliknięcia.
                </p>
                <p className="selector-result-note">Jeśli nie wiesz, wybierz opcję inne albo najbliższy opis.</p>
                <button type="button" className="notatnik-btn notatnik-btn-accent selector-start-button" onClick={() => setStepIndex(0)}>
                  <span>Rozpocznij wybór</span>
                </button>
              </>
            )}
          </aside>
        </div>
      </div>
      )}
    </div>
  )
}
