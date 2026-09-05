// Tipos de domínio do FÔNIX.
// Espelham as tabelas planejadas no Supabase (ver README > Banco de dados).
// Na FASE 1 (atual) são usados apenas com dados mockados em src/services/mock.ts.

export type SecurityLevel = 'NORMAL' | 'ATENCAO' | 'CRITICO' | 'SISTEMA'

export type IncidentStatus = 'NORMAL' | 'PERDIDO' | 'ROUBADO' | 'RECUPERADO'

export type SubscriptionPlan = 'FREE' | 'PREMIUM' | 'FAMILIA' | 'EMPRESA'

export interface Profile {
  id: string
  name: string
  email: string
  subscriptionStatus: 'trial' | 'active' | 'inactive'
  subscriptionEnd: string | null
  plan: SubscriptionPlan
  createdAt: string
}

export interface Device {
  id: string
  ownerId: string
  name: string
  brand: string
  model: string
  os: 'Android' | 'iOS' | 'Desconhecido'
  protectionEnabled: boolean
  batteryLevel: number | null
  connectionStatus: 'ONLINE' | 'OFFLINE' | 'DESCONHECIDO'
  lastSyncAt: string | null
  imei: string | null
}

export interface DeviceEvent {
  id: string
  deviceId: string
  type: SecurityLevel
  description: string
  occurredAt: string
  locationId: string | null
}

export interface DeviceLocation {
  id: string
  deviceId: string
  latitude: number | null
  longitude: number | null
  accuracyMeters: number | null
  capturedAt: string | null
}

export interface Incident {
  id: string
  deviceId: string
  status: IncidentStatus
  openedAt: string
  closedAt: string | null
  recovered: boolean | null
}

export interface RecoveryContact {
  id: string
  ownerId: string
  name: string
  phone: string
  message: string
}

export interface AppNotification {
  id: string
  title: string
  body: string
  createdAt: string
  read: boolean
}
