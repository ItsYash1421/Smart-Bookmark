'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Link as LinkIcon, Type } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AddBookmark() {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !title) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase.from('bookmarks').insert([
      { url, title, user_id: user.id },
    ]).select().single()

    if (error) {
      console.error('Error adding bookmark:', error)
    } else {
      window.dispatchEvent(new CustomEvent('bookmark-added', { detail: data }))
      setUrl('')
      setTitle('')
    }
    setLoading(false)
  }

  return (
    <div className={cn(
      "bg-card rounded-3xl border transition-all duration-300 overflow-hidden",
      isFocused 
        ? "border-indigo-200 dark:border-indigo-500/30 shadow-2xl shadow-indigo-100 dark:shadow-indigo-950/20 ring-4 ring-indigo-50 dark:ring-indigo-900/10" 
        : "border-border shadow-xl shadow-gray-200/50 dark:shadow-none"
    )}>
      <form onSubmit={handleSubmit} className="p-6 md:p-8" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
            <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">Add New Bookmark</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-zinc-400 ml-1 flex items-center gap-2">
              <Type className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. My Favorite Tool"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 font-medium"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-zinc-400 ml-1 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-gray-400 dark:text-zinc-500" />
              URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-600 font-medium"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full relative group overflow-hidden px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Save Bookmark
              </>
            )}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </form>
    </div>
  )
}
