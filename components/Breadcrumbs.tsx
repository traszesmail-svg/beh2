import Link from 'next/link'
import { Schema } from '@/components/schema'
import { breadcrumbSchema } from '@/lib/structured-data'

interface Crumb {
  name: string
  url: string
}

interface BreadcrumbsProps {
  items: Crumb[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allCrumbs: Crumb[] = [{ name: 'Strona g\u0142\u00f3wna', url: '/' }, ...items]

  return (
    <>
      <Schema data={breadcrumbSchema(allCrumbs)} />

      <nav aria-label="Breadcrumb" className="px-4 py-2 text-sm">
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
          {allCrumbs.map((crumb, index) => {
            const isLast = index === allCrumbs.length - 1

            return (
              <li key={crumb.url} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-muted-2 shrink-0">
                    /
                  </span>
                ) : null}
                {isLast ? (
                  <span className="text-muted font-medium" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.url} className="text-muted transition-colors hover:text-accent">
                    {crumb.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
