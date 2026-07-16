"use server"

import prisma from '@/lib/prisma'

export async function getAiInsights() {
  const apbdes = await prisma.apbdes.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      pendapatans: true,
      belanjas: true,
    }
  })

  if (!apbdes) return []

  const insights = []

  const totalPendapatan = apbdes.pendapatans.reduce((sum, p) => sum + p.realisasi, 0)
  const totalBelanja = apbdes.belanjas.reduce((sum, b) => sum + b.realisasi, 0)

  // Rule 1: Sisa Kas Warning
  if (totalBelanja > totalPendapatan) {
    insights.push({
      type: 'warning',
      title: 'Peringatan Defisit Kas',
      message: `Total realisasi belanja (Rp ${totalBelanja.toLocaleString('id-ID')}) melebihi realisasi pendapatan (Rp ${totalPendapatan.toLocaleString('id-ID')}). Harap segera tinjau sumber dana yang tersedia.`
    })
  }

  // Rule 2: Penyerapan Anggaran Belanja Rendah
  const totalAnggaranBelanja = apbdes.belanjas.reduce((sum, b) => sum + b.anggaran, 0)
  const penyerapanBelanja = (totalBelanja / totalAnggaranBelanja) * 100
  if (penyerapanBelanja < 30) {
    insights.push({
      type: 'info',
      title: 'Penyerapan Anggaran Masih Rendah',
      message: `Persentase penyerapan belanja saat ini baru ${penyerapanBelanja.toFixed(1)}%. Perlu dilakukan percepatan pelaksanaan program.`
    })
  }

  // Rule 3: Pos Belanja Overbudget
  const overbudgetItems = apbdes.belanjas.filter(b => b.realisasi > b.anggaran)
  if (overbudgetItems.length > 0) {
    insights.push({
      type: 'danger',
      title: 'Terdapat Pos Belanja Overbudget',
      message: `${overbudgetItems.length} pos belanja terpantau melebihi anggaran yang ditetapkan. Sistem menyarankan revisi APBDes atau pembatasan transaksi.`
    })
  }

  // Rule 4: Prediksi Positif
  if (totalPendapatan > totalAnggaranBelanja * 0.8 && totalBelanja < totalPendapatan) {
    insights.push({
      type: 'success',
      title: 'Likuiditas Kas Sangat Baik',
      message: 'Pendapatan telah mencapai lebih dari 80% dari total rencana belanja. Kas desa berada dalam kondisi sangat sehat.'
    })
  }

  return insights
}
