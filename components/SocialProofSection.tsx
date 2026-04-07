import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AddTestimonialForm } from '@/components/AddTestimonialForm'
import { MEDIA_MENTIONS, REAL_CASE_STUDIES } from '@/lib/site'
import { TESTIMONIALS, getTestimonialIssueLabel } from '@/lib/testimonials'

function getInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function shouldRenderLocalPhoto(photoSrc?: string | null): photoSrc is string {
  return typeof photoSrc === 'string' && photoSrc.startsWith('/')
}

type SocialProofSectionProps = {
  showSubmissionForm?: boolean
}

export function SocialProofSection({ showSubmissionForm = true }: SocialProofSectionProps) {
  const hasTestimonials = TESTIMONIALS.length > 0

  return (
    <section className="panel section-panel" id="historie" aria-labelledby="historie-heading">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Opinie i realne przypadki</div>
          <h2 id="historie-heading">Historie opiekunów i efekty konsultacji</h2>
        </div>
        <div className="muted">
          Krótko pokazujemy punkt wyjścia, pierwszy krok i dalszą ścieżkę. Obok są publiczne źródła i zweryfikowane
          wpisy.
        </div>
      </div>

      <div className="summary-grid trust-grid top-gap">
        <div className="summary-card tree-backed-card">
          <div className="stat-label">Typowe starty</div>
          <span>Sprawy, z którymi opiekunowie przychodzą na pierwszy kontakt.</span>
        </div>
        <div className="summary-card tree-backed-card">
          <div className="stat-label">Publiczne źródła</div>
          <span>Łączymy case studies, profil zawodowy i publikacje w jednym miejscu.</span>
        </div>
        <div className="summary-card tree-backed-card">
          <div className="stat-label">Ręczna weryfikacja</div>
          <span>Nic nie trafia na stronę automatycznie.</span>
        </div>
      </div>

      <div className="real-case-grid top-gap">
        {REAL_CASE_STUDIES.map((caseStudy) => (
          <article key={caseStudy.id} className="real-case-card">
            <div className="real-case-image-shell">
              <Image
                src={caseStudy.imageSrc}
                alt={caseStudy.imageAlt}
                width={1200}
                height={900}
                sizes="(max-width: 680px) 100vw, 50vw"
                className="real-case-image"
              />
            </div>
            <div className="real-case-copy">
              <div className="section-eyebrow">{caseStudy.sourceLabel}</div>
              <h3>{caseStudy.problem}</h3>
              <p>{caseStudy.summary}</p>
              <div className="real-case-result">
                <strong>Pierwszy krok</strong>
                <span>{caseStudy.effect}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="section-head top-gap">
        <div>
          <div className="section-eyebrow">Publiczne źródła</div>
          <h3>Gdzie można sprawdzić profil i publikacje</h3>
        </div>
        <div className="muted">
          CAPBT, Instagram i publikacje branżowe są tu po to, żeby szybko sprawdzić profil przed przekazaniem strony
          dalej.
        </div>
      </div>

      <div className="media-grid top-gap">
        {MEDIA_MENTIONS.map((mention) => (
          <article key={mention.id} className="media-card">
            <div className="section-eyebrow">{mention.label}</div>
            <h3>{mention.title}</h3>
            <p>{mention.summary}</p>
            <div className="offer-card-actions">
              <a href={mention.href} target="_blank" rel="noopener noreferrer" className="button button-ghost small-button">
                {mention.cta}
              </a>
            </div>
          </article>
        ))}
      </div>

      {hasTestimonials ? (
        <>
        <div className="section-head top-gap">
          <div>
            <div className="section-eyebrow">Zweryfikowane opinie</div>
            <h3>Akceptowane wpisy klientów</h3>
          </div>
          <div className="muted">Opinie pojawiają się dopiero po ręcznej akceptacji.</div>
        </div>

          <div className="summary-grid top-gap">
            {TESTIMONIALS.map((testimonial) => (
              <article key={testimonial.id} className="summary-card tree-backed-card">
                <div className="testimonial-head">
                  {shouldRenderLocalPhoto(testimonial.photoSrc) ? (
                    <div className="testimonial-avatar" aria-hidden="true">
                      <Image
                        src={testimonial.photoSrc}
                        alt={`Zdjęcie powiązane z opinią ${testimonial.displayName}`}
                        width={72}
                        height={72}
                        sizes="72px"
                        className="testimonial-photo"
                      />
                    </div>
                  ) : (
                    <div className="testimonial-avatar" aria-hidden="true">
                      {getInitials(testimonial.displayName)}
                    </div>
                  )}

                  <div className="testimonial-meta">
                    <strong>{testimonial.displayName}</strong>
                    <span>{testimonial.dateLabel}</span>
                    <span>{getTestimonialIssueLabel(testimonial.issueCategory)}</span>
                  </div>
                </div>
                <strong>{testimonial.opinion}</strong>
                <span>{testimonial.beforeAfter}</span>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="real-case-empty top-gap">
          <strong>Zweryfikowane opinie pojawią się po ręcznej akceptacji.</strong>
          <p>
            Na ten moment pokazujemy przede wszystkim realne przypadki, publiczne profile i publikacje. Dzięki temu
            sekcja nie opiera się na pustych deklaracjach.
          </p>
        </div>
      )}

      <div className="info-box top-gap">
        Opinie i dane kontaktowe z formularza są weryfikowane ręcznie. Nic nie trafia na stronę automatycznie.
      </div>

      {showSubmissionForm ? (
        <div className="top-gap">
          <AddTestimonialForm />
        </div>
      ) : (
        <div className="offer-detail-cta-band top-gap">
          <div className="offer-detail-cta-copy">
            <span className="section-eyebrow">Dalszy krok</span>
            <strong>Chcesz przejść do pełnej sekcji opinii albo napisać wiadomość?</strong>
            <span>Pełny formularz publikacji i dodatkowe wskazówki są na osobnej podstronie.</span>
          </div>

          <div className="hero-actions offer-detail-actions">
            <Link href="/opinie" prefetch={false} className="button button-primary big-button">
              Zobacz pełną sekcję opinii
            </Link>
            <Link href="/kontakt" prefetch={false} className="button button-ghost big-button">
              Napisz wiadomość
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}
