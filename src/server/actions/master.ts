"use server"

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      role: true,
      desa: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    roleId: user.roleId,
    desa: user.desa?.name || '-',
    desaId: user.desaId,
    isActive: user.isActive,
    avatar: user.avatarUrl,
    createdAt: user.createdAt.toISOString()
  }))
}

export async function getRoles() {
  return await prisma.role.findMany()
}

export async function getDesa() {
  return await prisma.desa.findMany()
}

export async function addUser(data: { name: string, email: string, roleId: number, desaId?: number | null, isActive: boolean }) {
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: 'hashed_password', // Mock
      roleId: data.roleId,
      desaId: data.desaId || null,
      isActive: data.isActive
    }
  })
  revalidatePath('/master')
  return { success: true }
}

export async function toggleUserStatus(id: string, currentStatus: boolean) {
  await prisma.user.update({
    where: { id },
    data: { isActive: !currentStatus }
  })
  revalidatePath('/master')
  return { success: true }
}

export async function deleteUser(id: string) {
  await prisma.user.delete({
    where: { id }
  })
  revalidatePath('/master')
  return { success: true }
}
