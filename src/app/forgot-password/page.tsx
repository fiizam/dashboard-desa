"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import { requestPasswordReset } from '@/server/actions/auth-reset'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    const res = await requestPasswordReset(email)

    if (res?.error) {
      setError(res.error)
    } else if (res?.success) {
      setMessage(res.message)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Login
        </Link>
        <div className="w-16 h-16 mb-4 relative bg-white rounded-xl overflow-hidden p-1 shadow-sm border border-border/50 mx-auto sm:mx-0">
          <Image 
            src="/logo.png" 
            alt="DesaSync Logo" 
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Lupa Password?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 sm:px-10 border border-border shadow-xl sm:rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm font-medium">
                {error}
              </div>
            )}
            
            {message && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm font-medium leading-relaxed">
                {message}
              </div>
            )}
            
            {!message && (
              <>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Email Terdaftar</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="email"
                      name="email"
                      required
                      className="w-full bg-background border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="admin@desa.id"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 disabled:opacity-70"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Kirim Tautan Reset
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
