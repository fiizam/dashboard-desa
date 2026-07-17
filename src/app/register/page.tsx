"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Lock, User, UserCircle, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'
import { register } from '@/server/actions/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const validations = {
    length: password.length >= 10,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }
  const isPasswordValid = Object.values(validations).every(Boolean)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string

    if (username.length < 10) {
      setError('Username minimal 10 karakter')
      setIsLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError('Password tidak memenuhi syarat keamanan')
      setIsLoading(false)
      return
    }

    const data = {
      name: formData.get('name'),
      username,
      email: formData.get('email'),
      password,
    }

    const res = await register(data)

    if (res?.error) {
      setError(res.error)
      setIsLoading(false)
    } else if (res?.success) {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm shadow-primary/25 mb-4 text-xl">
            D
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Buat Akun Baru</h2>
          <p className="mt-2 text-sm text-muted-foreground">Bergabung untuk mengakses layanan digital desa.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border/50 shadow-2xl rounded-3xl p-8 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Nama Lengkap</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                name="name"
                required
                className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                name="username"
                required
                className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Minimal 10 karakter unik"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email Terdaftar</label>
            <div className="relative">
              <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="email"
                name="email"
                required
                className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Alamat email aktif Anda"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            
            <div className="pt-2 grid grid-cols-2 gap-2">
              <div className={`flex items-center gap-1.5 text-xs ${validations.length ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {validations.length ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} Min. 10 Karakter
              </div>
              <div className={`flex items-center gap-1.5 text-xs ${validations.uppercase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {validations.uppercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Huruf Besar
              </div>
              <div className={`flex items-center gap-1.5 text-xs ${validations.lowercase ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {validations.lowercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Huruf Kecil
              </div>
              <div className={`flex items-center gap-1.5 text-xs ${validations.number ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                {validations.number ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Angka
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading || !isPasswordValid}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 disabled:opacity-50"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Daftar Akun
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}
