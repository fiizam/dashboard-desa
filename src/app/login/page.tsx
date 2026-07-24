"use client"

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock, User, Eye, EyeOff, ShieldCheck, FileText, Users } from 'lucide-react'
import { login } from '@/server/actions/auth'
import { motion, AnimatePresence } from 'framer-motion'

function SuccessMessage() {
  const searchParams = useSearchParams()
  const isRegistered = searchParams.get('registered')

  if (!isRegistered) return null

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium text-center"
    >
      Akun berhasil dibuat! Silakan login menggunakan username dan password Anda.
    </motion.div>
  )
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-indigo-500/30">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1000px] bg-white rounded-[2rem] shadow-2xl shadow-indigo-900/10 flex flex-col md:flex-row overflow-hidden min-h-[600px] relative"
      >
        
        {/* LEFT SIDE - FORM */}
        <div className="flex-1 flex flex-col relative px-8 py-12 md:px-16 md:py-16 bg-white z-10">
          
          {/* Top Decorative Circle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-50 rounded-full" />
          
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-sm mx-auto relative z-10 flex flex-col h-full justify-center"
          >
            <motion.h2 variants={slideUp} className="text-2xl font-bold text-center tracking-widest text-slate-800 mb-12 uppercase">
              Sign In
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Suspense fallback={null}>
                <SuccessMessage />
              </Suspense>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Username Input */}
              <motion.div variants={slideUp} className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-500">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    name="username"
                    required
                    className="w-full bg-white border-2 border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Masukkan username"
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div variants={slideUp} className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-500">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className="w-full bg-white border-2 border-slate-200 rounded-xl pl-11 pr-12 py-3 text-sm text-slate-800 outline-none focus:border-indigo-500 transition-colors font-medium tracking-wider"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={slideUp} className="flex justify-end pt-1">
                <button type="button" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
                  Lupa Password?
                </button>
              </motion.div>

              <motion.div variants={slideUp} className="pt-2">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold tracking-wide text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'LOGIN'}
                </button>
              </motion.div>
            </form>
            
            {/* Bottom Separator (Optional, adapted from image) */}
            <motion.div variants={slideUp} className="mt-12 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Sistem Terpadu RW
              </div>
            </motion.div>
            
          </motion.div>
        </div>

        {/* RIGHT SIDE - DARK GRADIENT & ILLUSTRATION */}
        <div className="hidden md:flex flex-1 relative bg-gradient-to-br from-[#1a1c3b] via-[#2c2b66] to-[#453691] overflow-hidden items-center justify-center p-12">
          
          {/* Abstract Top Right Clouds */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl"
          />
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute top-[5%] right-[-5%] w-[200px] h-[200px] bg-indigo-400/10 rounded-full blur-xl"
          />

          {/* Central Illustration specific to RW System */}
          <div className="relative z-10 w-full flex flex-col items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-10 text-center"
            >
              <h3 className="text-3xl font-extrabold text-white mb-3">Sistem Terpadu RW</h3>
              <p className="text-indigo-200 text-sm font-medium max-w-sm leading-relaxed mx-auto">
                Platform digital cerdas untuk mengelola data kependudukan, transparansi keuangan, dan laporan warga.
              </p>
            </motion.div>

            {/* Mockup Mobile/Dashboard with animated icons */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-64 h-80 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 flex flex-col items-center justify-center shadow-2xl"
            >
              {/* Animated Inner Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/50"
              >
                <ShieldCheck className="w-10 h-10 text-white" />
              </motion.div>
              
              <div className="w-3/4 h-3 bg-white/20 rounded-full mb-3" />
              <div className="w-1/2 h-3 bg-white/20 rounded-full mb-8" />
              
              <div className="flex gap-4 w-full px-4">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex-1 aspect-square bg-blue-400/20 rounded-xl border border-blue-400/30 flex items-center justify-center"
                >
                  <Users className="w-6 h-6 text-blue-300" />
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex-1 aspect-square bg-purple-400/20 rounded-xl border border-purple-400/30 flex items-center justify-center"
                >
                  <FileText className="w-6 h-6 text-purple-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* Glowing Backdrop for Illustration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
          </div>

          {/* Bottom Arch / Footer */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-0 left-0 right-0 h-40 flex items-end justify-center pb-8"
          >
            {/* The Arch Shape */}
            <div className="absolute bottom-[-50px] w-[150%] h-[150px] bg-gradient-to-t from-black/60 to-transparent rounded-[100%] border-t-2 border-indigo-400/30" />
            
            <p className="relative z-10 text-slate-300 text-sm font-medium">
              Belum punya akun?{' '}
              <a href="#" className="text-indigo-300 hover:text-indigo-200 transition-colors ml-1 font-semibold">
                Hubungi Admin RW
              </a>
            </p>
          </motion.div>

        </div>
      </motion.div>
    </div>
  )
}
