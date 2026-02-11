'use client'

import { Bookmark, LogOut, User as UserIcon } from 'lucide-react'
import { User } from '@/types'
import { ThemeToggle } from '../theme-toggle'

export default function Navbar({ user }: { user: User }) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              SmartMark
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-foreground">
                {user.name || user.email?.split('@')[0]}
              </span>
              <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">{user.email}</span>
            </div>
            
            <div className="h-8 w-px bg-gray-200 dark:bg-zinc-800 mx-2 hidden sm:block" />

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="group flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold text-gray-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 bg-gray-50 dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}
