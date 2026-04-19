import type { Metadata } from 'next'
import { ProblemLandingPage, getProblemLandingMetadata } from '@/lib/problem-landings'

export const dynamic = 'force-static'

export const metadata: Metadata = getProblemLandingMetadata('/koty/zalatwianie-poza-kuweta')

export default function CatOutsideLitterBoxPage() {
  return <ProblemLandingPage routePath="/koty/zalatwianie-poza-kuweta" />
}
