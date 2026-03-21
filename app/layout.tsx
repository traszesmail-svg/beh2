import type { Metadata } from 'next'
import { Fraunces, Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-ui',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Behawior 15 | 15-minutowa konsultacja glosowa',
  description: 'Szybka konsultacja glosowa dla opiekunow psow i kotow. Placisz z gory i od razu dostajesz termin rozmowy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={`${manrope.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  )
}
