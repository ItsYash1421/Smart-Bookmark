'use client'

import { useState } from 'react'
import { Plus, List } from 'lucide-react'
import AddBookmark from './AddBookmark'
import BookmarkList from './BookmarkList'
import { Bookmark, User } from '@/types'
import { cn } from '@/lib/utils'

interface DashboardContentProps {
  initialBookmarks: Bookmark[]
  user: User
}

export default function DashboardContent({ initialBookmarks, user }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<'collection' | 'add'>('collection')

  return (
    <div className="w-full">
      <div className="lg:hidden mb-8 p-1 bg-card rounded-2xl flex items-center border border-border">
        <button
          onClick={() => setActiveTab('collection')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200",
            activeTab === 'collection' 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
              : "text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300"
          )}
        >
          <List className="w-4 h-4" />
          Collection
        </button>
        <button
          onClick={() => setActiveTab('add')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200",
            activeTab === 'add' 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
              : "text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300"
          )}
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className={cn(
          "lg:col-span-5 lg:block",
          activeTab === 'add' ? "block" : "hidden"
        )}>
          <div className="lg:sticky lg:top-28">
            <div className="h-auto lg:h-32 flex flex-col justify-end mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                Welcome back!
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-zinc-500 font-medium">
                Organize your digital world, one link at a time.
              </p>
            </div>
            <AddBookmark />
          </div>
        </div>

        <div className={cn(
          "lg:col-span-7 lg:block",
          activeTab === 'collection' ? "block" : "hidden"
        )}>
          <div className="h-auto lg:h-32 flex flex-col justify-end mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2 mb-1">
              Your Collection
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                {initialBookmarks?.length || 0}
              </span>
            </h2>
            <p className="text-sm md:text-base opacity-0 select-none pointer-events-none hidden lg:block">
              Spacer
            </p>
          </div>
          <BookmarkList initialBookmarks={initialBookmarks} />
        </div>
      </div>
    </div>
  )
}
