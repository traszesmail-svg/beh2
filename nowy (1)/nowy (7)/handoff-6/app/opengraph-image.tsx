// handoff-6/app/opengraph-image.tsx
// Dynamiczny OG image generator — Next.js next/og (Edge runtime)
// Lokalizacja: app/opengraph-image.tsx (root) — dla głównej
// Lub: app/[route]/opengraph-image.tsx — per strona

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Regulski Behawiorysta — konsultacje online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #faf9f7 0%, #e8f3f0 100%)',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Pattern dekoracyjny */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, #4a8d7a22 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Logo / nazwa */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '40px',
            color: '#4a8d7a',
            fontSize: '24px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#4a8d7a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
            }}
          >
            R
          </div>
          Regulski Behawiorysta
        </div>

        {/* Tytuł */}
        <div
          style={{
            display: 'flex',
            fontSize: '76px',
            fontWeight: 700,
            color: '#1c1a18',
            lineHeight: 1.1,
            marginBottom: '32px',
            letterSpacing: '-0.02em',
            maxWidth: '900px',
          }}
        >
          Konsultacje behawioralne online
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#5a5650',
            lineHeight: 1.4,
            maxWidth: '800px',
          }}
        >
          Pies, kot, problem behawioralny? Pomogę bez kar i przymusu.
        </div>

        {/* Bottom badges */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            position: 'absolute',
            bottom: '60px',
            left: '80px',
          }}
        >
          {['COAPE / CAPBT', 'Bez kar i przymusu', 'Od 69 zł'].map(text => (
            <div
              key={text}
              style={{
                display: 'flex',
                padding: '12px 24px',
                background: 'white',
                borderRadius: '999px',
                fontSize: '20px',
                color: '#1c1a18',
                fontWeight: 500,
                border: '2px solid #e5e2dc',
              }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
