import { supabase } from '@/lib/supabaseClient'
import type { RecoveryContact } from '@/types'

export const getRecoveryContacts = async (): Promise<RecoveryContact[]> => {
  const { data, error } = await supabase
    .from('recovery_contacts')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Erro ao buscar contatos de emergência:', error)
    return []
  }

  return (data || []).map((item: any) => ({
    id: item.id,
    ownerId: item.owner_id || '',
    name: item.name,
    phone: item.phone,
    message: item.message || '',
  }))
}

export const createRecoveryContact = async (contact: {
  name: string
  phone: string
  message?: string
}): Promise<RecoveryContact | null> => {
  const { data, error } = await supabase
    .from('recovery_contacts')
    .insert([
      {
        name: contact.name,
        phone: contact.phone,
        message: contact.message || 'Alerta de emergência ativado pelo FÔNIX.',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao salvar contato de emergência:', error)
    return null
  }

  return {
    id: data.id,
    ownerId: data.owner_id || '',
    name: data.name,
    phone: data.phone,
    message: data.message || '',
  }
}

export const deleteRecoveryContact = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('recovery_contacts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir contato:', error)
    return false
  }

  return true
}
