'use client'

import { useEffect, useState } from 'react'
import { APP_THEME_ATTRIBUTE, THEME_STORAGE_KEY, isAppTheme, type AppTheme } from '@/lib/theme'

function getSystemTheme(): AppTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readCurrentTheme(): AppTheme {
  const currentTheme = document.documentElement.getAttribute(APP_THEME_ATTRIBUTE)
  if (isAppTheme(currentTheme)) {
    return currentTheme
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (isAppTheme(storedTheme)) {
    return storedTheme
  }

  return getSystemTheme()
}

function applyTheme(theme: AppTheme) {
  document.documentElement.setAttribute(APP_THEME_ATTRIBUTE, theme)
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<AppTheme>('light')

  useEffect(() => {
    setTheme(readCurrentTheme())
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (!isAppTheme(storedTheme)) {
        const nextTheme = mediaQuery.matches ? 'dark' : 'light'
        document.documentElement.setAttribute(APP_THEME_ATTRIBUTE, nextTheme)
        setTheme(nextTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  function handleToggle() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(nextTheme)
    setTheme(nextTheme)
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="notatnik-theme-toggle"
      onClick={handleToggle}
      aria-label={isDark ? 'Przelacz na jasny motyw' : 'Przelacz na ciemny motyw'}
      aria-pressed={isDark}
      title={isDark ? 'Jasny motyw' : 'Ciemny motyw'}
    >
      <span className="notatnik-theme-toggle-track" aria-hidden="true">
        <span className="notatnik-theme-toggle-thumb" />
      </span>
      <span className="notatnik-theme-toggle-label">{isDark ? 'Ciemny' : 'Jasny'}</span>
    </button>
  )
}
