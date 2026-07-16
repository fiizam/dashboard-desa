"use server"

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { GoogleGenAI } from '@google/genai'

export async function generateFinancialInsights() {
  const session = await getSession()
  if (session?.role !== 'Admin') throw new Error('Unauthorized')

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'masukkan_api_key_anda_di_sini') {
    return { response: "⚠️ **Konfigurasi API Key Belum Lengkap.** \n\nSistem mendeteksi bahwa `GEMINI_API_KEY` belum terpasang atau masih kosong. Harap isi API Key di file `.env` dan **RESTART terminal (npm run dev)** Anda." }
  }

  const ai = new GoogleGenAI({ apiKey })

  // Get APBDes and transactions
  const apbdes = await prisma.apbdes.findFirst({
    where: { status: 'ACTIVE' },
    include: {
      pendapatans: true,
      belanjas: true,
    }
  })

  if (!apbdes) return { response: "Belum ada data APBDes aktif untuk dianalisis." }

  const totalPendapatan = apbdes.pendapatans.reduce((sum, p) => sum + p.realisasi, 0)
  const totalAnggaranBelanja = apbdes.belanjas.reduce((sum, b) => sum + b.anggaran, 0)
  const totalRealisasiBelanja = apbdes.belanjas.reduce((sum, b) => sum + b.realisasi, 0)

  // Construct prompt
  const prompt = `
Anda adalah DesaSync AI, seorang Konsultan Keuangan Desa yang ahli, profesional, analitis, dan berwibawa.
Berikut adalah data keuangan (APBDes) desa saat ini:
- Total Pendapatan Terealisasi: Rp ${totalPendapatan.toLocaleString('id-ID')}
- Total Anggaran Belanja: Rp ${totalAnggaranBelanja.toLocaleString('id-ID')}
- Total Realisasi Belanja (dana terpakai): Rp ${totalRealisasiBelanja.toLocaleString('id-ID')}

Detail Pos Belanja:
${apbdes.belanjas.map(b => `- ${b.kodeRekening}: Anggaran Rp ${b.anggaran.toLocaleString('id-ID')}, Realisasi Rp ${b.realisasi.toLocaleString('id-ID')}`).join('\n')}

Tugas Anda:
1. Analisis kesehatan keuangan desa secara singkat berdasarkan angka di atas.
2. Identifikasi potensi masalah (contoh: defisit jika belanja > pendapatan, penyerapan rendah, atau overbudget).
3. Berikan saran strategis dan praktis yang bisa segera dieksekusi oleh Pemerintah Desa.
4. Tulis menggunakan format Markdown yang rapi (bold, daftar peluru, header level 3). Gunakan gaya bahasa konsultan profesional namun mudah dipahami.
`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    })
    
    return { response: response.text }
  } catch (error: any) {
    console.error("AI Error:", error)
    return { response: `⚠️ **Koneksi AI Gagal.** \n\n${error.message || 'Terjadi kesalahan tidak terduga.'}\n\nPastikan Anda telah mengisi \`GEMINI_API_KEY\` yang valid di dalam file \`.env\` dan **MERESTART server Anda (matikan terminal lalu jalankan npm run dev kembali)**.` }
  }
}
