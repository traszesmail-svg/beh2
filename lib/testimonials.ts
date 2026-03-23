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
  { value: 'szczekanie-i-pobudzenie', label: 'Szczekanie i pobudzenie' },
  { value: 'lek-separacyjny', label: 'Lęk separacyjny' },
  { value: 'kot-i-kuweta', label: 'Kot i kuweta' },
  { value: 'konflikt-miedzy-zwierzetami', label: 'Konflikt między zwierzętami' },
  { value: 'niszczenie-rzeczy', label: 'Niszczenie rzeczy' },
  { value: 'inne', label: 'Inne' },
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
