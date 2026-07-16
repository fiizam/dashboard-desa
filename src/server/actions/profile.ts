"use server"

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function getProfile() {
  const session = await getSession()
  
  if (!session || !session.userId) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      role: true,
      desa: true
    }
  })

  if (!user) return null

  // Omit password for security
  const { password, ...safeUser } = user
  return safeUser
}
