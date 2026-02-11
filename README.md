# Smart Bookmark App

A simple, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google OAuth**: Secure login using Google (via Supabase Auth).
- **Private Bookmarks**: Users can only see and manage their own bookmarks.
- **Real-time Updates**: Bookmark list updates instantly across all open tabs when a bookmark is added or deleted.
- **Responsive Design**: Beautiful UI built with Tailwind CSS.

## Tech Stack

- **Framework**: [Next.js (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Setup Instructions

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Supabase Setup**:
    - Create a new project on [Supabase](https://supabase.com/).
    - Run the SQL in `schema.sql` in the Supabase SQL Editor.
    - Enable Google Auth in the Supabase Dashboard (Authentication > Providers > Google).
    - Configure the Google OAuth redirect URI in Supabase to: `https://your-project-id.supabase.co/auth/v1/callback`.
    - In your Google Cloud Console, set the Authorized redirect URIs to: `https://your-project-id.supabase.co/auth/v1/callback`.
4.  **Environment Variables**:
    - Create a `.env.local` file and add your Supabase credentials:
      ```env
      NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
      NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
      ```
5.  **Run the app**:
    ```bash
    npm run dev
    ```

## Problems Faced & Solutions

### 1. Real-time Synchronization
**Problem**: Ensuring that bookmarks update in real-time across multiple tabs without manual refresh.
**Solution**: Leveraged Supabase's Realtime subscriptions. I set up a `useEffect` hook in the `BookmarkList` component that listens for `INSERT` and `DELETE` events on the `bookmarks` table and updates the local state accordingly.

### 2. Middleware Session Management
**Problem**: Next.js App Router requires careful handling of cookies and sessions in middleware to prevent unauthorized access.
**Solution**: Used the `@supabase/ssr` package to implement a robust session refresh logic in `middleware.ts`. This ensures that the user's session is always valid when navigating between pages.

### 3. Google OAuth Redirects
**Problem**: Handling the OAuth redirect correctly on production (Vercel) vs local environment.
**Solution**: Implemented a dynamic redirect logic in the `/auth/callback` route that detects the environment and uses the correct host for redirection after successful authentication.

### 4. RLS (Row Level Security)
**Problem**: Ensuring User A cannot see User B's bookmarks.
**Solution**: Enabled RLS on the `bookmarks` table and created policies that restrict access based on the `auth.uid()`. This ensures security at the database level, not just the application level.
