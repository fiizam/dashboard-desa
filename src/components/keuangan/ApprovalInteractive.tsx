"use client"

import { useState } from 'react'
import { processTransaction } from '@/server/actions/keuangan'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export function ApprovalInteractive({ initialPendapatan, initialBelanja }: { initialPendapatan: any[], initialBelanja: any[] }) {
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null)
  
  const handleProcess = async (id: string, type: 'in' | 'out', action: 'APPROVE' | 'REJECT') => {
    let reason = ''
    if (action === 'REJECT') {
      const input = prompt('Alasan penolakan:')
      if (input === null) return // cancelled
      reason = input
    }

    setIsSubmitting(id)
    try {
      const res = await processTransaction(id, type, action, reason)
      if (res.success) {
        toast.success(`Transaksi berhasil ${action === 'APPROVE' ? 'disetujui' : 'ditolak'}`)
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(null)
    }
  }

  const allPending = [
    ...initialPendapatan.map(p => ({ ...p, _type: 'in' as const })),
    ...initialBelanja.map(b => ({ ...b, _type: 'out' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-secondary/50 uppercase border-b border-border/50">
            <tr>
              <th className="px-6 py-4 font-medium">Tanggal</th>
              <th className="px-6 py-4 font-medium">Jenis</th>
              <th className="px-6 py-4 font-medium">Uraian / Keterangan</th>
              <th className="px-6 py-4 font-medium">Jumlah (Rp)</th>
              <th className="px-6 py-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {allPending.length > 0 ? allPending.map((item) => (
              <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4">
                  {new Date(item.tanggal).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item._type === 'in' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                    {item._type === 'in' ? 'Pendapatan' : 'Belanja'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{item._type === 'in' ? item.pendapatan?.uraian : item.belanja?.uraian}</div>
                  <div className="text-muted-foreground text-xs">{item.keterangan || '-'}</div>
                </td>
                <td className="px-6 py-4 font-semibold">
                  {item.jumlah.toLocaleString('id-ID')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleProcess(item.id, item._type, 'APPROVE')}
                      disabled={isSubmitting === item.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg text-xs font-medium transition-colors shadow-sm shadow-emerald-500/20 disabled:opacity-50"
                    >
                      {isSubmitting === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Setujui
                    </button>
                    <button 
                      onClick={() => handleProcess(item.id, item._type, 'REJECT')}
                      disabled={isSubmitting === item.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 text-white hover:bg-rose-600 rounded-lg text-xs font-medium transition-colors shadow-sm shadow-rose-500/20 disabled:opacity-50"
                    >
                      {isSubmitting === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                      Tolak
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  Tidak ada transaksi yang menunggu persetujuan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
