import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { AdminMaterialyOrders } from '@/components/AdminMaterialyOrders'
import { listAllOrders } from '@/lib/server/materialy-storage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminMaterialyPage() {
  noStore()
  const orders = await listAllOrders()
  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <>
      <Header />
      <main className="page-shell" style={{ paddingBlock: '40px' }}>
        <div className="page-shell-inner" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          <p style={{ marginBottom: '12px' }}>
            <Link href="/admin">&larr; Panel admina</Link>
          </p>
          <h1>Zamówienia /materialy</h1>
          <p style={{ color: '#5e4a3c', maxWidth: '720px' }}>
            Po wpływie BLIK kliknij „Potwierdź wpłatę i wyślij kod&quot;. Klient dostanie 6-cyfrowy kod
            mailem i pobierze PDF na <Link href="/materialy/pobranie">/materialy/pobranie</Link>.
          </p>

          <AdminMaterialyOrders initialOrders={orders} />
        </div>
      </main>
    </>
  )
}
