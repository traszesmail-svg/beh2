// handoff-7/app/api/lead-magnet/route.ts
// API endpoint — zapisuje email + wysyła PDF
// Domyślnie używa Resend; przełącz na Mailerlite/Brevo wg potrzeby

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

    // Walidacja
    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: 'Nieprawidłowy adres email' }, { status: 400 });
    }

    const magnet = LEAD_MAGNETS.find(m => m.id === body.magnetId);
    if (!magnet) {
      return NextResponse.json({ error: 'Nieznany lead magnet' }, { status: 400 });
    }

    // Rate limiting po IP — proste in-memory, podmień na Redis jeśli wieloinstancyjne
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Zbyt wiele zapisów z tego IP. Spróbuj za chwilę.' }, { status: 429 });
    }

    // 1. Zapisz subscribera (Mailerlite / Brevo / KV)
    await saveSubscriber({
      email: body.email,
      magnetId: body.magnetId,
      source: body.source,
      newsletter: !!body.consentNewsletter,
    });

    // 2. Wyślij email z PDF
    const pdfUrl = await generateSignedPdfUrl(magnet.pdfPath);
    await sendPdfEmail({
      to: body.email,
      magnetTitle: magnet.title,
      pdfUrl,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[lead-magnet]', err);
    return NextResponse.json({ error: 'Coś poszło nie tak. Spróbuj ponownie.' }, { status: 500 });
  }
}

// ====================================================================
// IMPLEMENTACJE — wybierz jedną i odkomentuj
// ====================================================================

// ----- Wariant A: Resend + zapis do Vercel KV -----
async function saveSubscriber(data: {
  email: string;
  magnetId: string;
  source: string;
  newsletter: boolean;
}) {
  // Przykład z Vercel KV:
  // import { kv } from '@vercel/kv';
  // await kv.hset(`subscriber:${data.email}`, {
  //   ...data,
  //   createdAt: Date.now(),
  // });
  // await kv.sadd('subscribers', data.email);

  // TYMCZASOWO — log do konsoli
  console.log('[subscriber]', data);
}

async function sendPdfEmail(args: { to: string; magnetTitle: string; pdfUrl: string }) {
  // Przykład z Resend:
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'Krzysztof Regulski <kontakt@regulskibehawiorysta.pl>',
  //   to: args.to,
  //   subject: `Twój PDF: ${args.magnetTitle}`,
  //   html: `
  //     <p>Cześć!</p>
  //     <p>Dziękuję za zapisanie się. Tak jak obiecałem — PDF do pobrania:</p>
  //     <p><a href="${args.pdfUrl}">📥 Pobierz: ${args.magnetTitle}</a></p>
  //     <p>Link aktywny przez 7 dni. Jeśli będziesz potrzebował konsultacji — zarezerwuj na regulskibehawiorysta.pl/book</p>
  //     <p>Pozdrawiam, Krzysztof</p>
  //   `,
  // });

  console.log('[email]', args);
}

async function generateSignedPdfUrl(path: string): Promise<string> {
  // Dla Vercel Blob — tworzymy podpisany URL z TTL
  // import { generateClientTokenFromReadWriteToken } from '@vercel/blob';
  // ...

  // TYMCZASOWO — bezpośredni link
  return `${process.env.NEXT_PUBLIC_SITE_URL || ''}${path}`;
}

// ----- Rate limiting -----
const rateLimits = new Map<string, number[]>();
const MAX_PER_HOUR = 5;
const HOUR_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimits.get(ip) || []).filter(t => now - t < HOUR_MS);
  if (timestamps.length >= MAX_PER_HOUR) return false;
  timestamps.push(now);
  rateLimits.set(ip, timestamps);
  return true;
}

/* ====================================================================
   WARIANT B — Mailerlite (zamiast saveSubscriber + sendPdfEmail powyżej)
   ====================================================================
   Mailerlite ma builtin automation — podpinasz subscriber-a do listy,
   automation wysyła PDF. Prościej.

async function saveSubscriber(data) {
  const r = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      groups: [
        process.env.MAILERLITE_GROUP_PDF,                    // wszyscy z PDF
        ...(data.newsletter ? [process.env.MAILERLITE_GROUP_NEWSLETTER] : []),
      ],
      fields: {
        magnet_id: data.magnetId,
        source: data.source,
      },
    }),
  });
  if (!r.ok) throw new Error(`Mailerlite: ${r.status}`);
}
==================================================================== */
