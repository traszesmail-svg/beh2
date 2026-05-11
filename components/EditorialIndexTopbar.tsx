import Image from 'next/image'
import Link from 'next/link'
import { Menu, Zap } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { REGULSKI_WEB_LOGO } from '@/lib/regulski-web-assets'

const EDITORIAL_INDEX_NAV_ITEMS = [
  { href: '/o-mnie', label: 'O mnie' },
  { href: '/cennik', label: 'Cennik' },
  { href: '/niezbednik', label: 'Niezbędnik' },
  { href: '/blog', label: 'Blog' },
  { href: '/kontakt', label: 'Kontakt' },
] as const

export function EditorialIndexTopbar() {
  return (
    <header className="blog-index-topbar">
      <Link href="/" prefetch={false} className="blog-index-brand" aria-label="Wróć na stronę główną Regulski">
        <span className="blog-index-brand-logo" aria-hidden="true">
          <Image src={REGULSKI_WEB_LOGO} alt="" width={512} height={512} priority />
        </span>
        <span className="blog-index-brand-copy">
          <span className="blog-index-brand-name-full">Regulski Behawiorysta</span>
          <span className="blog-index-brand-name-short" aria-hidden="true">Regulski</span>
          <small>Krzysztof Regulski - behawiorysta zwierzęcy</small>
        </span>
      </Link>

      <nav className="blog-index-nav" aria-label="Główne sekcje">
        {EDITORIAL_INDEX_NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} prefetch={false}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="blog-index-actions" aria-label="Narzędzia strony">
        <Link href="/wybor" prefetch={false} className="blog-index-topbar-cta">
          <Zap size={16} strokeWidth={2.1} aria-hidden="true" />
          <span>Szybki start</span>
        </Link>
        <ThemeToggle />

        <details className="blog-index-mobile-menu">
        <summary aria-label="Otwórz menu">
          <Menu size={20} strokeWidth={2} aria-hidden="true" />
        </summary>
        <div>
          <Link href="/wybor" prefetch={false}>
            Szybki start
          </Link>
          {EDITORIAL_INDEX_NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
        </div>
        </details>
      </div>
    </header>
  )
}
