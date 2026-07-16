"use server"

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function generateBackup() {
  const session = await getSession()
  
  if (!session || session.role !== 'Admin') {
    return { error: 'Anda tidak memiliki otorisasi untuk mengunduh backup data.' }
  }

  try {
    const users = await prisma.user.findMany({ select: { id: true, name: true, username: true, roleId: true } })
    const apbdes = await prisma.aPBDes.findMany()
    const pendapatan = await prisma.pendapatan.findMany()
    const belanja = await prisma.belanja.findMany()
    const transaksi = await prisma.transaksi.findMany()
    const log = await prisma.logAktivitas.findMany()

    const backupData = {
      timestamp: new Date().toISOString(),
      generatedBy: session.userId,
      data: {
        users,
        apbdes,
        pendapatan,
        belanja,
        transaksi,
        log
      }
    }

    return { success: true, data: JSON.stringify(backupData, null, 2) }
  } catch (error) {
    return { error: 'Gagal menghasilkan file backup.' }
  }
}
