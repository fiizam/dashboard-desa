"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Bot, RefreshCw, X } from 'lucide-react'
import { generateFinancialInsights } from '@/server/actions/ai-gemini'
import ReactMarkdown from 'react-markdown'

export function AiFinancialAdvisor() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [insight, setInsight] = useState<string | null>(null)

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

  return (
    <div className="w-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 rounded-3xl p-6 border border-indigo-500/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
        <Sparkles className="w-32 h-32 text-indigo-500 animate-pulse" />
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Digital Village AI Advisor
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:max-w-xl leading-relaxed">
            Asisten cerdas yang menganalisis kesehatan finansial desa Anda secara real-time. Dapatkan wawasan instan mengenai defisit, efisiensi anggaran, dan rekomendasi strategis.
          </p>
        </div>

        <button 
          onClick={handleAnalyze}
          disabled={isLoading}
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {isLoading ? "Menganalisis..." : "Mulai Analisis AI"}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-indigo-100 dark:border-indigo-500/20 p-6 relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-slate-800" />
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin absolute inset-0" />
                  </div>
                  <p className="text-sm font-medium text-slate-500 animate-pulse">AI sedang membaca triliunan data APBDes...</p>
                </div>
              ) : (
                <div className="max-w-none text-sm md:text-base max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold text-indigo-400 mt-6 mb-3" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold text-indigo-400 mt-6 mb-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-base font-bold text-indigo-300 mt-5 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 mb-4 text-slate-600 dark:text-slate-300 space-y-2" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-5 mb-4 text-slate-600 dark:text-slate-300 space-y-2" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />,
                    }}
                  >
                    {insight || ''}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
