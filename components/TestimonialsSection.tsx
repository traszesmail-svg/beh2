import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TESTIMONIALS, Testimonial, getTestimonialIssueLabel } from '@/lib/testimonials'

type TestimonialsSectionProps = {
  testimonials?: Testimonial[]
}

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

export function TestimonialsSection({ testimonials = TESTIMONIALS }: TestimonialsSectionProps) {
  const hasTestimonials = testimonials.length > 0

  return (
    <section className="panel section-panel" id="opinie" aria-labelledby="opinie-heading">
      <div className="section-head">
        <div>
          <div className="section-eyebrow">Po konsultacji</div>
          <h2 id="opinie-heading">Opinie klientów</h2>
        </div>
        <div className="muted">
          Prawdziwe, ręcznie weryfikowane historie opiekunów psów i kotów po konsultacji. Pokazujemy tylko treści, które zostały sprawdzone przed publikacją.
        </div>
      </div>

      {hasTestimonials ? (
        <div className="testimonial-grid top-gap">
          {testimonials.map((testimonial) => (
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
                  <span className="testimonial-category">
                    {getTestimonialIssueLabel(testimonial.issueCategory)}
                  </span>
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
        <div className="testimonial-empty top-gap">
          <strong>Pierwsze zweryfikowane opinie pojawią się tutaj wkrótce.</strong>
          <span>
            Po każdej konsultacji klient może wysłać opinię do ręcznej moderacji. Publikujemy ją dopiero po sprawdzeniu treści i zgód.
          </span>
          <Link href="#dodaj-opinie" className="button button-ghost small-button top-gap-small">
            Dodaj opinię do weryfikacji
          </Link>
        </div>
      )}

      <div className="testimonial-disclaimer">
        Publikujemy wyłącznie opinie zaakceptowane po weryfikacji. Dane kontaktowe nie są publikowane.
      </div>
    </section>
  )
}
