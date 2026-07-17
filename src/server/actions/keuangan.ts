"use server"

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { createNotification } from './notifications'
import { createAuditLog } from './audit'

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
  const session = await getSession()
  const userId = session?.userId || 'system'
  
  if (data.type === 'in') {
    const tx = await prisma.transaksiPendapatan.create({
      data: {
        pendapatanId: data.posId,
        jumlah: data.amount,
        keterangan: data.description,
        tanggal: new Date(),
        status: 'PENDING',
        createdBy: userId
      }
    })
    await createAuditLog('CREATE_TRANSAKSI', 'Transaksi Pendapatan', tx.id, `Pengajuan pendapatan Rp ${data.amount}`)
  } else {
    const tx = await prisma.transaksiBelanja.create({
      data: {
        belanjaId: data.posId,
        jumlah: data.amount,
        keterangan: data.description,
        tanggal: new Date(),
        status: 'PENDING',
        penerima: '-',
        createdBy: userId
      }
    })
    await createAuditLog('CREATE_TRANSAKSI', 'Transaksi Belanja', tx.id, `Pengajuan belanja Rp ${data.amount}`)
  }
  
  // Notify Kepala Desa
  const kades = await prisma.user.findFirst({
    where: { role: { name: 'Kepala Desa' } }
  })
  
  if (kades) {
    await createNotification(
      kades.id,
      'Transaksi Baru Menunggu Persetujuan',
      `Terdapat pengajuan transaksi ${data.type === 'in' ? 'pendapatan' : 'belanja'} sebesar Rp ${data.amount.toLocaleString()} yang memerlukan persetujuan Anda.`,
      '/keuangan/approval'
    )
  }

  revalidatePath('/keuangan')
  return { success: true }
}

export async function processTransaction(id: string, type: 'in' | 'out', action: 'APPROVE' | 'REJECT', reason?: string) {
  const status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED'
  
  if (type === 'in') {
    const tx = await prisma.transaksiPendapatan.update({
      where: { id },
      data: { status }
    })
    
    if (action === 'APPROVE') {
      await prisma.pendapatan.update({
        where: { id: tx.pendapatanId },
        data: { realisasi: { increment: tx.jumlah } }
      })
    }

    if (tx.createdBy !== 'system') {
      await createNotification(
        tx.createdBy,
        `Transaksi Pendapatan ${status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}`,
        `Pengajuan pendapatan Anda sebesar Rp ${tx.jumlah.toLocaleString()} telah ${status === 'APPROVED' ? 'disetujui' : `ditolak. Alasan: ${reason || '-'}`}`,
        '/keuangan'
      )
    }
    
    await createAuditLog(`${action}_TRANSAKSI`, 'Transaksi Pendapatan', tx.id, `Status: ${status}`)

  } else {
    const tx = await prisma.transaksiBelanja.update({
      where: { id },
      data: { status }
    })
    
    if (action === 'APPROVE') {
      await prisma.belanja.update({
        where: { id: tx.belanjaId },
        data: { realisasi: { increment: tx.jumlah } }
      })
    }

    if (tx.createdBy !== 'system') {
      await createNotification(
        tx.createdBy,
        `Transaksi Belanja ${status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}`,
        `Pengajuan belanja Anda sebesar Rp ${tx.jumlah.toLocaleString()} telah ${status === 'APPROVED' ? 'disetujui' : `ditolak. Alasan: ${reason || '-'}`}`,
        '/keuangan'
      )
    }
    
    await createAuditLog(`${action}_TRANSAKSI`, 'Transaksi Belanja', tx.id, `Status: ${status}`)
  }
  
  revalidatePath('/keuangan/approval')
  return { success: true }
}
