// ⚠️ DADOS DE DEMONSTRAÇÃO
// Este arquivo existe apenas para a FASE 1 (antes da integração com Supabase).
// Nunca deve ser importado em build de produção real — será substituído
// pelos serviços em src/services/devices.ts, events.ts, incidents.ts etc,
// que falam diretamente com o Supabase (FASE 2 em diante).

import type { Device, DeviceEvent, Incident, Profile } from '@/types'

export const demoProfile: Profile = {
  id: 'demo-user',
  name: 'Ana',
  email: 'ana@exemplo.com',
  subscriptionStatus: 'trial',
  subscriptionEnd: null,
 plan:'FREE',                          // ← adicionar esta linha
  createdAt: new Date().toISOString(),
}

export const demoDevice: Device = {
  id: 'demo-device',
  ownerId: 'demo-user',
  name: 'Meu Android',
  brand: 'Samsung',
  model: 'Galaxy S23',
  os: 'Android',
  protectionEnabled: true,
  batteryLevel: 62,
  connectionStatus: 'ONLINE',
  lastSyncAt: new Date().toISOString(),
  imei: null,
}

export const demoEvents: DeviceEvent[] = [
  {
    id: 'evt-1',
    deviceId: 'demo-device',
    type: 'SISTEMA',
    description: 'Proteção ativada',
    occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    locationId: null,
  },
  {
    id: 'evt-2',
    deviceId: 'demo-device',
    type: 'NORMAL',
    description: 'Localização registrada',
    occurredAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    locationId: null,
  },
  {
    id: 'evt-3',
    deviceId: 'demo-device',
    type: 'SISTEMA',
    description: 'Sincronização realizada',
    occurredAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    locationId: null,
  },
]

export const demoIncidents: Incident[] = []
