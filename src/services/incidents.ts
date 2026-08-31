import { supabase } from '@/lib/supabaseClient'
import type { Incident, IncidentStatus } from '@/types'
import { logEvent } from '@/services/events'

function fromRow(row: any): Incident {
  return {
    id: row.id,
    deviceId: row.device_id,
    status: row.status,
    openedAt: row.opened_at,
    closedAt: row.closed_at,
    recovered: row.recovered,
  }
}

export async function getActiveIncident(deviceId: string): Promise<Incident | null> {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('device_id', deviceId)
    .is('closed_at', null)
    .order('opened_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data ? fromRow(data) : null
}

/** Ativa o Modo Fênix: cria o incidente e registra o evento CRÍTICO correspondente. */
export async function activatePhoenixMode(deviceId: string): Promise<Incident> {
  const { data, error } = await supabase
    .from('incidents')
    .insert({ device_id: deviceId, status: 'PERDIDO' })
    .select()
    .single()
  if (error) throw error

  await logEvent(deviceId, 'CRITICO', 'Modo Fênix ativado — possível evento de segurança')
  return fromRow(data)
}

export async function updateIncidentStatus(incidentId: string, status: IncidentStatus) {
  const { error } = await supabase.from('incidents').update({ status }).eq('id', incidentId)
  if (error) throw error
}

export async function closeIncident(incidentId: string, recovered: boolean) {
  const { error } = await supabase
    .from('incidents')
    .update({ closed_at: new Date().toISOString(), recovered, status: recovered ? 'RECUPERADO' : 'NORMAL' })
    .eq('id', incidentId)
  if (error) throw error
}
