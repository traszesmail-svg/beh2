import nodemailer from 'nodemailer'
import type { LeadMagnet } from '@/lib/growth-layer'
import { formatDateTimeLabel, getProblemLabel } from '@/lib/data'
import { formatPricePln } from '@/lib/pricing'
import { getContactDetails, getPublicContactDetails } from '@/lib/site'
import { getBaseUrl } from '@/lib/server/env'
import { getManualPaymentConfig } from '@/lib/server/payment-options'
import { buildGoogleCalendarUrl } from '@/lib/server/google-calendar'
import { getPrepGuideUrl } from '@/lib/server/prep-guide'
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
      summary: 'Tryb maili klienta jest zablokowany, bo CUSTOMER_EMAIL_MODE ma nieprawidĹ‚owÄ… wartoĹ›Ä‡.',
      nextStep: 'Ustaw CUSTOMER_EMAIL_MODE=auto albo CUSTOMER_EMAIL_MODE=disabled.',
    }
  }

  if (modeConfig.mode === 'disabled') {
    return {
      state: 'disabled',
      mode: 'disabled',
      issue: 'CUSTOMER_EMAIL_MODE=disabled',
      summary:
        'Maile klienta sa swiadomie wylaczone. Status platnosci, materialy i link do rozmowy pozostaja na stronie potwierdzenia rezerwacji.',
      nextStep:
        'Zostaw ten tryb tymczasowo albo po weryfikacji domeny nadawcy przeĹ‚Ä…cz CUSTOMER_EMAIL_MODE=auto i ustaw RESEND_FROM_EMAIL na zweryfikowany adres.',
    }
  }

  if (mail.provider === 'invalid') {
    return {
      state: 'blocked',
      mode: 'auto',
      issue: 'MAIL_PROVIDER invalid',
      summary: 'WysyĹ‚ka maili do klientĂłw jest zablokowana, bo MAIL_PROVIDER ma nieprawidĹ‚owÄ… wartoĹ›Ä‡.',
      nextStep: 'Ustaw MAIL_PROVIDER=resend albo MAIL_PROVIDER=gmail.',
    }
  }

  if (mail.provider === 'gmail') {
    if (!mail.smtpUser) {
      return {
        state: 'blocked',
        mode: 'auto',
        issue: 'GMAIL_SMTP_USER missing',
        summary: 'WysyĹ‚ka maili do klientĂłw jest zablokowana, bo brakuje GMAIL_SMTP_USER.',
        nextStep: 'Ustaw GMAIL_SMTP_USER i powtĂłrz prĂłbÄ™ wysyĹ‚ki.',
      }
    }

    if (!mail.smtpAppPassword) {
      return {
        state: 'blocked',
        mode: 'auto',
        issue: 'GMAIL_SMTP_APP_PASSWORD missing',
        summary: 'WysyĹ‚ka maili do klientĂłw jest zablokowana, bo brakuje GMAIL_SMTP_APP_PASSWORD.',
        nextStep: 'Wygeneruj Gmail App Password i ustaw GMAIL_SMTP_APP_PASSWORD.',
      }
    }

    if (mail.fromStatus !== 'valid' || !mail.from) {
      return {
        state: 'blocked',
        mode: 'auto',
        issue: 'GMAIL_FROM_EMAIL missing or invalid',
        summary: 'WysyĹ‚ka maili do klientĂłw jest zablokowana, bo GMAIL_FROM_EMAIL jest pusty albo nieprawidĹ‚owy.',
        nextStep: 'Ustaw poprawny adres nadawcy w GMAIL_FROM_EMAIL albo uĹĽyj poprawnego GMAIL_SMTP_USER.',
      }
    }

    return {
      state: 'ready',
      mode: 'auto',
      issue: null,
      summary: 'WysyĹ‚ka maili do klientĂłw zewnÄ™trznych jest gotowa z aktualnej konfiguracji Gmail SMTP.',
      nextStep: 'Brak blokera po stronie konfiguracji maili klienta.',
    }
  }

  if (!mail.apiKey) {
    return {
      state: 'blocked',
      mode: 'auto',
      issue: 'RESEND_API_KEY missing',
      summary: 'WysyĹ‚ka maili do klientĂłw jest zablokowana, bo brakuje RESEND_API_KEY.',
      nextStep: 'UzupeĹ‚nij RESEND_API_KEY i powtĂłrz prĂłbÄ™ wysyĹ‚ki na zewnÄ™trzny adres testowy.',
    }
  }

  if (mail.configuredFromStatus === 'invalid') {
    return {
      state: 'blocked',
      mode: 'auto',
      issue: 'RESEND_FROM_EMAIL missing or invalid',
      summary: 'WysyĹ‚ka maili do klientĂłw jest zablokowana, bo RESEND_FROM_EMAIL jest pusty albo nieprawidĹ‚owy.',
      nextStep: 'Ustaw poprawny adres nadawcy w RESEND_FROM_EMAIL.',
    }
  }

  if (!isValidResendFrom(mail.from)) {
    return {
      state: 'blocked',
      mode: 'auto',
      issue: 'RESEND_FROM_EMAIL missing or invalid',
      summary: 'WysyĹ‚ka maili do klientĂłw jest zablokowana, bo RESEND_FROM_EMAIL jest pusty albo nieprawidĹ‚owy.',
      nextStep: 'Ustaw poprawny adres nadawcy w RESEND_FROM_EMAIL.',
    }
  }

  if (!isResendTestingSender(mail.from)) {
    return {
      state: 'ready',
      mode: 'auto',
      issue: null,
      summary: 'WysyĹ‚ka maili do klientĂłw zewnÄ™trznych jest gotowa z aktualnej konfiguracji Resend.',
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
      summary: 'WysyĹ‚ka maili do klientĂłw zewnÄ™trznych jest gotowa z aktualnej konfiguracji Resend.',
      nextStep: 'Brak blokera po stronie konfiguracji maili klienta.',
    }
  }

  return {
    state: 'blocked',
    mode: 'auto',
    issue: allowedRecipient
      ? `RESEND_FROM_EMAIL uses resend.dev testing mode. Verify a domain to send customer emails to recipients other than ${allowedRecipient}.`
      : 'RESEND_FROM_EMAIL uses resend.dev testing mode. Verify a domain to send customer emails to external recipients.',
    summary: 'WysyĹ‚ka maili do klientĂłw zewnÄ™trznych jest zablokowana, bo RESEND_FROM_EMAIL nadal korzysta z resend.dev testing mode.',
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
    parts.push('<p><strong>Kontakt:</strong> odpowiedz na tÄ™ wiadomoĹ›Ä‡, jeĹ›li potrzebujesz doprecyzowania terminu.</p>')
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
    lines.push('Kontakt: odpowiedz na tÄ™ wiadomoĹ›Ä‡, jeĹ›li potrzebujesz doprecyzowania terminu.')
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
          <p style="margin-bottom:0;color:#6b625b;font-size:13px;">WiadomoĹ›Ä‡ wysĹ‚ana automatycznie przez Behawior 15.</p>
        </div>
      </div>
    </div>
  `
}

type EmailActionButton = {
  href: string
  label: string
}

function renderEmailActionButton(action: EmailActionButton) {
  return `
    <div style="margin:24px 0 20px;">
      <a
        href="${escapeHtml(action.href)}"
        style="display:inline-block;padding:14px 22px;border-radius:999px;background:#1f1a17;color:#ffffff;text-decoration:none;font-weight:700;letter-spacing:0.01em;"
      >
        ${escapeHtml(action.label)}
      </a>
    </div>
  `
}

function buildAbsoluteUrl(pathname: string): string {
  return new URL(pathname, getBaseUrl()).toString()
}

function buildBookingViewerUrl(pathname: '/payment' | '/confirmation', bookingId: string, accessToken?: string | null) {
  const searchParams = new URLSearchParams({
    bookingId,
  })

  if (accessToken) {
    searchParams.set('access', accessToken)
  }

  return buildAbsoluteUrl(`${pathname}?${searchParams.toString()}`)
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
  actionButton?: EmailActionButton | null,
) {
  const renderedFacts = renderBookingEmailFacts(facts)
  const actionHtml = actionButton ? renderEmailActionButton(actionButton) : ''
  const actionText = actionButton ? `Strona rezerwacji: ${actionButton.href}` : ''

  return {
    to: booking.email,
    subject,
    html: renderEmailShell(title, intro, `${renderedFacts.html}${actionHtml}`, outro),
    text: [intro, renderedFacts.text, outro, actionText, renderContactBlockText()].filter(Boolean).join('\n'),
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

export async function sendBookingReservationCreatedEmail(
  booking: BookingRecord,
  accessToken?: string | null,
): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const subject = `Rezerwacja przyjÄ™ta - Behawior 15 - ${summary}`
  const customerEmailStatus = getCustomerEmailDeliveryStatus(booking.email)
  const bookingPageUrl = buildBookingViewerUrl('/payment', booking.id, accessToken)
  const emailDeliveryNote =
    customerEmailStatus.state === 'ready'
      ? 'Po potwierdzeniu klient automatycznie dostanie mail z linkiem do pokoju rozmowy, a przy braku wpĹ‚aty wrĂłci do pĹ‚atnoĹ›ci.'
      : customerEmailStatus.state === 'disabled'
        ? 'Po potwierdzeniu klient od razu zobaczy aktywne potwierdzenie i pokĂłj na swojej stronie rezerwacji. Maile klienta sÄ… teraz Ĺ›wiadomie wyĹ‚Ä…czone, wiÄ™c link do rozmowy zostaje na stronie potwierdzenia.'
        : 'Po potwierdzeniu klient od razu zobaczy aktywne potwierdzenie i pokĂłj na swojej stronie rezerwacji. WysyĹ‚ka maili do innych adresĂłw ruszy po naprawie konfiguracji Resend.'
  const html = renderEmailShell(
    'Mamy TwojÄ… rezerwacjÄ™',
    'Termin zostaĹ‚ chwilowo zablokowany i czeka na pĹ‚atnoĹ›Ä‡. To pierwszy krok do spokojniejszego planu dziaĹ‚ania.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Kwota:</strong> ${formatPricePln(booking.amount)}</p>
      <p><strong>Co dalej:</strong> dokoĹ„cz pĹ‚atnoĹ›Ä‡, aby ostatecznie potwierdziÄ‡ konsultacjÄ™ i odblokowaÄ‡ link do rozmowy.</p>
      ${renderEmailActionButton({ href: bookingPageUrl, label: 'Otwórz stronę rezerwacji' })}
      ${renderContactBlockHtml()}
    `,
    emailDeliveryNote,
  )
  const text = [
    'Behawior 15 - rezerwacja przyjÄ™ta.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Kwota: ${formatPricePln(booking.amount)}`,
    'Co dalej: dokoĹ„cz pĹ‚atnoĹ›Ä‡, aby ostatecznie potwierdziÄ‡ konsultacjÄ™ i odblokowaÄ‡ link do rozmowy.',
    `Strona rezerwacji: ${bookingPageUrl}`,
    emailDeliveryNote,
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail({ to: booking.email, subject, html, text }, 'customer')
}

export async function sendBookingOwnerNotificationEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const recipient = getAdminNotificationRecipientEmail()

  if (!recipient) {
    return {
      status: 'skipped',
      reason: 'admin notification email missing or invalid',
    }
  }

  const speciesLabel = booking.animalType
  const serviceLabel = getProblemLabel(booking.problemType)
  const bookingServiceLabel = booking.serviceType ? booking.serviceType : 'szybka-konsultacja-15-min'
  const serviceTitle =
    bookingServiceLabel === 'konsultacja-behawioralna-online'
      ? 'Pelna konsultacja behawioralna'
      : bookingServiceLabel === 'konsultacja-30-min'
        ? 'Dwa kwadranse'
        : 'Kwadrans z behawiorysta'
  const summary = formatDateTimeLabel(booking.bookingDate, booking.bookingTime)
  const subject = `[Rezerwacja] ${serviceTitle} - ${booking.ownerName} ${speciesLabel}`
  const replyTo = isValidPublicEmail(booking.email) ? booking.email : undefined
  const html = renderEmailShell(
    'Nowa rezerwacja w systemie',
    'Booking zostal zapisany i slot jest juz zablokowany. To jest wewnetrzne powiadomienie dla wlasciciela.',
    `
      <p><strong>Imie klienta:</strong> ${escapeHtml(booking.ownerName)}</p>
      <p><strong>E-mail klienta:</strong> ${replyTo ? `<a href="mailto:${escapeHtml(booking.email)}">${escapeHtml(booking.email)}</a>` : escapeHtml(booking.email)}</p>
      <p><strong>Gatunek:</strong> ${escapeHtml(speciesLabel)}</p>
      <p><strong>Usluga:</strong> ${escapeHtml(serviceTitle)} (${escapeHtml(formatPricePln(booking.amount))})</p>
      <p><strong>Temat:</strong> ${escapeHtml(serviceLabel)}</p>
      <p><strong>Termin:</strong> ${escapeHtml(summary)}</p>
      <p><strong>Opis sytuacji:</strong><br />${formatMultilineHtml(booking.description)}</p>
      <p><strong>Status:</strong> ${escapeHtml(booking.bookingStatus)} / ${escapeHtml(booking.paymentStatus)}</p>
      <p><strong>Co dalej:</strong> gdy klient kliknie „Zrobiłem płatność”, dostaniesz osobny mail z linkami do potwierdzenia albo odrzucenia wpłaty.</p>
      <p><strong>ID rezerwacji:</strong> ${escapeHtml(booking.id)}</p>
    `,
    'Ten flow nie zbiera oddzielnych checkboxow zgod klienta. Slot czeka teraz na oplaty i dalsza obsluge.',
  )
  const text = [
    'Nowa rezerwacja w systemie.',
    `Imie klienta: ${booking.ownerName}`,
    `E-mail klienta: ${booking.email}`,
    `Gatunek: ${speciesLabel}`,
    `Usluga: ${serviceTitle} (${formatPricePln(booking.amount)})`,
    `Temat: ${serviceLabel}`,
    `Termin: ${summary}`,
    'Opis sytuacji:',
    booking.description,
    '',
    `Status: ${booking.bookingStatus} / ${booking.paymentStatus}`,
    'Co dalej: gdy klient kliknie "Zrobiłem płatność", dostaniesz osobny mail z linkami do potwierdzenia albo odrzucenia wpłaty.',
    `ID rezerwacji: ${booking.id}`,
    'Zgody: ten flow nie zbiera oddzielnych checkboxow zgod klienta.',
  ].join('\n')

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

export type ContactLeadSubmission = {
  name: string
  email: string
  topic: string
  message: string
  contextLabel: string
  serviceLabel?: string | null
  requestedDate?: string | null
  requestedTime?: string | null
  bookingId?: string | null
  website?: string | null
}

export type PdfOrderSubmission = {
  itemType: 'guide' | 'bundle'
  itemSlug: string
  itemTitle: string
  itemPrice: string
  name: string
  email: string
  notes?: string | null
  website?: string | null
}

export type BookRequestSubmission = {
  service: 'kwadrans-na-juz' | 'szybka-konsultacja-15-min' | 'konsultacja-30-min' | 'konsultacja-behawioralna-online'
  serviceLabel: string
  servicePrice: string
  name: string
  email: string
  species: 'pies' | 'kot'
  description: string
  preferredSlots: string
}

function getPdfOrderCustomerCta(submission: PdfOrderSubmission): EmailActionButton {
  const manualPayment = getManualPaymentConfig()

  if (manualPayment.paypalMeUrl) {
    return {
      href: manualPayment.paypalMeUrl,
      label: 'Przejdz do PayPal',
    }
  }

  return {
    href:
      submission.itemType === 'bundle'
        ? buildAbsoluteUrl(`/zamow-pdf?bundle=${encodeURIComponent(submission.itemSlug)}`)
        : buildAbsoluteUrl(`/zamow-pdf?guide=${encodeURIComponent(submission.itemSlug)}`),
    label: 'Zobacz szczegoly zamowienia',
  }
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
  const serviceBlock = submission.serviceLabel ? `<p><strong>Sciezka:</strong> ${escapeHtml(submission.serviceLabel)}</p>` : ''
  const preferredWindowBlock =
    submission.requestedDate && submission.requestedTime
      ? `<p><strong>Preferowany termin:</strong> ${escapeHtml(submission.requestedDate)} o ${escapeHtml(submission.requestedTime)}</p>`
      : ''
  const html = renderEmailShell(
    'Nowa wiadomosc z formularza kontaktu',
    'Ktos wyslal wiadomosc przez formularz kontaktowy. To jest pierwszy krok do odpowiedzi i uporzadkowania kolejnego ruchu.',
    `
      <p><strong>Imie:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>Kontakt:</strong> ${replyTo ? `<a href="mailto:${escapeHtml(contactValue)}">${escapeHtml(contactValue)}</a>` : escapeHtml(contactValue)}</p>
      <p><strong>Temat:</strong> ${escapeHtml(submission.topic)}</p>
      ${serviceBlock}
      <p><strong>Kontekst:</strong> ${escapeHtml(submission.contextLabel)}</p>
      ${preferredWindowBlock}
      ${contextBlock}
      <p><strong>Wiadomosc:</strong><br />${formatMultilineHtml(submission.message)}</p>
    `,
    'Odpowiedz na podany adres e-mail albo wrĂłÄ‡ do kontaktu, jeĹ›li potrzebujesz doprecyzowaÄ‡ szczegĂłĹ‚y.',
  )
  const text = [
    'Nowa wiadomosc z formularza kontaktu.',
    `Imie: ${submission.name}`,
    `Kontakt: ${contactValue}`,
    `Temat: ${submission.topic}`,
    submission.serviceLabel ? `Sciezka: ${submission.serviceLabel}` : null,
    `Kontekst: ${submission.contextLabel}`,
    submission.requestedDate && submission.requestedTime
      ? `Preferowany termin: ${submission.requestedDate} ${submission.requestedTime}`
      : null,
    submission.bookingId ? `Numer rezerwacji: ${submission.bookingId}` : null,
    `Wiadomosc: ${submission.message}`,
    'Odpowiedz na podany adres e-mail albo wrĂłÄ‡ do kontaktu, jeĹ›li potrzebujesz doprecyzowaÄ‡ szczegĂłĹ‚y.',
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

export async function sendContactLeadAutoReplyEmail(submission: ContactLeadSubmission): Promise<DeliveryResult> {
  const recipient = submission.email.trim()

  if (!isValidPublicEmail(recipient)) {
    return {
      status: 'skipped',
      reason: 'customer contact email missing or invalid',
    }
  }

  const subject = 'Dostalem Twoja wiadomosc - Regulski'
  const quickStartHref = 'https://regulskibehawiorysta.pl/book?service=szybka-konsultacja-15-min'
  const html = renderEmailShell(
    `Czesc ${escapeHtml(submission.name)}, dostalem Twoja wiadomosc.`,
    'Odpowiem na podany adres e-mail w ciagu 1-2 dni roboczych.',
    `
      <p><strong>Temat:</strong> ${escapeHtml(submission.topic)}</p>
      <p>Jesli sytuacja wymaga szybszego wejscia, mozesz od razu umowic Kwadrans z behawiorysta.</p>
      <p><a href="${quickStartHref}">${quickStartHref}</a></p>
      ${renderContactBlockHtml()}
    `,
    'Jesli chcesz doprecyzowac temat, po prostu odpowiedz na tego maila.',
  )
  const text = [
    `Czesc ${submission.name},`,
    '',
    'Dostalem Twoja wiadomosc i odpowiem w ciagu 1-2 dni roboczych.',
    '',
    `Temat: ${submission.topic}`,
    'Jesli sytuacja wymaga szybszego wejscia, mozesz od razu umowic Kwadrans z behawiorysta:',
    quickStartHref,
    '',
    'Jesli chcesz doprecyzowac temat, po prostu odpowiedz na tego maila.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail(
    {
      to: recipient,
      subject,
      html,
      text,
      replyTo: getPublicContactDetails().email ?? undefined,
    },
    'customer',
  )
}
export async function sendPdfOrderEmail(submission: PdfOrderSubmission): Promise<DeliveryResult> {
  const recipient = getPublicContactDetails().email

  if (!recipient) {
    return {
      status: 'skipped',
      reason: 'public contact email missing or invalid',
    }
  }

  const replyTo = isValidPublicEmail(submission.email) ? submission.email : undefined
  const itemTypeLabel = submission.itemType === 'bundle' ? 'Pakiet PDF' : 'PDF'
  const notesBlock = submission.notes ? `<p><strong>Wiadomosc:</strong><br />${formatMultilineHtml(submission.notes)}</p>` : ''
  const subject = `Zamowienie ${itemTypeLabel} - ${submission.itemTitle} - ${submission.name}`
  const html = renderEmailShell(
    'Nowe zamowienie PDF',
    'Klient wyslal zamowienie poradnika PDF albo pakietu. Odpowiedz z potwierdzeniem wyboru i preferuj PayPal albo BLIK na telefon bez eksponowania numeru publicznie.',
    `
      <p><strong>Imie:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>E-mail:</strong> ${replyTo ? `<a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a>` : escapeHtml(submission.email)}</p>
      <p><strong>Typ:</strong> ${itemTypeLabel}</p>
      <p><strong>Produkt:</strong> ${escapeHtml(submission.itemTitle)}</p>
      <p><strong>Slug:</strong> ${escapeHtml(submission.itemSlug)}</p>
      <p><strong>Cena:</strong> ${escapeHtml(submission.itemPrice)}</p>
      ${notesBlock}
    `,
    'Wyslij klientowi mail z przyciskiem do PayPal albo z instrukcja BLIK na telefon, bez odsylania do publicznego numeru.',
  )
  const text = [
    'Nowe zamowienie PDF.',
    `Imie: ${submission.name}`,
    `E-mail: ${submission.email}`,
    `Typ: ${itemTypeLabel}`,
    `Produkt: ${submission.itemTitle}`,
    `Slug: ${submission.itemSlug}`,
    `Cena: ${submission.itemPrice}`,
    submission.notes ? `Wiadomosc: ${submission.notes}` : null,
    'Wyslij klientowi mail z przyciskiem do PayPal albo z instrukcja BLIK na telefon, bez odsylania do publicznego numeru.',
  ]
    .filter((line): line is string => Boolean(line))
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

export async function sendPdfOrderAutoReplyEmail(submission: PdfOrderSubmission): Promise<DeliveryResult> {
  const recipient = submission.email.trim()

  if (!isValidPublicEmail(recipient)) {
    return {
      status: 'skipped',
      reason: 'customer contact email missing or invalid',
    }
  }

  const action = getPdfOrderCustomerCta(submission)
  const hasPaypalButton = action.label === 'Przejdz do PayPal'
  const subject = `Dostalem zamowienie: ${submission.itemTitle}`
  const html = renderEmailShell(
    `Czesc ${escapeHtml(submission.name)}, dostalem Twoje zamowienie.`,
    hasPaypalButton
      ? 'Zamowienie jest zapisane. Mozesz od razu przejsc do platnosci przez PayPal z przycisku ponizej. BLIK na telefon zostaje dostepny jako opcja zapasowa bez publikowania numeru na stronie.'
      : 'Zamowienie jest zapisane. Odpowiem mailowo z dalszym krokiem platnosci. BLIK na telefon zostaje dostepny bez publikowania numeru na stronie.',
    `
      <p><strong>Produkt:</strong> ${escapeHtml(submission.itemTitle)}</p>
      <p><strong>Cena:</strong> ${escapeHtml(submission.itemPrice)}</p>
      <p><strong>Metody platnosci:</strong> PayPal albo BLIK na telefon.</p>
      <p><strong>Dalszy krok:</strong> ${
        hasPaypalButton
          ? 'po platnosci odpisze z potwierdzeniem i informacja o dostepie do materialu.'
          : 'odpisze z potwierdzeniem wyboru i instrukcja platnosci.'
      }</p>
      ${renderEmailActionButton(action)}
      <p style="margin-top:0;color:#6b625b;">${
        hasPaypalButton
          ? 'Przycisk prowadzi bezposrednio do PayPal, zeby ograniczyc widocznosc numeru telefonu.'
          : 'Jesli wybierzesz BLIK na telefon, szczegoly dostaniesz mailowo bez publikowania numeru na stronie.'
      }</p>
      ${renderContactBlockHtml()}
    `,
    'Jesli chcesz cos doprecyzowac, po prostu odpowiedz na tego maila.',
  )
  const text = [
    `Czesc ${submission.name},`,
    '',
    hasPaypalButton
      ? 'Dostalem Twoje zamowienie. Mozesz od razu przejsc do platnosci przez PayPal z linku ponizej. BLIK na telefon zostaje dostepny jako opcja zapasowa.'
      : 'Dostalem Twoje zamowienie. Odpisze z potwierdzeniem wyboru i instrukcja platnosci. BLIK na telefon zostaje dostepny bez publikowania numeru na stronie.',
    '',
    `Produkt: ${submission.itemTitle}`,
    `Cena: ${submission.itemPrice}`,
    'Metody platnosci: PayPal albo BLIK na telefon.',
    `${hasPaypalButton ? 'Przycisk do PayPal' : 'Szczegoly zamowienia'}: ${action.href}`,
    'Jesli chcesz cos doprecyzowac, po prostu odpowiedz na tego maila.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail(
    {
      to: recipient,
      subject,
      html,
      text,
      replyTo: getPublicContactDetails().email ?? undefined,
    },
    'customer',
  )
}

export async function sendBookRequestEmail(submission: BookRequestSubmission): Promise<DeliveryResult> {
  const recipient = getPublicContactDetails().email

  if (!recipient) {
    return {
      status: 'skipped',
      reason: 'public contact email missing or invalid',
    }
  }

  const replyTo = isValidPublicEmail(submission.email) ? submission.email : undefined
  const speciesLabel = submission.species === 'kot' ? 'Kot' : 'Pies'
  const subject =
    submission.service === 'kwadrans-na-juz'
      ? `PILNE - Kwadrans na juz: ${submission.name}`
      : `REZERWACJA [${submission.serviceLabel}] - ${submission.name} (${speciesLabel})`
  const html = renderEmailShell(
    'Nowa prosba o rezerwacje',
    submission.service === 'kwadrans-na-juz'
      ? 'Klient wyslal pilna prosbe o Kwadrans na juz. Wroc z odpowiedzia priorytetowo i odeslij potwierdzenie terminu z PayPal albo instrukcja BLIK na telefon.'
      : 'Klient wyslal prosbe o rezerwacje konsultacji. Odpowiedz z potwierdzonym terminem i preferuj PayPal albo BLIK na telefon bez eksponowania numeru publicznie.',
    `
      <p><strong>Usluga:</strong> ${escapeHtml(submission.serviceLabel)} (${escapeHtml(submission.servicePrice)})</p>
      <p><strong>Gatunek:</strong> ${escapeHtml(speciesLabel)}</p>
      <p><strong>Imie:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>E-mail:</strong> ${replyTo ? `<a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a>` : escapeHtml(submission.email)}</p>
      <p><strong>Preferowane terminy:</strong><br />${formatMultilineHtml(submission.preferredSlots)}</p>
      <p><strong>Opis sytuacji:</strong><br />${formatMultilineHtml(submission.description)}</p>
      <p><strong>Nastepny krok:</strong> ${submission.service === 'kwadrans-na-juz' ? 'odpisz w ciagu 15 minut z pierwszym wolnym terminem i dalszym krokiem platnosci.' : 'potwierdz termin i wyslij klientowi PayPal albo instrukcje BLIK na telefon.'}</p>
    `,
    'To jest manualny flow rezerwacji po potwierdzeniu terminu, bez publicznego numeru telefonu.',
  )
  const text = [
    submission.service === 'kwadrans-na-juz' ? 'Nowa pilna prosba o rezerwacje.' : 'Nowa prosba o rezerwacje.',
    `Usluga: ${submission.serviceLabel} (${submission.servicePrice})`,
    `Gatunek: ${speciesLabel}`,
    `Imie: ${submission.name}`,
    `E-mail: ${submission.email}`,
    '',
    'Preferowane terminy:',
    submission.preferredSlots,
    '',
    'Opis sytuacji:',
    submission.description,
    '',
    submission.service === 'kwadrans-na-juz'
      ? 'Nastepny krok: odpisz w ciagu 15 minut z pierwszym wolnym terminem i dalszym krokiem platnosci.'
      : 'Nastepny krok: potwierdz termin i wyslij klientowi PayPal albo instrukcje BLIK na telefon.',
  ].join('\n')

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

export async function sendBookRequestAutoReplyEmail(submission: BookRequestSubmission): Promise<DeliveryResult> {
  const recipient = submission.email.trim()

  if (!isValidPublicEmail(recipient)) {
    return {
      status: 'skipped',
      reason: 'customer contact email missing or invalid',
    }
  }

  const requestHref = buildAbsoluteUrl(`/book?service=${encodeURIComponent(submission.service)}`)
  const subject = `Dostalem Twoja rezerwacje - ${submission.serviceLabel}`
  const html = renderEmailShell(
    `Czesc ${escapeHtml(submission.name)}, dostalem Twoja rezerwacje.`,
    `Prosba o ${escapeHtml(submission.serviceLabel)} (${escapeHtml(submission.servicePrice)}) trafila do mnie poprawnie. Platnosc zostaje w modelu PayPal albo BLIK na telefon, bez publikowania numeru na stronie.`,
    `
      <p><strong>Co dalej:</strong></p>
      <p>${submission.service === 'kwadrans-na-juz' ? '1. Odezwe sie w ciagu 15 minut z pierwszym wolnym terminem i dalszym krokiem platnosci.' : '1. Odezwe sie w ciagu kilku godzin, miedzy 9 a 21, z potwierdzeniem terminu i dalszym krokiem platnosci.'}</p>
      <p>2. Dostaniesz PayPal albo instrukcje BLIK na telefon, zaleznie od najprostszego wariantu dla tej rezerwacji.</p>
      <p>3. Po platnosci potwierdzam rezerwacje do 15 minut i odsylam link do rozmowy.</p>
      <p><strong>Twoje preferowane terminy:</strong><br />${formatMultilineHtml(submission.preferredSlots)}</p>
      ${renderEmailActionButton({ href: requestHref, label: 'Zobacz szczegoly rezerwacji' })}
      ${renderContactBlockHtml()}
    `,
    'Jesli chcesz cos dopowiedziec, po prostu odpowiedz na tego maila.',
  )
  const text = [
    `Czesc ${submission.name},`,
    '',
    `Dostalem Twoja rezerwacje: ${submission.serviceLabel} (${submission.servicePrice}).`,
    'Platnosc zostaje w modelu PayPal albo BLIK na telefon, bez publikowania numeru na stronie.',
    '',
    'Co dalej:',
    submission.service === 'kwadrans-na-juz'
      ? '1. Odezwe sie w ciagu 15 minut z pierwszym wolnym terminem i dalszym krokiem platnosci.'
      : '1. Odezwe sie w ciagu kilku godzin, miedzy 9 a 21, z potwierdzeniem terminu i dalszym krokiem platnosci.',
    '2. Dostaniesz PayPal albo instrukcje BLIK na telefon.',
    '3. Po platnosci potwierdzam rezerwacje do 15 minut i odsylam link do rozmowy.',
    '',
    'Twoje preferowane terminy:',
    submission.preferredSlots,
    '',
    `Szczegoly rezerwacji: ${requestHref}`,
    '',
    'Jesli chcesz cos dopowiedziec, po prostu odpowiedz na tego maila.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail(
    {
      to: recipient,
      subject,
      html,
      text,
      replyTo: getPublicContactDetails().email ?? undefined,
    },
    'customer',
  )
}

export async function sendLeadMagnetFollowUpThreeEmail(email: string, magnet: LeadMagnet): Promise<DeliveryResult> {
  if (!isValidPublicEmail(email)) {
    return {
      status: 'skipped',
      reason: 'customer contact email missing or invalid',
    }
  }

  const subject = `${magnet.followUpTitle} - Regulski`
  const nextStepHref = `https://regulskibehawiorysta.pl${magnet.nextStepHref}`
  const html = renderEmailShell(
    magnet.followUpTitle,
    magnet.followUpBody,
    `
      <p><strong>Kolejny krok:</strong> <a href="${nextStepHref}">${nextStepHref}</a></p>
      <p>${escapeHtml(magnet.nextStepCopy)}</p>
      ${renderContactBlockHtml()}
    `,
    'Jesli chcesz doprecyzowac swoja sytuacje, odpowiedz na tego maila albo przejdz do rezerwacji.',
  )
  const text = [
    magnet.followUpTitle,
    '',
    magnet.followUpBody,
    '',
    `Kolejny krok: ${nextStepHref}`,
    magnet.nextStepCopy,
    '',
    'Jesli chcesz doprecyzowac swoja sytuacje, odpowiedz na tego maila albo przejdz do rezerwacji.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail(
    {
      to: email,
      subject,
      html,
      text,
      replyTo: getPublicContactDetails().email ?? undefined,
    },
    'customer',
  )
}

export async function sendLeadMagnetFollowUpSevenEmail(email: string, magnet: LeadMagnet): Promise<DeliveryResult> {
  if (!isValidPublicEmail(email)) {
    return {
      status: 'skipped',
      reason: 'customer contact email missing or invalid',
    }
  }

  const bookingHref = 'https://regulskibehawiorysta.pl/book?service=szybka-konsultacja-15-min'
  const subject = `Jesli dalej cos sie nie uklada - ${magnet.shortTitle}`
  const html = renderEmailShell(
    'Jesli dalej cos sie nie uklada',
    'Po kilku dniach material powinien juz porzadkowac pierwsze obserwacje. Jesli nadal nie wiesz, co zrobic dalej, najprostszy kolejny krok to krotka rozmowa.',
    `
      <p><strong>Najprostszy kolejny krok:</strong> <a href="${bookingHref}">${bookingHref}</a></p>
      <p>Kwadrans z behawiorysta zostaje najlzejszym startem, gdy chcesz przejsc od obserwacji do konkretnej decyzji.</p>
      ${renderContactBlockHtml()}
    `,
    'Jesli temat jest juz dla Ciebie jasny, zachowaj material i wroc do niego wtedy, kiedy bedzie potrzebny.',
  )
  const text = [
    'Jesli dalej cos sie nie uklada, najprostszy kolejny krok to krotka rozmowa.',
    '',
    `Najprostszy kolejny krok: ${bookingHref}`,
    'Kwadrans z behawiorysta zostaje najlzejszym startem, gdy chcesz przejsc od obserwacji do konkretnej decyzji.',
    '',
    'Jesli temat jest juz dla Ciebie jasny, zachowaj material i wroc do niego wtedy, kiedy bedzie potrzebny.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail(
    {
      to: email,
      subject,
      html,
      text,
      replyTo: getPublicContactDetails().email ?? undefined,
    },
    'customer',
  )
}

type UrgentNowResponseEmailPayload = {
  customerName: string
  customerEmail: string
  topic: string
  proposedDate: string
  proposedTime: string
  bookingHref: string
  responseNote?: string | null
}

export async function sendUrgentNowResponseEmail(payload: UrgentNowResponseEmailPayload): Promise<DeliveryResult> {
  const subject = `Kwadrans na juz - proponowany termin ${payload.proposedDate} ${payload.proposedTime}`
  const noteBlock = payload.responseNote ? `<p><strong>Dodatkowa wiadomosc:</strong><br />${formatMultilineHtml(payload.responseNote)}</p>` : ''
  const html = renderEmailShell(
    'Mam dla Ciebie termin Kwadransu na juz',
    'Dodalem proponowany termin do terminarza. Mozesz od razu przejsc do formularza i dokonczyc rezerwacje.',
    `
      <p><strong>Temat:</strong> ${escapeHtml(payload.topic)}</p>
      <p><strong>Proponowany termin:</strong> ${escapeHtml(payload.proposedDate)} o ${escapeHtml(payload.proposedTime)}</p>
      <p><strong>Link do terminu:</strong> <a href="${escapeHtml(payload.bookingHref)}">${escapeHtml(payload.bookingHref)}</a></p>
      ${noteBlock}
      ${renderContactBlockHtml()}
    `,
    'Jesli termin przestal pasowac, odpowiedz na tego maila albo napisz przez formularz kontaktu.',
  )
  const text = [
    `Mam dla Ciebie termin Kwadransu na juz.`,
    `Temat: ${payload.topic}`,
    `Proponowany termin: ${payload.proposedDate} ${payload.proposedTime}`,
    `Link do terminu: ${payload.bookingHref}`,
    payload.responseNote ? `Dodatkowa wiadomosc: ${payload.responseNote}` : null,
    'Jesli termin przestal pasowac, odpowiedz na tego maila albo napisz przez formularz kontaktu.',
    renderContactBlockText(),
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n')

  return deliverEmail(
    {
      to: payload.customerEmail,
      subject,
      html,
      text,
    },
    'customer',
  )
}

export async function sendBookingConfirmationEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const subject = `Potwierdzenie konsultacji - Behawior 15 - ${summary}`
  const prepGuideUrl = getPrepGuideUrl(booking)
  const prepGuideBlock = prepGuideUrl
    ? `<p><strong>Jak się przygotować:</strong> <a href="${escapeHtml(prepGuideUrl)}">Przeczytaj krótki poradnik</a> — zajmuje 3 minuty i sprawi, że wyciągniesz z rozmowy maksimum.</p>`
    : ''
  const prepGuideText = prepGuideUrl
    ? `Jak się przygotować: ${prepGuideUrl}`
    : ''

  const html = renderEmailShell(
    'Konsultacja potwierdzona',
    'Płatność została przyjęta, a Twój termin jest już przypisany do Ciebie.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Link do rozmowy:</strong> <a href="${escapeHtml(booking.meetingUrl)}">${escapeHtml(booking.meetingUrl)}</a></p>
      ${prepGuideBlock}
      <p><strong>Co dalej:</strong> wejdź 3–5 minut przed czasem. Miej gotową jedną najważniejszą obserwację — to wystarczy, żeby zacząć.</p>
      ${renderContactBlockHtml()}
    `,
    'Jeśli będzie potrzebny kolejny krok po rozmowie, dostaniesz jasną rekomendację zamiast ogólnych porad.',
  )
  const text = [
    'Twoja konsultacja Behawior 15 została potwierdzona.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Link do rozmowy: ${booking.meetingUrl}`,
    prepGuideText,
    'Co dalej: wejdź 3–5 minut przed czasem. Miej gotową jedną najważniejszą obserwację.',
    renderContactBlockText(),
  ].filter(Boolean).join('\n')

  return deliverEmail({ to: booking.email, subject, html, text }, 'customer')
}

export async function sendBookingManualPaymentPendingEmail(
  booking: BookingRecord,
  accessToken?: string | null,
): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const paymentReference = booking.paymentReference ?? booking.id
  const confirmationUrl = buildBookingViewerUrl('/confirmation', booking.id, accessToken)
  const subject = `WpĹ‚ata zgĹ‚oszona - czekamy na potwierdzenie - Behawior 15 - ${summary}`
  const intro = 'DostaĹ‚em zgĹ‚oszenie wpĹ‚aty rÄ™cznej. SprawdzÄ™ je do 15 minut.'
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
      label: 'TytuĹ‚ wpĹ‚aty',
      htmlValue: escapeHtml(paymentReference),
      textValue: paymentReference,
    },
    {
      label: 'NastÄ™pny krok',
      htmlValue: escapeHtml('Po akceptacji dostaniesz mail z linkiem do pokoju rozmowy.'),
      textValue: 'Po akceptacji dostaniesz mail z linkiem do pokoju rozmowy.',
    },
  ]
  const outro = 'Do czasu potwierdzenia status rezerwacji pozostaje na stronie potwierdzenia.'
  const email = buildBookingCustomerEmail(
    booking,
    subject,
    'WpĹ‚ata jest w weryfikacji',
    intro,
    facts,
    outro,
    { href: confirmationUrl, label: 'Zobacz stronę rezerwacji' },
  )

  return deliverEmail(email, 'customer')
}

export async function sendBookingStatusOutcomeEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const outcome =
    booking.paymentStatus === 'refunded'
      ? {
          subject: `Rezerwacja anulowana - Behawior 15 - ${summary}`,
          title: 'Rezerwacja zostaĹ‚a anulowana',
          intro: 'Zwrot zostaĹ‚ uruchomiony, a termin wrĂłciĹ‚ do kalendarza.',
          statusLabel: 'Zwrot',
          reasonLabel: 'PowĂłd',
          nextStep: 'JeĹ›li chcesz wrĂłciÄ‡ do konsultacji, wybierz nowy termin albo napisz wiadomoĹ›Ä‡.',
        }
      : booking.paymentStatus === 'rejected'
        ? {
            subject: `WpĹ‚ata nie zostaĹ‚a potwierdzona - Behawior 15 - ${summary}`,
            title: 'WpĹ‚ata nie zostaĹ‚a potwierdzona',
            intro: 'Nie udaĹ‚o siÄ™ potwierdziÄ‡ wpĹ‚aty, wiÄ™c termin wrĂłciĹ‚ do kalendarza.',
            statusLabel: 'Status',
            reasonLabel: 'PowĂłd',
            nextStep: 'JeĹ›li chcesz wrĂłciÄ‡ do konsultacji, wybierz nowy termin albo napisz wiadomoĹ›Ä‡.',
          }
        : booking.paymentStatus === 'failed'
          ? {
              subject: `PĹ‚atnoĹ›Ä‡ nie zostaĹ‚a dokoĹ„czona - Behawior 15 - ${summary}`,
              title: 'PĹ‚atnoĹ›Ä‡ nie zostaĹ‚a dokoĹ„czona',
              intro: 'PĹ‚atnoĹ›Ä‡ online nie zostaĹ‚a zakoĹ„czona i termin wrĂłciĹ‚ do kalendarza.',
              statusLabel: 'Status',
              reasonLabel: 'PowĂłd',
              nextStep: 'JeĹ›li chcesz wrĂłciÄ‡ do konsultacji, wybierz nowy termin albo napisz wiadomoĹ›Ä‡.',
            }
          : {
              subject: `Rezerwacja wygasĹ‚a - Behawior 15 - ${summary}`,
              title: 'Rezerwacja wygasĹ‚a',
              intro: 'Czas na potwierdzenie minÄ…Ĺ‚, wiÄ™c termin wrĂłciĹ‚ do kalendarza.',
              statusLabel: 'Status',
              reasonLabel: 'PowĂłd',
              nextStep: 'JeĹ›li chcesz wrĂłciÄ‡ do konsultacji, wybierz nowy termin albo napisz wiadomoĹ›Ä‡.',
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
    label: 'NastÄ™pny krok',
    htmlValue: escapeHtml(outcome.nextStep),
    textValue: outcome.nextStep,
  })

  const email = buildBookingCustomerEmail(booking, outcome.subject, outcome.title, outcome.intro, facts, 'MoĹĽesz wrĂłciÄ‡ do rezerwacji w dowolnym momencie.')

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

  const calendarUrl = buildGoogleCalendarUrl(booking)
  const subject = `Płatność do potwierdzenia do 15 min - Behawior 15 - ${buildBookingSummary(booking)}`
  const html = renderEmailShell(
    'Wpłata czeka na decyzję',
    'Klient kliknął "Zrobiłem płatność". Sprawdź wpływ i kliknij właściwą decyzję.',
    `
      <p><strong>Booking ID:</strong> ${escapeHtml(booking.id)}</p>
      <p><strong>Tytuł płatności:</strong> ${escapeHtml(booking.paymentReference ?? booking.id)}</p>
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Kwota:</strong> ${formatPricePln(booking.amount)}</p>
      <p><strong>Klient:</strong> ${escapeHtml(booking.ownerName)} | <a href="mailto:${escapeHtml(booking.email)}">${escapeHtml(booking.email)}</a> | ${escapeHtml(booking.phone)}</p>
      <p><strong>Opis:</strong> ${formatMultilineHtml(booking.description)}</p>
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:20px;">
        <a href="${links.approveUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#0a5c36;color:#ffffff;text-decoration:none;font-weight:700;">Jest wpłata — potwierdź i otwórz pokój</a>
        <a href="${links.rejectUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#8a3022;color:#ffffff;text-decoration:none;font-weight:700;">Nie ma wpłaty</a>
        <a href="${escapeHtml(calendarUrl)}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#1a56b0;color:#ffffff;text-decoration:none;font-weight:700;">Dodaj do Google Calendar</a>
      </div>
    `,
    customerEmailStatus.state !== 'ready'
      ? 'Po potwierdzeniu klient od razu zobaczy aktywne potwierdzenie i pokój na swojej stronie rezerwacji. Wysyłka maili do innych adresów ruszy po weryfikacji domeny nadawcy w Resend.'
      : 'Po potwierdzeniu klient automatycznie dostanie mail z linkiem do pokoju rozmowy, a przy braku wpłaty wróci do płatności.',
  )
  const text = [
    'Płatność czeka na potwierdzenie do 15 min.',
    `Booking ID: ${booking.id}`,
    `Tytuł płatności: ${booking.paymentReference ?? booking.id}`,
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Kwota: ${formatPricePln(booking.amount)}`,
    `Klient: ${booking.ownerName} | ${booking.email} | ${booking.phone}`,
    `Opis: ${booking.description}`,
    `Jest wpłata: ${links.approveUrl}`,
    `Nie ma wpłaty: ${links.rejectUrl}`,
    `Dodaj do Google Calendar: ${calendarUrl}`,
  ].join('\n')

  return deliverEmail({ to: recipient, subject, html, text }, 'internal')
}

export async function sendBookingReminderEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const subject = 'Przypomnienie: konsultacja Behawior 15 startuje za mniej niĹĽ godzinÄ™'
  const html = renderEmailShell(
    'Przypomnienie o konsultacji',
    'Za mniej niĹĽ godzinÄ™ startuje Twoja rozmowa. Warto wejĹ›Ä‡ chwilÄ™ wczeĹ›niej, ĹĽeby zaczÄ…Ä‡ spokojnie i bez poĹ›piechu.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Link do rozmowy:</strong> <a href="${booking.meetingUrl}">${booking.meetingUrl}</a></p>
      <p><strong>Przed rozmowÄ…:</strong> przygotuj 2-3 najwaĹĽniejsze pytania i najkrĂłtszy moĹĽliwy opis problemu.</p>
      ${renderContactBlockHtml()}
    `,
    'Do usĹ‚yszenia. To bÄ™dzie krĂłtka rozmowa, ale z konkretnym kierunkiem dziaĹ‚ania.',
  )
  const text = [
    'Przypomnienie o konsultacji Behawior 15.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Link do rozmowy: ${booking.meetingUrl}`,
    'Przed rozmowÄ… przygotuj 2-3 najwaĹĽniejsze pytania i najkrĂłtszy moĹĽliwy opis problemu.',
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

  const subject = `Nowe zgĹ‚oszenie opinii do weryfikacji - Behawior 15 - ${submission.displayName}`
  const photoBlock = submission.photoUrl
    ? `<p><strong>Link do zdjÄ™cia:</strong> <a href="${escapeHtml(submission.photoUrl)}">${escapeHtml(submission.photoUrl)}</a></p>`
    : '<p><strong>Link do zdjÄ™cia:</strong> klient nie dodaĹ‚ linku.</p>'
  const html = renderEmailShell(
    'Nowa opinia czeka na weryfikacjÄ™',
    'Klient wysĹ‚aĹ‚ opiniÄ™ przez formularz na stronie. Wpis nie jest jeszcze opublikowany.',
    `
      <p><strong>ImiÄ™ do publikacji:</strong> ${escapeHtml(submission.displayName)}</p>
      <p><strong>Email do kontaktu:</strong> <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a></p>
      <p><strong>Kategoria problemu:</strong> ${escapeHtml(submission.issueCategory)}</p>
      <p><strong>TreĹ›Ä‡ opinii:</strong><br />${formatMultilineHtml(submission.opinion)}</p>
      <p><strong>Co siÄ™ zmieniĹ‚o:</strong><br />${formatMultilineHtml(submission.beforeAfter)}</p>
      ${photoBlock}
      <p><strong>Status:</strong> wpis nadal wymaga rÄ™cznej akceptacji i rÄ™cznego dodania do statycznej listy opinii.</p>
    `,
    'Po akceptacji zapisz zdjÄ™cie lokalnie i dopisz nowy wpis do lib/testimonials.ts przed kolejnym deployem.',
  )
  const text = [
    'Nowa opinia czeka na weryfikacjÄ™. Wpis nie jest jeszcze opublikowany.',
    `ImiÄ™ do publikacji: ${submission.displayName}`,
    `Email do kontaktu: ${submission.email}`,
    `Kategoria problemu: ${submission.issueCategory}`,
    `TreĹ›Ä‡ opinii: ${submission.opinion}`,
    `Co siÄ™ zmieniĹ‚o: ${submission.beforeAfter}`,
    `Link do zdjÄ™cia: ${submission.photoUrl || 'brak'}`,
    'Status: wpis nadal wymaga rÄ™cznej akceptacji i rÄ™cznego dodania do statycznej listy opinii.',
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
  const subject = `Nowa opinia do rÄ™cznej akceptacji - Behawior 15 - ${submission.displayName}`
  const html = renderEmailShell(
    'Nowa opinia do sprawdzenia',
    'Klient wysĹ‚aĹ‚ opiniÄ™ przez ukryty formularz po konsultacji. To nie jest jeszcze wpis publikowany.',
    `
      <p><strong>ImiÄ™ lub inicjaĹ‚y:</strong> ${escapeHtml(submission.displayName)}</p>
      <p><strong>Gatunek:</strong> ${escapeHtml(speciesLabel)}</p>
      <p><strong>Temat:</strong> ${escapeHtml(submission.topic)}</p>
      <p><strong>Zgoda na publikacjÄ™:</strong> ${submission.consentPublish ? 'tak' : 'nie'}</p>
      <p><strong>TreĹ›Ä‡ opinii:</strong><br />${formatMultilineHtml(submission.opinion)}</p>
      <p><strong>Status:</strong> wpis czeka na rÄ™cznÄ… akceptacjÄ™ i dodanie do publicznej listy opinii.</p>
    `,
    'Po akceptacji dodaj wpis rÄ™cznie do publicznej listy opinii przed kolejnym publikowaniem strony.',
  )
  const text = [
    'Nowa opinia do rÄ™cznej akceptacji.',
    `ImiÄ™ lub inicjaĹ‚y: ${submission.displayName}`,
    `Gatunek: ${speciesLabel}`,
    `Temat: ${submission.topic}`,
    `Zgoda na publikacjÄ™: ${submission.consentPublish ? 'tak' : 'nie'}`,
    `TreĹ›Ä‡ opinii: ${submission.opinion}`,
    'Status: wpis czeka na rÄ™cznÄ… akceptacjÄ™ i dodanie do publicznej listy opinii.',
    'Po akceptacji dodaj wpis rÄ™cznie do publicznej listy opinii przed kolejnym publikowaniem strony.',
  ].join('\n')

  return deliverEmail({ to: recipient, subject, html, text }, 'internal')
}

type UrgentNowSubmission = {
  requestId: string
  name: string
  email: string
  phone?: string | null
  topic: string
  species: string
  message: string
  requestedDate?: string | null
  requestedTime?: string | null
}

export async function sendUrgentNowCustomerAckEmail(submission: UrgentNowSubmission): Promise<DeliveryResult> {
  const recipient = submission.email.trim()

  if (!isValidPublicEmail(recipient)) {
    return { status: 'skipped', reason: 'customer email missing or invalid' }
  }

  const subject = 'Kwadrans na juz - dostałem Twoją prośbę, odpiszę w 15 minut'
  const html = renderEmailShell(
    `Cześć ${escapeHtml(submission.name.split(' ')[0])}, dostałem Twoją prośbę o Kwadrans na już.`,
    'Odpiszę na ten adres e-mail w ciągu 15 minut z propozycją terminu.',
    `
      <p><strong>Temat:</strong> ${escapeHtml(submission.topic)}</p>
      ${submission.requestedDate && submission.requestedTime ? `<p><strong>Preferowany termin:</strong> ${escapeHtml(submission.requestedDate)} o ${escapeHtml(submission.requestedTime)}</p>` : ''}
      <p>Jeśli coś się zmieni albo zechcesz doprecyzować temat, po prostu odpowiedz na tego maila.</p>
      ${renderContactBlockHtml()}
    `,
    'Poczekaj chwilę — termin będzie gotowy za kilkanaście minut.',
  )
  const text = [
    `Cześć ${submission.name.split(' ')[0]},`,
    '',
    'Dostałem Twoją prośbę o Kwadrans na już. Odpiszę w ciągu 15 minut z propozycją terminu.',
    '',
    `Temat: ${submission.topic}`,
    submission.requestedDate && submission.requestedTime ? `Preferowany termin: ${submission.requestedDate} ${submission.requestedTime}` : null,
    '',
    'Jeśli coś się zmieni, po prostu odpowiedz na tego maila.',
    renderContactBlockText(),
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n')

  return deliverEmail(
    { to: recipient, subject, html, text, replyTo: getPublicContactDetails().email ?? undefined },
    'customer',
  )
}

export async function sendUrgentNowAdminAlertEmail(submission: UrgentNowSubmission): Promise<DeliveryResult> {
  const recipient = getPublicContactDetails().email

  if (!recipient) {
    return { status: 'skipped', reason: 'admin email missing or invalid' }
  }

  const replyTo = isValidPublicEmail(submission.email) ? submission.email : undefined
  const phoneBlock = submission.phone ? `<p><strong>Telefon:</strong> ${escapeHtml(submission.phone)}</p>` : ''
  const preferredBlock =
    submission.requestedDate && submission.requestedTime
      ? `<p><strong>Preferowany termin:</strong> ${escapeHtml(submission.requestedDate)} o ${escapeHtml(submission.requestedTime)}</p>`
      : ''
  const subject = `KWADRANS NA JUZ: ${submission.name} - ${submission.topic} [ID: ${submission.requestId.slice(0, 8)}]`
  const html = renderEmailShell(
    'Nowe zgłoszenie Kwadrans na już',
    'Klient czeka na odpowiedź w ciągu 15 minut. Potwierdź termin albo zaproponuj inny.',
    `
      <p><strong>Imię:</strong> ${escapeHtml(submission.name)}</p>
      <p><strong>E-mail:</strong> ${replyTo ? `<a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a>` : escapeHtml(submission.email)}</p>
      ${phoneBlock}
      <p><strong>Gatunek:</strong> ${escapeHtml(submission.species)}</p>
      <p><strong>Temat:</strong> ${escapeHtml(submission.topic)}</p>
      ${preferredBlock}
      <p><strong>Opis:</strong><br />${formatMultilineHtml(submission.message)}</p>
      <p><strong>ID prośby:</strong> ${escapeHtml(submission.requestId)}</p>
    `,
    'Odpowiedz na maila klienta albo użyj panelu admin do zatwierdzenia terminu.',
  )
  const text = [
    'KWADRANS NA JUZ - nowe zgłoszenie.',
    `Imię: ${submission.name}`,
    `E-mail: ${submission.email}`,
    submission.phone ? `Telefon: ${submission.phone}` : null,
    `Gatunek: ${submission.species}`,
    `Temat: ${submission.topic}`,
    submission.requestedDate && submission.requestedTime ? `Preferowany termin: ${submission.requestedDate} ${submission.requestedTime}` : null,
    `Opis: ${submission.message}`,
    `ID prośby: ${submission.requestId}`,
    'Odpowiedz w ciągu 15 minut.',
  ]
    .filter((line): line is string => typeof line === 'string')
    .join('\n')

  return deliverEmail({ to: recipient, subject, html, text, replyTo }, 'internal')
}

export type ClientTestimonialSubmission = {
  id: string
  displayName: string
  email: string
  issueCategory: string
  opinion: string
  photoUrl: string | null
}

export async function sendClientTestimonialNotificationEmail(
  submission: ClientTestimonialSubmission,
): Promise<DeliveryResult> {
  const recipient = getAdminNotificationRecipientEmail()
  if (!recipient) {
    return {
      status: 'skipped',
      reason: 'ADMIN_NOTIFICATION_EMAIL missing',
    }
  }

  const baseUrl = getBaseUrl()
  const publishUrl = `${baseUrl}/api/admin/testimonials/${submission.id}?action=publish`
  const skipUrl = `${baseUrl}/api/admin/testimonials/${submission.id}?action=skip`

  const subject = `Nowa opinia od klienta - ${submission.displayName}`
  const photoBlock = submission.photoUrl
    ? `<p><strong>Zdjecie:</strong> <a href="${escapeHtml(submission.photoUrl)}">${escapeHtml(submission.photoUrl)}</a></p>`
    : '<p><strong>Zdjecie:</strong> brak</p>'

  const html = renderEmailShell(
    'Nowa opinia od klienta',
    'Klient wyslal opinie przez prywatny formularz. Zatwierdz lub odloz ponizej.',
    `
      <p><strong>Imie do publikacji:</strong> ${escapeHtml(submission.displayName)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(submission.email)}">${escapeHtml(submission.email)}</a></p>
      <p><strong>Kategoria:</strong> ${escapeHtml(submission.issueCategory)}</p>
      <p><strong>Tresc opinii:</strong><br />${formatMultilineHtml(submission.opinion)}</p>
      ${photoBlock}
      <div style="margin:28px 0 8px;display:flex;gap:12px;">
        <a href="${escapeHtml(publishUrl)}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#1f7a1f;color:#ffffff;text-decoration:none;font-weight:700;margin-right:12px;">
          Opublikuj opinie
        </a>
        <a href="${escapeHtml(skipUrl)}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#7a3a1f;color:#ffffff;text-decoration:none;font-weight:700;">
          Odloz (zostaje w panelu)
        </a>
      </div>
      <p style="font-size:13px;color:#6b625b;">Linki wymagaja autoryzacji admina. Po kliknieciu bedziesz musiec podac haslo.</p>
    `,
    'Opinia czeka w panelu /admin/opinie do momentu zatwierdzenia.',
  )

  const text = [
    'Nowa opinia od klienta czeka na zatwierdzenie.',
    `Imie: ${submission.displayName}`,
    `Email: ${submission.email}`,
    `Kategoria: ${submission.issueCategory}`,
    `Tresc: ${submission.opinion}`,
    `Zdjecie: ${submission.photoUrl ?? 'brak'}`,
    '',
    `Opublikuj: ${publishUrl}`,
    `Odloz: ${skipUrl}`,
  ].join('\n')

  return deliverEmail({ to: recipient, subject, html, text }, 'internal')
}

// ── /materialy funnel ───────────────────────────────────────────────────────
// Notifications for the new low-friction PDF funnel that uses BLIK + manual
// confirmation. Two flows: (1) free lead-magnet — code is generated immediately
// and sent to the customer; (2) paid order — owner gets a "to confirm" mail,
// then after manual confirmation the customer receives the unlock code.

export type MaterialyOrderEmailPayload = {
  orderId: string
  productKind: 'guide' | 'bundle'
  productSlug: string
  productTitle: string
  priceLabel: string
  priceAmount: number
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  notes?: string | null
}

export async function sendMaterialyOrderOwnerEmail(payload: MaterialyOrderEmailPayload): Promise<DeliveryResult> {
  const recipient = getPublicContactDetails().email
  if (!recipient) return { status: 'skipped', reason: 'public contact email missing or invalid' }

  const replyTo = isValidPublicEmail(payload.customerEmail) ? payload.customerEmail : undefined
  const isBundle = payload.productKind === 'bundle'
  const isFree = payload.priceAmount === 0
  const subject = isFree
    ? `Materialy: nowy lead - ${payload.productTitle}`
    : `Materialy: zamowienie ${payload.orderId} - ${payload.productTitle} (${payload.priceLabel})`

  const phoneBlock = payload.customerPhone
    ? `<p><strong>Telefon:</strong> ${escapeHtml(payload.customerPhone)}</p>`
    : ''
  const notesBlock = payload.notes
    ? `<p><strong>Wiadomosc:</strong><br />${formatMultilineHtml(payload.notes)}</p>`
    : ''

  const intro = isFree
    ? 'Klient pobral darmowy material. Kod do pobrania zostal juz wyslany automatycznie. To powiadomienie tylko do listy mailingowej i statystyk.'
    : `Klient zamowil ${isBundle ? 'pakiet' : 'pojedynczy PDF'}. Po wplywie BLIK potwierdz zamowienie w panelu admina (lub przez API confirm), aby system wyslal klientowi kod do pobrania.`

  const html = renderEmailShell(
    isFree ? 'Nowy lead PDF (bezplatny)' : 'Nowe zamowienie PDF',
    intro,
    `
      <p><strong>Order ID:</strong> <code>${escapeHtml(payload.orderId)}</code></p>
      <p><strong>Produkt:</strong> ${escapeHtml(payload.productTitle)} ${isBundle ? '(pakiet)' : ''}</p>
      <p><strong>Slug:</strong> ${escapeHtml(payload.productSlug)}</p>
      <p><strong>Cena:</strong> ${escapeHtml(payload.priceLabel)}</p>
      <p><strong>Imie:</strong> ${escapeHtml(payload.customerName)}</p>
      <p><strong>E-mail:</strong> ${replyTo ? `<a href="mailto:${escapeHtml(payload.customerEmail)}">${escapeHtml(payload.customerEmail)}</a>` : escapeHtml(payload.customerEmail)}</p>
      ${phoneBlock}
      ${notesBlock}
    `,
    isFree
      ? 'Material wyslany automatycznie. Mozesz dorzucic kontakt do listy nurturujacej.'
      : 'Po BLIK na podany w polu nadawcy numer wykonaj POST /api/materialy/confirm z naglowkiem x-admin-secret i body { orderId }, lub potwierdz w panelu admina.',
  )

  const lines = [
    isFree ? 'Nowy lead PDF (darmowy).' : 'Nowe zamowienie PDF.',
    `Order ID: ${payload.orderId}`,
    `Produkt: ${payload.productTitle}${isBundle ? ' (pakiet)' : ''}`,
    `Slug: ${payload.productSlug}`,
    `Cena: ${payload.priceLabel}`,
    `Imie: ${payload.customerName}`,
    `E-mail: ${payload.customerEmail}`,
    payload.customerPhone ? `Telefon: ${payload.customerPhone}` : null,
    payload.notes ? `Wiadomosc: ${payload.notes}` : null,
  ]
    .filter((line): line is string => Boolean(line))
    .join('\n')

  return deliverEmail({ to: recipient, subject, html, text: lines, replyTo }, 'internal')
}

export async function sendMaterialyOrderPendingCustomerEmail(payload: MaterialyOrderEmailPayload, blikPhone: string): Promise<DeliveryResult> {
  const recipient = payload.customerEmail.trim()
  if (!isValidPublicEmail(recipient)) return { status: 'skipped', reason: 'customer contact email missing or invalid' }

  const subject = `Zamowienie ${payload.orderId}: jak oplacic i odebrac PDF`
  const html = renderEmailShell(
    `Czesc ${escapeHtml(payload.customerName)}, dostalem Twoje zamowienie.`,
    'Wystarczy zrobic szybki BLIK i wysle Ci kod do pobrania PDF. To proces reczny — kod przychodzi do 60 minut w godzinach 8–18 (pon–pt). Poza tymi godzinami w nastepny dzien roboczy.',
    `
      <p><strong>Numer zamowienia:</strong> <code>${escapeHtml(payload.orderId)}</code></p>
      <p><strong>Produkt:</strong> ${escapeHtml(payload.productTitle)}</p>
      <p><strong>Kwota:</strong> ${escapeHtml(payload.priceLabel)}</p>
      <h2 style="font-size:16px;margin-top:24px;">Jak oplacic</h2>
      <p>Wykonaj BLIK <strong>na numer telefonu:</strong> <code>${escapeHtml(blikPhone)}</code></p>
      <p><strong>Tytul przelewu:</strong> ${escapeHtml(payload.orderId)}</p>
      <p>(Mozesz tez zrobic zwykly przelew z tym samym tytulem na konto, ktore podam w odpowiedzi mailowej, jesli nie korzystasz z BLIKa.)</p>
      <h2 style="font-size:16px;margin-top:24px;">Co dalej</h2>
      <p>Po zaksiegowaniu wplaty wysle Ci e-mail z 6-cyfrowym kodem. Kod wpisujesz na stronie <a href="https://regulskibehawiorysta.pl/materialy/pobranie">regulskibehawiorysta.pl/materialy/pobranie</a> i pobierasz PDF.</p>
      <p>Kod jest wazny 72 godziny i pozwala na maksymalnie 3 pobrania.</p>
    `,
    'Jesli zamowienie wymaga zmiany albo dane sie nie zgadzaja, odpowiedz na ten e-mail.',
  )
  const text = [
    `Czesc ${payload.customerName},`,
    `Numer zamowienia: ${payload.orderId}`,
    `Produkt: ${payload.productTitle}`,
    `Kwota: ${payload.priceLabel}`,
    '',
    `BLIK na numer: ${blikPhone}`,
    `Tytul: ${payload.orderId}`,
    '',
    'Po zaksiegowaniu wyslemy Ci kod do pobrania mailem.',
    'Strona pobrania: https://regulskibehawiorysta.pl/materialy/pobranie',
  ].join('\n')

  return deliverEmail({ to: recipient, subject, html, text }, 'customer')
}

export async function sendMaterialyCodeCustomerEmail(payload: MaterialyOrderEmailPayload, code: string, expiresAt: string): Promise<DeliveryResult> {
  const recipient = payload.customerEmail.trim()
  if (!isValidPublicEmail(recipient)) return { status: 'skipped', reason: 'customer contact email missing or invalid' }

  const expiresLabel = new Date(expiresAt).toLocaleString('pl-PL', { dateStyle: 'long', timeStyle: 'short' })
  const isFree = payload.priceAmount === 0
  const subject = isFree
    ? `Twoj bezplatny material: ${payload.productTitle}`
    : `Kod do pobrania: ${payload.productTitle}`

  const html = renderEmailShell(
    isFree
      ? `Czesc ${escapeHtml(payload.customerName)}, oto Twoj bezplatny material.`
      : `Czesc ${escapeHtml(payload.customerName)}, dostalem Twoja wplate. Oto kod.`,
    isFree
      ? 'Material jest darmowy. Kod ponizej dziala tak samo jak przy zamowieniach platnych.'
      : 'Wpisz ponizszy kod razem z e-mailem na stronie pobrania, zeby otworzyc PDF.',
    `
      <p><strong>Numer zamowienia:</strong> <code>${escapeHtml(payload.orderId)}</code></p>
      <p><strong>Produkt:</strong> ${escapeHtml(payload.productTitle)}</p>
      <p style="margin-top:24px;"><strong>Kod do pobrania:</strong></p>
      <p style="font-size:28px;letter-spacing:6px;font-weight:700;background:#f0e5d6;padding:16px 24px;border-radius:6px;display:inline-block;">${escapeHtml(code)}</p>
      <p style="margin-top:24px;"><strong>Strona pobrania:</strong><br /><a href="https://regulskibehawiorysta.pl/materialy/pobranie">regulskibehawiorysta.pl/materialy/pobranie</a></p>
      <p><strong>Wazny do:</strong> ${escapeHtml(expiresLabel)} (72 godziny od potwierdzenia, max 3 pobrania).</p>
    `,
    'Material wylacznie do uzytku wlasnego, bez prawa dalszej dystrybucji.',
  )
  const text = [
    `Czesc ${payload.customerName},`,
    `Numer zamowienia: ${payload.orderId}`,
    `Produkt: ${payload.productTitle}`,
    '',
    `Kod do pobrania: ${code}`,
    `Strona pobrania: https://regulskibehawiorysta.pl/materialy/pobranie`,
    `Wazny do: ${expiresLabel} (max 3 pobrania).`,
  ].join('\n')

  return deliverEmail({ to: recipient, subject, html, text }, 'customer')
}

