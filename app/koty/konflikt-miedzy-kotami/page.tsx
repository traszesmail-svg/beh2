import type { Metadata } from 'next'
import { ProblemLandingPage, getProblemLandingMetadata } from '@/lib/problem-landings'

export const dynamic = 'force-static'

export const metadata: Metadata = getProblemLandingMetadata('/koty/konflikt-miedzy-kotami')

export default function CatConflictPage() {
  return <ProblemLandingPage routePath="/koty/konflikt-miedzy-kotami" />
}
