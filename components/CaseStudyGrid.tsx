import { CaseStudyCard } from '@/components/CaseStudyCard'
import type { RealCaseStudy } from '@/lib/real-case-studies'

type CaseStudyGridProps = {
  caseStudies: readonly RealCaseStudy[]
}

export function CaseStudyGrid({ caseStudies }: CaseStudyGridProps) {
  const dogCaseStudies = caseStudies.filter((caseStudy) => caseStudy.species === 'pies')
  const catCaseStudies = caseStudies.filter((caseStudy) => caseStudy.species === 'kot')
  const groups = [
    { id: 'psy', label: 'Psy', items: dogCaseStudies },
    { id: 'koty', label: 'Koty', items: catCaseStudies },
  ] as const

  return (
    <div className="notatnik-case-grid-shell">
      <div className="notatnik-case-anchor-row" aria-label="Szybki podzial historii">
        <a href="#psy">Psy ({dogCaseStudies.length})</a>
        <a href="#koty">Koty ({catCaseStudies.length})</a>
      </div>

      {groups.map((group) =>
        group.items.length > 0 ? (
          <div key={group.id} id={group.id} className="notatnik-case-group">
            <div className="notatnik-case-group-head">
              <div className="notatnik-mono">{group.label}</div>
              <h2>{group.label === 'Psy' ? 'Historie psie' : 'Historie kocie'}</h2>
            </div>
            <div className="notatnik-case-grid">
              {group.items.map((caseStudy, index) => (
                <CaseStudyCard key={caseStudy.id} caseStudy={caseStudy} priority={group.id === 'psy' && index < 2} />
              ))}
            </div>
          </div>
        ) : null,
      )}
    </div>
  )
}
