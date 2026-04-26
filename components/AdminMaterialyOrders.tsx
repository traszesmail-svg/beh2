'use client'

import { useState, useTransition } from 'react'
import type { MaterialyOrder } from '@/lib/server/materialy-storage'

type Props = {
  initialOrders: MaterialyOrder[]
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })
}

function statusLabel(status: MaterialyOrder['status']): string {
  switch (status) {
    case 'pending':
      return 'Oczekuje wpłaty'
    case 'paid':
      return 'Opłacone — kod wysłany'
    case 'used':
      return 'Wykorzystane (3/3)'
    case 'cancelled':
      return 'Anulowane'
  }
}

export function AdminMaterialyOrders({ initialOrders }: Props) {
  const [orders, setOrders] = useState<MaterialyOrder[]>(initialOrders)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  async function refresh() {
    try {
      const res = await fetch('/api/admin/materialy/list', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as { orders: MaterialyOrder[] }
      setOrders(data.orders)
    } catch (e) {
      setError(`Nie udało się odświeżyć listy: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  async function confirm(orderId: string) {
    if (busyId) return
    if (!window.confirm(`Potwierdzić wpłatę dla ${orderId}? Klient dostanie kod mailem.`)) return
    setBusyId(orderId)
    setError(null)
    try {
      const res = await fetch('/api/admin/materialy/confirm', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = (await res.json()) as Record<string, unknown>
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Coś poszło nie tak.')
        return
      }
      startTransition(() => {
        void refresh()
      })
    } catch (e) {
      setError(`Błąd sieci: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setBusyId(null)
    }
  }

  const pending = orders.filter((o) => o.status === 'pending')
  const paid = orders.filter((o) => o.status === 'paid' || o.status === 'used')

  return (
    <div className="admin-materialy">
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-section">
        <h2>Oczekuje wpłaty ({pending.length})</h2>
        {pending.length === 0 && <p className="admin-quiet">Brak nowych zamówień do potwierdzenia.</p>}
        <ul className="admin-orders">
          {pending.map((o) => (
            <li key={o.id} className="admin-order">
              <div className="admin-order-head">
                <code>{o.id}</code>
                <span className="admin-tag">{statusLabel(o.status)}</span>
                <span>{o.priceLabel}</span>
                <span className="admin-quiet">{formatDate(o.createdAt)}</span>
              </div>
              <div className="admin-order-body">
                <p>
                  <strong>{o.customerName}</strong> · {o.customerEmail}
                  {o.customerPhone && <> · {o.customerPhone}</>}
                </p>
                <p>
                  {o.productKind === 'bundle' ? 'Pakiet' : 'PDF'}: <code>{o.productSlug}</code>
                </p>
                {o.notes && <p className="admin-quiet">„{o.notes}&quot;</p>}
              </div>
              <div className="admin-order-actions">
                <button
                  type="button"
                  onClick={() => confirm(o.id)}
                  disabled={busyId === o.id}
                >
                  {busyId === o.id ? 'Wysyłam…' : 'Potwierdź wpłatę i wyślij kod'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-section">
        <h2>Opłacone ({paid.length})</h2>
        {paid.length === 0 && <p className="admin-quiet">Brak opłaconych zamówień w historii.</p>}
        <ul className="admin-orders">
          {paid.map((o) => (
            <li key={o.id} className="admin-order">
              <div className="admin-order-head">
                <code>{o.id}</code>
                <span className="admin-tag">{statusLabel(o.status)}</span>
                <span>{o.priceLabel}</span>
                <span className="admin-quiet">opłac.: {formatDate(o.paidAt)}</span>
                <span className="admin-quiet">pobrań: {o.usedCount}/3</span>
              </div>
              <div className="admin-order-body">
                <p>
                  <strong>{o.customerName}</strong> · {o.customerEmail}
                </p>
                <p>
                  {o.productKind === 'bundle' ? 'Pakiet' : 'PDF'}: <code>{o.productSlug}</code> · kod{' '}
                  <code>{o.code ?? '—'}</code>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button type="button" onClick={refresh} className="admin-refresh">
        Odśwież listę
      </button>

      <style jsx>{`
        .admin-materialy { margin-top: 24px; }
        .admin-error {
          background: #fde0e0;
          border: 1px solid #cc6655;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .admin-section { margin-bottom: 32px; }
        .admin-section h2 {
          font-size: 18px;
          margin: 0 0 12px;
          color: #1f1a17;
        }
        .admin-quiet { color: #8b6f5a; font-size: 13px; }
        .admin-orders {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .admin-order {
          background: #faf6f0;
          border: 1px solid #e5d8c6;
          border-radius: 6px;
          padding: 12px 16px;
        }
        .admin-order-head {
          display: flex;
          gap: 12px;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .admin-order-head code {
          background: #fff;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
        }
        .admin-tag {
          background: #c9a37a;
          color: #fff;
          padding: 2px 8px;
          border-radius: 3px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .admin-order-body p { margin: 4px 0; }
        .admin-order-body code {
          background: #fff;
          padding: 1px 4px;
          border-radius: 2px;
          font-size: 12px;
        }
        .admin-order-actions { margin-top: 12px; }
        .admin-order-actions button {
          background: #1f1a17;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
        }
        .admin-order-actions button:disabled {
          opacity: 0.5;
          cursor: wait;
        }
        .admin-refresh {
          background: transparent;
          border: 1px solid #c9a37a;
          color: #5e4a3c;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
