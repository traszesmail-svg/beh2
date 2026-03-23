import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { getContactDetails } from '@/lib/site'
import { BookingRecord } from '@/lib/types'

const DEFAULT_RESEND_FROM_EMAIL = 'Behawior 15 <onboarding@resend.dev>'

type SendEmailPayload = {
  to: string
  subject: string
  html: string
  text: string
}

type DeliveryResult = {
  status: 'sent' | 'skipped' | 'failed'
  reason?: string
}

export type TestimonialSubmission = {
  displayName: string
  email: string
  issueCategory: string
  opinion: string
  beforeAfter: string
  photoUrl: string
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || null
  const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim() || null
  const from = isValidResendFrom(configuredFrom) ? configuredFrom : DEFAULT_RESEND_FROM_EMAIL

  return {
    apiKey,
    from,
  }
}

function isValidPublicEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidResendFrom(value: string | null): value is string {
  if (!value) {
    return false
  }

  const match = value.match(/<([^>]+)>/)
  const candidate = match?.[1]?.trim() ?? value.trim()

  return isValidPublicEmail(candidate)
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatMultilineHtml(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />')
}

function getExplicitContactEmail(): string | null {
  const value = process.env.BEHAVIOR15_CONTACT_EMAIL?.trim() || null
  return value && isValidPublicEmail(value) ? value : null
}

export function getTestimonialSubmissionConfigIssue(): string | null {
  if (!(process.env.RESEND_API_KEY?.trim() || null)) {
    return 'RESEND_API_KEY missing'
  }

  if (!isValidResendFrom(process.env.RESEND_FROM_EMAIL?.trim() || null)) {
    return 'RESEND_FROM_EMAIL missing or invalid'
  }

  if (!getExplicitContactEmail()) {
    return 'BEHAVIOR15_CONTACT_EMAIL missing or invalid'
  }

  return null
}

function buildBookingSummary(booking: BookingRecord): string {
  return `${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)} | ${getProblemLabel(booking.problemType)}`
}

function renderContactBlockHtml() {
  const contact = getContactDetails()
  const parts = []

  if (contact.email) {
    parts.push(`<p><strong>Kontakt:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>`)
  }

  if (contact.phoneDisplay) {
    parts.push(`<p><strong>Telefon:</strong> ${contact.phoneDisplay}</p>`)
  }

  if (!parts.length) {
    parts.push('<p><strong>Kontakt:</strong> odpowiedz na tę wiadomość, jeśli potrzebujesz doprecyzowania terminu.</p>')
  }

  return parts.join('')
}

function renderContactBlockText() {
  const contact = getContactDetails()
  const lines = []

  if (contact.email) {
    lines.push(`Kontakt: ${contact.email}`)
  }

  if (contact.phoneDisplay) {
    lines.push(`Telefon: ${contact.phoneDisplay}`)
  }

  if (!lines.length) {
    lines.push('Kontakt: odpowiedz na tę wiadomość, jeśli potrzebujesz doprecyzowania terminu.')
  }

  return lines.join('\n')
}

function renderEmailShell(title: string, intro: string, content: string, outro: string) {
  return `
    <div style="background:#f6f3ee;padding:24px 12px;font-family:Arial,sans-serif;color:#1f1a17;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e9dfcf;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(31,26,23,0.06);">
        <div style="background:linear-gradient(135deg,#1f1a17,#6f5a48);padding:24px 28px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.82;">Behawior 15</div>
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">${title}</h1>
        </div>
        <div style="padding:28px;line-height:1.65;font-size:15px;">
          <p style="margin-top:0;">${intro}</p>
          ${content}
          <p>${outro}</p>
          <p style="margin-bottom:0;color:#6b625b;font-size:13px;">Wiadomość wysłana automatycznie przez Behawior 15.</p>
        </div>
      </div>
    </div>
  `
}

export function shouldSendBookingConfirmationAfterPayment(
  booking: Pick<BookingRecord, 'bookingStatus' | 'paymentStatus'>,
): boolean {
  return booking.bookingStatus === 'pending' && booking.paymentStatus === 'unpaid'
}

async function deliverEmail(payload: SendEmailPayload): Promise<DeliveryResult> {
  const resend = getResendConfig()

  if (!resend.apiKey) {
    console.warn('[behawior15][email] skip', {
      reason: 'RESEND_API_KEY missing',
      to: payload.to,
      subject: payload.subject,
    })
    return {
      status: 'skipped',
      reason: 'RESEND_API_KEY missing',
    }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resend.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resend.from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('[behawior15][email] failed', {
        status: response.status,
        body,
        to: payload.to,
        subject: payload.subject,
      })
      return {
        status: 'failed',
        reason: `Resend HTTP ${response.status}`,
      }
    }

    console.info('[behawior15][email] sent', {
      to: payload.to,
      subject: payload.subject,
    })
    return {
      status: 'sent',
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'Unknown Resend error'
    console.error('[behawior15][email] failed', {
      reason,
      to: payload.to,
      subject: payload.subject,
    })
    return {
      status: 'failed',
      reason,
    }
  }
}

export async function sendBookingReservationCreatedEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const subject = `Rezerwacja przyjęta - Behawior 15 - ${summary}`
  const html = renderEmailShell(
    'Mamy Twoją rezerwację',
    'Termin został chwilowo zablokowany i czeka na płatność. To pierwszy krok do spokojniejszego planu działania.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Kwota:</strong> ${formatPricePln(booking.amount)}</p>
      <p><strong>Co dalej:</strong> dokończ płatność, aby ostatecznie potwierdzić konsultację i odblokować link do rozmowy.</p>
      ${renderContactBlockHtml()}
    `,
    'Po opłaceniu od razu wyślemy finalne potwierdzenie. Jeśli nie dokończysz płatności, slot automatycznie wróci do terminarza.',
  )
  const text = [
    'Behawior 15 - rezerwacja przyjęta.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Kwota: ${formatPricePln(booking.amount)}`,
    'Co dalej: dokończ płatność, aby ostatecznie potwierdzić konsultację i odblokować link do rozmowy.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail({ to: booking.email, subject, html, text })
}

export async function sendBookingConfirmationEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const subject = `Potwierdzenie konsultacji - Behawior 15 - ${summary}`
  const html = renderEmailShell(
    'Konsultacja potwierdzona',
    'Płatność została przyjęta, a Twój termin jest już przypisany do Ciebie.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Opis zgłoszenia:</strong> ${booking.description}</p>
      <p><strong>Link do rozmowy:</strong> <a href="${booking.meetingUrl}">${booking.meetingUrl}</a></p>
      <p><strong>Co dalej:</strong> wejdź 3-5 minut przed czasem i przygotuj najważniejsze obserwacje oraz pytania. Po rozmowie dostaniesz jasny następny krok zamiast ogólnych porad.</p>
      ${renderContactBlockHtml()}
    `,
    'Jeśli będzie potrzebny kolejny krok po rozmowie, dostaniesz jasną rekomendację zamiast ogólnych porad.',
  )
  const text = [
    'Twoja konsultacja Behawior 15 została potwierdzona.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Opis: ${booking.description}`,
    `Link do rozmowy: ${booking.meetingUrl}`,
    'Co dalej: wejdź 3-5 minut przed czasem i przygotuj najważniejsze obserwacje oraz pytania. Po rozmowie dostaniesz jasny następny krok zamiast ogólnych porad.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail({ to: booking.email, subject, html, text })
}

export async function sendBookingReminderEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const subject = 'Przypomnienie: konsultacja Behawior 15 startuje za mniej niż godzinę'
  const html = renderEmailShell(
    'Przypomnienie o konsultacji',
    'Za mniej niż godzinę startuje Twoja rozmowa. Warto wejść chwilę wcześniej, żeby zacząć spokojnie i bez pośpiechu.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Link do rozmowy:</strong> <a href="${booking.meetingUrl}">${booking.meetingUrl}</a></p>
      <p><strong>Przed rozmową:</strong> przygotuj 2-3 najważniejsze pytania i najkrótszy możliwy opis problemu.</p>
      ${renderContactBlockHtml()}
    `,
    'Do usłyszenia. To będzie krótka rozmowa, ale z konkretnym kierunkiem działania.',
  )
  const text = [
    'Przypomnienie o konsultacji Behawior 15.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Link do rozmowy: ${booking.meetingUrl}`,
    'Przed rozmową przygotuj 2-3 najważniejsze pytania i najkrótszy możliwy opis problemu.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail({ to: booking.email, subject, html, text })
}

export async function sendTestimonialSubmissionEmail(submission: TestimonialSubmission): Promise<DeliveryResult> {
  const recipient = getExplicitContactEmail()
  const configIssue = getTestimonialSubmissionConfigIssue()

  if (!recipient || configIssue) {
    return {
      status: 'skipped',
      reason: configIssue ?? 'BEHAVIOR15_CONTACT_EMAIL missing or invalid',
    }
  }

  const subject = `Nowe zgłoszenie opinii do weryfikacji - Behawior 15 - ${submission.displayName}`
  const photoBlock = submission.photoUrl
    ? `<p><strong>Link do zdjęcia:</strong> <a href="${escapeHtml(submission.photoUrl)}">${escapeHtml(submission.photoUrl)}</a></p>`
    : '<p><strong>Link do zdjęcia:</strong> klient nie dodał linku.</p>'
  const html = renderEmailShell(
    'Nowa opinia czeka na weryfikację',
    'Klient wysłał opinię przez formularz na stronie. Wpis nie jest jeszcze opublikowany.',
    `
      <p><strong>Imię do publikacji:</strong> ${escapeHtml(submission.displayName)}</p>
      <p><strong>Email do kontaktu:</strong> <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a></p>
      <p><strong>Kategoria problemu:</strong> ${escapeHtml(submission.issueCategory)}</p>
      <p><strong>Treść opinii:</strong><br />${formatMultilineHtml(submission.opinion)}</p>
      <p><strong>Co się zmieniło:</strong><br />${formatMultilineHtml(submission.beforeAfter)}</p>
      ${photoBlock}
      <p><strong>Status:</strong> wpis nadal wymaga ręcznej akceptacji i ręcznego dodania do statycznej listy opinii.</p>
    `,
    'Po akceptacji zapisz zdjęcie lokalnie i dopisz nowy wpis do lib/testimonials.ts przed kolejnym deployem.',
  )
  const text = [
    'Nowa opinia czeka na weryfikację. Wpis nie jest jeszcze opublikowany.',
    `Imię do publikacji: ${submission.displayName}`,
    `Email do kontaktu: ${submission.email}`,
    `Kategoria problemu: ${submission.issueCategory}`,
    `Treść opinii: ${submission.opinion}`,
    `Co się zmieniło: ${submission.beforeAfter}`,
    `Link do zdjęcia: ${submission.photoUrl || 'brak'}`,
    'Status: wpis nadal wymaga ręcznej akceptacji i ręcznego dodania do statycznej listy opinii.',
  ].join('\n')

  return deliverEmail({ to: recipient, subject, html, text })
}
