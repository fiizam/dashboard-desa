"use server"

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

// Master Data: Sumber Dana
export async function getSumberDanas() {
  return await prisma.sumberDana.findMany({ orderBy: { kode: 'asc' } })
}

export async function upsertSumberDana(data: { id?: string; kode: string; name: string; keterangan?: string }) {
  const session = await getSession()
  if (!['Super Admin', 'Admin Keuangan'].includes(session?.role as string)) throw new Error('Unauthorized')

  if (data.id) {
    await prisma.sumberDana.update({ where: { id: data.id }, data })
  } else {
    await prisma.sumberDana.create({ data })
  }
  revalidatePath('/referensi')
  return { success: true }
}

export async function deleteSumberDana(id: string) {
  const session = await getSession()
  if (!['Super Admin', 'Admin Keuangan'].includes(session?.role as string)) throw new Error('Unauthorized')

  await prisma.sumberDana.delete({ where: { id } })
  revalidatePath('/referensi')
  return { success: true }
}

// Master Data: Kategori Pendapatan
export async function getKategoriPendapatans() {
  return await prisma.kategoriPendapatan.findMany({ orderBy: { kode: 'asc' } })
}

export async function upsertKategoriPendapatan(data: { id?: string; kode: string; name: string }) {
  const session = await getSession()
  if (!['Super Admin', 'Admin Keuangan'].includes(session?.role as string)) throw new Error('Unauthorized')

  if (data.id) {
    await prisma.kategoriPendapatan.update({ where: { id: data.id }, data })
  } else {
    await prisma.kategoriPendapatan.create({ data })
  }
  revalidatePath('/referensi')
  return { success: true }
}

export async function deleteKategoriPendapatan(id: string) {
  const session = await getSession()
  if (!['Super Admin', 'Admin Keuangan'].includes(session?.role as string)) throw new Error('Unauthorized')

  await prisma.kategoriPendapatan.delete({ where: { id } })
  revalidatePath('/referensi')
  return { success: true }
}

// Master Data: Kategori Belanja
export async function getKategoriBelanjas() {
  return await prisma.kategoriBelanja.findMany({ orderBy: { kode: 'asc' } })
}

export async function upsertKategoriBelanja(data: { id?: string; kode: string; name: string }) {
  const session = await getSession()
  if (!['Super Admin', 'Admin Keuangan'].includes(session?.role as string)) throw new Error('Unauthorized')

  if (data.id) {
    await prisma.kategoriBelanja.update({ where: { id: data.id }, data })
  } else {
    await prisma.kategoriBelanja.create({ data })
  }
  revalidatePath('/referensi')
  return { success: true }
}

export async function deleteKategoriBelanja(id: string) {
  const session = await getSession()
  if (!['Super Admin', 'Admin Keuangan'].includes(session?.role as string)) throw new Error('Unauthorized')

  await prisma.kategoriBelanja.delete({ where: { id } })
  revalidatePath('/referensi')
  return { success: true }
}
