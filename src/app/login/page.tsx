"use client"

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Eye, EyeOff, Activity, Wallet, FileText, ChevronRight, User } from 'lucide-react'
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
      className="mb-6 p-4 rounded-2xl bg-emerald-50 text-emerald-600 text-sm font-medium text-center border border-emerald-100"
    >
      Akun berhasil dibuat! Silakan login.
    </motion.div>
  )
}

// Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
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
    <div className="min-h-screen bg-[#D9D9D9] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-orange-500/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1200px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[750px] relative"
      >

        {/* LEFT SIDE - DARK THEME */}
        <div className="hidden md:flex flex-1 flex-col relative bg-[#1E1C1A] overflow-hidden justify-between p-12 lg:p-16 text-white rounded-[2.5rem] md:mr-2 z-10 m-2">

          {/* Subtle concentric circles background */}
          <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
          <div className="absolute top-[35%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />

          {/* Top text */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs text-white/50 font-medium tracking-wide relative z-20 text-center uppercase"
          >
            Sistem tata kelola desa online terpadu untuk Anda.
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative z-20 mt-20 mb-auto text-center"
          >
            <h1 className="text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
              Kelola Dana Desa<br />Dengan Mudah
            </h1>
          </motion.div>

          {/* Phone / App Mockup Graphic */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="relative z-20 w-[260px] h-[450px] mx-auto mt-12 bg-gradient-to-b from-[#2A2624] to-[#141211] rounded-[2.5rem] border-[6px] border-[#2A2624] shadow-2xl flex flex-col overflow-hidden -mb-32"
          >
            {/* Dynamic Notch */}
            <div className="w-24 h-6 bg-[#1A1A1A] rounded-full mx-auto mt-2 absolute left-1/2 -translate-x-1/2" />

            <div className="flex-1 p-5 pt-12 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-white/50">APBDes 2026</span>
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <Wallet className="w-3 h-3 text-white/70" />
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-6">Rp897.00<span className="text-lg text-white/50">Jt</span></h2>

              {/* Fake chart */}
              <div className="flex items-end justify-between h-20 mb-6 gap-2">
                {[40, 70, 45, 90, 60, 85, 30].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 0.8 + (i * 0.1) }}
                    className={`w-full rounded-t-sm ${i === 3 ? 'bg-gradient-to-t from-orange-600 to-rose-500' : 'bg-white/20'}`}
                  />
                ))}
              </div>

              {/* Fake cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-2xl h-24 flex flex-col justify-between">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] text-white/50">Pendapatan<br /><span className="text-white font-bold text-xs mt-1 block">785.00 Jt</span></span>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl h-24 flex flex-col justify-between">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span className="text-[10px] text-white/50">Belanja<br /><span className="text-white font-bold text-xs mt-1 block">550.00 Jt</span></span>
                </div>
              </div>
            </div>

            {/* Nav simulation on mockup */}
            <div className="h-16 mt-auto flex items-center justify-around px-4 border-t border-white/5 pb-2">
              <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
              </div>
              <div className="w-4 h-4 rounded-full border border-white/30" />
              <div className="w-4 h-4 rounded border border-white/30" />
            </div>
          </motion.div>

        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="flex-1 flex flex-col relative bg-white px-8 py-10 md:px-16 md:py-12 z-10">

          {/* Top Header inside form */}
          <div className="flex items-center justify-between mb-16 md:mb-24">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 relative rounded-full border-2 border-orange-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">DigitalVillage</span>
            </div>

            <a href="#" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors">
              <User className="w-4 h-4" />
              Sign Up
            </a>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="w-full max-w-sm mx-auto flex-1 flex flex-col"
          >
            <motion.h2 variants={slideUp} className="text-[2.2rem] font-medium text-slate-800 mb-10 tracking-tight">
              Sign In
            </motion.h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Suspense fallback={null}>
                <SuccessMessage />
              </Suspense>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-2xl bg-rose-50 text-rose-600 text-sm font-medium text-center border border-rose-100"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username Input */}
              <motion.div variants={slideUp} className="space-y-1">
                <input
                  name="username"
                  required
                  className="w-full bg-transparent border border-slate-200 rounded-full px-6 py-3.5 text-sm font-medium text-slate-800 outline-none focus:border-orange-400 transition-colors placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="Email or Username"
                />
              </motion.div>

              {/* Password Input */}
              <motion.div variants={slideUp} className="space-y-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="w-full bg-transparent border border-slate-200 rounded-full pl-6 pr-14 py-3.5 text-sm font-medium text-slate-800 outline-none focus:border-orange-400 transition-colors placeholder:text-slate-400 placeholder:font-normal"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </motion.div>

              <motion.div variants={slideUp} className="pt-2">
                <button type="button" className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                  Forgot password?
                </button>
              </motion.div>

              <motion.div variants={slideUp} className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 transition-all shadow-[0_8px_20px_-10px_rgba(249,115,22,0.5)] disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      Sign In
                    </>
                  )}
                </button>
              </motion.div>
            </form>

          </motion.div>

          <div className="mt-auto pt-12 flex items-center justify-between text-[10px] font-semibold text-slate-400">
            <span>© 2026 DigitalVillage Inc.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600 transition-colors">Contact Us</a>
              <span className="flex items-center gap-1 cursor-pointer hover:text-slate-600 transition-colors">
                English <ChevronRight className="w-3 h-3 rotate-90" />
              </span>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  )
}
