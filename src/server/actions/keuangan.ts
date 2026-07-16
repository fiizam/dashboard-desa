"use server"

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getApbdesData() {
  const activeApbdes = await prisma.apbdes.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      desa: true,
      pendapatans: {
        include: {
          sumberDana: true,
          kategori: true
        }
      },
      belanjas: {
        include: {
          sumberDana: true,
          kategori: true,
          kegiatan: {
            include: {
              bidang: true
            }
          }
        }
      }
    }
  })

  return activeApbdes
}

export async function getRecentTransactions() {
  const incomes = await prisma.transaksiPendapatan.findMany({
    take: 10,
    orderBy: { tanggal: 'desc' },
    include: { pendapatan: true }
  })

  const expenses = await prisma.transaksiBelanja.findMany({
    take: 10,
    orderBy: { tanggal: 'desc' },
    include: { belanja: true }
  })

  return { incomes, expenses }
}

export async function addTransaction(data: { type: 'in' | 'out', amount: number, description: string, posId: string }) {
  if (data.type === 'in') {
    await prisma.transaksiPendapatan.create({
      data: {
        pendapatanId: data.posId,
        jumlah: data.amount,
        keterangan: data.description,
        tanggal: new Date(),
        status: 'PENDING'
      }
    })
  } else {
    await prisma.transaksiBelanja.create({
      data: {
        belanjaId: data.posId,
        jumlah: data.amount,
        keterangan: data.description,
        tanggal: new Date(),
        status: 'PENDING'
      }
    })
  }
  revalidatePath('/keuangan')
  return { success: true }
}

export async function approveTransaction(id: string, type: 'in' | 'out') {
  if (type === 'in') {
    const tx = await prisma.transaksiPendapatan.update({
      where: { id },
      data: { status: 'APPROVED' }
    })
    // Update realisasi
    await prisma.pendapatan.update({
      where: { id: tx.pendapatanId },
      data: { realisasi: { increment: tx.jumlah } }
    })
  } else {
    const tx = await prisma.transaksiBelanja.update({
      where: { id },
      data: { status: 'APPROVED' }
    })
    // Update realisasi
    await prisma.belanja.update({
      where: { id: tx.belanjaId },
      data: { realisasi: { increment: tx.jumlah } }
    })
  }
  revalidatePath('/keuangan')
  return { success: true }
}
