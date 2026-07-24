"use server"

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function generateFinancialInsights() {
  const session = await getSession()
  if (session?.role !== 'Admin') throw new Error('Unauthorized')

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { response: "⚠️ **Konfigurasi API Key Belum Lengkap.** \n\nSistem mendeteksi bahwa `GEMINI_API_KEY` belum terpasang atau masih kosong. Harap isi API Key di file `.env` dan **RESTART terminal (npm run dev)** Anda." }
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" })

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
Anda adalah Digital Village AI, seorang Konsultan Keuangan Desa yang ahli, profesional, analitis, dan berwibawa.
Berikut adalah data keuangan (APBDes) desa saat ini:
- Total Pendapatan Terealisasi: Rp ${totalPendapatan.toLocaleString('id-ID')}
- Total Anggaran Belanja: Rp ${totalAnggaranBelanja.toLocaleString('id-ID')}
- Total Realisasi Belanja (dana terpakai): Rp ${totalRealisasiBelanja.toLocaleString('id-ID')}

Detail Pos Belanja:
${apbdes.belanjas.map(b => `- ${b.uraian}: Anggaran Rp ${b.anggaran.toLocaleString('id-ID')}, Realisasi Rp ${b.realisasi.toLocaleString('id-ID')}`).join('\n')}

Tugas Anda:
1. Analisis kesehatan keuangan desa secara singkat berdasarkan angka di atas.
2. Identifikasi potensi masalah (contoh: defisit jika belanja > pendapatan, penyerapan rendah, atau overbudget).
3. Berikan saran strategis dan praktis yang bisa segera dieksekusi oleh Pemerintah Desa.
4. Tulis menggunakan format Markdown yang rapi (bold, daftar peluru, header level 3). Gunakan gaya bahasa konsultan profesional namun mudah dipahami.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return { response: response.text() }
  } catch (error: any) {
    console.error("AI Error:", error)
    const errorMsg = error.message || 'Terjadi kesalahan tidak terduga.'
    
    if (errorMsg.includes('503') || errorMsg.includes('high demand')) {
      return { response: `⚠️ **Server AI Sedang Sibuk (503).** \n\nServer Google Gemini saat ini sedang mengalami permintaan yang sangat tinggi dan tidak dapat melayani permintaan kita. Ini murni masalah dari server Google, bukan dari kode Anda. Silakan coba lagi dalam beberapa menit.` }
    } else if (errorMsg.includes('429') || errorMsg.includes('Quota')) {
      return { response: `⚠️ **Kuota API Habis (429).** \n\nKuota penggunaan API Key Anda telah habis atau dibatasi oleh Google. Silakan periksa akun Google Cloud / AI Studio Anda.` }
    }

    return { response: `⚠️ **Koneksi AI Gagal.** \n\nError: ${errorMsg}\n\n(Jika ini error konfigurasi, pastikan API Key benar dan Anda telah merestart npm run dev).` }
  }
}

