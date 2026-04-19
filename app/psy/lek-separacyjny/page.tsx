import type { Metadata } from 'next'
import { ProblemLandingPage, getProblemLandingMetadata } from '@/lib/problem-landings'

export const dynamic = 'force-static'

export const metadata: Metadata = getProblemLandingMetadata('/psy/lek-separacyjny')

export default function DogSeparationAnxietyPage() {
  return <ProblemLandingPage routePath="/psy/lek-separacyjny" />
}
