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

export async function updateProfile(data: { name: string, email: string, desaId?: string | null, alamat?: string | null, avatarUrl?: string | null }) {
  const session = await getSession()
  if (!session?.userId) throw new Error('Unauthorized')

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      name: data.name,
      email: data.email,
      desaId: data.desaId || null,
      alamat: data.alamat || null,
      avatarUrl: data.avatarUrl || null,
    }
  })

  // We can't revalidatePath('/profile') easily if it's called from client, but we'll return success
  return { success: true }
}

export async function updateProfilePassword(newPassword: string) {
  const session = await getSession()
  if (!session?.userId) throw new Error('Unauthorized')

  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: session.userId },
    data: { password: hashedPassword }
  })

  return { success: true }
}
