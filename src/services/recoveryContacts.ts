import { supabase } from '@/lib/supabaseClient'
import type { RecoveryContact } from '@/types'

function fromRow(row: any): RecoveryContact {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    phone: row.phone,
    message: row.message,
  }
}

export async function getMyRecoveryContact(): Promise<RecoveryContact | null> {
  const { data, error } = await supabase
    .from('recovery_contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data ? fromRow(data) : null
}

export async function upsertRecoveryContact(input: {
  id?: string
  name: string
  phone: string
  message?: string
}): Promise<RecoveryContact> {
  const { data: userData } = await supabase.auth.getUser()
  const ownerId = userData.user?.id
  if (!ownerId) throw new Error('Usuário não autenticado.')

  if (input.id) {
    const { data, error } = await supabase
      .from('recovery_contacts')
      .update({ name: input.name, phone: input.phone, message: input.message })
      .eq('id', input.id)
      .select()
      .single()
    if (error) throw error
    return fromRow(data)
  }

  const { data, error } = await supabase
    .from('recovery_contacts')
    .insert({ owner_id: ownerId, ...input })
    .select()
    .single()
  if (error) throw error
  return fromRow(data)
}
