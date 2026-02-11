'use client'

import { createClient } from '@/utils/supabase/client'
import { Bookmark, Sparkles, ShieldCheck, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative transition-colors">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] md:w-[40%] h-[40%] bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] md:w-[40%] h-[40%] bg-violet-50 dark:bg-violet-950/20 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-[32px] md:rounded-[40px] shadow-2xl shadow-indigo-500/10 dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 md:p-12 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center mb-6 md:mb-8"
            >
              <div className="p-4 md:p-5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[20px] md:rounded-[24px] shadow-xl shadow-indigo-200 dark:shadow-none">
                <Bookmark className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-zinc-100 mb-3 md:mb-4 tracking-tight">
              Smart<span className="text-indigo-600 dark:text-indigo-400">Mark</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 dark:text-zinc-400 font-medium mb-8 md:mb-12 max-w-xs md:max-w-sm mx-auto leading-relaxed">
              The minimalist way to organize your digital universe in real-time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-12">
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl flex flex-col items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-500 uppercase tracking-wider">Real-time</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl flex flex-col items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-500 uppercase tracking-wider">Secure</span>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl flex flex-col items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-gray-600 dark:text-zinc-500 uppercase tracking-wider">Minimal</span>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-4 px-8 py-5 bg-white dark:bg-zinc-900 border-2 border-gray-100 dark:border-zinc-800 rounded-[24px] text-gray-700 dark:text-zinc-300 font-bold text-lg hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-sm active:scale-[0.98]"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-6 h-6"
              />
              Continue with Google
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-zinc-800/30 p-6 text-center border-t border-gray-100 dark:border-zinc-800">
            <p className="text-sm text-gray-400 dark:text-zinc-600 font-medium">
              Join thousands of users organizing their links better.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
