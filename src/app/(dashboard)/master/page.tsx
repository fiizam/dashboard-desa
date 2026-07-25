import { UsersDataTable } from '@/components/master/UsersDataTable'
import { getSession } from '@/lib/session'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function MasterDataPage() {
  const session = await getSession()
  let role = session?.role || 'User'

  if (session?.userId) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { role: true }
    })
    if (user) {
      role = user.role.name
    }
  }

  const allowedRoles = ['Super Admin', 'Ketua RW']
  if (!allowedRoles.includes(role)) {
    redirect('/')
  }

  return (
    <>
      <UsersDataTable userRole={role} />
    </>
  )
}
