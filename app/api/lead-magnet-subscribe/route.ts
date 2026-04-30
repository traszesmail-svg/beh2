import { NextRequest, NextResponse } from 'next/server';
import { LEAD_MAGNETS } from '@/lib/lead-magnet.config';

interface SubmitBody {
  email: string;
  magnetId: string;
  source: 'popup' | 'banner' | 'section';
  consentNewsletter?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitBody;

    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: 'Nieprawidłowy adres email' }, { status: 400 });
    }

    const magnet = LEAD_MAGNETS.find(m => m.id === body.magnetId);
    if (!magnet) {
      return NextResponse.json({ error: 'Nieznany lead magnet' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Zbyt wiele prób. Spróbuj za chwilę.' }, { status: 429 });
    }

    await saveSubscriber({
      email: body.email,
      magnetId: body.magnetId,
      source: body.source,
      newsletter: !!body.consentNewsletter,
    });

    const pdfUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}${magnet.pdfPath}`;
    await sendPdfEmail({ to: body.email, magnetTitle: magnet.title, pdfUrl });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[lead-magnet-subscribe]', err);
    return NextResponse.json({ error: 'Coś poszło nie tak. Spróbuj ponownie.' }, { status: 500 });
  }
}

async function saveSubscriber(data: {
  email: string;
  magnetId: string;
  source: string;
  newsletter: boolean;
}) {
  if (process.env.MAILERLITE_API_KEY) {
    const groups = [
      process.env.MAILERLITE_GROUP_PDF,
      ...(data.newsletter && process.env.MAILERLITE_GROUP_NEWSLETTER
        ? [process.env.MAILERLITE_GROUP_NEWSLETTER]
        : []),
    ].filter(Boolean);

    const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        groups,
        fields: { magnet_id: data.magnetId, source: data.source },
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      console.error('[mailerlite]', err);
    }
    return;
  }

  // Fallback: log
  console.log('[subscriber]', data);
}

async function sendPdfEmail(args: { to: string; magnetTitle: string; pdfUrl: string }) {
  if (process.env.RESEND_API_KEY) {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL ?? 'Krzysztof Regulski <kontakt@regulskibehawiorysta.pl>',
        to: [args.to],
        subject: `Twój PDF: ${args.magnetTitle}`,
        html: `
          <p>Cześć,</p>
          <p>Dziękuję za zapisanie się. Jak obiecałem — Twój PDF:</p>
          <p><a href="${args.pdfUrl}" style="font-weight:bold">📥 Pobierz: ${args.magnetTitle}</a></p>
          <p>Jeśli potrzebujesz konsultacji — zarezerwuj na <a href="https://regulskibehawiorysta.pl/book">regulskibehawiorysta.pl</a></p>
          <p>Pozdrawiam,<br>Krzysztof Regulski</p>
        `,
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      console.error('[resend]', err);
      throw new Error('Błąd wysyłki email');
    }
    return;
  }

  // Fallback: log
  console.log('[email]', args);
}

const rateLimits = new Map<string, number[]>();
const MAX_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimits.get(ip) ?? []).filter(t => now - t < HOUR_MS);
  if (timestamps.length >= MAX_PER_HOUR) return false;
  timestamps.push(now);
  rateLimits.set(ip, timestamps);
  return true;
}
