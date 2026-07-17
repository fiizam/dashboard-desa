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

export async function addUser(data: { name: string, username: string, email: string, password?: string, roleId: string, desaId?: string | null, isActive: boolean }) {
  const session = await getSession()
  if (session?.role !== 'Admin') throw new Error('Unauthorized')

  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : 'hashed_password'

  await prisma.user.create({
    data: {
      name: data.name,
      username: data.username,
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

  const targetUser = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (targetUser?.role.name === 'Admin' || targetUser?.role.name === 'Super Admin') {
    return { error: 'Tidak dapat mengubah status akun Admin' }
  }

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

  const targetUser = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (targetUser?.role.name === 'Admin' || targetUser?.role.name === 'Super Admin') {
    return { error: 'Tidak dapat menghapus akun Admin' }
  }

  await prisma.user.delete({
    where: { id }
  })
  revalidatePath('/master')
  return { success: true }
}

export async function editUser(id: string, data: { name: string, username: string, email: string, roleId: string, desaId?: string | null }) {
  const session = await getSession()
  if (session?.role !== 'Admin') throw new Error('Unauthorized')

  const targetUser = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (targetUser?.role.name === 'Admin' || targetUser?.role.name === 'Super Admin') {
    return { error: 'Tidak dapat mengedit data akun Admin' }
  }

  await prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      username: data.username,
      email: data.email,
      roleId: data.roleId,
      desaId: data.desaId || null
    }
  })
  revalidatePath('/master')
  return { success: true }
}

export async function resetUserPassword(id: string, newPassword: string) {
  const session = await getSession()
  if (session?.role !== 'Admin') throw new Error('Unauthorized')

  const targetUser = await prisma.user.findUnique({ where: { id }, include: { role: true } })
  if (targetUser?.role.name === 'Admin' || targetUser?.role.name === 'Super Admin') {
    return { error: 'Tidak dapat mereset kata sandi akun Admin' }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword }
  })
  revalidatePath('/master')
  return { success: true }
}
