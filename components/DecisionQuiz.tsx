'use client'

import Link from 'next/link'
import { useMemo, useState, type FormEvent } from 'react'
import { trackAnalyticsEvent } from '@/lib/analytics'
import {
  QUIZ_QUESTIONS,
  QUIZ_SERVICE_LABELS,
  resolveQuizResult,
  type QuizAnswers,
  type QuizServiceKey,
} from '@/lib/quiz'
import { NotificationOptIn } from '@/components/NotificationOptIn'

type DecisionQuizProps = {
  bookingHrefs: Record<QuizServiceKey, string>
}

function isEmailValid(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function DecisionQuiz({ bookingHrefs }: DecisionQuizProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>({})
  const [showResult, setShowResult] = useState(false)
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [emailFeedback, setEmailFeedback] = useState('')

  const currentQuestion = QUIZ_QUESTIONS[stepIndex]
  const result = useMemo(() => resolveQuizResult(answers), [answers])
  const resultMeta = QUIZ_SERVICE_LABELS[result.serviceKey]
  const species = answers.species === 'kot' ? 'kot' : answers.species === 'pies' ? 'pies' : 'oba'

  function chooseAnswer(questionId: string, optionId: string) {
    const nextAnswers = { ...answers, [questionId]: optionId }
    setAnswers(nextAnswers)

    trackAnalyticsEvent('topic_selected', {
      location: 'quiz',
      question: questionId,
      answer: optionId,
    })

    if (stepIndex >= QUIZ_QUESTIONS.length - 1) {
      setShowResult(true)
      trackAnalyticsEvent('quiz_completed', {
        location: 'quiz',
        result: resolveQuizResult(nextAnswers).serviceKey,
        species: nextAnswers.species ?? 'unknown',
      })
      return
    }

    setStepIndex((current) => current + 1)
  }

  function goBack() {
    if (showResult) {
      setShowResult(false)
      setStepIndex(QUIZ_QUESTIONS.length - 1)
      return
    }

    setStepIndex((current) => Math.max(current - 1, 0))
  }

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isEmailValid(email.trim())) {
      setEmailStatus('error')
      setEmailFeedback('Podaj poprawny adres e-mail.')
      return
    }

    setEmailStatus('loading')
    setEmailFeedback('')

    try {
      const response = await fetch('/api/growth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'newsletter',
          email: email.trim(),
          segment: species,
          location: 'quiz-result',
          sourcePage: '/quiz',
        }),
      })

      const payload = (await response.json()) as { ok?: boolean; error?: string; message?: string }

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? 'Nie udało się zapisać adresu.')
      }

      trackAnalyticsEvent('newsletter_signup', {
        location: 'quiz-result',
        segment: species,
        quiz_result: result.serviceKey,
      })

      setEmail('')
      setEmailStatus('success')
      setEmailFeedback(payload.message ?? 'Zapis przyjęty.')
    } catch (error) {
      setEmailStatus('error')
      setEmailFeedback(error instanceof Error ? error.message : 'Nie udało się zapisać adresu.')
    }
  }

  if (!currentQuestion) {
    return null
  }

  if (showResult) {
    return (
      <div className="decision-quiz decision-quiz-result">
        <article className="summary-card tree-backed-card decision-quiz-result-card">
          <div className="section-eyebrow">Najrozsądniejszy pierwszy krok</div>
          <h2>{result.title}</h2>
          <p>{result.summary}</p>

          <div className="decision-quiz-result-price" aria-label="Sugerowana rozmowa">
            <span>{resultMeta.label}</span>
            <strong>{resultMeta.price}</strong>
            <small>{resultMeta.duration}</small>
          </div>

          <ul className="decision-quiz-reasons">
            {result.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>

          <p className="field-help">{result.note}</p>

          <div className="decision-quiz-material-path">
            <strong>{result.materialTitle}</strong>
            <span>{result.materialCopy}</span>
          </div>

          <div className="hero-actions top-gap-small">
            <Link href={result.materialHref} prefetch={false} className="button button-ghost">
              Zobacz materiały
            </Link>
            <Link
              href={bookingHrefs[result.serviceKey]}
              prefetch={false}
              className="button button-primary big-button"
              onClick={() =>
                trackAnalyticsEvent('cta_click', {
                  location: 'quiz-result',
                  service: result.serviceKey,
                })
              }
            >
              Pokaż mi, od czego zacząć
            </Link>
            <button type="button" className="button button-ghost" onClick={goBack}>
              Zmień odpowiedzi
            </button>
          </div>
        </article>

        <div className="decision-quiz-followups">
          <article className="summary-card tree-backed-card">
            <div className="section-eyebrow">Zachowaj wynik</div>
            <h3>Raz w miesiącu spokojna porcja wiedzy.</h3>
            <p className="muted">
              Bez spamu, bez codziennych maili. Możesz wypisać się jednym kliknięciem.
            </p>
            <form className="form-grid top-gap-small compact-form-grid" onSubmit={submitEmail} noValidate>
              <div className="form-field">
                <label htmlFor="quiz-email">E-mail</label>
                <input
                  id="quiz-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder="twoj@email.pl"
                />
              </div>
              <div className="full-width hero-actions">
                <button type="submit" className="button button-ghost" disabled={emailStatus === 'loading'}>
                  {emailStatus === 'loading' ? 'Zapisuje...' : 'Zapisz wynik w newsletterze'}
                </button>
              </div>
              {emailFeedback ? (
                <div className={`full-width info-box ${emailStatus === 'error' ? 'error-box' : ''}`}>
                  <strong>{emailStatus === 'success' ? 'Gotowe' : 'Uwaga'}</strong>
                  <span>{emailFeedback}</span>
                </div>
              ) : null}
            </form>
          </article>

          <NotificationOptIn
            sourcePage="/quiz"
            location="quiz-result"
            context={`quiz:${result.serviceKey}`}
            recommendedService={resultMeta.label}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="decision-quiz">
      <div className="decision-quiz-progress" aria-label="Postęp quizu">
        <span>
          {stepIndex + 1}/{QUIZ_QUESTIONS.length}
        </span>
        <div>
          <i style={{ width: `${((stepIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
        </div>
      </div>

      <article className="summary-card tree-backed-card decision-quiz-card">
        <div className="section-eyebrow">Quiz</div>
        <h2>{currentQuestion.title}</h2>
        {currentQuestion.helper ? <p className="muted">{currentQuestion.helper}</p> : null}

        <div className="decision-quiz-options" role="list">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="decision-quiz-option"
              onClick={() => chooseAnswer(currentQuestion.id, option.id)}
            >
              <strong>{option.label}</strong>
              {option.helper ? <span>{option.helper}</span> : null}
            </button>
          ))}
        </div>

        {stepIndex > 0 ? (
          <button type="button" className="button button-ghost decision-quiz-back" onClick={goBack}>
            Wróć
          </button>
        ) : null}
      </article>
    </div>
  )
}
