import { supabase } from '@/lib/supabase'
import { logEvent } from '@/services/events'
import type { Incident } from '@/types'

export const getActiveIncident = async (): Promise<Incident | null> => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('status', 'OPEN')
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    deviceId: data.device_id,
    type: data.type,
    status: data.status,
    createdAt: data.created_at,
    resolvedAt: data.resolved_at,
  }
}

export const createIncident = async (incidentData: {
  type: string
  status?: string
}): Promise<Incident | null> => {
  const { data, error } = await supabase
    .from('incidents')
    .insert([
      {
        type: incidentData.type,
        status: incidentData.status || 'OPEN',
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar incidente:', error)
    return null
  }

  return {
    id: data.id,
    deviceId: data.device_id,
    type: data.type,
    status: data.status,
    createdAt: data.created_at,
    resolvedAt: data.resolved_at,
  }
}

export const resolveIncident = async (incidentId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('incidents')
    .update({ status: 'RESOLVED', resolved_at: new Date().toISOString() })
    .eq('id', incidentId)

  if (error) {
    console.error('Erro ao resolver incidente:', error)
    return false
  }

  return true
}
