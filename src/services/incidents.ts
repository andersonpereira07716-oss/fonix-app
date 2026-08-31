import { supabase } from '@/lib/supabaseClient'
import type { Incident, IncidentStatus } from '@/types'

export const getActiveIncident = async (): Promise<Incident | null> => {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .neq('status', 'NORMAL')
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    deviceId: data.device_id,
    status: data.status as IncidentStatus,
    openedAt: data.created_at || data.opened_at,
    closedAt: data.resolved_at || data.closed_at || null,
    recovered: data.recovered ?? false,
  }
}

export const createIncident = async (incidentData: {
  status?: string | IncidentStatus
  deviceId?: string
  type?: string
}): Promise<Incident | null> => {
  const { data, error } = await supabase
    .from('incidents')
    .insert([
      {
        status: incidentData.status || 'PERDIDO',
        device_id: incidentData.deviceId,
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
    status: data.status as IncidentStatus,
    openedAt: data.created_at || data.opened_at,
    closedAt: data.resolved_at || data.closed_at || null,
    recovered: data.recovered ?? false,
  }
}

export const resolveIncident = async (incidentId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('incidents')
    .update({ status: 'RECUPERADO', resolved_at: new Date().toISOString() })
    .eq('id', incidentId)

  if (error) {
    console.error('Erro ao resolver incidente:', error)
    return false
  }

  return true
}
