import type { Metadata } from 'next'
import { ProblemLandingPage, getProblemLandingMetadata } from '@/lib/problem-landings'

export const dynamic = 'force-static'

export const metadata: Metadata = getProblemLandingMetadata('/psy/reaktywnosc-na-smyczy')

export default function DogLeashReactivityPage() {
  return <ProblemLandingPage routePath="/psy/reaktywnosc-na-smyczy" />
}
