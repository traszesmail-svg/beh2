import type { ReactNode } from 'react'
import type { TrustFaqItem } from '@/lib/trust-layer'

type EditorialFaqSectionProps = {
  id?: string
  eyebrow?: string
  title: string
  description?: string
  items: readonly TrustFaqItem[]
  afterContent?: ReactNode
}

export function EditorialFaqSection({
  id,
  eyebrow = 'FAQ',
  title,
  description,
  items,
  afterContent,
}: EditorialFaqSectionProps) {
  return (
    <section className="panel section-panel editorial-section" id={id}>
      <div className="editorial-section-head">
        <div className="editorial-section-head-copy">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
        {description ? <p className="editorial-section-lead">{description}</p> : null}
      </div>

      <div className="premium-faq-grid">
        {items.map((item) => (
          <details key={item.question} className="premium-faq-item">
            <summary className="premium-faq-summary">{item.question}</summary>
            <div className="premium-faq-content">{item.answer}</div>
          </details>
        ))}
      </div>

      {afterContent}
    </section>
  )
}
