import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Schema } from '@/components/schema';
import { breadcrumbSchema } from '@/lib/structured-data';

interface Crumb {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allCrumbs: Crumb[] = [{ name: 'Strona główna', url: '/' }, ...items];

  return (
    <>
      <Schema data={breadcrumbSchema(allCrumbs)} />

      <nav aria-label="Breadcrumb" className="text-sm px-4 py-2">
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
