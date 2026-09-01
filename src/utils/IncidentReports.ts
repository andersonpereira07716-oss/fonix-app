import type { Device, Incident, DeviceEvent, DeviceLocation } from '@/types'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR')
}

/**
 * Monta um relatório em texto simples sobre um incidente do Modo Fênix,
 * incluindo dados do dispositivo, período do incidente, eventos e
 * localizações registradas durante o período.
 */
export function buildIncidentReport(
  device: Device,
  incident: Incident,
  events: DeviceEvent[],
  locations: DeviceLocation[],
): string {
  const lines: string[] = []

  lines.push('RELATÓRIO DE INCIDENTE — FÔNIX')
  lines.push('================================')
  lines.push('')
  lines.push(`Dispositivo: ${device.name}${device.brand ? ` (${device.brand} ${device.model ?? ''})` : ''}`)
  lines.push(`Status do incidente: ${incident.status}`)
  lines.push(`Aberto em: ${formatDate(incident.openedAt)}`)
  lines.push(`Encerrado em: ${incident.closedAt ? formatDate(incident.closedAt) : 'Ainda em aberto'}`)
  lines.push('')

  lines.push('LINHA DO TEMPO')
  lines.push('--------------')
  if (events.length === 0) {
    lines.push('Nenhum evento registrado no período.')
  } else {
    for (const event of events) {
      lines.push(`[${formatDate(event.occurredAt)}] (${event.type}) ${event.description}`)
    }
  }
  lines.push('')

  lines.push('LOCALIZAÇÕES REGISTRADAS')
  lines.push('-------------------------')
  if (locations.length === 0) {
    lines.push('Nenhuma localização registrada no período.')
  } else {
    for (const loc of locations) {
      if (loc.latitude == null || loc.longitude == null) continue
      const mapsLink = `https://maps.google.com/?q=${loc.latitude},${loc.longitude}`
      lines.push(`[${formatDate(loc.capturedAt)}] ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`)
      lines.push(`  → ${mapsLink}`)
    }
  }
  lines.push('')
  lines.push('Relatório gerado pelo app FÔNIX.')

  return lines.join('\n')
}
