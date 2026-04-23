export const THEME_STORAGE_KEY = 'regulski-theme'

export type AppTheme = 'light' | 'dark'

export const APP_THEME_ATTRIBUTE = 'data-theme'

export function isAppTheme(value: string | null | undefined): value is AppTheme {
  return value === 'light' || value === 'dark'
}
