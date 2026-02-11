import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DashboardContent from '@/components/DashboardContent'

export default async function Home() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: bookmarks, error } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching bookmarks:', error)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={{ 
        id: user.id, 
        email: user.email, 
        name: user.user_metadata?.full_name || user.user_metadata?.name 
      }} />
      
      <main className="flex-grow max-w-[1400px] mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8 w-full">
        <DashboardContent 
          initialBookmarks={bookmarks || []} 
          user={{ 
            id: user.id, 
            email: user.email, 
            name: user.user_metadata?.full_name || user.user_metadata?.name 
          }} 
        />
      </main>

      <Footer />
    </div>
  )
}
