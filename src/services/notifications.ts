import { supabase } from '@/lib/supabaseClient'
import type { AppNotification } from '@/types'

function fromRow(row: any): AppNotification {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    createdAt: row.created_at,
    read: row.read,
  }
}

export async function listNotifications(): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Erro ao buscar notificações:', error)
    return []
  }

  return (data || []).map(fromRow)
}

export async function createNotification(title: string, body: string): Promise<void> {
  const { error } = await supabase.from('notifications').insert({ title, body })
  if (error) {
    console.error('Erro ao criar notificação:', error)
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id)
  if (error) {
    console.error('Erro ao marcar notificação como lida:', error)
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false)
  if (error) {
    console.error('Erro ao marcar notificações como lidas:', error)
  }
}
