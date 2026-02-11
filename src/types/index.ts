export type Bookmark = {
  id: string
  created_at: string
  user_id: string
  url: string
  title: string
}

export type User = {
  id: string
  email?: string
  name?: string
  avatar_url?: string
}
