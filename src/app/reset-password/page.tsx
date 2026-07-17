"use client"

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { resetPassword } from '@/server/actions/auth-reset'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!token) {
      setError('Tautan tidak valid atau tidak memiliki token.')
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.')
      setIsLoading(false)
      return
    }

    const res = await resetPassword(password, token)

    if (res?.error) {
      setError(res.error)
    } else if (res?.success) {
      setSuccess(res.message || 'Kata sandi berhasil diubah!')
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
    
    setIsLoading(false)
  }

  if (!token && !error) {
    return (
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm font-medium leading-relaxed">
        Tautan reset kata sandi tidak valid (token hilang). Pastikan Anda menyalin tautan secara penuh dari email Anda.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium leading-relaxed text-center">
          <p>{success}</p>
          <p className="mt-2 text-xs">Mengarahkan ke halaman login...</p>
        </div>
      ) : (
        <>
          <div className="space-y-1">
            <label className="text-sm font-medium">Kata Sandi Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Minimal 6 karakter"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                required
                className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Ulangi kata sandi baru"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 disabled:opacity-70"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Simpan Kata Sandi
          </button>
        </>
      )}
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </Link>
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm shadow-primary/25 mb-4 text-xl">
          D
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Atur Ulang Kata Sandi</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Silakan masukkan kata sandi baru Anda untuk akun ini.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 sm:px-10 border border-border shadow-xl sm:rounded-3xl">
          <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
