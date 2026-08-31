import { supabase } from '@/lib/supabaseClient'
import type { DeviceLocation } from '@/types'

function fromRow(row: any): DeviceLocation {
  return {
    id: row.id,
    deviceId: row.device_id,
    latitude: row.latitude,
    longitude: row.longitude,
    accuracyMeters: row.accuracy_meters,
    capturedAt: row.captured_at,
  }
}

export async function getLatestLocation(deviceId: string): Promise<DeviceLocation | null> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('device_id', deviceId)
    .order('captured_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data ? fromRow(data) : null
}

export async function listLocationHistory(deviceId: string, limit = 20): Promise<DeviceLocation[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('device_id', deviceId)
    .order('captured_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []).map(fromRow)
}

/**
 * Pede a localização atual ao navegador (só funciona com permissão do
 * usuário e HTTPS ou localhost) e salva um novo registro em `locations`.
 * Nunca inventa coordenadas: se o navegador não fornecer, rejeita a Promise.
 */
export function captureBrowserLocation(deviceId: string): Promise<DeviceLocation> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Este navegador não oferece a API de geolocalização.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data, error } = await supabase
            .from('locations')
            .insert({
              device_id: deviceId,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy_meters: pos.coords.accuracy,
            })
            .select()
            .single()
          if (error) throw error
          resolve(fromRow(data))
        } catch (err) {
          reject(err)
        }
      },
      (err) => reject(new Error(err.message)),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  })
}
