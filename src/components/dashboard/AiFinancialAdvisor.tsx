"use client"
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Bot, RefreshCw, X, MessageSquareText } from 'lucide-react'
import { generateFinancialInsights } from '@/server/actions/ai-gemini'
import ReactMarkdown from 'react-markdown'
import { usePathname } from 'next/navigation'

export function AiFinancialAdvisor() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Hide on login page
  if (pathname === '/login') return null

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const handleAnalyze = async () => {
    setIsLoading(true)
    setIsOpen(true)
    try {
      const res = await generateFinancialInsights()
      setInsight(res.response)
    } catch (error) {
      setInsight("Terjadi kesalahan saat menghubungkan ke AI.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleOpen = () => {
    if (!isOpen && !insight) {
      handleAnalyze()
    } else {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="fixed bottom-24 lg:bottom-10 right-4 lg:right-10 z-[100] flex flex-col items-end pointer-events-none">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[calc(100vw-2rem)] sm:w-[450px] bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[75vh]"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <Sparkles className="w-16 h-16 animate-pulse" />
              </div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Digital Village AI</h3>
                  <p className="text-[10px] text-white/70">Asisten Finansial Pintar</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 transition-colors rounded-full relative z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent bg-slate-50 dark:bg-[#151515]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-slate-800" />
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute inset-0" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 animate-pulse text-center">
                    Menganalisis APBDes...<br/>
                    <span className="text-xs text-slate-400">Harap tunggu sebentar</span>
                  </p>
                </div>
              ) : (
                <div className="max-w-none text-[13px] sm:text-sm">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-6 mb-3" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-5 mb-2 border-b border-slate-200 dark:border-slate-800 pb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-4 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-outside pl-4 mb-4 text-slate-600 dark:text-slate-300 space-y-1.5" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-4 mb-4 text-slate-600 dark:text-slate-300 space-y-1.5" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-white bg-indigo-50 dark:bg-indigo-500/20 px-1 rounded" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 mb-4 text-slate-500 dark:text-slate-400 italic bg-indigo-50/50 dark:bg-indigo-500/10 rounded-r-lg" {...props} />
                    }}
                  >
                    {insight || 'Halo! Saya asisten AI Desa Anda.'}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            
            {/* Footer action */}
            {!isLoading && insight && (
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <button 
                  onClick={handleAnalyze}
                  className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 rounded-xl transition-all shadow-md active:scale-[0.98]"
                >
                  <RefreshCw className="w-4 h-4" /> Perbarui Analisis
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className="pointer-events-auto relative group flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-shadow focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Tooltip on hover (desktop only) */}
        {!isOpen && (
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl">
            Tanya AI Advisor
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-slate-800" />
          </div>
        )}
      </motion.button>

    </div>
  )
}
