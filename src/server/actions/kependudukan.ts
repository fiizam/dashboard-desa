'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function getStatistikKependudukan() {
  try {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    const totalKeluarga = await prisma.keluarga.count()
    const totalWarga = await prisma.warga.count()
    const lakiLaki = await prisma.warga.count({ where: { jenisKelamin: 'Laki-laki' } })
    const perempuan = await prisma.warga.count({ where: { jenisKelamin: 'Perempuan' } })

    return { totalKeluarga, totalWarga, lakiLaki, perempuan }
  } catch (error: any) {
    console.error('Failed to get stats:', error)
    return { totalKeluarga: 0, totalWarga: 0, lakiLaki: 0, perempuan: 0 }
  }
}

export async function getDaftarWarga(search?: string, rt?: string) {
  try {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    const where: any = {}
    if (search) {
      where.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (rt) {
      where.keluarga = { rt }
    }

    const warga = await prisma.warga.findMany({
      where,
      include: { keluarga: true },
      orderBy: { nama: 'asc' }
    })

    return warga
  } catch (error: any) {
    console.error('Failed to get warga:', error)
    return []
  }
}

export async function getDaftarKeluarga() {
  try {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')

    const keluarga = await prisma.keluarga.findMany({
      include: {
        _count: { select: { anggota: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return keluarga
  } catch (error: any) {
    console.error('Failed to get keluarga:', error)
    return []
  }
}

export async function createWarga(data: any) {
  try {
    const session = await getSession()
    if (!session) throw new Error('Unauthorized')
    
    // basic validation
    if (!data.nik || !data.nama || !data.keluargaId) {
      return { error: 'Data tidak lengkap' }
    }

    await prisma.warga.create({
      data: {
        nik: data.nik,
        nama: data.nama,
        tempatLahir: data.tempatLahir,
        tanggalLahir: new Date(data.tanggalLahir),
        jenisKelamin: data.jenisKelamin,
        agama: data.agama,
        pendidikan: data.pendidikan,
        pekerjaan: data.pekerjaan,
        statusPerkawinan: data.statusPerkawinan,
        statusKeluarga: data.statusKeluarga,
        keluargaId: data.keluargaId
      }
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to create warga:', error)
    if (error.code === 'P2002') return { error: 'NIK sudah terdaftar' }
    return { error: 'Gagal menambahkan warga' }
  }
}
