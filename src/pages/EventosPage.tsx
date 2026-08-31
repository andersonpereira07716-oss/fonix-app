import { demoEvents } from '@/services/mockData'
import StatusBadge from '@/components/ui/StatusBadge'

export default function EventosPage() {
  const sorted = [...demoEvents].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )

  return (
    <div className="px-5 py-6 md:px-8 md:py-8">
      <p className="label-eyebrow">Linha do tempo</p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-white">
        Linha do tempo de segurança
      </h1>

      <div className="card mt-6 divide-y divide-white/5">
        {sorted.map((event) => (
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

      <p className="mt-4 text-xs text-mist">
        Dados de demonstração — a FASE 3 conecta esta tela aos eventos reais do Supabase.
      </p>
    </div>
  )
}
