"use server"

import prisma from '@/lib/prisma'

export async function getExportData() {
  const incomes = await prisma.transaksiPendapatan.findMany({
    include: { pendapatan: true }
  })

  const expenses = await prisma.transaksiBelanja.findMany({
    include: { belanja: true }
  })

  return { incomes, expenses }
}
