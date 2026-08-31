import type { SecurityLevel } from '@/types'

const STYLES: Record<SecurityLevel, { dot: string; text: string; label: string }> = {
  NORMAL: { dot: 'bg-safe', text: 'text-safe', label: 'Normal' },
  ATENCAO: { dot: 'bg-warn', text: 'text-warn', label: 'Atenção' },
  CRITICO: { dot: 'bg-alert', text: 'text-alert', label: 'Crítico' },
  SISTEMA: { dot: 'bg-electric', text: 'text-electric', label: 'Sistema' },
}

export default function StatusBadge({ level }: { level: SecurityLevel }) {
  const s = STYLES[level]
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}
