import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { LaporanInteractive } from '@/components/laporan/LaporanInteractive'
import { getSession } from '@/lib/session'

export default async function LaporanPage() {
  const session = await getSession()

  return (
    <DashboardLayout userRole={session?.role || 'User'}>
      <LaporanInteractive />
    </DashboardLayout>
  )
}
