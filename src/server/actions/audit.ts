"use server"

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function createAuditLog(action: string, entity: string, entityId?: string, details?: string) {
  try {
    const session = await getSession()
    if (!session?.userId) return

    await prisma.logAktivitas.create({
      data: {
        userId: session.userId,
        action,
        entity,
        entityId,
        details
      }
    })
  } catch (error) {
    console.error('Failed to create audit log', error)
  }
}
