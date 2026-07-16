import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { getApbdesData, getRecentTransactions } from '@/server/actions/keuangan'
import { KeuanganInteractive } from '@/components/keuangan/KeuanganInteractive'
import { getSession } from '@/lib/session'

export default async function KeuanganPage() {
  const session = await getSession()
  const apbdes = await getApbdesData()
  const transactions = await getRecentTransactions()

  return (
    <DashboardLayout userRole={session?.role || 'User'}>
      <KeuanganInteractive initialApbdes={apbdes} initialTransactions={transactions} userRole={session?.role || 'User'} />
    </DashboardLayout>
  )
}
