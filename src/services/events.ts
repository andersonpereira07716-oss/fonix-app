import { supabase } from '@/lib/supabase'
import type { DeviceEvent } from '@/types'

export const getEvents = async (): Promise<DeviceEvent[]> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('occurred_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar eventos:', error)
    return []
  }

  return (data || []).map((evt: any) => ({
    id: evt.id,
    deviceId: evt.device_id,
    type: evt.type,
    description: evt.description,
    occurredAt: evt.occurred_at,
    locationId: evt.location_id,
  }))
}

export const createEvent = async (
  eventData: Omit<DeviceEvent, 'id' | 'occurredAt'>
): Promise<DeviceEvent | null> => {
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        device_id: eventData.deviceId,
        type: eventData.type,
        description: eventData.description,
        location_id: eventData.locationId,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar evento:', error)
    return null
  }

  return {
    id: data.id,
    deviceId: data.device_id,
    type: data.type,
    description: data.description,
    occurredAt: data.occurred_at,
    locationId: data.location_id,
  }
}

export const logEvent = createEvent
