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
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Kiri: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 lg:flex-none lg:w-1/2 lg:px-20 xl:px-24 relative z-10 bg-background">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 flex items-center justify-center text-[#254d68] mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
                <circle cx="12" cy="10" r="3" fill="white" />
                <circle cx="12" cy="10" r="1.5" fill="#254d68" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-[22px] font-bold tracking-tight text-foreground leading-snug">
              Gabung dan bagikan kisahmu bersama kami.
            </h2>
            <p className="mt-3 text-[13px] text-muted-foreground font-medium">
              Daftar untuk memulai kunjungan Anda bersama Sistem Keuangan Desa.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-foreground/80">Nama</label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/60" />
                <input 
                  name="name"
                  required
                  className="w-full bg-background border border-border/70 rounded-[14px] pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  placeholder="Masukkan Nama"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-foreground/80">Email</label>
              <div className="relative">
                <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/60" />
                <input 
                  type="email"
                  name="email"
                  required
                  className="w-full bg-background border border-border/70 rounded-[14px] pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  placeholder="Masukkan Email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-foreground/80">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/60" />
                <input 
                  name="username"
                  required
                  className="w-full bg-background border border-border/70 rounded-[14px] pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  placeholder="Masukkan Username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-foreground/80">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground/60" />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border/70 rounded-[14px] pl-10 pr-10 py-3 text-sm outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50 placeholder:font-medium"
                  placeholder="Masukkan Password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              
              <div className="pt-3 grid grid-cols-2 gap-y-2 gap-x-4">
                <div className={`flex items-center gap-2 text-xs font-medium ${validations.length ? 'text-emerald-500' : 'text-muted-foreground/80'}`}>
                  {validations.length ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} Min. 10 Characters
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${validations.uppercase ? 'text-emerald-500' : 'text-muted-foreground/80'}`}>
                  {validations.uppercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Uppercase Letter
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${validations.lowercase ? 'text-emerald-500' : 'text-muted-foreground/80'}`}>
                  {validations.lowercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Lowercase Letter
                </div>
                <div className={`flex items-center gap-2 text-xs font-medium ${validations.number ? 'text-emerald-500' : 'text-muted-foreground/80'}`}>
                  {validations.number ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Number
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={isLoading || !isPasswordValid}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-[14px] font-semibold bg-[#509798] text-white hover:bg-[#437d7e] transition-colors shadow-md shadow-[#509798]/30 disabled:opacity-70 disabled:cursor-not-allowed text-[15px]"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-[13px] font-medium text-muted-foreground">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-bold text-[#509798] hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
      
      {/* Kanan: Background */}
      <div className="hidden lg:block relative flex-1">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-16 left-16 right-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Jadilah bagian dari<br/>Keluarga Kami
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
