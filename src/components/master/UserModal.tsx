"use client"

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { addUser, getRoles, getDesa } from '@/server/actions/master'
import { motion } from 'framer-motion'
import { X, Loader2, Eye, EyeOff } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  roleId: z.string().min(1, 'Role wajib dipilih'),
  desaId: z.string().optional(),
  isActive: z.boolean().default(true),
})

type FormData = z.infer<typeof schema>

export function UserModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  
  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: () => getRoles() })
  const { data: desas = [] } = useQuery({ queryKey: ['desas'], queryFn: () => getDesa() })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const mutation = useMutation({
    mutationFn: (data: FormData) => addUser(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
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
          <h3 className="font-semibold text-lg tracking-tight">Tambah Pengguna Baru</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-background transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((d: any) => mutation.mutate(d))} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <input 
              {...register('name')}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Masukkan nama pengguna"
            />
            {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input 
              {...register('email')}
              className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="admin@desa.id"
            />
            {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                {...register('password')}
                className="w-full bg-background border border-border/50 rounded-xl pl-4 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role Akses</label>
              <select 
                {...register('roleId')}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Pilih Role...</option>
                {roles.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {errors.roleId && <p className="text-xs text-rose-500">{errors.roleId.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Entitas Desa</label>
              <select 
                {...register('desaId')}
                className="w-full bg-background border border-border/50 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">(Bukan spesifik desa)</option>
                {desas.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
            <label htmlFor="isActive" className="text-sm font-medium">Aktifkan pengguna segera</label>
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
              Simpan Data
            </button>
          </div>
        </form>
      </motion.div>
    </div>,
    document.body
  )
}
