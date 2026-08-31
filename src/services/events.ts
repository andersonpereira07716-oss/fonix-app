import { supabase } from '@/lib/supabaseClient'
import type { DeviceEvent, SecurityLevel } from '@/types'

function fromRow(row: any): DeviceEvent {
  return {
    id: row.id,
    deviceId: row.device_id,
    type: row.type,
    description: row.description,
    occurredAt: row.occurred_at,
    locationId: row.location_id,
  }
}

export async function listDeviceEvents(deviceId: string): Promise<DeviceEvent[]> {
  const { data, error } = await supabase
    .from('device_events')
    .select('*')
    .eq('device_id', deviceId)
    .order('occurred_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(fromRow)
}

export async function logEvent(
  deviceId: string,
  type: SecurityLevel,
  description: string,
  locationId?: string,
) {
  const { error } = await supabase
    .from('device_events')
    .insert({ device_id: deviceId, type, description, location_id: locationId ?? null })
  if (error) throw error
}
