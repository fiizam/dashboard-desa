import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { UsersDataTable } from '@/components/master/UsersDataTable'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export default async function MasterDataPage() {
  const session = await getSession()

  if (session?.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <DashboardLayout userRole={session?.role || 'User'}>
      <UsersDataTable />
    </DashboardLayout>
  )
}
