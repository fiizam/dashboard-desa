"use server"

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

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

export async function addUser(data: { name: string, email: string, password?: string, roleId: string, desaId?: string | null, isActive: boolean }) {
  const session = await getSession()
  if (session?.role !== 'Admin') throw new Error('Unauthorized')

  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : 'hashed_password'

  await prisma.user.create({
    data: {
      name: data.name,
      username: data.email.split('@')[0], // Generate username from email
      email: data.email,
      password: hashedPassword,
      roleId: data.roleId,
      desaId: data.desaId || null,
      isActive: data.isActive
    }
  })
  revalidatePath('/master')
  return { success: true }
}

export async function toggleUserStatus(id: string, currentStatus: boolean) {
  const session = await getSession()
  if (session?.role !== 'Admin') throw new Error('Unauthorized')

  await prisma.user.update({
    where: { id },
    data: { isActive: !currentStatus }
  })
  revalidatePath('/master')
  return { success: true }
}

export async function deleteUser(id: string) {
  const session = await getSession()
  if (session?.role !== 'Admin') throw new Error('Unauthorized')

  await prisma.user.delete({
    where: { id }
  })
  revalidatePath('/master')
  return { success: true }
}
