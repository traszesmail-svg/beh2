'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getServiceAnalyticsParams } from '@/lib/analytics-schema'
import { buildBookHref } from '@/lib/booking-routing'
import { FUNNEL_CTA_LABELS } from '@/lib/funnel'
import { FUNNEL_SECONDARY_HREF } from '@/lib/offers'
import { SITE_HEADER_BRAND, SITE_HEADER_SUBTITLE, SITE_NAME } from '@/lib/site'

type NavItem = {
  href: string
  label: string
  sectionId?: string
  activeSectionIds?: string[]
}

const homeNavItems: NavItem[] = [
  { href: '/#start', label: 'Start', sectionId: 'start' },
  { href: '/#pies-i-kot', label: 'Pies i kot', sectionId: 'pies-i-kot' },
  { href: '/#opinie', label: 'Opinie', sectionId: 'opinie' },
  { href: '/#faq', label: 'FAQ', sectionId: 'faq' },
]

const dogNavItems: NavItem[] = [
  { href: '/psy#jak-pomagam', label: 'Jak pomagam', sectionId: 'jak-pomagam' },
  { href: '/psy#konsultacja', label: 'Konsultacja', sectionId: 'konsultacja' },
  { href: '/psy#opinie', label: 'Opinie', sectionId: 'opinie' },
  { href: '/psy#faq', label: 'FAQ', sectionId: 'faq' },
]

const catNavItems: NavItem[] = [
  { href: '/koty#jak-pomagam', label: 'Jak pomagam', sectionId: 'jak-pomagam' },
  { href: '/koty#konsultacja', label: 'Konsultacja', sectionId: 'konsultacja' },
  { href: '/koty#opinie', label: 'Opinie', sectionId: 'opinie' },
  { href: '/koty#faq', label: 'FAQ', sectionId: 'faq' },
]

const opinionNavItems: NavItem[] = [
  { href: '/opinie#opinie', label: 'Opinie', sectionId: 'opinie' },
  { href: '/opinie#przypadki', label: 'Przypadki', sectionId: 'przypadki' },
  { href: '/opinie#faq', label: 'FAQ', sectionId: 'faq' },
  { href: '/opinie#kontakt', label: 'Kontakt', sectionId: 'kontakt' },
]

const contactNavItems: NavItem[] = [
  { href: '/kontakt#kontakt', label: 'Kontakt', sectionId: 'kontakt' },
  { href: '/kontakt#jak-umowic-konsultacje', label: 'Jak umówić konsultację', sectionId: 'jak-umowic-konsultacje' },
  { href: '/kontakt#faq', label: 'FAQ', sectionId: 'faq' },
  { href: '/kontakt#rezerwacja', label: 'Rezerwacja', sectionId: 'rezerwacja' },
]

const materialNavItems: NavItem[] = [
  { href: '/niezbednik#polecane-starty', label: 'Polecane starty', sectionId: 'polecane-starty' },
  { href: '/niezbednik#ksiazki', label: 'Książki', sectionId: 'ksiazki' },
  { href: '/niezbednik#przybory', label: 'Narzędzia', sectionId: 'przybory' },
  { href: '/niezbednik#kontakt', label: 'Dalszy krok', sectionId: 'kontakt' },
]

const faqNavItems: NavItem[] = [
  { href: '/konsultacja-behawioralna-online#faq', label: 'Konsultacja' },
  { href: '/psy#faq', label: 'Psy' },
  { href: '/koty#faq', label: 'Koty' },
  { href: '/o-mnie#faq', label: 'Podejście' },
  { href: '/faq#kontakt', label: 'Kontakt', sectionId: 'kontakt' },
]

const aboutNavItems: NavItem[] = [
  { href: '/o-mnie#kim-jestem', label: 'Kim jestem', sectionId: 'kim-jestem' },
  { href: '/o-mnie#metodyka', label: 'Metodyka', sectionId: 'metodyka' },
  { href: '/o-mnie#opinie', label: 'Opinie', sectionId: 'opinie' },
  { href: '/o-mnie#faq', label: 'FAQ', sectionId: 'faq' },
]

const blogNavItems: NavItem[] = [
  { href: '/blog', label: 'Blog' },
  { href: '/psy', label: 'Psy' },
  { href: '/koty', label: 'Koty' },
  { href: '/niezbednik', label: 'Niezbędnik' },
]

function getNavItems(pathname: string): NavItem[] {
  if (pathname === '/blog' || pathname.startsWith('/blog/')) {
    return blogNavItems
  }

  if (pathname === '/psy') {
    return dogNavItems
  }

  if (pathname === '/koty') {
    return catNavItems
  }

  if (pathname === '/opinie') {
    return opinionNavItems
  }

  if (pathname === '/o-mnie') {
    return aboutNavItems
  }

  if (pathname === '/kontakt') {
    return contactNavItems
  }

  if (pathname === '/materialy' || pathname === '/przybornik' || pathname === '/niezbednik') {
    return materialNavItems
  }

  if (pathname === '/faq') {
    return faqNavItems
  }

  return homeNavItems
}

function buildSectionHref(pathname: string, sectionId: string): string {
  if (
    pathname === '/psy' ||
    pathname === '/koty' ||
    pathname === '/opinie' ||
    pathname === '/o-mnie' ||
    pathname === '/faq' ||
    pathname === '/kontakt' ||
    pathname === '/materialy' ||
    pathname === '/przybornik' ||
    pathname === '/niezbednik'
  ) {
    return `${pathname}#${sectionId}`
  }

  return `/#${sectionId}`
}

export function Header() {
  const pathname = usePathname() ?? '/'
  const isHome = pathname === '/'
  const species = pathname === '/psy' ? 'pies' : pathname === '/koty' ? 'kot' : null
  const audioHref = buildBookHref(null, 'szybka-konsultacja-15-min', false, species)
  const consultationHref = buildBookHref(null, 'konsultacja-behawioralna-online', false, species)
  const messageHref = species ? `/kontakt?species=${species}#formularz` : '/kontakt#formularz'
  const toolkitHref = FUNNEL_SECONDARY_HREF
  const navItems = getNavItems(pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
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

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 18)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const activeHref = activeSection ? buildSectionHref(pathname, activeSection) : pathname
  const quickService = getServiceAnalyticsParams('szybka-konsultacja-15-min')
  const fullService = getServiceAnalyticsParams('konsultacja-behawioralna-online')

  function getLinkState(item: NavItem) {
    if ((pathname === '/blog' || pathname.startsWith('/blog/')) && item.href === '/blog') {
      return true
    }

    if (item.activeSectionIds?.includes(activeSection)) {
      return true
    }

    return activeHref === item.href
  }

  function handleNavClick() {
    setMenuOpen(false)
  }

  const headerClassName = `${isHome ? 'premium-home-header header-shell' : 'header-shell'}${isScrolled ? ' is-scrolled' : ''}`
  const headerMainClassName = `${isHome ? 'premium-home-header-inner header-main' : 'header-main'}${isScrolled ? ' is-scrolled' : ''}`
  const brandClassName = isHome ? 'premium-home-brand header-branding' : 'header-branding'
  const navClassName = isHome ? 'premium-home-nav header-nav' : 'header-nav'
  const ctaClassName = isHome ? 'button button-primary header-cta premium-home-header-cta' : 'button button-primary header-cta'

  return (
    <header className={headerClassName}>
      <div className={headerMainClassName}>
        <Link href="/" prefetch={false} className={brandClassName} aria-label={SITE_NAME}>
          <span className="brand-copy">
            <span className="brand">{SITE_HEADER_BRAND}</span>
            <span className="header-subtitle">{SITE_HEADER_SUBTITLE}</span>
          </span>
        </Link>

        <nav className={navClassName} aria-label="Główna nawigacja">
          <div className="header-links">
            {navItems.map((item) => {
              const isActive = getLinkState(item)

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
            href={audioHref}
            prefetch={false}
            className={ctaClassName}
            data-analytics-event="funnel_entry_15_min"
            data-analytics-location="header"
            data-analytics-cta-label={FUNNEL_CTA_LABELS.primary}
            data-analytics-service="szybka-konsultacja-15-min"
            data-analytics-service-name={String(quickService.service_name)}
            data-analytics-service-duration={String(quickService.service_duration)}
            data-analytics-service-price={String(quickService.service_price)}
          >
            {FUNNEL_CTA_LABELS.primary}
          </Link>
          <Link
            href={toolkitHref}
            prefetch={false}
            className="button button-ghost header-secondary-cta"
            data-analytics-event="funnel_entry_niezbednik"
            data-analytics-location="header-toolkit"
            data-analytics-cta-label={FUNNEL_CTA_LABELS.secondary}
          >
            {FUNNEL_CTA_LABELS.secondary}
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
              const isActive = getLinkState(item)

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
              href={audioHref}
              prefetch={false}
              className="button button-primary big-button header-mobile-cta"
              data-analytics-event="funnel_entry_15_min"
              data-analytics-location="header-mobile-audio"
              data-analytics-cta-label={FUNNEL_CTA_LABELS.primary}
              data-analytics-service="szybka-konsultacja-15-min"
              data-analytics-service-name={String(quickService.service_name)}
              data-analytics-service-duration={String(quickService.service_duration)}
              data-analytics-service-price={String(quickService.service_price)}
              onClick={handleNavClick}
            >
              {FUNNEL_CTA_LABELS.primary}
            </Link>
            <Link
              href={toolkitHref}
              prefetch={false}
              className="button button-ghost big-button header-mobile-secondary"
              data-analytics-event="funnel_entry_niezbednik"
              data-analytics-location="header-mobile-toolkit"
              data-analytics-cta-label={FUNNEL_CTA_LABELS.secondary}
              onClick={handleNavClick}
            >
              {FUNNEL_CTA_LABELS.secondary}
            </Link>
            <div className="header-mobile-soft-card">
              <Link
                href={consultationHref}
                prefetch={false}
                className="header-mobile-soft-link"
                data-analytics-event="funnel_entry_60_min"
                data-analytics-location="header-mobile-consultation"
                data-analytics-cta-label={FUNNEL_CTA_LABELS.consultation}
                data-analytics-service="konsultacja-behawioralna-online"
                data-analytics-service-name={String(fullService.service_name)}
                data-analytics-service-duration={String(fullService.service_duration)}
                data-analytics-service-price={String(fullService.service_price)}
                onClick={handleNavClick}
              >
                {FUNNEL_CTA_LABELS.consultation}
              </Link>
              <span className="header-mobile-soft-note">
                Dla szerszych tematów albo{' '}
                <Link href={messageHref} prefetch={false} onClick={handleNavClick}>
                  {FUNNEL_CTA_LABELS.contact}
                </Link>
                .
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
