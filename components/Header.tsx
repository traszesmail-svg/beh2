'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_NAME, SITE_SHORT_NAME } from '@/lib/site'

type NavItem = {
  href: string
  label: string
  sectionId?: string
}

const homeNavItems: NavItem[] = [
  { href: '/#jak-pomagam', label: 'Jak pomagam', sectionId: 'jak-pomagam' },
  { href: '/#pierwsza-konsultacja', label: 'Pierwsza konsultacja', sectionId: 'pierwsza-konsultacja' },
  { href: '/#opinie', label: 'Opinie', sectionId: 'opinie' },
  { href: '/#faq', label: 'FAQ', sectionId: 'faq' },
]

const dogNavItems: NavItem[] = [
  { href: '/psy#jak-pomagam', label: 'Jak pomagam', sectionId: 'jak-pomagam' },
  { href: '/psy#konsultacja', label: 'Konsultacja', sectionId: 'konsultacja' },
  { href: '/psy#opinie', label: 'Opinie', sectionId: 'opinie' },
  { href: '/psy#faq', label: 'FAQ', sectionId: 'faq' },
]

function getNavItems(pathname: string): NavItem[] {
  return pathname === '/psy' ? dogNavItems : homeNavItems
}

function buildSectionHref(pathname: string, sectionId: string): string {
  return pathname === '/psy' ? `/psy#${sectionId}` : `/#${sectionId}`
}

export function Header() {
  const pathname = usePathname() ?? '/'
  const isHome = pathname === '/'
  const consultationHref = pathname === '/psy' ? '/book' : '/kontakt'
  const [menuOpen, setMenuOpen] = useState(false)
  const navItems = getNavItems(pathname)
  const [activeSection, setActiveSection] = useState<string>(navItems[0]?.sectionId ?? '')

  useEffect(() => {
    setMenuOpen(false)

    const sectionIds = navItems
      .map((item) => item.sectionId)
      .filter((sectionId): sectionId is string => Boolean(sectionId))

    if (sectionIds.length === 0) {
      setActiveSection('')
      return
    }

    const hash = window.location.hash.replace(/^#/, '')
    const validSectionIds = new Set(sectionIds)
    setActiveSection(validSectionIds.has(hash) ? hash : sectionIds[0])

    const sections = sectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter((section): section is HTMLElement => Boolean(section))

    if (sections.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting)

        if (visibleEntries.length === 0) {
          return
        }

        const topEntry = visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        const sectionId = topEntry?.target instanceof HTMLElement ? topEntry.target.id : null

        if (sectionId) {
          setActiveSection(sectionId)
        }
      },
      {
        rootMargin: '-28% 0px -55% 0px',
        threshold: [0.18, 0.32, 0.48, 0.64],
      },
    )

    for (const section of sections) {
      observer.observe(section)
    }

    return () => {
      observer.disconnect()
    }
  }, [navItems, pathname])

  const activeHref = activeSection ? buildSectionHref(pathname, activeSection) : pathname

  function getLinkState(href: string) {
    return activeHref === href
  }

  function handleNavClick() {
    setMenuOpen(false)
  }

  const headerClassName = isHome ? 'premium-home-header header-shell' : 'header-shell'
  const headerMainClassName = isHome ? 'premium-home-header-inner header-main' : 'header-main'
  const brandClassName = isHome ? 'premium-home-brand header-branding' : 'header-branding'
  const navClassName = isHome ? 'premium-home-nav header-nav' : 'header-nav'
  const ctaClassName = isHome ? 'button button-primary header-cta premium-home-header-cta' : 'button button-primary header-cta'

  return (
    <header className={headerClassName}>
      <div className={headerMainClassName}>
        <Link href="/" prefetch={false} className={brandClassName} aria-label={SITE_NAME}>
          <span className="brand-copy">
            <span className="brand">{SITE_SHORT_NAME}</span>
            <span className="header-subtitle">Behawiorysta COAPE | Koty i psy</span>
          </span>
        </Link>

        <nav className={navClassName} aria-label="Główna nawigacja">
          <div className="header-links">
            {navItems.map((item) => {
              const isActive = getLinkState(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`header-link${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="header-actions">
          <Link
            href={consultationHref}
            prefetch={false}
            className={ctaClassName}
            data-analytics-event="cta_click"
            data-analytics-location="header"
          >
            Umów konsultację
          </Link>

          <button
            type="button"
            className="header-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className="header-menu-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="header-mobile-panel" id="site-mobile-menu">
          <nav className="header-mobile-links" aria-label="Menu mobilne">
            {navItems.map((item) => {
              const isActive = getLinkState(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={`header-mobile-link${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={handleNavClick}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="header-mobile-actions">
            <Link
              href={consultationHref}
              prefetch={false}
              className="button button-primary big-button header-mobile-cta"
              data-analytics-event="cta_click"
              data-analytics-location="header-mobile-book"
              onClick={handleNavClick}
            >
              Umów konsultację
            </Link>
            {isHome ? null : (
              <>
                <Link
                  href="/book?service=szybka-konsultacja-15-min"
                  prefetch={false}
                  className="header-mobile-soft-link"
                  data-analytics-event="cta_click"
                  data-analytics-location="header-mobile-audio"
                  onClick={handleNavClick}
                >
                  Krótka rozmowa wstępna 15 min audio
                </Link>
                <span className="header-mobile-soft-note">bez potrzeby przygotowania kamery</span>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
