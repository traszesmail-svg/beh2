'use client'

import { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'

type NotatnikMobileMenuItem = {
  href: string
  label: string
}

type NotatnikMobileMenuProps = {
  navItems: readonly NotatnikMobileMenuItem[]
}

export function NotatnikMobileMenuAutoClose() {
  useEffect(() => {
    const closeOpenMenus = () => {
      document.querySelectorAll<HTMLDetailsElement>('.notatnik-mobile-menu[open]').forEach((details) => {
        details.open = false
      })
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeOpenMenus()
      }
    }

    window.addEventListener('scroll', closeOpenMenus, { passive: true })
    window.addEventListener('wheel', closeOpenMenus, { passive: true })
    window.addEventListener('touchmove', closeOpenMenus, { passive: true })
    window.addEventListener('resize', closeOpenMenus)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('scroll', closeOpenMenus)
      window.removeEventListener('wheel', closeOpenMenus)
      window.removeEventListener('touchmove', closeOpenMenus)
      window.removeEventListener('resize', closeOpenMenus)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return null
}

export function NotatnikMobileMenu({ navItems }: NotatnikMobileMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const closeMenu = useCallback(() => {
    const details = detailsRef.current

    if (details?.open) {
      details.open = false
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu()
      }
    }

    window.addEventListener('scroll', closeMenu, { passive: true })
    window.addEventListener('wheel', closeMenu, { passive: true })
    window.addEventListener('touchmove', closeMenu, { passive: true })
    window.addEventListener('resize', closeMenu)
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('scroll', closeMenu)
      window.removeEventListener('wheel', closeMenu)
      window.removeEventListener('touchmove', closeMenu)
      window.removeEventListener('resize', closeMenu)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [closeMenu])

  return (
    <details ref={detailsRef} className="notatnik-mobile-menu">
      <summary aria-label="OtwĂłrz menu">
        <span className="notatnik-mobile-menu-bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </summary>
      <div className="notatnik-mobile-menu-panel">
        <nav aria-label="Menu mobilne">
          <Link href="/wybor" prefetch={false} onClick={closeMenu}>
            Quiz
          </Link>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false} onClick={closeMenu}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </details>
  )
}
