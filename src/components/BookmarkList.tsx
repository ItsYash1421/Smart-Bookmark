'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Trash2, ExternalLink, Globe, Calendar, Search } from 'lucide-react'
import { Bookmark } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Pagination from './Pagination'

const ITEMS_PER_PAGE = 3

export default function BookmarkList({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [totalCount, setTotalCount] = useState(initialBookmarks.length)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  const fetchBookmarks = useCallback(async (page: number, showLoading = true) => {
    if (showLoading) setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const start = (page - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE - 1

    const { count } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (count !== null) setTotalCount(count)

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(start, end)

    if (error) {
      console.error('Error fetching bookmarks:', error)
    } else {
      setBookmarks(data || [])
    }
    if (showLoading) setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchBookmarks(1)
  }, [fetchBookmarks])

  // Listen for local "bookmark-added" event for instant update
  useEffect(() => {
    const handleBookmarkAdded = (event: any) => {
      const newBookmark = event.detail
      setBookmarks(prev => {
        // Prevent duplicate if realtime already added it
        if (prev.find(b => b.id === newBookmark.id)) return prev
        const updated = [newBookmark, ...prev].slice(0, ITEMS_PER_PAGE)
        return updated
      })
      setTotalCount(prev => prev + 1)
      setCurrentPage(1)
    }

    window.addEventListener('bookmark-added', handleBookmarkAdded)
    return () => window.removeEventListener('bookmark-added', handleBookmarkAdded)
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchBookmarks(page)
  }

  useEffect(() => {
    let channel: any

    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channel = supabase
        .channel('realtime-bookmarks')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'bookmarks',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newBookmark = payload.new as Bookmark
              setBookmarks(prev => {
                if (prev.find(b => b.id === newBookmark.id)) return prev
                return [newBookmark, ...prev].slice(0, ITEMS_PER_PAGE)
              })
              setTotalCount(prev => prev + 1)
              setCurrentPage(1)
            } else if (payload.eventType === 'DELETE') {
              fetchBookmarks(currentPage, false)
            } else {
              fetchBookmarks(currentPage, false)
            }
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, currentPage, fetchBookmarks])

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('bookmarks').delete().eq('id', id)
    if (error) console.error('Error deleting bookmark:', error)
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <div className="space-y-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
        <input
          type="text"
          placeholder="Search your bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-950/20 outline-none transition-all text-foreground font-medium"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {bookmarks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 bg-card rounded-3xl border border-dashed border-border"
              >
                <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-gray-300 dark:text-zinc-600" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No bookmarks found</h3>
                <p className="text-gray-500 dark:text-zinc-500">Try adding a new one!</p>
              </motion.div>
            ) : (
              bookmarks
                .filter(b => 
                  b.title.toLowerCase().includes(search.toLowerCase()) || 
                  b.url.toLowerCase().includes(search.toLowerCase())
                )
                .map((bookmark) => (
                  <motion.div
                    key={bookmark.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative flex items-center justify-between p-5 bg-card border border-border rounded-3xl hover:border-indigo-100 dark:hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-none transition-all duration-300"
                  >
                    <div className="flex items-center gap-5 overflow-hidden">
                      <div className="hidden sm:flex shrink-0 w-12 h-12 items-center justify-center bg-background rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <h3 className="font-bold text-foreground truncate text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {bookmark.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-1">
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1.5 truncate transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {bookmark.url.replace(/^https?:\/\//, '')}
                          </a>
                          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-600 font-medium">
                            <Calendar className="w-3 h-3" />
                            {new Date(bookmark.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(bookmark.id)}
                        className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-all duration-200"
                        title="Delete bookmark"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))
            )}
          </AnimatePresence>
        )}
      </div>

      {!loading && bookmarks.length > 0 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}
    </div>
  )
}
