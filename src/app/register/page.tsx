"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Lock, User, UserCircle, CheckCircle2, XCircle, Eye, EyeOff, Mail } from 'lucide-react'
import { register } from '@/server/actions/auth'
import { motion } from 'framer-motion'

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
      router.push('/login?registered=true')
    }
  }

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {/* Left side - Decorative/Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex lg:flex-1 relative bg-secondary/30 border-r border-border/50 p-12 items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50"></div>
        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 mb-8 relative bg-white rounded-2xl overflow-hidden p-2 shadow-lg shadow-primary/10">
            <Image 
              src="/logo.png" 
              alt="DesaSync Logo" 
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">Mulai Perjalanan<br />Digital Desa.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Bergabunglah dengan platform enterprise modern kami untuk mengelola administrasi keuangan dan tata kelola secara cerdas.
          </p>
        </div>

        {/* Abstract animated shapes */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl opacity-40 pointer-events-none"
        />
      </motion.div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 h-full overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto w-full max-w-md"
        >
          <div className="mb-6 lg:mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Buat Akun</h2>
            <p className="mt-2 text-sm text-muted-foreground">Silakan lengkapi data di bawah ini untuk mendaftar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nama Lengkap</label>
                <div className="relative group">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    name="name"
                    required
                    className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm hover:border-border"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Username</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    name="username"
                    required
                    className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm hover:border-border"
                    placeholder="Min 10 char"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm hover:border-border"
                  placeholder="Alamat email anda"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-xl pl-9 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-sm hover:border-border"
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

              <div className="pt-2 grid grid-cols-2 gap-1.5 bg-secondary/20 p-2.5 rounded-lg border border-border/30 mt-2">
                <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${validations.length ? 'text-emerald-500' : 'text-muted-foreground/70'}`}>
                  {validations.length ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} Min. 10 Characters
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${validations.uppercase ? 'text-emerald-500' : 'text-muted-foreground/70'}`}>
                  {validations.uppercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Uppercase Letter
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${validations.lowercase ? 'text-emerald-500' : 'text-muted-foreground/70'}`}>
                  {validations.lowercase ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Lowercase Letter
                </div>
                <div className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${validations.number ? 'text-emerald-500' : 'text-muted-foreground/70'}`}>
                  {validations.number ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />} 1 Number
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Daftar Sekarang
            </motion.button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline transition-all">
              Masuk di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
