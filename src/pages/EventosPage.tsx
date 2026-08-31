import { useState, useEffect } from 'react'
import { Loader2, CalendarX } from 'lucide-react'
import { getEvents } from '@/services/events'
import StatusBadge from '@/components/ui/StatusBadge'
import type { DeviceEvent } from '@/types'

export default function EventosPage() {
  const [events, setEvents] = useState<DeviceEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true)
        const data = await getEvents()
        
        const sorted = [...data].sort(
          (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
        )
        setEvents(sorted)
      } catch (err) {
        console.error('Erro ao carregar histórico de eventos:', err)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-electric" size={28} />
      </div>
    )
  }

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <p className="label-eyebrow">Linha do tempo</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-white">
        Linha do tempo de segurança
      </h1>

      {events.length === 0 ? (
        <div className="card mt-6 flex flex-col items-center justify-center gap-3 p-8 text-center">
          <CalendarX className="text-mist" size={32} />
          <p className="text-sm text-mist">Nenhum evento registrado até o momento.</p>
        </div>
      ) : (
        <div className="card mt-6 divide-y divide-white/5">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm text-white">{event.description}</p>
                <p className="mt-1 font-mono text-[11px] text-mist">
                  {new Date(event.occurredAt).toLocaleString('pt-BR')}
                </p>
              </div>
              <StatusBadge level={event.type} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
