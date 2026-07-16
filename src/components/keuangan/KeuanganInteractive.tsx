"use client"

import { useState } from 'react'
import { Plus, Download, ArrowUpRight, ArrowDownRight, CheckCircle2, Clock } from 'lucide-react'
import { TransactionModal } from './TransactionModal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApbdesData, getRecentTransactions, approveTransaction } from '@/server/actions/keuangan'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function KeuanganInteractive({ initialApbdes, initialTransactions, userRole }: { initialApbdes: any, initialTransactions: any, userRole?: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  // Use React Query for realtime updates after mutations
  const { data: apbdes } = useQuery({
    queryKey: ['keuangan', 'apbdes'],
    queryFn: () => getApbdesData(),
    initialData: initialApbdes
  })

  const { data: transactions } = useQuery({
    queryKey: ['keuangan', 'transactions'],
    queryFn: () => getRecentTransactions(),
    initialData: initialTransactions
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, type }: { id: number, type: 'in'|'out' }) => approveTransaction(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keuangan'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    }
  })

  const exportPDF = () => {
    if (!apbdes) return

    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(`Laporan Keuangan Desa - APBDes ${apbdes.tahun}`, 14, 15)
    
    // Pendapatan Table
    doc.setFontSize(12)
    doc.text("Rincian Pendapatan", 14, 25)
    const pendapatanData = apbdes.pendapatans.map((p: any) => [
      p.uraian,
      formatRupiah(p.anggaran),
      formatRupiah(p.realisasi),
      `${((p.realisasi / p.anggaran) * 100).toFixed(1)}%`
    ])
    autoTable(doc, {
      startY: 30,
      head: [['Uraian', 'Anggaran', 'Realisasi', 'Persentase']],
      body: pendapatanData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] } // emerald-500
    })

    // Belanja Table
    const finalY = (doc as any).lastAutoTable.finalY || 30
    doc.text("Rincian Belanja", 14, finalY + 10)
    const belanjaData = apbdes.belanjas.map((b: any) => [
      b.uraian,
      formatRupiah(b.anggaran),
      formatRupiah(b.realisasi),
      `${((b.realisasi / b.anggaran) * 100).toFixed(1)}%`
    ])
    autoTable(doc, {
      startY: finalY + 15,
      head: [['Uraian', 'Anggaran', 'Realisasi', 'Persentase']],
      body: belanjaData,
      theme: 'grid',
      headStyles: { fillColor: [244, 63, 94] } // rose-500
    })

    doc.save(`Laporan_Keuangan_Desa_${apbdes.tahun}.pdf`)
  }

  if (!apbdes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Belum ada APBDes Aktif</h2>
        <p className="text-muted-foreground mb-6">Silakan buat draf APBDes baru untuk tahun ini.</p>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm shadow-primary/25">Buat APBDes</button>
      </div>
    )
  }

  const pendingIncomes = transactions.incomes.filter((t: any) => t.status === 'PENDING')
  const pendingExpenses = transactions.expenses.filter((t: any) => t.status === 'PENDING')
  const allPending = [...pendingIncomes.map((t: any) => ({ ...t, tType: 'in' })), ...pendingExpenses.map((t: any) => ({ ...t, tType: 'out' }))]

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Keuangan</h1>
            <p className="text-muted-foreground">Kelola APBDes {apbdes.tahun} dan persetujuan transaksi.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary rounded-xl font-medium transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-colors shadow-sm shadow-primary/25"
            >
              <Plus className="w-4 h-4" />
              Catat Transaksi
            </button>
          </div>
        </div>

        {allPending.length > 0 && (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-lg font-semibold text-amber-600 dark:text-amber-400">Persetujuan Menunggu ({allPending.length})</h3>
            </div>
            <div className="space-y-3">
              {allPending.map((t: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-card border border-border/50">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${t.tType === 'in' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                        {t.tType === 'in' ? 'Pendapatan' : 'Belanja'}
                      </span>
                      <span className="font-medium text-sm">{t.keterangan}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Pos: {t.tType === 'in' ? t.pendapatan?.uraian : t.belanja?.uraian}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground">{formatRupiah(t.jumlah)}</span>
                    {userRole === 'Admin' && (
                      <button 
                        onClick={() => approveMutation.mutate({ id: t.id, type: t.tType as 'in'|'out' })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Setujui
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-emerald-500" />
                Rincian Pendapatan
              </h3>
            </div>
            <div className="space-y-4">
              {apbdes.pendapatans.map((p: any) => {
                const percentage = (p.realisasi / p.anggaran) * 100;
                return (
                  <div key={p.id} className="p-5 rounded-xl bg-card/50 border border-border/50 hover:border-emerald-500/30 hover:shadow-sm transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between mb-3 gap-2">
                      <span className="font-medium text-sm group-hover:text-foreground transition-colors line-clamp-1" title={p.uraian}>{p.uraian}</span>
                      <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{formatRupiah(p.anggaran)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Realisasi: <span className="font-medium text-foreground">{formatRupiah(p.realisasi)}</span>
                      </span>
                      <span className={`font-medium ${percentage >= 100 ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-rose-500" />
                Rincian Belanja
              </h3>
            </div>
            <div className="space-y-4">
              {apbdes.belanjas.map((b: any) => {
                const percentage = (b.realisasi / b.anggaran) * 100;
                return (
                  <div key={b.id} className="p-5 rounded-xl bg-card/50 border border-border/50 hover:border-rose-500/30 hover:shadow-sm transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:items-center justify-between mb-3 gap-2">
                      <span className="font-medium text-sm group-hover:text-foreground transition-colors line-clamp-1" title={b.uraian}>{b.uraian}</span>
                      <span className="font-semibold text-sm text-rose-600 dark:text-rose-400 whitespace-nowrap">{formatRupiah(b.anggaran)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        Realisasi: <span className="font-medium text-foreground">{formatRupiah(b.realisasi)}</span>
                      </span>
                      <span className={`font-medium ${percentage >= 100 ? 'text-rose-600 dark:text-rose-400' : ''}`}>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(percentage, 100)}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <TransactionModal apbdes={apbdes} onClose={() => setIsModalOpen(false)} />}
    </>
  )
}
