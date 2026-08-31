import { supabase } from '@/lib/supabaseClient'
import type { Profile } from '@/types'

function fromRow(row: any): Profile {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    plan: row.plan,
    createdAt: row.created_at,
  }
}

export async function getMyProfile(): Promise<Profile | null> {
  const { data: userData } = await supabase.auth.getUser()
  const userId = userData.user?.id
  if (!userId) return null

  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data ? fromRow(data) : null
}
