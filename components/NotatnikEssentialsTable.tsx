'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

export type NotatnikEssentialRow = {
  id: string
  index: string
  category: string
  title: string
  description: string
  meta: string[]
  href: string
  ctaLabel: string
  filters: string[]
}

const FILTERS = [
  { key: 'all', label: 'Wszystkie' },
  { key: 'pies', label: 'Pies' },
  { key: 'kot', label: 'Kot' },
  { key: 'przewodnik', label: 'Przewodnik' },
  { key: 'ksiazka', label: 'Ksiazka' },
  { key: 'narzedzie', label: 'Narzedzie' },
] as const

export function NotatnikEssentialsTable({ rows }: { rows: NotatnikEssentialRow[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]['key']>('all')

  const visibleRows = useMemo(() => {
    if (activeFilter === 'all') {
      return rows
    }

    return rows.filter((row) => row.filters.includes(activeFilter))
  }, [activeFilter, rows])

  return (
    <>
      <div className="notatnik-filter-bar">
        <div className="notatnik-mono">Filtruj</div>
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            className="notatnik-filter-button"
            aria-pressed={activeFilter === filter.key}
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="notatnik-list">
        {visibleRows.map((row) => (
          <article key={row.id} className="notatnik-list-row">
            <div className="notatnik-list-index">{row.index}</div>
            <div className="notatnik-list-meta notatnik-mono">{row.category}</div>
            <div>
              <div className="notatnik-list-title">{row.title}</div>
              <div className="notatnik-list-copy" style={{ marginTop: 4 }}>
                {row.description}
              </div>
            </div>
            <div className="notatnik-list-copy">
              {row.meta.map((entry) => (
                <div key={entry}>{entry}</div>
              ))}
            </div>
            <div className="notatnik-list-link">
              {row.href.startsWith('http') ? (
                <a href={row.href} target="_blank" rel="noopener noreferrer">
                  {row.ctaLabel}
                </a>
              ) : (
                <Link href={row.href} prefetch={false}>
                  {row.ctaLabel}
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
