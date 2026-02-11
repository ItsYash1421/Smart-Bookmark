import { Bookmark, Github, Twitter, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-6 w-full transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Bookmark className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              SmartMark
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-xs text-gray-400 dark:text-zinc-500">
              © {new Date().getFullYear()} All rights reserved.
            </p>
            <div className="h-3 w-px bg-gray-200 dark:bg-zinc-800" />
            <p className="text-xs text-gray-400 dark:text-zinc-500 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by ItsYash
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
