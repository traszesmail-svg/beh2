import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { getContactDetails, getPublicContactDetails } from '@/lib/site'
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

type EmailAudience = 'customer' | 'internal'

type ManualPaymentReviewLinks = {
  approveUrl: string
  rejectUrl: string
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
  const configuredFromStatus = !configuredFrom ? 'missing' : isValidResendFrom(configuredFrom) ? 'valid' : 'invalid'
  const from = configuredFromStatus === 'valid' ? configuredFrom : DEFAULT_RESEND_FROM_EMAIL

  return {
    apiKey,
    from,
    configuredFrom,
    configuredFromStatus,
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

function extractEmailAddress(value: string): string {
  const match = value.match(/<([^>]+)>/)
  return (match?.[1]?.trim() ?? value.trim()).toLowerCase()
}

function isResendTestingSender(value: string): boolean {
  return extractEmailAddress(value).endsWith('@resend.dev')
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

function getNotificationRecipientEmail(): string | null {
  return getContactDetails().email
}

function getAdminNotificationRecipientEmail(): string | null {
  return process.env.ADMIN_NOTIFICATION_EMAIL?.trim() || getNotificationRecipientEmail()
}

export function getTestimonialSubmissionConfigIssue(): string | null {
  const resend = getResendConfig()

  if (!resend.apiKey) {
    return 'RESEND_API_KEY missing'
  }

  if (resend.configuredFromStatus !== 'valid') {
    return 'RESEND_FROM_EMAIL missing or invalid'
  }

  if (!getNotificationRecipientEmail()) {
    return 'public contact email missing or invalid'
  }

  return null
}

export function getCustomerEmailDeliveryConfigIssue(recipientEmail?: string | null): string | null {
  const resend = getResendConfig()

  if (!resend.apiKey) {
    return 'RESEND_API_KEY missing'
  }

  if (resend.configuredFromStatus === 'invalid') {
    return 'RESEND_FROM_EMAIL missing or invalid'
  }

  if (!isValidResendFrom(resend.from)) {
    return 'RESEND_FROM_EMAIL missing or invalid'
  }

  if (!isResendTestingSender(resend.from)) {
    return null
  }

  const allowedRecipient = getNotificationRecipientEmail()?.toLowerCase() ?? null
  const normalizedRecipient = recipientEmail?.trim().toLowerCase() ?? null

  if (allowedRecipient && normalizedRecipient === allowedRecipient) {
    return null
  }

  return allowedRecipient
    ? `RESEND_FROM_EMAIL uses resend.dev testing mode. Verify a domain to send customer emails to recipients other than ${allowedRecipient}.`
    : 'RESEND_FROM_EMAIL uses resend.dev testing mode. Verify a domain to send customer emails to external recipients.'
}

function buildBookingSummary(booking: BookingRecord): string {
  return `${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)} | ${getProblemLabel(booking.problemType)}`
}

function renderContactBlockHtml() {
  const contact = getPublicContactDetails()
  const parts = []

  if (contact.email) {
    parts.push(`<p><strong>Kontakt:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>`)
  }

  if (!parts.length) {
    parts.push('<p><strong>Kontakt:</strong> odpowiedz na tę wiadomość, jeśli potrzebujesz doprecyzowania terminu.</p>')
  }

  return parts.join('')
}

function renderContactBlockText() {
  const contact = getPublicContactDetails()
  const lines = []

  if (contact.email) {
    lines.push(`Kontakt: ${contact.email}`)
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
  return (
    (booking.bookingStatus === 'pending' && booking.paymentStatus === 'unpaid') ||
    (booking.bookingStatus === 'pending_manual_payment' && booking.paymentStatus === 'pending_manual_review')
  )
}

async function deliverEmail(payload: SendEmailPayload, audience: EmailAudience = 'internal'): Promise<DeliveryResult> {
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

  if (audience === 'internal' && resend.configuredFromStatus === 'invalid') {
    console.warn('[behawior15][email] invalid RESEND_FROM_EMAIL, using resend.dev fallback for internal delivery only', {
      configuredFrom: resend.configuredFrom,
      to: payload.to,
      subject: payload.subject,
    })
  }

  if (audience === 'customer') {
    const configIssue = getCustomerEmailDeliveryConfigIssue(payload.to)

    if (configIssue) {
      console.warn('[behawior15][email] skip', {
        reason: configIssue,
        to: payload.to,
        subject: payload.subject,
      })
      return {
        status: 'skipped',
        reason: configIssue,
      }
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

  return deliverEmail({ to: booking.email, subject, html, text }, 'customer')
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

  return deliverEmail({ to: booking.email, subject, html, text }, 'customer')
}

export async function sendManualPaymentReportedAdminEmail(
  booking: BookingRecord,
  links: ManualPaymentReviewLinks,
): Promise<DeliveryResult> {
  const recipient = getAdminNotificationRecipientEmail()
  const customerEmailIssue = getCustomerEmailDeliveryConfigIssue(booking.email)

  if (!recipient) {
    return {
      status: 'skipped',
      reason: 'ADMIN_NOTIFICATION_EMAIL missing',
    }
  }

  const subject = `Płatność do potwierdzenia do 60 min - Behawior 15 - ${buildBookingSummary(booking)}`
  const html = renderEmailShell(
    'Wpłata czeka na decyzję',
    'Klient kliknął "Zapłaciłem". Sprawdź wpływ i kliknij właściwą decyzję.',
    `
      <p><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
      <p><strong>Tytuł płatności:</strong> ${escapeHtml(booking.paymentReference ?? booking.id)}</p>
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Kwota:</strong> ${formatPricePln(booking.amount)}</p>
      <p><strong>Klient:</strong> ${escapeHtml(booking.ownerName)} | <a href="mailto:${escapeHtml(booking.email)}">${escapeHtml(booking.email)}</a> | ${escapeHtml(booking.phone)}</p>
      <p><strong>Opis:</strong> ${formatMultilineHtml(booking.description)}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px;">
        <a href="${links.approveUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0a5c36;color:#ffffff;text-decoration:none;font-weight:700;">Jest wpłata - potwierdź i otwórz pokój</a>
        <a href="${links.rejectUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#8a3022;color:#ffffff;text-decoration:none;font-weight:700;">Nie ma wpłaty</a>
      </div>
    `,
    customerEmailIssue
      ? 'Po potwierdzeniu klient od razu zobaczy aktywne potwierdzenie i pokój na swojej stronie rezerwacji. Wysyłka maili do innych adresów ruszy po weryfikacji domeny nadawcy w Resend.'
      : 'Po potwierdzeniu klient automatycznie dostanie mail z linkiem do pokoju rozmowy, a przy braku wpłaty wróci do płatności.',
  )
  const text = [
    'Płatność czeka na potwierdzenie do 60 min.',
    `Booking ID: ${booking.id}`,
    `Tytuł płatności: ${booking.paymentReference ?? booking.id}`,
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Kwota: ${formatPricePln(booking.amount)}`,
    `Klient: ${booking.ownerName} | ${booking.email} | ${booking.phone}`,
    `Opis: ${booking.description}`,
    `Jest wpłata: ${links.approveUrl}`,
    `Nie ma wpłaty: ${links.rejectUrl}`,
  ].join('\n')

  return deliverEmail({ to: recipient, subject, html, text }, 'internal')
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

  return deliverEmail({ to: booking.email, subject, html, text }, 'customer')
}

export async function sendTestimonialSubmissionEmail(submission: TestimonialSubmission): Promise<DeliveryResult> {
  const recipient = getNotificationRecipientEmail()
  const configIssue = getTestimonialSubmissionConfigIssue()

  if (!recipient || configIssue) {
    return {
      status: 'skipped',
      reason: configIssue ?? 'public contact email missing or invalid',
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

  return deliverEmail({ to: recipient, subject, html, text }, 'internal')
}
