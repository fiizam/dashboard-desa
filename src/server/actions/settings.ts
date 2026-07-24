"use server"

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function generateBackup() {
  const session = await getSession()
  
  if (!session || !['Super Admin', 'Ketua RW', 'Wakil Ketua RW'].includes(session.role as string)) {
    return { error: 'Anda tidak memiliki otorisasi untuk mengunduh backup data.' }
  }

  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, username: true, roleId: true } })
    const apbdes = await prisma.apbdes.findMany()
    const pendapatan = await prisma.pendapatan.findMany()
    const belanja = await prisma.belanja.findMany()
    const transaksiPendapatan = await prisma.transaksiPendapatan.findMany()
    const transaksiBelanja = await prisma.transaksiBelanja.findMany()
    const log = await prisma.logAktivitas.findMany()

    const backupData = {
      timestamp: new Date().toISOString(),
      generatedBy: session.userId,
      data: {
        users,
        apbdes,
        pendapatan,
        belanja,
        transaksiPendapatan,
        transaksiBelanja,
        log
      }
    }

    return { success: true, data: JSON.stringify(backupData, null, 2) }
  } catch (error) {
    return { error: 'Gagal menghasilkan file backup.' }
  }
}
