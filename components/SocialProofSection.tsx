import React from 'react'
import Image from 'next/image'
import { AddTestimonialForm } from '@/components/AddTestimonialForm'
import { REAL_CASE_STUDIES } from '@/lib/site'
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

export function SocialProofSection() {
  const hasTestimonials = TESTIMONIALS.length > 0

  return (
    <section className="panel section-panel" id="historie" aria-labelledby="historie-heading">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Opinie i realne przypadki</div>
          <h2 id="historie-heading">Historie opiekunów i efekty konsultacji</h2>
        </div>
        <div className="muted">
          Ta sekcja łączy dwa rodzaje dowodu społecznego: krótkie historie typowych problemów oraz opinie klientów,
          które publikujemy dopiero po ręcznej weryfikacji.
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
                <strong>Po pierwszej konsultacji</strong>
                <span>{caseStudy.effect}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasTestimonials ? (
        <div className="testimonial-grid top-gap">
          {TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.id} className="testimonial-card">
              <div className="testimonial-head">
                {shouldRenderLocalPhoto(testimonial.photoSrc) ? (
                  <div className="testimonial-photo-shell">
                    <Image
                      src={testimonial.photoSrc}
                      alt={`Zdjęcie powiązane z opinią ${testimonial.displayName}`}
                      width={112}
                      height={112}
                      sizes="112px"
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
                  <span className="testimonial-category">{getTestimonialIssueLabel(testimonial.issueCategory)}</span>
                </div>
              </div>

              <p className="testimonial-opinion">„{testimonial.opinion}”</p>
              <div className="testimonial-change">
                <strong>Co się zmieniło</strong>
                <span>{testimonial.beforeAfter}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="social-proof-summary top-gap">
          <strong>Po każdej konsultacji można zostawić krótką opinię do weryfikacji.</strong>
          <span>
            Gdy pojawią się pierwsze zaakceptowane opinie, będą publikowane tutaj obok realnych historii problemów i efektów pracy.
          </span>
        </div>
      )}

      <div className="testimonial-disclaimer">
        Publikujemy wyłącznie opinie zaakceptowane po weryfikacji. Dane kontaktowe i linki przesłane w formularzu nie są
        publikowane automatycznie.
      </div>

      <div className="top-gap">
        <AddTestimonialForm />
      </div>
    </section>
  )
}
