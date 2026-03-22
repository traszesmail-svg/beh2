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

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim() || null
  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_RESEND_FROM_EMAIL

  return {
    apiKey,
    from,
  }
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

  if (contact.phone) {
    parts.push(`<p><strong>Telefon:</strong> ${contact.phone}</p>`)
  }

  if (!parts.length) {
    parts.push('<p><strong>Kontakt:</strong> odpowiedz na te wiadomosc, jesli potrzebujesz doprecyzowania terminu.</p>')
  }

  return parts.join('')
}

function renderContactBlockText() {
  const contact = getContactDetails()
  const lines = []

  if (contact.email) {
    lines.push(`Kontakt: ${contact.email}`)
  }

  if (contact.phone) {
    lines.push(`Telefon: ${contact.phone}`)
  }

  if (!lines.length) {
    lines.push('Kontakt: odpowiedz na te wiadomosc, jesli potrzebujesz doprecyzowania terminu.')
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
          <p style="margin-bottom:0;color:#6b625b;font-size:13px;">Wiadomosc wyslana automatycznie przez Behawior 15.</p>
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
  const subject = `Rezerwacja przyjeta - Behawior 15 - ${summary}`
  const html = renderEmailShell(
    'Mamy Twoja rezerwacje',
    'Termin zostal chwilowo zablokowany i czeka na platnosc. To pierwszy krok do spokojniejszego planu dzialania.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Kwota:</strong> ${formatPricePln(booking.amount)}</p>
      <p><strong>Co dalej:</strong> dokoncz platnosc, aby ostatecznie potwierdzic konsultacje i odblokowac link do rozmowy.</p>
      ${renderContactBlockHtml()}
    `,
    'Po oplaceniu od razu wyslemy finalne potwierdzenie. Jesli nie dokonczysz platnosci, slot automatycznie wroci do terminarza.',
  )
  const text = [
    'Behawior 15 - rezerwacja przyjeta.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Kwota: ${formatPricePln(booking.amount)}`,
    'Co dalej: dokoncz platnosc, aby ostatecznie potwierdzic konsultacje i odblokowac link do rozmowy.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail({ to: booking.email, subject, html, text })
}

export async function sendBookingConfirmationEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const summary = buildBookingSummary(booking)
  const subject = `Potwierdzenie konsultacji - Behawior 15 - ${summary}`
  const html = renderEmailShell(
    'Konsultacja potwierdzona',
    'Platnosc zostala przyjeta, a Twoj termin jest juz przypisany do Ciebie.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Opis zgloszenia:</strong> ${booking.description}</p>
      <p><strong>Link do rozmowy:</strong> <a href="${booking.meetingUrl}">${booking.meetingUrl}</a></p>
      <p><strong>Co dalej:</strong> wejdz 3-5 minut przed czasem i przygotuj najwazniejsze obserwacje oraz pytania. Po rozmowie dostaniesz jasny nastepny krok zamiast ogolnych porad.</p>
      ${renderContactBlockHtml()}
    `,
    'Jesli bedzie potrzebny kolejny krok po rozmowie, dostaniesz jasna rekomendacje zamiast ogolnych porad.',
  )
  const text = [
    'Twoja konsultacja Behawior 15 zostala potwierdzona.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Opis: ${booking.description}`,
    `Link do rozmowy: ${booking.meetingUrl}`,
    'Co dalej: wejdz 3-5 minut przed czasem i przygotuj najwazniejsze obserwacje oraz pytania. Po rozmowie dostaniesz jasny nastepny krok zamiast ogolnych porad.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail({ to: booking.email, subject, html, text })
}

export async function sendBookingReminderEmail(booking: BookingRecord): Promise<DeliveryResult> {
  const subject = 'Przypomnienie: konsultacja Behawior 15 startuje za mniej niz godzine'
  const html = renderEmailShell(
    'Przypomnienie o konsultacji',
    'Za mniej niz godzine startuje Twoja rozmowa. Warto wejsc chwile wczesniej, zeby zaczac spokojnie i bez pospiechu.',
    `
      <p><strong>Termin:</strong> ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}</p>
      <p><strong>Temat:</strong> ${getProblemLabel(booking.problemType)}</p>
      <p><strong>Link do rozmowy:</strong> <a href="${booking.meetingUrl}">${booking.meetingUrl}</a></p>
      <p><strong>Przed rozmowa:</strong> przygotuj 2-3 najwazniejsze pytania i najkrotszy mozliwy opis problemu.</p>
      ${renderContactBlockHtml()}
    `,
    'Do uslyszenia. To bedzie krotka rozmowa, ale z konkretnym kierunkiem dzialania.',
  )
  const text = [
    'Przypomnienie o konsultacji Behawior 15.',
    `Termin: ${formatDateTimeLabel(booking.bookingDate, booking.bookingTime)}`,
    `Temat: ${getProblemLabel(booking.problemType)}`,
    `Link do rozmowy: ${booking.meetingUrl}`,
    'Przed rozmowa przygotuj 2-3 najwazniejsze pytania i najkrotszy mozliwy opis problemu.',
    renderContactBlockText(),
  ].join('\n')

  return deliverEmail({ to: booking.email, subject, html, text })
}
