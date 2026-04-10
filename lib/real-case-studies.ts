import casesData from '@/content/cases.json'

export type RealCaseImage = {
  src: string
  remoteSrc?: string
  alt: string
}

export type RealCaseStudy = {
  id: string
  species: string
  breed: string
  age: string
  eyebrow: string
  headline: string
  summary: string
  firstStepLabel: string
  firstStepText: string
  nextStepLabel: string
  nextStepText: string
  images: RealCaseImage[]
}

export const REAL_CASE_STUDIES = casesData as RealCaseStudy[]
