"use server"

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function login(data: FormData) {
  const username = data.get('username') as string
  const password = data.get('password') as string

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi' }
  }

  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true }
  })

  if (!user || !user.isActive) {
    return { error: 'Akun tidak ditemukan atau tidak aktif' }
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  
  if (!isValidPassword) {
    return { error: 'Password salah' }
  }

  // Create session
  await createSession(user.id, user.role.name)

  return { success: true, redirect: '/' }
}

export async function register(data: any) {
  try {
    const { name, username, email, password } = data

    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return { error: 'Username sudah digunakan' }
    }

    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return { error: 'Email sudah terdaftar, silakan gunakan email lain.' }
    }

    // Assign "User" role by default
    const userRole = await prisma.role.findFirst({
      where: { name: 'User' }
    })

    if (!userRole) {
      return { error: 'System Role "User" tidak ditemukan' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        roleId: userRole.id
      }
    })

    return { success: true }
  } catch (error) {
    return { error: 'Terjadi kesalahan saat registrasi' }
  }
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
