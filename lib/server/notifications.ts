import nodemailer from 'nodemailer'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { getContactDetails, getPublicContactDetails } from '@/lib/site'
import { BookingRecord } from '@/lib/types'

const DEFAULT_RESEND_FROM_EMAIL = 'Behawior 15 <onboarding@resend.dev>'
const DEFAULT_MAIL_PROVIDER = 'resend'

type SendEmailPayload = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

type DeliveryResult = {
  status: 'sent' | 'skipped' | 'failed'
  reason?: string
}

type EmailAudience = 'customer' | 'internal'

export type CustomerEmailDeliveryState = 'ready' | 'disabled' | 'blocked'

export type CustomerEmailDeliveryStatus = {
  state: CustomerEmailDeliveryState
  mode: 'auto' | 'disabled' | 'invalid'
  issue: string | null
  summary: string
  nextStep: string
}

type MailProvider = 'resend' | 'gmail'

type MailProviderConfig =
  | {
      provider: 'resend'
      apiKey: string | null
      from: string
      configuredFrom: string | null
      configuredFromStatus: 'missing' | 'invalid' | 'valid'
    }
  | {
      provider: 'gmail'
      smtpUser: string | null
      smtpAppPassword: string | null
      from: string | null
      fromStatus: 'missing' | 'invalid' | 'valid'
    }

let gmailTransport: nodemailer.Transporter | null = null

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

function getResendConfig(): Extract<MailProviderConfig, { provider: 'resend' }> {
  const apiKey = process.env.RESEND_API_KEY?.trim() || null
  const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim() || null
  const configuredFromStatus: 'missing' | 'invalid' | 'valid' = !configuredFrom
    ? 'missing'
    : isValidResendFrom(configuredFrom)
      ? 'valid'
      : 'invalid'
  const from: string =
    configuredFromStatus === 'valid' ? configuredFrom ?? DEFAULT_RESEND_FROM_EMAIL : DEFAULT_RESEND_FROM_EMAIL

  return {
    provider: 'resend' as const,
    apiKey,
    from,
    configuredFrom,
    configuredFromStatus,
  }
}

function getMailProvider(): MailProvider | 'invalid' {
  const raw = process.env.MAIL_PROVIDER?.trim().toLowerCase() || DEFAULT_MAIL_PROVIDER

  if (raw === 'resend' || raw === 'gmail') {
    return raw
  }

  return 'invalid'
}

function getGmailConfig(): MailProviderConfig {
  const smtpUser = process.env.GMAIL_SMTP_USER?.trim() || null
  const smtpAppPassword = process.env.GMAIL_SMTP_APP_PASSWORD?.trim() || null
  const configuredFrom = process.env.GMAIL_FROM_EMAIL?.trim() || smtpUser
  const fromStatus = !configuredFrom ? 'missing' : isValidPublicEmail(configuredFrom) ? 'valid' : 'invalid'

  return {
    provider: 'gmail',
    smtpUser,
    smtpAppPassword,
    from: fromStatus === 'valid' ? configuredFrom : null,
    fromStatus,
  }
}

function getMailProviderConfig(): MailProviderConfig | { provider: 'invalid' } {
  const provider = getMailProvider()

  if (provider === 'invalid') {
    return { provider }
  }

  return provider === 'gmail' ? getGmailConfig() : getResendConfig()
}

function getCustomerEmailModeConfig(): { mode: 'auto' | 'disabled' | 'invalid'; raw: string | null } {
  const raw = process.env.CUSTOMER_EMAIL_MODE?.trim().toLowerCase() || null

  if (!raw || raw === 'auto') {
    return {
      mode: 'auto',
      raw,
    }
  }

  if (raw === 'disabled') {
    return {
      mode: 'disabled',
      raw,
    }
  }

  return {
    mode: 'invalid',
    raw,
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
  const mail = getMailProviderConfig()

  if (mail.provider === 'invalid') {
    return 'MAIL_PROVIDER invalid'
  }

  if (mail.provider === 'resend') {
    if (!mail.apiKey) {
      return 'RESEND_API_KEY missing'
    }

    if (mail.configuredFromStatus !== 'valid') {
      return 'RESEND_FROM_EMAIL missing or invalid'
    }
  } else {
    if (!mail.smtpUser) {
      return 'GMAIL_SMTP_USER missing'
    }

    if (!mail.smtpAppPassword) {
      return 'GMAIL_SMTP_APP_PASSWORD missing'
    }

    if (mail.fromStatus !== 'valid') {
      return 'GMAIL_FROM_EMAIL missing or invalid'
    }
  }

  if (!getNotificationRecipientEmail()) {
    return 'public contact email missing or invalid'
  }

  return null
}

export function getCustomerEmailDeliveryStatus(recipientEmail?: string | null): CustomerEmailDeliveryStatus {
  const modeConfig = getCustomerEmailModeConfig()
  const mail = getMailProviderConfig()

  if (modeConfig.mode === 'invalid') {
    return {
      state: 'blocked',
      mode: 'invalid',
      issue: `CUSTOMER_EMAIL_MODE has invalid value "${modeConfig.raw}".`,
      summary: 'Tryb maili klienta jest zablokowany, bo CUSTOMER_EMAIL_MODE ma nieprawidłową wartość.',
      nextStep: 'Ustaw CUSTOMER_EMAIL_MODE=auto albo CUSTOMER_EMAIL_MODE=disabled.',
    }
  }

  if (modeConfig.mode === 'disabled') {
    return {
      state: 'disabled',
      mode: 'disabled',
      issue: 'CUSTOMER_EMAIL_MODE=disabled',
      summary:
        'Maile klienta są świadomie wyłączone. Status płatności, materiały i link do rozmowy pozostają na stronie potwierdzenia rezerwacji.',
      nextStep:
        'Zostaw ten tryb tymczasowo albo po weryfikacji domeny nadawcy przełącz CUSTOMER_EMAIL_MODE=auto i ustaw RESEND_FROM_EMAIL na zweryfikowany adres.',
    }
  }

  if (mail.provider === 'invalid') {
    return {
      state: 'blocked',
      mode: 'auto',
      issue: 'MAIL_PROVIDER invalid',
      summary: 'Wysyłka maili do klientów jest zablokowana, bo MAIL_PROVIDER ma nieprawidłową wartość.',
      nextStep: 'Ustaw MAIL_PROVIDER=resend albo MAIL_PROVIDER=gmail.',
    }
  }

  if (mail.provider === 'gmail') {
    if (!mail.smtpUser) {
      return {
        state: 'blocked',
        mode: 'auto',
        issue: 'GMAIL_SMTP_USER missing',
        summary: 'Wysyłka maili do klientów jest zablokowana, bo brakuje GMAIL_SMTP_USER.',
        nextStep: 'Ustaw GMAIL_SMTP_USER i powtórz próbę wysyłki.',
      }
    }

    if (!mail.smtpAppPassword) {
      return {
        state: 'blocked',
        mode: 'auto',
        issue: 'GMAIL_SMTP_APP_PASSWORD missing',
        summary: 'Wysyłka maili do klientów jest zablokowana, bo brakuje GMAIL_SMTP_APP_PASSWORD.',
        nextStep: 'Wygeneruj Gmail App Password i ustaw GMAIL_SMTP_APP_PASSWORD.',
      }
    }

    if (mail.fromStatus !== 'valid' || !mail.from) {
      return {
        state: 'blocked',
        mode: 'auto',
        issue: 'GMAIL_FROM_EMAIL missing or invalid',
        summary: 'Wysyłka maili do klientów jest zablokowana, bo GMAIL_FROM_EMAIL jest pusty albo nieprawidłowy.',
        nextStep: 'Ustaw poprawny adres nadawcy w GMAIL_FROM_EMAIL albo użyj poprawnego GMAIL_SMTP_USER.',
      }
    }

    return {
      state: 'ready',
      mode: 'auto',
      issue: null,
      summary: 'Wysyłka maili do klientów zewnętrznych jest gotowa z aktualnej konfiguracji Gmail SMTP.',
      nextStep: 'Brak blokera po stronie konfiguracji maili klienta.',
    }
  }

  if (!mail.apiKey) {
    return {
      state: 'blocked',
      mode: 'auto',
      issue: 'RESEND_API_KEY missing',
      summary: 'Wysyłka maili do klientów jest zablokowana, bo brakuje RESEND_API_KEY.',
      nextStep: 'Uzupełnij RESEND_API_KEY i powtórz próbę wysyłki na zewnętrzny adres testowy.',
    }
  }

  if (mail.configuredFromStatus === 'invalid') {
    return {
      state: 'blocked',
      mode: 'auto',
      issue: 'RESEND_FROM_EMAIL missing or invalid',
      summary: 'Wysyłka maili do klientów jest zablokowana, bo RESEND_FROM_EMAIL jest pusty albo nieprawidłowy.',
      nextStep: 'Ustaw poprawny adres nadawcy w RESEND_FROM_EMAIL.',
    }
  }

  if (!isValidResendFrom(mail.from)) {
    return {
      state: 'blocked',
      mode: 'auto',
      issue: 'RESEND_FROM_EMAIL missing or invalid',
      summary: 'Wysyłka maili do klientów jest zablokowana, bo RESEND_FROM_EMAIL jest pusty albo nieprawidłowy.',
      nextStep: 'Ustaw poprawny adres nadawcy w RESEND_FROM_EMAIL.',
    }
  }

  if (!isResendTestingSender(mail.from)) {
    return {
      state: 'ready',
      mode: 'auto',
      issue: null,
      summary: 'Wysyłka maili do klientów zewnętrznych jest gotowa z aktualnej konfiguracji Resend.',
      nextStep: 'Brak blokera po stronie konfiguracji maili klienta.',
    }
  }

  const allowedRecipient = getNotificationRecipientEmail()?.toLowerCase() ?? null
  const normalizedRecipient = recipientEmail?.trim().toLowerCase() ?? null

  if (allowedRecipient && normalizedRecipient === allowedRecipient) {
    return {
      state: 'ready',
      mode: 'auto',
      issue: null,
      summary: 'Wysyłka maili do klientów zewnętrznych jest gotowa z aktualnej konfiguracji Resend.',
      nextStep: 'Brak blokera po stronie konfiguracji maili klienta.',
    }
  }

  return {
    state: 'blocked',
    mode: 'auto',
    issue: allowedRecipient
      ? `RESEND_FROM_EMAIL uses resend.dev testing mode. Verify a domain to send customer emails to recipients other than ${allowedRecipient}.`
      : 'RESEND_FROM_EMAIL uses resend.dev testing mode. Verify a domain to send customer emails to external recipients.',
    summary: 'Wysyłka maili do klientów zewnętrznych jest zablokowana, bo RESEND_FROM_EMAIL nadal korzysta z resend.dev testing mode.',
    nextStep: 'Zweryfikuj domene nadawcy w Resend i ustaw RESEND_FROM_EMAIL na adres z tej domeny.',
  }
}

export function getCustomerEmailDeliveryConfigIssue(recipientEmail?: string | null): string | null {
  const status = getCustomerEmailDeliveryStatus(recipientEmail)

  return status.state === 'ready' ? null : status.issue
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
          <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">${escapeHtml(title)}</h1>
        </div>
        <div style="padding:28px;line-height:1.65;font-size:15px;">
          <p style="margin-top:0;">${escapeHtml(intro)}</p>
          ${content}
          <p>${escapeHtml(outro)}</p>
          <p style="margin-bottom:0;color:#6b625b;font-size:13px;">Wiadomość wysłana automatycznie przez Behawior 15.</p>
        </div>
      </div>
    </div>
  `
}

type BookingEmailFact = {
  label: string
  htmlValue: string
  textValue: string
}

function renderBookingEmailFacts(facts: BookingEmailFact[]) {
  return {
    html: facts.map((fact) => `<p><strong>${escapeHtml(fact.label)}:</strong> ${fact.htmlValue}</p>`).join(''),
    text: facts.map((fact) => `${fact.label}: ${fact.textValue}`).join('\n'),
  }
}

function buildBookingCustomerEmail(
  booking: BookingRecord,
  subject: string,
  title: string,
  intro: string,
  facts: BookingEmailFact[],
  outro: string,
) {
  const renderedFacts = renderBookingEmailFacts(facts)

  return {
    to: booking.email,
    subject,
    html: renderEmailShell(title, intro, renderedFacts.html, outro),
    text: [intro, renderedFacts.text, outro, renderContactBlockText()].join('\n'),
  }
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
  const mail = getMailProviderConfig()

  if (mail.provider === 'invalid') {
    console.warn('[behawior15][email] skip', {
      reason: 'MAIL_PROVIDER invalid',
      to: payload.to,
      subject: payload.subject,
    })
    return {
      status: 'skipped',
      reason: 'MAIL_PROVIDER invalid',
    }
  }

  if (mail.provider === 'resend' && !mail.apiKey) {
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

  if (mail.provider === 'resend' && audience === 'internal' && mail.configuredFromStatus === 'invalid') {
    console.warn('[behawior15][email] invalid RESEND_FROM_EMAIL, using resend.dev fallback for internal delivery only', {
      configuredFrom: mail.configuredFrom,
      to: payload.to,
      subject: payload.subject,
    })
  }

  if (audience === 'customer') {
    const customerEmailStatus = getCustomerEmailDeliveryStatus(payload.to)

    if (customerEmailStatus.state !== 'ready') {
      const reason = customerEmailStatus.issue ?? customerEmailStatus.summary
      console.warn('[behawior15][email] skip', {
        reason,
        state: customerEmailStatus.state,
        to: payload.to,
        subject: payload.subject,
      })
      return {
        status: 'skipped',
        reason,
      }
    }
  }

  try {
    if (mail.provider === 'gmail') {
      if (!mail.smtpUser || !mail.smtpAppPassword || !mail.from) {
        return {
          status: 'skipped',
          reason: 'Gmail SMTP not fully configured',
        }
      }

      if (!gmailTransport) {
        gmailTransport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: mail.smtpUser,
            pass: mail.smtpAppPassword,
          },
        })
      }

      const replyTo = payload.replyTo ?? getPublicContactDetails().email ?? undefined

      await gmailTransport.sendMail({
        from: mail.from,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        replyTo,
      })

      console.info('[behawior15][email] sent', {
        provider: mail.provider,
        to: payload.to,
        subject: payload.subject,
      })
      return {
        status: 'sent',
      }
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mail.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: mail.from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
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
      provider: mail.provider,
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
  const customerEmailStatus = getCustomerEmailDeliveryStatus(booking.email)
  const emailDeliveryNote =
    customerEmailStatus.state === 'ready'
      ? 'Po potwierdzeniu klient automatycznie dostanie mail z linkiem do pokoju rozmowy, a przy braku wpłaty wróci do płatności.'
      : customerEmailStatus.state === 'disabled'
        ? 'Po potwierdzeniu klient od razu zobaczy aktywne potwierdzenie i pokój na swojej stronie rezerwacji. Maile klienta są teraz świadomie wyłączone, więc link do rozmowy zostaje na stronie potwierdzenia.'
        : 'Po potwierdzeniu klient od razu zobaczy aktywne potwierdzenie i pokój na swojej stronie rezerwacji. Wysyłka maili do innych adresów ruszy po naprawie konfiguracji Resend.'
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
    emailDeliveryNote,
  )
  const text = [
    'Behawior 15 - rezerwacja przyjęta.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Kwota: ${formatPricePln(booking.amount)}`,
    'Co dalej: dokończ płatność, aby ostatecznie potwierdzić konsultację i odblokować link do rozmowy.',
    emailDeliveryNote,
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail({ to: booking.email, subject, html, text }, 'customer')
}

export type ContactLeadSubmission = {
  name: string
  email: string
  topic: string
  message: string
  contextLabel: string
  bookingId?: string | null
  website?: string | null
}

export async function sendContactLeadEmail(submission: ContactLeadSubmission): Promise<DeliveryResult> {
  const recipient = getPublicContactDetails().email

  if (!recipient) {
    return {
      status: 'skipped',
      reason: 'public contact email missing or invalid',
    }
  }

  const subject = `Kontakt - ${submission.topic} - ${submission.name}`
  const contactValue = submission.email.trim()
  const replyTo = isValidPublicEmail(contactValue) ? contactValue : undefined
  const contextBlock = submission.bookingId
    ? `<p><strong>Numer rezerwacji:</strong> ${escapeHtml(submission.bookingId)}</p>`
    : ''
  const html = renderEmailShell(
    'Nowa wiadomosc z formularza kontaktu',
    'Ktos wyslal wiadomosc przez formularz kontaktowy. To jest pierwszy krok do odpowiedzi i uporzadkowania kolejnego ruchu.',
    `
      <p><strong>Imie:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Kontakt:</strong> ${replyTo ? `<a href="mailto:${escapeHtml(contactValue)}">${escapeHtml(contactValue)}</a>` : escapeHtml(contactValue)}</p>
      <p><strong>Temat:</strong> ${escapeHtml(submission.topic)}</p>
      <p><strong>Kontekst:</strong> ${escapeHtml(submission.contextLabel)}</p>
      ${contextBlock}
      <p><strong>Wiadomosc:</strong><br />${formatMultilineHtml(submission.message)}</p>
    `,
    'Odpowiedz na podany adres e-mail albo wróć do kontaktu, jeśli potrzebujesz doprecyzować szczegóły.',
  )
  const text = [
    'Nowa wiadomosc z formularza kontaktu.',
    `Imie: ${submission.name}`,
    `Kontakt: ${contactValue}`,
    `Temat: ${submission.topic}`,
    `Kontekst: ${submission.contextLabel}`,
    submission.bookingId ? `Numer rezerwacji: ${submission.bookingId}` : null,
    `Wiadomosc: ${submission.message}`,
    'Odpowiedz na podany adres e-mail albo wróć do kontaktu, jeśli potrzebujesz doprecyzować szczegóły.',
  ]
    .filter((line): line is string => typeof line === 'string' && line.length > 0)
    .join('\n')

  return deliverEmail(
    {
      to: recipient,
      subject,
      html,
      text,
      replyTo,
    },
    'internal',
  )
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

export async function sendBookingManualPaymentPendingEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const paymentReference = booking.paymentReference ?? booking.id
  const subject = `Wpłata zgłoszona - czekamy na potwierdzenie - Behawior 15 - ${summary}`
  const intro = 'Dostałem zgłoszenie wpłaty ręcznej. Sprawdzę je do 60 minut.'
  const facts = [
    {
      label: 'Termin',
      htmlValue: escapeHtml(formatDateTimeLabel(booking.bookingDate, booking.bookingTime)),
      textValue: formatDateTimeLabel(booking.bookingDate, booking.bookingTime),
    },
    {
      label: 'Temat',
      htmlValue: escapeHtml(getProblemLabel(booking.problemType)),
      textValue: getProblemLabel(booking.problemType),
    },
    {
      label: 'Kwota',
      htmlValue: escapeHtml(formatPricePln(booking.amount)),
      textValue: formatPricePln(booking.amount),
    },
    {
      label: 'Tytuł wpłaty',
      htmlValue: escapeHtml(paymentReference),
      textValue: paymentReference,
    },
    {
      label: 'Następny krok',
      htmlValue: escapeHtml('Po akceptacji dostaniesz mail z linkiem do pokoju rozmowy.'),
      textValue: 'Po akceptacji dostaniesz mail z linkiem do pokoju rozmowy.',
    },
  ]
  const outro = 'Do czasu potwierdzenia status rezerwacji pozostaje na stronie potwierdzenia.'
  const email = buildBookingCustomerEmail(booking, subject, 'Wpłata jest w weryfikacji', intro, facts, outro)

  return deliverEmail(email, 'customer')
}

export async function sendBookingStatusOutcomeEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const outcome =
    booking.paymentStatus === 'refunded'
      ? {
          subject: `Rezerwacja anulowana - Behawior 15 - ${summary}`,
          title: 'Rezerwacja została anulowana',
          intro: 'Zwrot został uruchomiony, a termin wrócił do kalendarza.',
          statusLabel: 'Zwrot',
          reasonLabel: 'Powód',
          nextStep: 'Jeśli chcesz wrócić do konsultacji, wybierz nowy termin albo napisz wiadomość.',
        }
      : booking.paymentStatus === 'rejected'
        ? {
            subject: `Wpłata nie została potwierdzona - Behawior 15 - ${summary}`,
            title: 'Wpłata nie została potwierdzona',
            intro: 'Nie udało się potwierdzić wpłaty, więc termin wrócił do kalendarza.',
            statusLabel: 'Status',
            reasonLabel: 'Powód',
            nextStep: 'Jeśli chcesz wrócić do konsultacji, wybierz nowy termin albo napisz wiadomość.',
          }
        : booking.paymentStatus === 'failed'
          ? {
              subject: `Płatność nie została dokończona - Behawior 15 - ${summary}`,
              title: 'Płatność nie została dokończona',
              intro: 'Płatność online nie została zakończona i termin wrócił do kalendarza.',
              statusLabel: 'Status',
              reasonLabel: 'Powód',
              nextStep: 'Jeśli chcesz wrócić do konsultacji, wybierz nowy termin albo napisz wiadomość.',
            }
          : {
              subject: `Rezerwacja wygasła - Behawior 15 - ${summary}`,
              title: 'Rezerwacja wygasła',
              intro: 'Czas na potwierdzenie minął, więc termin wrócił do kalendarza.',
              statusLabel: 'Status',
              reasonLabel: 'Powód',
              nextStep: 'Jeśli chcesz wrócić do konsultacji, wybierz nowy termin albo napisz wiadomość.',
            }

  const facts: BookingEmailFact[] = [
    {
      label: 'Termin',
      htmlValue: escapeHtml(formatDateTimeLabel(booking.bookingDate, booking.bookingTime)),
      textValue: formatDateTimeLabel(booking.bookingDate, booking.bookingTime),
    },
    {
      label: 'Temat',
      htmlValue: escapeHtml(getProblemLabel(booking.problemType)),
      textValue: getProblemLabel(booking.problemType),
    },
    {
      label: outcome.statusLabel,
      htmlValue: escapeHtml(booking.paymentStatus),
      textValue: booking.paymentStatus,
    },
  ]

  if (booking.paymentRejectedReason) {
    facts.push({
      label: outcome.reasonLabel,
      htmlValue: escapeHtml(booking.paymentRejectedReason),
      textValue: booking.paymentRejectedReason,
    })
  }

  facts.push({
    label: 'Następny krok',
    htmlValue: escapeHtml(outcome.nextStep),
    textValue: outcome.nextStep,
  })

  const email = buildBookingCustomerEmail(booking, outcome.subject, outcome.title, outcome.intro, facts, 'Możesz wrócić do rezerwacji w dowolnym momencie.')

  return deliverEmail(email, 'customer')
}

export async function sendManualPaymentReportedAdminEmail(
  booking: BookingRecord,
  links: ManualPaymentReviewLinks,
): Promise<DeliveryResult> {
  const recipient = getAdminNotificationRecipientEmail()
  const customerEmailStatus = getCustomerEmailDeliveryStatus(booking.email)

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
    customerEmailStatus.state !== 'ready'
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

export type OpinionSubmission = {
  displayName: string
  species: 'pies' | 'kot'
  topic: string
  opinion: string
  consentPublish: boolean
}

export async function sendOpinionSubmissionEmail(submission: OpinionSubmission): Promise<DeliveryResult> {
  const recipient = getNotificationRecipientEmail()

  if (!recipient) {
    return {
      status: 'skipped',
      reason: 'public contact email missing or invalid',
    }
  }

  const speciesLabel = submission.species === 'kot' ? 'Kot' : 'Pies'
  const subject = `Nowa opinia do ręcznej akceptacji - Behawior 15 - ${submission.displayName}`
  const html = renderEmailShell(
    'Nowa opinia do sprawdzenia',
    'Klient wysłał opinię przez ukryty formularz po konsultacji. To nie jest jeszcze wpis publikowany.',
    `
      <p><strong>Imię lub inicjały:</strong> ${escapeHtml(submission.displayName)}</p>
      <p><strong>Gatunek:</strong> ${escapeHtml(speciesLabel)}</p>
      <p><strong>Temat:</strong> ${escapeHtml(submission.topic)}</p>
      <p><strong>Zgoda na publikację:</strong> ${submission.consentPublish ? 'tak' : 'nie'}</p>
      <p><strong>Treść opinii:</strong><br />${formatMultilineHtml(submission.opinion)}</p>
      <p><strong>Status:</strong> wpis czeka na ręczną akceptację i dodanie do publicznej listy opinii.</p>
    `,
    'Po akceptacji dodaj wpis ręcznie do publicznej listy opinii przed kolejnym publikowaniem strony.',
  )
  const text = [
    'Nowa opinia do ręcznej akceptacji.',
    `Imię lub inicjały: ${submission.displayName}`,
    `Gatunek: ${speciesLabel}`,
    `Temat: ${submission.topic}`,
    `Zgoda na publikację: ${submission.consentPublish ? 'tak' : 'nie'}`,
    `Treść opinii: ${submission.opinion}`,
    'Status: wpis czeka na ręczną akceptację i dodanie do publicznej listy opinii.',
    'Po akceptacji dodaj wpis ręcznie do publicznej listy opinii przed kolejnym publikowaniem strony.',
  ].join('\n')

  return deliverEmail({ to: recipient, subject, html, text }, 'internal')
}
