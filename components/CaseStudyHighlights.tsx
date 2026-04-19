import type { RealCaseStudy } from '@/lib/real-case-studies'

type CaseStudyHighlightsProps = {
  eyebrow?: string
  title: string
  description?: string
  caseStudies: readonly RealCaseStudy[]
}

export function CaseStudyHighlights({
  eyebrow = 'Case studies',
  title,
  description,
  caseStudies,
}: CaseStudyHighlightsProps) {
  if (caseStudies.length === 0) {
    return null
  }

  return (
    <section className="panel section-panel editorial-section">
      <div className="editorial-section-head">
        <div className="editorial-section-head-copy">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
        {description ? <p className="editorial-section-lead">{description}</p> : null}
      </div>

      <div className="premium-two-column-grid top-gap-small">
        {caseStudies.map((caseStudy) => (
          <article key={caseStudy.id} className="summary-card tree-backed-card">
            <div className="section-eyebrow">{caseStudy.eyebrow}</div>
            <h3>{caseStudy.headline}</h3>
            <p>{caseStudy.summary}</p>

            <div className="top-gap-small">
              <strong>{caseStudy.firstStepLabel}</strong>
              <p className="muted">{caseStudy.firstStepText}</p>
            </div>

            <div className="top-gap-small">
              <strong>{caseStudy.nextStepLabel}</strong>
              <p className="muted">{caseStudy.nextStepText}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
