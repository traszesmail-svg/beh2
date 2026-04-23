import Link from 'next/link'
import { repairCopy } from '@/lib/copy'
import type { TrustSignalItem } from '@/lib/trust-layer'

type TrustSignalSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  items: readonly TrustSignalItem[]
}

export function TrustSignalSection({
  eyebrow = 'Zaufanie',
  title,
  description,
  items,
}: TrustSignalSectionProps) {
  return (
    <section className="panel section-panel editorial-section">
      <div className="editorial-section-head">
        <div className="editorial-section-head-copy">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
        </div>
        {description ? <p className="editorial-section-lead">{description}</p> : null}
      </div>

      <div className="summary-grid top-gap-small">
        {items.map((item) => (
          <article key={item.title} className="summary-card tree-backed-card">
            <h3>{repairCopy(item.title)}</h3>
            <p>{repairCopy(item.copy)}</p>
            {item.href && item.cta ? (
              <Link href={item.href} prefetch={false} className="prep-inline-link">
                {repairCopy(item.cta)}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
