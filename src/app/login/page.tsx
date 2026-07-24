"use client"

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Lock, User, Eye, EyeOff } from 'lucide-react'
import { login } from '@/server/actions/auth'

function SuccessMessage() {
  const searchParams = useSearchParams()
  const isRegistered = searchParams.get('registered')

  if (!isRegistered) return null

  return (
    <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium leading-relaxed text-center">
      Akun berhasil dibuat! Silakan login menggunakan username dan password Anda.
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const res = await login(formData)

    if (res?.error) {
      setError(res.error)
      setIsLoading(false)
    } else if (res?.success) {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <div className="w-16 h-16 mb-4 relative bg-white rounded-xl overflow-hidden p-1 shadow-sm border border-border/50">
              <Image 
                src="/logo.png" 
                alt="DesaSync Logo" 
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back</h2>
            <p className="mt-2 text-sm text-muted-foreground">Silakan masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Suspense fallback={null}>
              <SuccessMessage />
            </Suspense>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  name="username"
                  required
                  className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Masukkan username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
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
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20" />
                <span className="text-sm font-medium">Ingat saya</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">Lupa password?</Link>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 disabled:opacity-70"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Masuk ke Dashboard
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:block relative flex-1 bg-secondary/30 border-l border-border/50 p-12">
        <div className="absolute inset-0 flex flex-col justify-center p-16">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-4 leading-tight">Sistem Informasi<br/>Keuangan Desa</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Platform enterprise modern untuk mengelola administrasi APBDes secara transparan, akuntabel, dan efisien.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
