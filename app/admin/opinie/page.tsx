import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { listPendingTestimonials } from '@/lib/server/testimonial-store'
import { getTestimonialIssueLabel } from '@/lib/testimonials'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Oczekuje',
  published: 'Opublikowana',
  skipped: 'Odlozona',
}

export default async function AdminOpiniePage() {
  noStore()

  let testimonials: Awaited<ReturnType<typeof listPendingTestimonials>> = []
  let loadError: string | null = null

  try {
    testimonials = await listPendingTestimonials()
  } catch (err) {
    loadError = err instanceof Error ? err.message : String(err)
  }

  const pending = testimonials.filter((t) => t.status === 'pending')
  const rest = testimonials.filter((t) => t.status !== 'pending')

  return (
    <main style={{ maxWidth: 760, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif', color: '#1f1a17' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Opinie klientow</h1>
        <Link href="/admin" style={{ fontSize: 13, color: '#6b625b' }}>← Panel admin</Link>
      </div>

      {loadError && (
        <p style={{ color: '#b91c1c', background: '#fef2f2', padding: '12px 16px', borderRadius: 8 }}>
          Błąd ladowania danych: {loadError}
        </p>
      )}

      <section>
        <h2 style={{ fontSize: '1rem', marginBottom: 16 }}>
          Oczekujace na decyzje ({pending.length})
        </h2>

        {pending.length === 0 && !loadError && (
          <p style={{ color: '#6b625b' }}>Brak oczekujacych opinii.</p>
        )}

        {pending.map((t) => (
          <article
            key={t.id}
            style={{
              background: '#fafaf8',
              border: '1px solid #e9dfcf',
              borderRadius: 12,
              padding: '20px 24px',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <strong style={{ fontSize: '1rem' }}>{t.displayName}</strong>
                <span style={{ marginLeft: 12, fontSize: 13, color: '#6b625b' }}>{t.email}</span>
              </div>
              <span style={{ fontSize: 12, color: '#6b625b' }}>{formatDate(t.createdAt)}</span>
            </div>

            <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6b625b' }}>
              Kategoria: {getTestimonialIssueLabel(t.issueCategory)}
            </p>

            <blockquote style={{ margin: '14px 0', padding: '12px 16px', background: '#fff', borderLeft: '3px solid #d9cfc3', borderRadius: 6 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{t.opinion}</p>
            </blockquote>

            {t.photoUrl && (
              <p style={{ margin: '0 0 14px', fontSize: 13 }}>
                Zdjecie: <a href={t.photoUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1f1a17' }}>{t.photoUrl}</a>
              </p>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href={`/api/admin/testimonials/${t.id}?action=publish`}
                style={btnStyle('#1f7a1f')}
              >
                Opublikuj
              </a>
              <a
                href={`/api/admin/testimonials/${t.id}?action=skip`}
                style={btnStyle('#6b625b')}
              >
                Odloz
              </a>
            </div>
          </article>
        ))}
      </section>

      {rest.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 16 }}>Historia ({rest.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e9dfcf' }}>
                <th style={thStyle}>Imie</th>
                <th style={thStyle}>Kategoria</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Data</th>
              </tr>
            </thead>
            <tbody>
              {rest.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f0ebe3' }}>
                  <td style={tdStyle}>{t.displayName}</td>
                  <td style={tdStyle}>{getTestimonialIssueLabel(t.issueCategory)}</td>
                  <td style={tdStyle}>{STATUS_LABELS[t.status] ?? t.status}</td>
                  <td style={tdStyle}>{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  )
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    display: 'inline-block',
    padding: '10px 20px',
    borderRadius: 999,
    background: bg,
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    textDecoration: 'none',
  }
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  color: '#6b625b',
  fontWeight: 600,
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  color: '#1f1a17',
}
