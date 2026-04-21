import casesData from '@/content/cases.json'

export type RealCaseImage = {
  src: string
  remoteSrc?: string
  alt: string
}

export type RealCaseProof = {
  problemType: string
  serviceFormat: string
  cooperationStage: string
  timeHorizon: string
  sourceContext: string
  outcomeSnapshot: string
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
  proof: RealCaseProof
  images: RealCaseImage[]
}

export const REAL_CASE_STUDIES = casesData as RealCaseStudy[]

export function getRealCaseProofPills(caseStudy: RealCaseStudy) {
  return [
    caseStudy.proof.problemType,
    caseStudy.proof.serviceFormat,
    caseStudy.proof.cooperationStage,
    caseStudy.proof.timeHorizon,
  ]
}
