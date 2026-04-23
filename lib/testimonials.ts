import testimonialsData from '@/data/testimonials.json'

export type TestimonialRecord = {
  id: string
  quote: string
  author: string
  authorFull: string | null
  dog: string | null
  photo: string | null
  consent: boolean
  category: string
  service: string
}

export type TestimonialIssueOption = {
  value: string
  label: string
}

export const TESTIMONIAL_ISSUE_OPTIONS: TestimonialIssueOption[] = [
  { value: 'szczeniak', label: 'Szczeniak i mlody pies' },
  { value: 'separacja', label: 'Problemy separacyjne' },
  { value: 'spacer', label: 'Spacer i reakcje' },
  { value: 'pobudzenie', label: 'Pobudzenie i pogon' },
  { value: 'agresja', label: 'Agresja i obrona zasobow' },
  { value: 'reaktywnosc-pies', label: 'Reaktywnosc i napiecie na spacerach' },
  { value: 'kot-kuweta', label: 'Kuweta i zachowania toaletowe' },
  { value: 'kot-konflikt', label: 'Konflikt miedzy kotami' },
  { value: 'kot-dotyk', label: 'Dotyk, pielegnacja i obrona' },
  { value: 'kot-stres', label: 'Lek, stres i wycofanie' },
  { value: 'kot-nocna-wokalizacja', label: 'Nocna aktywnosc i rytm dnia' },
  { value: 'inne', label: 'Inny problem lub temat pokrewny' },
]

export const TESTIMONIAL_FORM_LIMITS = {
  displayName: 60,
  email: 120,
  opinion: 600,
  beforeAfter: 500,
  photoUrl: 500,
} as const

export const TESTIMONIALS: TestimonialRecord[] = testimonialsData

export function isTestimonialIssueCategory(value: string): boolean {
  return TESTIMONIAL_ISSUE_OPTIONS.some((option) => option.value === value)
}

export function getTestimonialIssueLabel(value: string): string {
  return TESTIMONIAL_ISSUE_OPTIONS.find((option) => option.value === value)?.label ?? value
}

export function getTestimonialDisplayName(testimonial: TestimonialRecord): string {
  return testimonial.authorFull ?? testimonial.author
}

export function getTestimonialSubjectLine(testimonial: TestimonialRecord): string | null {
  return testimonial.dog
}

export function getTestimonialServiceLabel(service: string): string {
  if (service === 'kwadrans') {
    return 'Kwadrans z behawiorysta'
  }

  if (service === 'konsultacja') {
    return 'Pelna konsultacja'
  }

  return service
}
