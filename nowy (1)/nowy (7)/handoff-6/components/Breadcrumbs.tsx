// handoff-6/components/Breadcrumbs.tsx
// Breadcrumbs UI + JSON-LD BreadcrumbList Schema.org
// Wstaw na każdej podstronie (nie home) pod nawigacją

import Link from 'next/link';
import Script from 'next/script';
import { ChevronRight, Home } from 'lucide-react';
import { breadcrumbSchema } from '@/lib/structured-data';

interface Crumb {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Zawsze prepend "Strona główna"
  const allCrumbs: Crumb[] = [{ name: 'Strona główna', url: '/' }, ...items];

  return (
    <>
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema(allCrumbs)),
        }}
      />

      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-2 flex-wrap">
          {allCrumbs.map((crumb, i) => {
            const isLast = i === allCrumbs.length - 1;
            return (
              <li key={crumb.url} className="flex items-center gap-2">
                {i > 0 && (
                  <ChevronRight size={14} className="text-muted-2 shrink-0" aria-hidden />
                )}
                {isLast ? (
                  <span className="text-muted font-medium" aria-current="page">
                    {i === 0 ? <Home size={14} className="inline" /> : crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.url}
                    className="text-muted hover:text-accent transition-colors flex items-center gap-1"
                  >
                    {i === 0 ? <Home size={14} aria-label="Strona główna" /> : crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/* UŻYCIE:

// app/psy/reaktywnosc-na-smyczy/page.tsx
import { Breadcrumbs } from '@/components/Breadcrumbs';

<Breadcrumbs items={[
  { name: 'Psy', url: '/psy' },
  { name: 'Reaktywność na smyczy', url: '/psy/reaktywnosc-na-smyczy' },
]} />
*/
