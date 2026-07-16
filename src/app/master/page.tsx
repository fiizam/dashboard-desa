import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { UsersDataTable } from '@/components/master/UsersDataTable'
import { getSession } from '@/lib/session'

export default async function MasterDataPage() {
  const session = await getSession()

  return (
    <DashboardLayout userRole={session?.role || 'User'}>
      <UsersDataTable />
    </DashboardLayout>
  )
}
