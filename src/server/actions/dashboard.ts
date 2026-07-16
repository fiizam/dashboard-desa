"use server"

import prisma from '@/lib/prisma'

export async function getDashboardStats() {
  const apbdes = await prisma.apbdes.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      pendapatans: true,
      belanjas: true,
    }
  })

  if (!apbdes) {
    return {
      totalAnggaran: 0,
      totalPendapatan: 0,
      totalBelanja: 0,
      sisaKas: 0,
      recentActivities: [],
      chartData: []
    }
  }

  const totalPendapatan = apbdes.pendapatans.reduce((sum, p) => sum + p.realisasi, 0)
  const totalBelanja = apbdes.belanjas.reduce((sum, b) => sum + b.realisasi, 0)
  
  // Get recent activities
  const recentPendapatan = await prisma.transaksiPendapatan.findMany({
    take: 5,
    orderBy: { tanggal: 'desc' },
    include: { pendapatan: true }
  })
  
  const recentBelanja = await prisma.transaksiBelanja.findMany({
    take: 5,
    orderBy: { tanggal: 'desc' },
    include: { belanja: true }
  })

  const combinedActivities = [
    ...recentPendapatan.map(p => ({
      id: `p-${p.id}`,
      title: p.keterangan || p.pendapatan.uraian,
      amount: `+ Rp ${p.jumlah.toLocaleString('id-ID')}`,
      rawAmount: p.jumlah,
      time: p.tanggal.toISOString(),
      type: 'in'
    })),
    ...recentBelanja.map(b => ({
      id: `b-${b.id}`,
      title: b.keterangan || b.belanja.uraian,
      amount: `- Rp ${b.jumlah.toLocaleString('id-ID')}`,
      rawAmount: b.jumlah,
      time: b.tanggal.toISOString(),
      type: 'out'
    }))
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)

  return {
    totalAnggaran: apbdes.pendapatans.reduce((sum, p) => sum + p.anggaran, 0),
    totalPendapatan,
    totalBelanja,
    sisaKas: totalPendapatan - totalBelanja,
    recentActivities: combinedActivities,
    // Dummy chart data for now since we just seeded it
    chartData: [
      { name: "Jan", pendapatan: totalPendapatan * 0.1, pengeluaran: totalBelanja * 0.05 },
      { name: "Feb", pendapatan: totalPendapatan * 0.15, pengeluaran: totalBelanja * 0.1 },
      { name: "Mar", pendapatan: totalPendapatan * 0.2, pengeluaran: totalBelanja * 0.2 },
      { name: "Apr", pendapatan: totalPendapatan * 0.1, pengeluaran: totalBelanja * 0.15 },
      { name: "Mei", pendapatan: totalPendapatan * 0.25, pengeluaran: totalBelanja * 0.3 },
      { name: "Jun", pendapatan: totalPendapatan * 0.1, pengeluaran: totalBelanja * 0.1 },
      { name: "Jul", pendapatan: totalPendapatan * 0.1, pengeluaran: totalBelanja * 0.1 },
    ]
  }
}
