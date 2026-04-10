export type Testimonial = {
  id: string
  displayName: string
  photoSrc?: string | null
  opinion: string
  beforeAfter: string
  issueCategory: string
  dateLabel: string
}

export type TestimonialIssueOption = {
  value: string
  label: string
}

export const TESTIMONIAL_ISSUE_OPTIONS: TestimonialIssueOption[] = [
  { value: 'szczeniak', label: 'Szczeniak i młody pies' },
  { value: 'separacja', label: 'Problemy separacyjne' },
  { value: 'spacer', label: 'Spacer i reakcje' },
  { value: 'pobudzenie', label: 'Pobudzenie i pogoń' },
  { value: 'agresja', label: 'Agresja i obrona zasobów' },
  { value: 'kot-kuweta', label: 'Kuweta i zachowania toaletowe' },
  { value: 'kot-konflikt', label: 'Konflikt między kotami' },
  { value: 'kot-dotyk', label: 'Dotyk, pielęgnacja i obrona' },
  { value: 'kot-stres', label: 'Lęk, stres i wycofanie' },
  { value: 'kot-nocna-wokalizacja', label: 'Nocna aktywność i rytm dnia' },
  { value: 'inne', label: 'Inny problem lub temat pokrewny' },
]

export const TESTIMONIAL_FORM_LIMITS = {
  displayName: 60,
  email: 120,
  opinion: 600,
  beforeAfter: 500,
  photoUrl: 500,
} as const

// Opinie trafiają tutaj dopiero po ręcznej akceptacji właściciela projektu.
// V1 startuje od pustej listy, żeby nie publikować przykładowych treści bez zgody.
export const TESTIMONIALS: Testimonial[] = []

export function isTestimonialIssueCategory(value: string): boolean {
  return TESTIMONIAL_ISSUE_OPTIONS.some((option) => option.value === value)
}

export function getTestimonialIssueLabel(value: string): string {
  return TESTIMONIAL_ISSUE_OPTIONS.find((option) => option.value === value)?.label ?? value
}
