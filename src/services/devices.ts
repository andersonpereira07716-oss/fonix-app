import { supabase } from '@/lib/supabaseClient'
import type { Device } from '@/types'

function fromRow(row: any): Device {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    brand: row.brand,
    model: row.model,
    os: row.os,
    protectionEnabled: row.protection_enabled,
    batteryLevel: row.battery_level,
    connectionStatus: row.connection_status,
    lastSyncAt: row.last_sync_at,
    imei: row.imei,
  }
}

export async function listMyDevices(): Promise<Device[]> {
  const { data, error } = await supabase.from('devices').select('*').order('created_at')
  if (error) throw error
  return (data ?? []).map(fromRow)
}

export async function createDevice(input: {
  name: string
  brand?: string
  model?: string
  os?: Device['os']
}): Promise<Device> {
  const { data: userData } = await supabase.auth.getUser()
  const ownerId = userData.user?.id
  if (!ownerId) throw new Error('Usuário não autenticado.')

  const { data, error } = await supabase
    .from('devices')
    .insert({ owner_id: ownerId, ...input })
    .select()
    .single()
  if (error) throw error
  return fromRow(data)
}

export async function setProtectionEnabled(deviceId: string, enabled: boolean) {
  const { error } = await supabase
    .from('devices')
    .update({ protection_enabled: enabled })
    .eq('id', deviceId)
  if (error) throw error
}

export async function setDeviceImei(deviceId: string, imei: string) {
  const { error } = await supabase
    .from('devices')
    .update({ imei })
    .eq('id', deviceId)
  if (error) throw error
}
