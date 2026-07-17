"use server"

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function getNotifications() {
  const session = await getSession()
  if (!session?.userId) return []

  return await prisma.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 10
  })
}

export async function markNotificationRead(id: string) {
  const session = await getSession()
  if (!session?.userId) return { error: 'Unauthorized' }

  await prisma.notification.updateMany({
    where: { id, userId: session.userId },
    data: { isRead: true }
  })
  return { success: true }
}

export async function createNotification(userId: string, title: string, message: string, link?: string) {
  await prisma.notification.create({
    data: { userId, title, message, link }
  })
}
