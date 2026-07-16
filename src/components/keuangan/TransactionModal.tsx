"use client"

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addTransaction } from '@/server/actions/keuangan'
import { motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'

const schema = z.object({
  type: z.enum(['in', 'out']),
  amount: z.coerce.number().min(1, 'Jumlah wajib diisi'),
  description: z.string().min(5, 'Keterangan minimal 5 karakter'),
  posId: z.string().min(1, 'Pos anggaran wajib dipilih'),
})

type FormData = z.infer<typeof schema>

export function TransactionModal({ 
  onClose, 
  apbdes 
}: { 
  onClose: () => void,
  apbdes: any 
}) {
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'out' }
  })

  const selectedType = watch('type')

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const mutation = useMutation({
    mutationFn: (data: FormData) => addTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keuangan'] })
      onClose()
    }
  })

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-3xl overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-secondary/30">
          <h3 className="font-semibold text-lg tracking-tight">Catat Transaksi Baru</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-background transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-colors ${selectedType === 'in' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-border/50 bg-background hover:bg-secondary'}`}>
                <input type="radio" value="in" {...register('type')} className="sr-only" />
                Pendapatan Masuk
              </label>
              <label className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl cursor-pointer transition-colors ${selectedType === 'out' ? 'border-rose-500 bg-rose-500/10 text-rose-600' : 'border-border/50 bg-background hover:bg-secondary'}`}>
                <input type="radio" value="out" {...register('type')} className="sr-only" />
                Belanja Keluar
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Pos Anggaran</label>
            <select 
              {...register('posId')}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Pilih Pos Anggaran...</option>
              {selectedType === 'in' ? (
                apbdes?.pendapatans?.map((p: any) => <option key={p.id} value={p.id}>{p.uraian}</option>)
              ) : (
                apbdes?.belanjas?.map((b: any) => <option key={b.id} value={b.id}>{b.uraian}</option>)
              )}
            </select>
            {errors.posId && <p className="text-xs text-rose-500">{errors.posId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nominal Transaksi (Rp)</label>
            <input 
              type="number"
              {...register('amount')}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="0"
            />
            {errors.amount && <p className="text-xs text-rose-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Keterangan / Uraian Transaksi</label>
            <textarea 
              {...register('description')}
              rows={3}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Tuliskan keterangan lengkap..."
            />
            {errors.description && <p className="text-xs text-rose-500">{errors.description.message}</p>}
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-border/50 mt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Ajukan Transaksi
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  )
}
