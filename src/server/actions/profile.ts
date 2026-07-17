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
  try {
    const session = await getSession()
    if (!session?.userId) return { error: 'Unauthorized' }

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

    return { success: true }
  } catch (error: any) {
    console.error("updateProfile error:", error)
    return { error: error.message || "Terjadi kesalahan saat menyimpan profil" }
  }
}

export async function updateProfilePassword(newPassword: string) {
  try {
    const session = await getSession()
    if (!session?.userId) return { error: 'Unauthorized' }

    const bcrypt = require('bcryptjs')
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: session.userId },
      data: { password: hashedPassword }
    })

    return { success: true }
  } catch (error: any) {
    console.error("updateProfilePassword error:", error)
    return { error: error.message || "Terjadi kesalahan saat mengubah password" }
  }
}
